const fs = require('fs');
const path = require('path');

function copyFolderRecursiveSync(source, target) {
  if (!fs.existsSync(target)) {
    fs.mkdirSync(target, { recursive: true });
  }

  if (fs.lstatSync(source).isDirectory()) {
    const files = fs.readdirSync(source);
    files.forEach(file => {
      const curSource = path.join(source, file);
      const curTarget = path.join(target, file);
      if (fs.lstatSync(curSource).isDirectory()) {
        copyFolderRecursiveSync(curSource, curTarget);
      } else {
        fs.copyFileSync(curSource, curTarget);
      }
    });
  }
}

// Copy dist contents to root directory
if (fs.existsSync('dist')) {
  fs.copyFileSync('dist/index.html', 'index.html');
  if (fs.existsSync('dist/404.html')) fs.copyFileSync('dist/404.html', '404.html');
  if (fs.existsSync('dist/.nojekyll')) fs.copyFileSync('dist/.nojekyll', '.nojekyll');
  if (fs.existsSync('dist/assets')) copyFolderRecursiveSync('dist/assets', 'assets');
  console.log('Successfully copied compiled dist build to root repository!');
}
