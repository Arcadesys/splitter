'use strict';

const { Plugin, MarkdownView, Notice, ItemView, WorkspaceLeaf } = require('obsidian');

const CHANGES_VIEW_TYPE = 'changes-view';

class ChangesView extends ItemView {
  constructor(leaf, plugin) {
    super(leaf);
    this.plugin = plugin;
  }

  getViewType() {
    return CHANGES_VIEW_TYPE;
  }

  getDisplayText() {
    return 'Pending Changes';
  }

  getIcon() {
    return 'list-checks';
  }

  async onOpen() {
    const container = this.containerEl.children[1];
    container.empty();
    container.addClass('changes-view-container');
    
    this.renderChanges();
  }

  renderChanges() {
    const container = this.containerEl.children[1];
    container.empty();

    const changes = this.plugin.pendingChanges;
    
    if (changes.length === 0) {
      container.createEl('div', { 
        text: 'No pending changes',
        cls: 'changes-empty-state'
      });
      return;
    }

    const changesList = container.createEl('div', { cls: 'changes-list' });

    changes.forEach((change, index) => {
      const changeItem = changesList.createEl('div', { cls: 'change-item' });
      
      const changeHeader = changeItem.createEl('div', { cls: 'change-header' });
      
      const changeType = changeHeader.createEl('span', {
        text: change.type === 'addition' ? '+ Addition' : '- Deletion',
        cls: `change-type ${change.type}`
      });

      const changeContent = changeItem.createEl('div', { 
        cls: 'change-content'
      });
      
      const preview = changeContent.createEl('pre', {
        text: change.content.substring(0, 200) + (change.content.length > 200 ? '...' : ''),
        cls: 'change-preview'
      });

      const changeActions = changeItem.createEl('div', { cls: 'change-actions' });
      
      const applyBtn = changeActions.createEl('button', {
        text: '✓ Apply',
        cls: 'change-apply-btn'
      });
      
      applyBtn.addEventListener('click', async () => {
        await this.plugin.applyChange(index);
        this.renderChanges();
      });

      const rejectBtn = changeActions.createEl('button', {
        text: '✗ Reject',
        cls: 'change-reject-btn'
      });
      
      rejectBtn.addEventListener('click', () => {
        this.plugin.rejectChange(index);
        this.renderChanges();
      });
    });
  }

  async onClose() {
    // Cleanup if needed
  }
}

