const fs = require('fs');
const path = require('path');

const projectDir = path.join(__dirname, 'project-dist');
const stylesDir = path.join(__dirname, 'styles');
const assets = path.join(__dirname, 'assets');
const copyAssets = path.join(projectDir, 'assets');
const components = path.join(__dirname, 'components');
const template = path.join(__dirname, 'template.html');
const newHtml = path.join(projectDir, 'index.html');

const createFolder = () => {
  fs.mkdir(projectDir, { recursive: true }, err => {
    if(err) throw err;
  });
};

createFolder();

const styleJoin = (oldDir, newDir) => {
  fs.readdir(oldDir, {withFileTypes: true}, (err, items) => {
    if(err) throw err;
    const files = items.filter(item => item.isFile());
    let data = [];
    files.forEach(file => {
      const filePath = path.join(oldDir, file.name);
      if(path.extname(filePath) === '.css') {
        const readStream = fs.createReadStream(path.join(oldDir, file.name));
        const writeStream = fs.createWriteStream(path.join(newDir, 'style.css'));

        readStream.on('data', chunk => data += chunk);
        readStream.on('end', () => writeStream.write(data));
      }
    }); 
  });
};

styleJoin(stylesDir, projectDir);

const copyFiles = (inDir, copyDir) => {
  fs.mkdir(copyDir, { recursive: true }, err => {
    if (err) throw err;
  });
  
  fs.readdir(inDir, { withFileTypes: true }, (err, items) => {
    if (err) throw err;
    items.forEach(item => {
      if(item.isFile()) {
        fs.copyFile(path.join(inDir, item.name), path.join(copyDir, item.name), err => {
          if (err) throw err;
        });
      } else {
        fs.mkdir(path.join(copyDir, item.name), {recursive: true}, err=> {
          if(err) throw err;
        });
        copyFiles(path.join(inDir, item.name), path.join(copyDir, item.name));
      }
    });
  });
};

fs.rm(copyAssets, { recursive: true}, () => {
  copyFiles(assets, copyAssets);
});

const createHTML = () => {
  fs.readFile(template, 'utf-8', (err, temp) => {
    if (err) throw err;
    fs.readdir(components, {withFileTypes: true}, (err, files) => {
      if(err) throw err;
      files.forEach(file => {
        if(file.isFile()) {
          fs.readFile(path.join(components, file.name), 'utf-8', (err, data) => {
            if(err) throw err;
            const tagName =`{{${file.name.split('.')[0]}}}`;
            temp = temp.replace(tagName, data);
            fs.rm((newHtml), {recrusive: true}, ()=> {
              fs.writeFile(newHtml, temp, err => {
                if(err) throw err;
              });
            })
          });
        }
      });
    });
  });
};

createHTML();
