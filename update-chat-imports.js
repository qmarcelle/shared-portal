/**
 * This script updates import paths from @/app/chat/* to @/app/@chat/* across the codebase
 * Run with: node update-chat-imports.js
 */
const fs = require('fs');
const path = require('path');
const { promisify } = require('util');

const readFileAsync = promisify(fs.readFile);
const writeFileAsync = promisify(fs.writeFile);
const readdirAsync = promisify(fs.readdir);
const statAsync = promisify(fs.stat);

// Configuration
const rootDir = __dirname;
const srcDir = path.join(rootDir, 'src');
const ignorePatterns = [
  /node_modules/,
  /\.git/,
  /\.next/,
  /\.vscode/,
  /\.idea/,
  /build/,
  /dist/,
];

// Pattern to match imports from @/app/chat but not @/app/@chat
const importPatterns = [
  {
    // Standard imports: from '@/app/chat/...'
    regex: /from\s+['"]@\/app\/chat\/(?!@chat)/g,
    replacement: 'from \'@/app/@chat/'
  },
  {
    // Relative imports: from '../../chat/...'
    regex: /from\s+['"]\.\.\/\.\.\/chat\/(?!@chat)/g,
    replacement: 'from \'../../@chat/'
  },
  {
    // Import in angle brackets: <@/app/chat/...>
    regex: /<@\/app\/chat\/(?!@chat)/g,
    replacement: '<@/app/@chat/'
  },
  {
    // Test imports: from 'app/chat/...'
    regex: /from\s+['"]app\/chat\/(?!@chat)/g,
    replacement: 'from \'app/@chat/'
  },
  {
    // Deeper relative imports: from '../../../chat/...'
    regex: /from\s+['"]\.\.\/\.\.\/\.\.\/chat\/(?!@chat)/g,
    replacement: 'from \'../../../@chat/'
  }
];

// React import patterns (specific to tsx files)
const reactImportPatterns = [
  {
    // Component imports: ChatWidget from '@/app/chat/...'
    regex: /(\w+)\s+from\s+['"]@\/app\/chat\/(?!@chat)/g,
    replacement: '$1 from \'@/app/@chat/'
  },
  {
    // Destructured imports: { X } from '@/app/chat/...'
    regex: /(\{[^}]+\})\s+from\s+['"]@\/app\/chat\/(?!@chat)/g,
    replacement: '$1 from \'@/app/@chat/'
  }
];

// Module imports for jest.mock
const jestMockPatterns = [
  {
    // Standard jest.mock: jest.mock('@/app/chat/...')
    regex: /jest\.mock\(['"]@\/app\/chat\/(?!@chat)/g,
    replacement: 'jest.mock(\'@/app/@chat/'
  },
  {
    // jest.mock with implementation: jest.mock('@/app/chat/...', () => {...})
    regex: /jest\.mock\(['"]@\/app\/chat\/([^'"]+)['"],\s*\(\)\s*=>/g,
    replacement: 'jest.mock(\'@/app/@chat/$1\', () =>'
  }
];

// Module imports for require
const requirePatterns = [
  {
    // require('@/app/chat/...')
    regex: /require\(['"]@\/app\/chat\/(?!@chat)/g,
    replacement: 'require(\'@/app/@chat/'
  }
];

// Logging
const logFile = path.join(rootDir, 'chat-import-update.log');
let logContent = `Chat Import Update Log - ${new Date().toISOString()}\n\n`;

// Function to append to log
function appendToLog(message) {
  logContent += `${message}\n`;
  console.log(message);
}

// Check if a file should be processed
function shouldProcessFile(filePath) {
  // Only process TypeScript and React files
  if (!/\.(ts|tsx|js|jsx)$/.test(filePath)) {
    return false;
  }

  // Skip files from ignore patterns
  return !ignorePatterns.some(pattern => pattern.test(filePath));
}

// Process a single file
async function processFile(filePath) {
  try {
    const content = await readFileAsync(filePath, 'utf8');
    let updatedContent = content;
    let hasChanges = false;
    
    // Apply all import patterns
    for (const pattern of importPatterns) {
      if (pattern.regex.test(updatedContent)) {
        updatedContent = updatedContent.replace(pattern.regex, pattern.replacement);
        hasChanges = true;
      }
      // Reset the regex lastIndex
      pattern.regex.lastIndex = 0;
    }
    
    // For TSX/JSX files, also apply React-specific patterns
    if (/\.(tsx|jsx)$/.test(filePath)) {
      for (const pattern of reactImportPatterns) {
        if (pattern.regex.test(updatedContent)) {
          updatedContent = updatedContent.replace(pattern.regex, pattern.replacement);
          hasChanges = true;
        }
        // Reset the regex lastIndex
        pattern.regex.lastIndex = 0;
      }
    }
    
    // Apply jest.mock patterns (especially important for test files)
    for (const pattern of jestMockPatterns) {
      if (pattern.regex.test(updatedContent)) {
        updatedContent = updatedContent.replace(pattern.regex, pattern.replacement);
        hasChanges = true;
      }
      // Reset the regex lastIndex
      pattern.regex.lastIndex = 0;
    }
    
    // Apply require patterns
    for (const pattern of requirePatterns) {
      if (pattern.regex.test(updatedContent)) {
        updatedContent = updatedContent.replace(pattern.regex, pattern.replacement);
        hasChanges = true;
      }
      // Reset the regex lastIndex
      pattern.regex.lastIndex = 0;
    }
    
    if (!hasChanges) {
      return false; // No changes needed
    }
    
    // Find all import statements in the file for logging
    const importLines = content.match(/import.*from\s+['"]@\/app\/chat\/[^'"]+['"]/g) || [];
    const jestMockLines = content.match(/jest\.mock\(['"]@\/app\/chat\/[^'"]+['"]/g) || [];
    
    // Write updated content back to file
    await writeFileAsync(filePath, updatedContent);
    
    // Logging
    appendToLog(`Updated: ${filePath}`);
    importLines.forEach(line => {
      appendToLog(`  - ${line} -> ${line.replace('@/app/chat/', '@/app/@chat/')}`);
    });
    jestMockLines.forEach(line => {
      appendToLog(`  - ${line} -> ${line.replace('@/app/chat/', '@/app/@chat/')}`);
    });
    
    return true;
  } catch (error) {
    appendToLog(`Error processing file ${filePath}: ${error.message}`);
    return false;
  }
}

// Recursively traverse directory
async function traverseDirectory(dirPath) {
  try {
    const entries = await readdirAsync(dirPath);
    let updatedCount = 0;
    
    for (const entry of entries) {
      const entryPath = path.join(dirPath, entry);
      const stats = await statAsync(entryPath);
      
      if (stats.isDirectory()) {
        // Skip directories in ignore patterns
        if (!ignorePatterns.some(pattern => pattern.test(entryPath))) {
          updatedCount += await traverseDirectory(entryPath);
        }
      } else if (stats.isFile() && shouldProcessFile(entryPath)) {
        const updated = await processFile(entryPath);
        if (updated) updatedCount++;
      }
    }
    
    return updatedCount;
  } catch (error) {
    appendToLog(`Error traversing directory ${dirPath}: ${error.message}`);
    return 0;
  }
}

// Special focus on test files
async function processTestFiles() {
  appendToLog('Focusing on test files specifically...');
  
  const testPatterns = [
    path.join(srcDir, 'app', '**', '__tests__', '**', '*.ts*'),
    path.join(srcDir, 'app', '**', '**', '*.spec.ts*'),
    path.join(srcDir, 'app', '**', '**', '*.test.ts*'),
    path.join(srcDir, 'tests', '**', '*.ts*'),
    path.join(srcDir, 'tests', '**', '*.spec.ts*'),
    path.join(srcDir, 'tests', '**', '*.test.ts*')
  ];
  
  // Helper function to glob files matching patterns
  async function globFiles(pattern) {
    const allFiles = [];
    const basePath = pattern.split('*')[0];
    
    async function traverseForTests(dirPath) {
      try {
        const entries = await readdirAsync(dirPath);
        
        for (const entry of entries) {
          const entryPath = path.join(dirPath, entry);
          const stats = await statAsync(entryPath);
          
          if (stats.isDirectory()) {
            if (!ignorePatterns.some(p => p.test(entryPath))) {
              await traverseForTests(entryPath);
            }
          } else if (stats.isFile() && 
                    (entryPath.includes('__tests__') || 
                     entryPath.endsWith('.spec.ts') || 
                     entryPath.endsWith('.spec.tsx') || 
                     entryPath.endsWith('.test.ts') || 
                     entryPath.endsWith('.test.tsx'))) {
            allFiles.push(entryPath);
          }
        }
      } catch (error) {
        appendToLog(`Error finding test files in ${dirPath}: ${error.message}`);
      }
    }
    
    await traverseForTests(basePath);
    return allFiles;
  }
  
  let testFiles = [];
  for (const pattern of testPatterns) {
    try {
      const files = await globFiles(pattern);
      testFiles = testFiles.concat(files);
    } catch (error) {
      appendToLog(`Error globbing pattern ${pattern}: ${error.message}`);
    }
  }
  
  // Remove duplicates
  testFiles = [...new Set(testFiles)];
  appendToLog(`Found ${testFiles.length} test files to process`);
  
  let updatedCount = 0;
  for (const file of testFiles) {
    try {
      const updated = await processFile(file);
      if (updated) updatedCount++;
    } catch (error) {
      appendToLog(`Error processing test file ${file}: ${error.message}`);
    }
  }
  
  appendToLog(`Updated ${updatedCount} test files specifically`);
  return updatedCount;
}

// Main execution
async function main() {
  appendToLog('Starting chat import path update...');
  
  // First update import statements
  const updatedCount = await traverseDirectory(srcDir);
  appendToLog(`Updated import paths in ${updatedCount} files.`);
  
  // Special focus on test files
  await processTestFiles();
  
  // Save log file
  fs.writeFileSync(logFile, logContent);
  appendToLog(`Log saved to ${logFile}`);
}

// Run the script
main().catch(error => {
  console.error('Script error:', error);
  fs.writeFileSync(logFile, `${logContent}\nScript error: ${error.message}`);
});