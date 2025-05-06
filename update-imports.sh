#!/bin/bash

# Update absolute imports
find src -type f -name "*.ts*" -exec sed -i '' \
  -e 's|@/app/dashboard/|@/app/(common)/dashboard/|g' \
  -e 's|@/app/findcare/|@/app/(common)/findcare/|g' \
  -e 's|@/app/support/|@/app/(common)/support/|g' \
  -e 's|@/app/security/|@/app/(common)/security/|g' \
  -e 's|@/app/pharmacy/|@/app/(common)/pharmacy/|g' \
  -e 's|@/app/claims/|@/app/(common)/claims/|g' \
  -e 's|@/app/chat/|@/app/(common)/chat/|g' \
  -e 's|@/app/login/|@/app/(common)/login/|g' \
  -e 's|@/app/searchResults/|@/app/(common)/searchResults/|g' \
  -e 's|@/app/spendingAccounts/|@/app/(common)/spendingAccounts/|g' \
  -e 's|@/app/sharingPermissions/|@/app/(common)/sharingPermissions/|g' \
  {} \;

# Update relative imports
find src -type f -name "*.ts*" -exec sed -i '' \
  -e 's|../../dashboard/|../../(common)/dashboard/|g' \
  -e 's|../../findcare/|../../(common)/findcare/|g' \
  -e 's|../../support/|../../(common)/support/|g' \
  -e 's|../../security/|../../(common)/security/|g' \
  -e 's|../../pharmacy/|../../(common)/pharmacy/|g' \
  -e 's|../../claims/|../../(common)/claims/|g' \
  -e 's|../../chat/|../../(common)/chat/|g' \
  -e 's|../../login/|../../(common)/login/|g' \
  -e 's|../../searchResults/|../../(common)/searchResults/|g' \
  -e 's|../../spendingAccounts/|../../(common)/spendingAccounts/|g' \
  -e 's|../../sharingPermissions/|../../(common)/sharingPermissions/|g' \
  {} \;

# Update one level up relative imports
find src -type f -name "*.ts*" -exec sed -i '' \
  -e 's|../dashboard/|../(common)/dashboard/|g' \
  -e 's|../findcare/|../(common)/findcare/|g' \
  -e 's|../support/|../(common)/support/|g' \
  -e 's|../security/|../(common)/security/|g' \
  -e 's|../pharmacy/|../(common)/pharmacy/|g' \
  -e 's|../claims/|../(common)/claims/|g' \
  -e 's|../chat/|../(common)/chat/|g' \
  -e 's|../login/|../(common)/login/|g' \
  -e 's|../searchResults/|../(common)/searchResults/|g' \
  -e 's|../spendingAccounts/|../(common)/spendingAccounts/|g' \
  -e 's|../sharingPermissions/|../(common)/sharingPermissions/|g' \
  {} \;

echo "Import paths updated" 