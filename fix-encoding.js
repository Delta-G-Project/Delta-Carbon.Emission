const fs = require('fs');
const path = require('path');

function fixMojibake(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  try {
    // Read the corrupted UTF-8 string, convert it to latin1 buffer, and parse as UTF-8
    const buffer = Buffer.from(content, 'binary');
    const fixedContent = buffer.toString('utf8');
    
    // Check if it actually contains valid Arabic characters now (e.g. \u0600 - \u06FF)
    // If the original file wasn't corrupted, this might garble it further, so be careful.
    if (/[\u0600-\u06FF]/.test(fixedContent)) {
      fs.writeFileSync(filePath, fixedContent, 'utf8');
      console.log(`Fixed: ${filePath}`);
    } else {
      console.log(`No Arabic found after decoding, might not be corrupted: ${filePath}`);
    }
  } catch (err) {
    console.error(`Error fixing ${filePath}:`, err);
  }
}

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(function(file) {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) { 
      results = results.concat(walk(file));
    } else if (file.endsWith('.js') || file.endsWith('.jsx')) {
      results.push(file);
    }
  });
  return results;
}

const files = walk(path.join(__dirname, 'src'));
files.forEach(fixMojibake);
