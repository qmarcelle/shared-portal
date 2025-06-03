#!/bin/bash

# This script removes the old SSO implementation files that have been refactored to the new pattern

echo "Removing old SSO implementation files..."

# Remove old implementation files
rm -f src/app/sso/ssoImpl/Blue365Impl.ts
rm -f src/app/sso/ssoImpl/CVSCaremarkImpl.ts
rm -f src/app/sso/ssoImpl/ChipRewardsImpl.ts
rm -f src/app/sso/ssoImpl/ElectronicPaymentBOAImpl.ts
rm -f src/app/sso/ssoImpl/EmboldImpl.ts
rm -f src/app/sso/ssoImpl/EyemedImpl.ts
rm -f src/app/sso/ssoImpl/HSABankImpl.ts
rm -f src/app/sso/ssoImpl/HealthEquityImpl.ts
rm -f src/app/sso/ssoImpl/InstamedImpl.ts
rm -f src/app/sso/ssoImpl/InstamedPaymentHistoryImpl.ts
rm -f src/app/sso/ssoImpl/M3PImpl.ts
rm -f src/app/sso/ssoImpl/OnLifeImpl.ts
rm -f src/app/sso/ssoImpl/PinnacleBankImpl.ts
rm -f src/app/sso/ssoImpl/PremiseHealthImpl.ts
rm -f src/app/sso/ssoImpl/ProviderDirectoryImpl.ts
rm -f src/app/sso/ssoImpl/TeladocImpl.ts
rm -f src/app/sso/ssoImpl/VitalsPRPImpl.ts

# Check if directory is empty
if [ -z "$(ls -A src/app/sso/ssoImpl/)" ]; then
    echo "Directory is empty, removing it..."
    rmdir src/app/sso/ssoImpl/
else
    echo "Directory is not empty, some files remain."
    ls -la src/app/sso/ssoImpl/
fi

echo "Cleanup complete!" 