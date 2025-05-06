#!/bin/bash

# Update myHealth routes
find src -type f -name "*.ts*" -exec sed -i '' 's|href="/myHealth|href="/myhealth|g' {} +

# Update myPlan routes
find src -type f -name "*.ts*" -exec sed -i '' 's|href="/myPlan|href="/myplan|g' {} + 