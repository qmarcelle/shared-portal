#!/bin/bash
# Script to permanently delete unnecessary chat files after testing

# Delete default.tsx.bak
if [ -f src/app/chat/default.tsx.bak ]; then
  rm src/app/chat/default.tsx.bak
  echo "Deleted default.tsx.bak"
fi

# Delete component .bak files
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
    rm src/app/chat/components/$component.bak
    echo "Deleted $component.bak"
  fi
done

echo "Cleanup complete. All unnecessary .bak files have been deleted."