#!/bin/bash

# Find all provider implementation files with 'use server'
PROVIDER_FILES=$(find src/app/sso/providers/implementations -name "*.ts" -type f | xargs grep -l "use server")

# Loop through files and remove 'use server'
for file in $PROVIDER_FILES; do
  echo "Fixing $file"
  # Remove 'use server' directive (and blank line after it)
  sed -i '' '1,2s/^'\''use server'\'';//' "$file"
done

echo "Completed removing 'use server' from provider implementation files." 