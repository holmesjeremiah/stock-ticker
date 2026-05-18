# stock-ticker

A simple Electron desktop app built with React and Vite that displays a scrolling stock ticker from a public Google Sheets CSV feed.

## Project Overview

- `src/main.ts` is the Electron main process.
- `src/preload.ts` is a preload script placeholder.
- `src/renderer.tsx` bootstraps the React renderer.
- `src/App.tsx` fetches CSV stock data from Google Sheets and renders a continuous scrolling ticker.
- `forge.config.ts` configures Electron Forge packaging and makers.

## Prerequisites

- Node.js installed (recommended: 18.x or newer)
- npm installed

## Setup

1. Open a terminal in the project folder.
2. Install dependencies:

```bash
npm install
```

## Run in Development

Start the app in development mode:

```bash
npm start
```

This runs Electron Forge and launches the app using the Vite development server.

## Build and Package

### Package the App

To package the application into an Electron app bundle:

```bash
npm run package
```

This creates a packaged app under the `out/package` folder.

### Create Installer / Executable

To build distributable installer artifacts, run:

```bash
npm run make
```

On Windows, this will generate output in the `out/make` folder using the Squirrel maker. The generated files may include an installer executable and release packages.

## How It Works

1. `src/main.ts` creates a frameless `BrowserWindow` and loads the renderer.
2. `src/renderer.tsx` attaches React to the page and renders `App`.
3. `src/App.tsx` fetches stock data from a published Google Sheets CSV URL.
4. The app parses the CSV, extracts symbol, name, price, and change values, then displays them in a loop.
5. The ticker uses a CSS animation to scroll continuously across the window.

## Launching the App

### During Development

Run:

```bash
npm start
```

### From a Packaged Build

If you used `npm run package`, open the generated app in `out/package`.

### From a Windows Installer / Executable

If you used `npm run make`, open the output folder `out/make` and run the generated installer or executable file. The exact filename depends on the generated Squirrel package.

## Notes

- The app currently loads stock data from a hard-coded Google Sheets URL in `src/App.tsx`.
- The Electron config uses `asar: true` and includes `@electron-forge/plugin-vite` for Vite integration.
- This project is configured for Windows packaging with Squirrel, plus ZIP, DEB, and RPM makers for other platforms.
