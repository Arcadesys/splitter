# Splitter — Obsidian Note-Splitting Plugin

A lightweight Obsidian plugin that lets you **split a note at the cursor** into two Markdown files, in Ulysses-style fashion.  
Inspired by “Ulysses” workflows, but ultra-minimal and customizable.

---

## 🚀 Features

- Split your current note **at cursor position** into two files  
- Automatically names the new file as `original-basename-part2.md`, `part3`, etc.  
- Opens the new note in a split/adjacent pane for seamless continuation  
- Command palette support + keyboard shortcut (**⌘ ⇧ D** / **Ctrl ⇧ D**)  
- Minimal dependencies and easy to extend (auto-linking, prompts, etc.)

---

## 🛠 Installation & Setup

1. Clone or download this repo into your Obsidian `.obsidian/plugins/splitter` folder.  
2. Enable “Safe Mode” off (if needed) and turn on **Splitter** in Community Plugins.  
3. The command **“Split note at cursor”** will appear in the Command Palette.  
4. Use the shortcut **⌘ ⇧ D** (Mac) or **Ctrl ⇧ D** (Windows) to split immediately.

---

## 🔧 How It Works

When you invoke the split:

- The plugin reads the active note’s content.  
- Finds the cursor offset and divides the text into **before** + **after**.  
- Replaces the original note with the “before” text.  
- Creates a new note in the same folder with the “after” text.  
- Opens the new note side-by-side for immediate editing.

You can build on this—examples:  
- Auto-insert a link at the end of the first note → “Continue in Part 2 →”  
- Prompt for a custom filename instead of auto `partN`  
- Add YAML header metadata (e.g. `split_from: original_file`)  
- UI options: choose whether to open in new pane, focus etc.

---

## ⚙️ Configuration / Customization (ideas)

- Change or remove the shortcut  
- Let users choose how file-naming works  
- Toggle auto-link insertion  
- Support splitting by headings (section splits)  
- Undo behavior or revision history compatibility  

---

## 🧪 Example Use Case

1. Open a large journal entry or a long-form note.  
2. Cursor somewhere in the middle.  
3. Hit `⌘ ⇧ D`.  
4. You’re immediately dropped into the second half, ready to continue writing.  
5. The first half remains intact, and the two files live in your vault side by side.

---

## ⚖️ Limitations & Caveats

- It’s a very **simple split**, not semantic (i.e. won’t automatically split at headings or logical breaks)  
- Doesn’t by default insert links—unless you extend it  
- If your vault has weird folder permissions or filenames with conflicts, you may need to handle those edge cases  

---

## 🧠 Why This Exists (Philosophy)

You don’t always need a full refactor engine — sometimes all you want is **“break here and keep writing.”** This plugin is your “paper cut” version of that power: sharp, precise, low friction.  

Use it to break notes into digestible chunks, reorganize your vault flow, or just avoid scrolling nightmares.

---

## ✨ Contribute & Extend

Pull requests, feature ideas, and bug reports are welcome. Some interesting open ideas:

- Auto-link the two note halves  
- Ask for filename when splitting  
- Offer “split at heading” modes  
- User preferences UI  
- Better conflict detection for existing file names

---

## 📄 License

[MIT License](LICENSE) — use, modify, and share freely.
