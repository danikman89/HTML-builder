const fs = require('fs');
const path = require('path');
const writeStream = fs.createWriteStream(path.join(__dirname, 'text.txt'));

process.stdout.write('\nWrite something, please!\n');
process.stdin.on('data', (data) => {
  if (data.toString().trim() === 'exit') {
    console.log('\nGood job, see you soon!\n');
    process.exit();
  } else {
    writeStream.write(data.toString());
  } 
});
process.on('SIGINT', () => {
  console.log('\nGood job, see you soon!\n');
  process.exit();
});
