#!/bin/bash

# Script to fix import paths in TypeScript/TSX files

echo "Starting import path fixes..."

# Find all TypeScript and TSX files in src/app directory
find src/app -type f -name "*.ts" -o -name "*.tsx" | while read file; do
  echo "Processing $file"
  
  # Fix route-group imports of type ../../(common)/
  sed -i '' "s|import \(.*\) from '\.\./\.\./\(common\)/|import \1 from '@/app/\(common\)/member/|g" "$file"
  
  # Fix mangled route-group imports of type @/app/(commo../(common)/
  sed -i '' "s|import \(.*\) from '@/app/(commo\.\./\(common\)/|import \1 from '@/app/\(common\)/member/|g" "$file"
  
  # Fix component imports of type ../../../components/
  sed -i '' "s|import \(.*\) from '\.\./\.\./\.\./components/|import \1 from '@/components/|g" "$file"
  sed -i '' "s|import \(.*\) from '\.\./\.\./\.\./\.\./\.\./\.\./components/|import \1 from '@/components/|g" "$file"
  
  # Fix public asset imports
  sed -i '' "s|public/assets/|/assets/|g" "$file"
done

echo "Import path fixes completed!"