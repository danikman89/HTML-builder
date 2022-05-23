const fs = require('fs');
const path = require('path');

const secretFolder = path.join(__dirname, 'secret-folder');

fs.readdir(secretFolder, {withFileTypes: true}, (err, items) => {
  if (err) {
    throw err;
  } else {
    const files = items.filter(item => item.isFile());
    files.forEach(file => {
      const filePath = path.join(secretFolder, file.name);
      const fileInfo = file.name.split('.');
      const [name, expansion] = fileInfo;
      fs.stat(filePath, (err, stats) => {
        if(err) {
          throw err;
        } else {
          console.log(`${name} - ${expansion} - ${stats.size}b`);
        }
      });
    });
  }
});