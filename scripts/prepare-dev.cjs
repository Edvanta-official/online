const fs = require('fs');
const path = require('path');

const rootIndexPath = path.join(__dirname, '..', 'index.html');
let html = fs.readFileSync(rootIndexPath, 'utf8');

// Replace static dist script tags with /src/main.jsx for Vite dev server
html = html.replace(/<script type="module"[^>]*src="[^"]+"[^>]*><\/script>/g, '<script type="module" src="/src/main.jsx"></script>');
html = html.replace(/<link rel="stylesheet"[^>]*href="\.\/assets\/[^"]+"[^>]*>/g, '');

fs.writeFileSync(rootIndexPath, html, 'utf8');

// Remove static assets folder from root so Vite dev server reads from src/
const assetsPath = path.join(__dirname, '..', 'assets');
if (fs.existsSync(assetsPath)) {
  fs.rmSync(assetsPath, { recursive: true, force: true });
}

console.log('Environment prepared for Vite dev server in VS Code!');
