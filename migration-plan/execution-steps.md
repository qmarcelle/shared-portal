# Execution Steps for Project Reorganization

## Initial Setup

1. Create a new branch for this restructuring:
   ```bash
   git checkout -b feature/app-directory-reorganization
   ```

2. Make the migration script executable:
   ```bash
   chmod +x migration-plan/migration-script.js
   ```

## Execution Process

### 1. Run the Migration Script

The script will:
- Create the necessary directory structure
- Move files according to the mapping table
- Create the middleware.ts file

```bash
node migration-plan/migration-script.js
```

### 2. Fix Imports

After moving files, you'll need to update import references. Use the following commands to find and fix broken imports:

```bash
# Find all files with import statements referencing moved files
find src -type f -name "*.tsx" -o -name "*.ts" | xargs grep -l "from '@" | xargs grep -l "app/"
```

For each file with broken imports, update the import paths according to the new structure.

### 3. Update Layouts

Make sure that layout files are correctly placed and referenced in the new structure:

1. Check that all route groups have appropriate layout.tsx files
2. Verify that nested layouts work correctly with the reorganized structure

### 4. Test the Application

Test thoroughly to ensure the restructuring doesn't break functionality:

1. Test public routes
2. Test protected routes with various visibility rules
3. Test LOB-specific route overrides
4. Test the middleware functionality for protecting routes

### 5. Commit Changes

Once testing is complete, commit the changes:

```bash
git add .
git commit -m "Reorganize app directory structure based on visibility rules"
```

## Implementation Notes

### Route Categories

1. **Public Routes**:
   - No visibility checks required
   - Accessible to all users (logged in or not)
   - Example: login, error pages

2. **Protected Common Routes**:
   - Require the user to be logged in
   - Use visibility rules to determine access
   - Common experience across all LOBs
   - Example: dashboard, myplan, myhealth

3. **LOB-Specific Routes**:
   - Override common routes for specific LOBs
   - Only accessible to users with specific LOB flags
   - Example: bluecare variants, amplify variants

4. **System Routes**:
   - Special routes for system functionality
   - Example: plan selection, maintenance

### Middleware Implementation

The middleware.ts file implements route protection based on visibility rules:

1. **Basic Protection**:
   - Checks if the user is logged in
   - Redirects to login if no visibility rules are found

2. **LOB-Specific Protection**:
   - Checks for specific LOB flags (blueCare, amplifyMember, etc.)
   - Redirects to 403 error if the user doesn't have the required flags

3. **Feature-Specific Protection**:
   - Checks for feature-specific flags based on the route
   - Redirects to 403 error if the user doesn't have the required flags

### Post-Migration Next Steps

1. **Update Navigation**:
   - Update any navigation components to reference the new routes

2. **Documentation**:
   - Update documentation to reflect the new structure
   - Document the middleware approach for route protection

3. **Future Enhancements**:
   - Consider implementing more granular route protection
   - Optimize middleware performance
   - Implement caching for visibility rules