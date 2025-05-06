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
    let newContent = content;
    let changes = false;
    
    // Patterns to fix
    const patterns = [
      // Pattern 1: Relative imports with double parentheses into (common)
      {
        pattern: /import (.*) from ['"]\.\.\/\(\(common\)\)\/(.*)['"]/g,
        replacement: "import $1 from '@/app/(common)/$2'"
      },
      // Pattern 2: Relative imports into (common)
      {
        pattern: /import (.*) from ['"]\.\.\/\(common\)\/(.*)['"]/g,
        replacement: "import $1 from '@/app/(common)/$2'"
      },
      // Pattern 3: Deep relative imports to foundation components
      {
        pattern: /import (.*) from ['"]\.\.\/\.\.\/\.\.\/components\/(.*)['"]/g,
        replacement: "import $1 from '@/components/$2'"
      },
      // Pattern 4: Medium-depth relative imports to components
      {
        pattern: /import (.*) from ['"]\.\.\/\.\.\/components\/(.*)['"]/g,
        replacement: "import $1 from '@/components/$2'"
      },
      // Pattern 5: Shallow relative imports to components 
      {
        pattern: /import (.*) from ['"]\.\.\/components\/(.*)['"]/g,
        replacement: "import $1 from '@/components/$2'"
      },
      // Pattern 6: Public assets imports
      {
        pattern: /from ['"].*public\/assets\/(.*)['"]/g,
        replacement: "from '/assets/$1'"
      },
      // Pattern 7: Fix imports between bluecare and common
      {
        pattern: /import (.*) from ['"]\.\.\/\(\(common\)\/member\/(.*)['"]/g,
        replacement: "import $1 from '@/app/(common)/member/$2'"
      },
      // Pattern 8: Fix imports between protected and public
      {
        pattern: /import (.*) from ['"]\.\.\/\(\(public\)\/(.*)['"]/g,
        replacement: "import $1 from '@/app/(public)/$2'"
      },
      // Pattern 9: Fix imports from /app/auth to proper path
      {
        pattern: /import (.*) from ['"]@\/app\/authDetail\/(.*)['"]/g,
        replacement: "import $1 from '@/app/(protected)/(common)/member/authDetail/$2'"
      },
      // Pattern 10: Fix paths to security stores
      {
        pattern: /import (.*) from ['"]\.\.\/security\/stores\/(.*)['"]/g,
        replacement: "import $1 from '@/app/(protected)/(common)/member/security/stores/$2'"
      },
      // Pattern 11: Fix paths to chat components
      {
        pattern: /import (.*) from ['"]\.\.\/chat\/components\/(.*)['"]/g,
        replacement: "import $1 from '@/app/(protected)/(common)/member/chat/components/$2'"
      },
      // Pattern 12: Fix paths to chat utils
      {
        pattern: /import (.*) from ['"]\.\.\/chat\/utils\/(.*)['"]/g,
        replacement: "import $1 from '@/app/(protected)/(common)/member/chat/utils/$2'"
      },
      // Pattern 13: Fix paths to login stores
      {
        pattern: /import (.*) from ['"]\.\.\/login\/stores\/(.*)['"]/g,
        replacement: "import $1 from '@/app/(public)/login/stores/$2'"
      }
    ];
    
    // Apply each pattern
    for (const { pattern, replacement } of patterns) {
      const updatedContent = newContent.replace(pattern, replacement);
      if (updatedContent !== newContent) {
        changes = true;
        newContent = updatedContent;
      }
    }
    
    // Only write the file if changes were made
    if (changes) {
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