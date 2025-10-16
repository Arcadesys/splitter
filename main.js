'use strict';

const { Plugin, MarkdownView, Notice } = require('obsidian');

module.exports = class SplitterPlugin extends Plugin {
  onload() {
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
};
