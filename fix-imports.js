const fs = require('fs');
const path = require('path');
const { promisify } = require('util');
const readdir = promisify(fs.readdir);
const stat = promisify(fs.stat);
const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);

// Paths to process
const APP_DIR = path.join(__dirname, 'src', 'app');

// Function to get all TypeScript files recursively
async function getAllFiles(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = await Promise.all(
    entries.map(async (entry) => {
      const fullPath = path.join(dir, entry.name);
      return entry.isDirectory() 
        ? getAllFiles(fullPath) 
        : (fullPath.endsWith('.ts') || fullPath.endsWith('.tsx')) ? [fullPath] : [];
    })
  );
  return files.flat();
}

// Function to fix imports in a file
async function fixImportsInFile(filePath) {
  try {
    const content = await readFile(filePath, 'utf8');
    
    // Fix pattern 1: Relative imports into (common) using `../((common)/…)`
    let newContent = content.replace(
      /import (.*) from ['"]\.\.\/\(\(common\)\)\/(.*)['"]/g, 
      "import $1 from '@/app/(common)/$2'"
    );
    
    // Fix pattern 2: Relative imports into (common) using `../((common)` (different variant)
    newContent = newContent.replace(
      /import (.*) from ['"]\.\.\/\(common\)\/(.*)['"]/g, 
      "import $1 from '@/app/(common)/$2'"
    );
    
    // Fix pattern 3: Relative foundation/component imports (`../../../components/...`)
    newContent = newContent.replace(
      /import (.*) from ['"]\.\.\/\.\.\/\.\.\/components\/(.*)['"]/g,
      "import $1 from '@/components/$2'"
    );
    
    // Fix pattern 4: More shallow component imports (`../../components/...`)
    newContent = newContent.replace(
      /import (.*) from ['"]\.\.\/\.\.\/components\/(.*)['"]/g,
      "import $1 from '@/components/$2'"
    );
    
    // Fix pattern 5: Asset imports pointing at `public/assets`
    newContent = newContent.replace(
      /(['"]).*public\/assets\/(.*)['"]/g,
      "'$2'"
    );
    
    // Only write the file if changes were made
    if (content !== newContent) {
      await writeFile(filePath, newContent, 'utf8');
      console.log(`Fixed imports in: ${path.relative(__dirname, filePath)}`);
      return true;
    }
    
    return false;
  } catch (error) {
    console.error(`Error processing file ${filePath}:`, error);
    return false;
  }
}

// Main function to run the script
async function main() {
  try {
    const files = await getAllFiles(APP_DIR);
    console.log(`Found ${files.length} TypeScript files to process`);
    
    let fixedFiles = 0;
    for (const file of files) {
      const wasFixed = await fixImportsInFile(file);
      if (wasFixed) fixedFiles++;
    }
    
    console.log(`\nSummary: Fixed imports in ${fixedFiles} out of ${files.length} files`);
  } catch (error) {
    console.error('Error running the script:', error);
  }
}

main();