const fs = require('fs');
const path = require('path');

const filesDir = path.join(__dirname, 'files');
const copyFilesDir = path.join(__dirname, 'copy-files');

const copyFiles = (inDir, copyDir) => {
  fs.mkdir(copyDir, { recursive: true }, err => {
    if (err) throw err;
  });

  fs.readdir(inDir, { withFileTypes: true }, (err, items) => {
    if (err) throw err;
    const files = items.filter(item => item.isFile());
    files.forEach(file => {
      fs.copyFile(path.join(inDir, file.name), path.join(copyDir, file.name), err => {
        if (err) throw err;
      });
    });
  });
};

fs.rm(copyFilesDir, { recursive: true}, () => {
  copyFiles(filesDir, copyFilesDir);
});
