# Ulysses-style splits — Obsidian Note-Splitting Plugin

A lightweight Obsidian plugin that allows you to **split a note at the cursor position** into two separate Markdown files, inspired by Ulysses-style workflows.

## Purpose

The Ulysses-style splits plugin solves the common problem of having long notes that need to be broken into smaller, more manageable pieces. Instead of manually copying and pasting content, this plugin automates the process of splitting a note at your current cursor position, creating a seamless workflow for organizing your thoughts.

## Features

- **Split at cursor**: Divide your current note exactly where your cursor is positioned
- **Smart naming**: Automatically names the new file as `original-basename split.md`
- **Seamless workflow**: Opens the new note in an adjacent pane for immediate editing
- **Keyboard shortcut**: Quick access via **⌘⇧D** (Mac) or **Ctrl⇧D** (Windows/Linux)
- **Context menu**: Right-click any markdown file to split it
- **Cross-platform**: Works on Windows, macOS, Linux, and mobile devices

## Installation

### From Community Plugins (Recommended)
1. Open Obsidian Settings
2. Go to Community Plugins and disable Safe Mode
3. Browse and search for "Ulysses-style splits"
4. Install and enable the plugin

### Manual Installation
1. Download the latest release from GitHub
2. Extract the files to your vault's `.obsidian/plugins/ulysses-style-splits/` folder
3. Enable the plugin in Obsidian's Community Plugins settings

## Usage

### Basic Usage
1. Open any Markdown note in Obsidian
2. Position your cursor where you want to split the note
3. Use one of these methods:
   - **Keyboard shortcut**: Press **⌘⇧D** (Mac) or **Ctrl⇧D** (Windows/Linux)
   - **Command palette**: Press **⌘P** (Mac) or **Ctrl+P** (Windows/Linux) and search for "Split File at Cursor"
   - **Context menu**: Right-click the file tab or in the file explorer and select "Split File at Cursor"

### What Happens
- The original note keeps everything **before** the cursor position
- A new note is created with everything **after** the cursor position
- The new note opens in a split pane for immediate editing
- Both files are saved automatically

### Example
**Before splitting** (`My Long Note.md`):
```markdown
# Introduction
This is the beginning of my note.

# Main Content
This is where I want to split.
This content will go to a new file.
```

**After splitting**:
- `My Long Note.md` contains:
```markdown
# Introduction
This is the beginning of my note.

# Main Content
```

- `My Long Note split.md` contains:
```markdown
This is where I want to split.
This content will go to a new file.
```

## Compatibility

- **Obsidian version**: Requires Obsidian 1.4.0 or higher
- **Platforms**: Windows, macOS, Linux, Android, iOS
- **File types**: Works with all Markdown (.md) files

## Troubleshooting

- **"No Markdown note is active"**: Ensure you have a Markdown file open and active
- **"Cursor is at the end of the note"**: Move your cursor to an earlier position in the note
- **Plugin not working**: Try disabling and re-enabling the plugin in settings

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

If you encounter any issues or have feature requests, please [open an issue on GitHub](https://github.com/Arcadesys/ulysses-style-splits/issues).
