/**
 * This script updates import paths from @/app/@chat/* to @/app/chat/* across the codebase
 * Used for the chat refactoring to move from a parallel route to a normal component
 */
const fs = require('fs');
const path = require('path');

const logFile = path.join(__dirname, 'chat-import-update.log');

// Clear the log file
fs.writeFileSync(logFile, '', 'utf8');

function appendToLog(message) {
  fs.appendFileSync(logFile, message + '\n', 'utf8');
}

appendToLog('Chat Import Path Update Log\n');
appendToLog(`Started at: ${new Date().toISOString()}\n`);

// Directories to search for files
const directories = [
  path.join(__dirname, 'src'),
  path.join(__dirname, 'new_portal'),
  path.join(__dirname, 'tests'),
];

// File extensions to process
const extensions = ['.ts', '.tsx', '.js', '.jsx', '.md'];

// Patterns to search and replace
const patterns = [
  {
    // From @/app/@chat/... to @/app/chat/...
    regex: /from\s+['"]@\/app\/@chat\//g,
    replacement: 'from \'@/app/chat/'
  },
  {
    // From @/@chat/... to @/chat/...
    regex: /from\s+['"]@\/@chat\//g,
    replacement: 'from \'@/chat/'
  },
  {
    // From ../../@chat/... to ../../chat/...
    regex: /from\s+['"]\.\.\/\.\.\/\.\.\/\.\.?@chat\//g,
    replacement: 'from \'../../chat/'
  },
  {
    // From ../../../@chat/... to ../../../chat/...
    regex: /from\s+['"]\.\.\/\.\.\/\.\.\/\.\.?@chat\//g,
    replacement: 'from \'../../../chat/'
  },
  {
    // For jest.mock calls
    regex: /jest\.mock\(['"]@\/app\/@chat\//g,
    replacement: 'jest.mock(\'@/app/chat/'
  },
  {
    // For imports with destructuring
    regex: /(\{[^}]+\})\s+from\s+['"]@\/app\/@chat\//g,
    replacement: '$1 from \'@/app/chat/'
  },
  {
    // For imports with named imports
    regex: /(\w+)\s+from\s+['"]@\/app\/@chat\//g,
    replacement: '$1 from \'@/app/chat/'
  },
  {
    // For require statements
    regex: /require\(['"]@\/app\/@chat\//g,
    replacement: 'require(\'@/app/chat/'
  },
  {
    // For doc references in markdown
    regex: /src\/app\/@chat\//g,
    replacement: 'src/app/chat/'
  },
];

/**
 * Get all files in directory recursively
 */
function getFiles(dir) {
  const results = [];
  const list = fs.readdirSync(dir);
  
  list.forEach((file) => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat && stat.isDirectory()) {
      // Recurse into subdirectory
      results.push(...getFiles(filePath));
    } else {
      // Check if file has one of the target extensions
      if (extensions.some(ext => filePath.endsWith(ext))) {
        results.push(filePath);
      }
    }
  });
  
  return results;
}

/**
 * Process a file and update imports
 */
function processFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let originalContent = content;
    let changed = false;
    
    // Apply each pattern
    patterns.forEach(pattern => {
      if (pattern.regex.test(content)) {
        content = content.replace(pattern.regex, pattern.replacement);
        changed = true;
      }
    });
    
    // Only write back if changes were made
    if (changed) {
      fs.writeFileSync(filePath, content, 'utf8');
      appendToLog(`Updated: ${filePath}`);
      
      // Log the specific lines that were changed for debugging
      const originalLines = originalContent.split('\n');
      const newLines = content.split('\n');
      
      for (let i = 0; i < originalLines.length; i++) {
        if (originalLines[i] !== newLines[i]) {
          appendToLog(`  - Line ${i+1}: ${originalLines[i]} -> ${newLines[i]}`);
        }
      }
      
      appendToLog('');
    }
  } catch (err) {
    appendToLog(`Error processing ${filePath}: ${err.message}`);
  }
}

// Main execution
let totalFiles = 0;
let updatedFiles = 0;

directories.forEach(dir => {
  if (fs.existsSync(dir)) {
    const files = getFiles(dir);
    totalFiles += files.length;
    
    files.forEach(file => {
      const before = fs.readFileSync(file, 'utf8');
      processFile(file);
      const after = fs.readFileSync(file, 'utf8');
      
      if (before !== after) {
        updatedFiles++;
      }
    });
  } else {
    appendToLog(`Directory not found: ${dir}`);
  }
});

appendToLog(`\nSummary:`);
appendToLog(`Total files processed: ${totalFiles}`);
appendToLog(`Files updated: ${updatedFiles}`);
appendToLog(`\nCompleted at: ${new Date().toISOString()}`);

console.log(`Chat import paths updated. See ${logFile} for details.`);
console.log(`Total files processed: ${totalFiles}`);
console.log(`Files updated: ${updatedFiles}`);