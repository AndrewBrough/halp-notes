# getHalp Notes

A modern, tag-based note-taking application built with Next.js and Material-UI.

## Features

- 📝 Create, edit, and delete notes
- 🏷️ Organize notes with tags
- 🎨 Multiple theme options (Gold, Purple, Ocean, Forest)
- 🌓 Light/Dark mode support
- 📱 PWA support for mobile installation
- ⌨️ Keyboard shortcuts for power users
- 🔍 Full-text search across notes
- 📅 View notes by date or tags
- 🎲 Random notes feature for rediscovery
- 💾 Automatic local storage persistence

## Keyboard Shortcuts

- `N` - Create new note
- `E` - Edit note (when hovering)
- `D` - Delete note (when hovering)
- `/` - Focus search bar
- `R` - Open random notes
- `T` - Toggle theme mode (light/dark)

## Tech Stack

- Next.js 13+ (App Router)
- TypeScript
- Material-UI (MUI)
- date-fns for date formatting
- Local Storage for data persistence
- PWA capabilities

## Getting Started

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/gethalp-notes.git
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Start the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## PWA Installation

The app can be installed as a Progressive Web App on both desktop and mobile devices. Look for the "Install" or "Add to Home Screen" option in your browser.

## Local Storage

All notes are stored in your browser's local storage. While this ensures privacy, make sure to back up important notes as clearing browser data will remove them.

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.