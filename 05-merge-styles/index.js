const fs = require('fs');
const path = require('path');

const stylesDir = path.join(__dirname, 'styles');
const projectDir = path.join(__dirname, 'project-dist');

const styleJoin = (oldDir, newDir) => {
  fs.readdir(oldDir, {withFileTypes: true}, (err, items) => {
    if(err) throw err;
    const files = items.filter(item => item.isFile());
    let data = [];
    files.forEach(file => {
      const filePath = path.join(oldDir, file.name);
      if(path.extname(filePath) === '.css') {
        const readStream = fs.createReadStream(path.join(oldDir, file.name));
        const writeStream = fs.createWriteStream(path.join(newDir, 'bundle.css'));

        readStream.on('data', chunk => data += chunk);
        readStream.on('end', () => writeStream.write(data));
      }
    }); 
  });
};

styleJoin(stylesDir, projectDir);