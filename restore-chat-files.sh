#!/bin/bash
# Script to restore renamed chat files if needed

# Restore default.tsx
if [ -f src/app/chat/default.tsx.bak ]; then
  mv src/app/chat/default.tsx.bak src/app/chat/default.tsx
  echo "Restored default.tsx"
fi

# Restore component files
components=(
  "ChatUI.tsx"
  "ChatLoading.tsx"
  "BusinessHoursBanner.tsx"
  "PlanSwitcherButton.tsx"
  "PlanInfoHeader.tsx"
  "TermsAndConditions.tsx"
  "PreChatWindow.tsx"
  "ChatControls.tsx"
)

for component in "${components[@]}"; do
  if [ -f src/app/chat/components/$component.bak ]; then
    mv src/app/chat/components/$component.bak src/app/chat/components/$component
    echo "Restored $component"
  fi
done

echo "Restoration complete. All available .bak files have been restored."