module.exports = class SplitterPlugin extends Plugin {
  onload() {
    this.pendingChanges = [];

    this.registerView(
      CHANGES_VIEW_TYPE,
      (leaf) => new ChangesView(leaf, this)
    );

    this.addCommand({
      id: 'show-changes-view',
      name: 'Show Pending Changes',
      callback: () => {
        this.activateChangesView();
      }
    });

    this.addCommand({
      id: 'add-addition',
      name: 'Mark Selection as Addition',
      editorCheckCallback: (checking, editor, view) => {
        if (checking) {
          return editor.somethingSelected();
        }
        
        const selection = editor.getSelection();
        this.addChange({
          type: 'addition',
          content: selection,
          position: editor.getCursor('from'),
          filePath: view.file.path
        });
        new Notice('Addition marked for review');
      }
    });

    this.addCommand({
      id: 'add-deletion',
      name: 'Mark Selection as Deletion',
      editorCheckCallback: (checking, editor, view) => {
        if (checking) {
          return editor.somethingSelected();
        }
        
        const selection = editor.getSelection();
        this.addChange({
          type: 'deletion',
          content: selection,
          position: editor.getCursor('from'),
          filePath: view.file.path
        });
        new Notice('Deletion marked for review');
      }
    });
    this.addCommand({
      id: 'split-file-at-cursor',
      name: 'Split File at Cursor',
      hotkeys: [
        {
          modifiers: ['Mod', 'Shift'],
          key: 'd',
        },
      ],
      checkCallback: (checking) => {
        const view = this.app.workspace.getActiveViewOfType(MarkdownView);
        if (!view || !view.editor || !view.file) {
          return false;
        }

        if (!checking) {
          this.splitAtCursor(view).catch((error) => {
            console.error('Ulysses-style splits plugin failed to split note', error);
            new Notice('Unable to split the note. Check the console for details.');
          });
        }

        return true;
      },
    });

    this.registerEvent(
      this.app.workspace.on('file-menu', (menu, file) => {
        if (!file || file.extension !== 'md') {
          return;
        }

        menu.addItem((item) => {
          item
            .setTitle('Split File at Cursor')
            .setIcon('scissors')
            .onClick(async () => {
              const activeView = this.app.workspace.getActiveViewOfType(MarkdownView);
              if (!activeView || !activeView.file || activeView.file.path !== file.path) {
                const leaf = this.app.workspace.getLeaf(false);
                await leaf.openFile(file);
              }

              const view = this.app.workspace.getActiveViewOfType(MarkdownView);
              if (!view) {
                new Notice('Open the note in a Markdown view before splitting.');
                return;
              }

              this.splitAtCursor(view).catch((error) => {
                console.error('Ulysses-style splits plugin failed to split note', error);
                new Notice('Unable to split the note. Check the console for details.');
              });
            });
        });
      })
    );
  }

  async splitAtCursor(view) {
    const editor = view.editor;
    const file = view.file;

    if (!editor || !file) {
      new Notice('No Markdown note is active.');
      return;
    }

    const cursor = editor.getCursor();
    const fileContent = await this.app.vault.read(file);
    const offset = editor.getRange({ line: 0, ch: 0 }, cursor).length;

    const before = fileContent.slice(0, offset);
    const after = fileContent.slice(offset);

    if (!after.length) {
      new Notice('Cursor is at the end of the note. Nothing to split.');
      return;
    }

    editor.setValue(before);
    await this.app.vault.modify(file, before);

    const parentFolder = file.parent ?? this.app.vault.getRoot();
    const newFile = await this.app.fileManager.createNewMarkdownFile(
      parentFolder,
      `${file.basename} split`
    );

    await this.app.vault.modify(newFile, after);

    const leaf = this.app.workspace.getLeaf('split');
    await leaf.openFile(newFile);

    new Notice(`Split note into "${file.name}" and "${newFile.name}".`);
  }

  addChange(change) {
    this.pendingChanges.push(change);
    this.updateChangesView();
  }

  rejectChange(index) {
    this.pendingChanges.splice(index, 1);
    new Notice('Change rejected');
  }

  async applyChange(index) {
    const change = this.pendingChanges[index];
    const file = this.app.vault.getAbstractFileByPath(change.filePath);
    
    if (!file) {
      new Notice('File not found');
      return;
    }

    const content = await this.app.vault.read(file);
    let newContent;

    if (change.type === 'addition') {
      // Find the position and insert the content
      const lines = content.split('\n');
      const line = change.position.line;
      const ch = change.position.ch;
      
      if (line < lines.length) {
        const lineContent = lines[line];
        lines[line] = lineContent.slice(0, ch) + change.content + lineContent.slice(ch);
        newContent = lines.join('\n');
      } else {
        newContent = content + '\n' + change.content;
      }
    } else if (change.type === 'deletion') {
      // Remove the content
      newContent = content.replace(change.content, '');
    }

    await this.app.vault.modify(file, newContent);
    this.pendingChanges.splice(index, 1);
    new Notice(`${change.type === 'addition' ? 'Addition' : 'Deletion'} applied`);
  }

  async activateChangesView() {
    const { workspace } = this.app;

    let leaf = workspace.getLeavesOfType(CHANGES_VIEW_TYPE)[0];

    if (!leaf) {
      leaf = workspace.getRightLeaf(false);
      await leaf.setViewState({
        type: CHANGES_VIEW_TYPE,
        active: true,
      });
    }

    workspace.revealLeaf(leaf);
  }

  updateChangesView() {
    const leaves = this.app.workspace.getLeavesOfType(CHANGES_VIEW_TYPE);
    leaves.forEach(leaf => {
      if (leaf.view instanceof ChangesView) {
        leaf.view.renderChanges();
      }
    });
  }
};
