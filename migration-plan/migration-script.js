#!/usr/bin/env node

/**
 * Project Reorganization Script
 * 
 * This script migrates the project structure according to the new organization
 * based on visibility rules analysis.
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Root directory
const ROOT_DIR = path.resolve(__dirname, '..');
const SRC_DIR = path.join(ROOT_DIR, 'src');
const APP_DIR = path.join(SRC_DIR, 'app');

// Migration tables - source -> destination mappings
const migrationMappings = {
  // System routes
  'planselect/active': '(system)/planselect/active',
  'planselect/termed': '(system)/planselect/termed',
  'maintenance': '(system)/maintenance',
  'error': '(system)/error',
  
  // Public routes (no visibility logic needed)
  'login': '(public)/login',
  '1095BFormRequest': '(public)/1095BFormRequest',
  'accessOthersInformation': '(public)/accessOthersInformation',
  'amplifyHealthSupport': '(public)/amplifyHealthSupport',
  'authDetail': '(public)/authDetail',
  'claim': '(public)/claim',
  'communicationSettings': '(public)/communicationSettings',
  'embed': '(public)/embed',
  'healthyMaternity': '(public)/healthyMaternity',
  'inbox': '(public)/inbox',
  'medicalBenefitDetail': '(public)/medicalBenefitDetail',
  'mentalHealthOptions': '(public)/mentalHealthOptions',
  'myPrimaryCareProvider': '(public)/myPrimaryCareProvider',
  'personalRepresentativeAccess': '(public)/personalRepresentativeAccess',
  'priceDentalCare': '(public)/priceDentalCare',
  'priorAuth': '(public)/priorAuth',
  'priorAuthorization': '(public)/priorAuthorization',
  'profileSettings': '(public)/profileSettings',
  'reportOtherHealthInsurance': '(public)/reportOtherHealthInsurance',
  'shareMyInformation': '(public)/shareMyInformation',
  'spendingAccount': '(public)/spendingAccount',
  'spendingSummary': '(public)/spendingSummary',
  'sso': '(public)/sso',
  'thirdPartySharing': '(public)/thirdPartySharing',
  'transactions': '(public)/transactions',
  'understandingAccessOnMyPlan': '(public)/understandingAccessOnMyPlan',
  'updateMyPrimaryCareProvider': '(public)/updateMyPrimaryCareProvider',
  'virtualCareOptions': '(public)/virtualCareOptions',
  
  // Protected common routes (with visibility logic)
  '(common)/dashboard': '(protected)/(common)/member/dashboard',
  '(common)/myplan': '(protected)/(common)/member/myplan',
  '(common)/myhealth': '(protected)/(common)/member/myhealth',
  '(common)/findcare': '(protected)/(common)/member/findcare',
  '(common)/pharmacy': '(protected)/(common)/member/pharmacy',
  '(common)/claims': '(protected)/(common)/member/claims',
  '(common)/support': '(protected)/(common)/member/support',
  '(common)/security': '(protected)/(common)/member/security',
  '(common)/profile': '(protected)/(common)/member/profile',
  '(common)/sharing': '(protected)/(common)/member/sharing',
  '(common)/sharingPermissions': '(protected)/(common)/member/sharing/permissions',
  '(common)/spendingAccounts': '(protected)/(common)/member/spendingAccounts',
  '(common)/chat': '(protected)/(common)/member/chat',
  
  // LOB-specific routes
  '[group]/dashboard': '(protected)/bluecare/member/dashboard',
  '[group]/findcare': '(protected)/bluecare/member/findcare',
  '[group]/myhealth': '(protected)/bluecare/member/myhealth',
  '[group]/myplan': '(protected)/bluecare/member/myplan',
  '[group]/support': '(protected)/amplify/member/support',
};

/**
 * Create required directories for migration
 */
function createDirectoryStructure() {
  console.log('Creating directory structure...');
  
  const directories = [
    // Public directory
    path.join(APP_DIR, '(public)'),
    
    // Protected directories
    path.join(APP_DIR, '(protected)'),
    path.join(APP_DIR, '(protected)', '(common)'),
    path.join(APP_DIR, '(protected)', '(common)', 'member'),
    path.join(APP_DIR, '(protected)', 'bluecare'),
    path.join(APP_DIR, '(protected)', 'bluecare', 'member'),
    path.join(APP_DIR, '(protected)', 'amplify'),
    path.join(APP_DIR, '(protected)', 'amplify', 'member'),
    path.join(APP_DIR, '(protected)', 'quantum'),
    path.join(APP_DIR, '(protected)', 'quantum', 'member'),
    
    // System directories
    path.join(APP_DIR, '(system)'),
    path.join(APP_DIR, '(system)', 'planselect'),
    path.join(APP_DIR, '(system)', 'planselect', 'active'),
    path.join(APP_DIR, '(system)', 'planselect', 'termed'),
    path.join(APP_DIR, '(system)', 'maintenance'),
    path.join(APP_DIR, '(system)', 'error'),
  ];
  
  directories.forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
      console.log(`Created: ${dir}`);
    }
  });
}

/**
 * Migrate files according to mapping
 */
function migrateFiles() {
  console.log('Migrating files...');
  
  Object.entries(migrationMappings).forEach(([source, dest]) => {
    const sourcePath = path.join(APP_DIR, source);
    const destPath = path.join(APP_DIR, dest);
    
    if (fs.existsSync(sourcePath)) {
      if (!fs.existsSync(destPath)) {
        // Ensure destination directory exists
        fs.mkdirSync(path.dirname(destPath), { recursive: true });
        
        // Use Git to move files to properly track changes
        try {
          execSync(`git mv "${sourcePath}" "${destPath}"`, { stdio: 'inherit' });
          console.log(`Moved: ${sourcePath} -> ${destPath}`);
        } catch (error) {
          // Fallback to regular move if git fails
          fs.renameSync(sourcePath, destPath);
          console.log(`Moved (non-git): ${sourcePath} -> ${destPath}`);
        }
      } else {
        console.log(`Destination already exists: ${destPath}`);
      }
    } else {
      console.log(`Source not found: ${sourcePath}`);
    }
  });
}

/**
 * Create middleware.ts file
 */
function createMiddleware() {
  console.log('Creating middleware.ts...');
  
  const middlewarePath = path.join(APP_DIR, 'middleware.ts');
  const middlewareContent = `import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getVisibilityRules } from '@/actions/getVisibilityRules'

export async function middleware(request: NextRequest) {
  // Get visibility rules from session
  const visibilityRules = await getVisibilityRules()
  
  // Route patterns that need protection
  const protectedRoutes = /^\\/\\(protected\\)\\/.*/
  
  // Check if route is protected
  if (protectedRoutes.test(request.nextUrl.pathname)) {
    // No visibility rules found - redirect to login
    if (!visibilityRules) {
      return NextResponse.redirect(new URL('/login', request.url))
    }
    
    // LOB-specific checks
    if (request.nextUrl.pathname.includes('/(protected)/bluecare/')) {
      if (!visibilityRules.blueCare) {
        return NextResponse.redirect(new URL('/error/403', request.url))
      }
    }
    
    // Amplify-specific checks
    if (request.nextUrl.pathname.includes('/(protected)/amplify/')) {
      if (!visibilityRules.amplifyMember) {
        return NextResponse.redirect(new URL('/error/403', request.url))
      }
    }
    
    // Quantum-specific checks
    if (request.nextUrl.pathname.includes('/(protected)/quantum/')) {
      if (!visibilityRules.isCondensedExperience) {
        return NextResponse.redirect(new URL('/error/403', request.url))
      }
    }
  }
  
  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!_next/static|api|favicon.ico).*)',
  ],
}`;

  fs.writeFileSync(middlewarePath, middlewareContent);
  console.log(`Created: ${middlewarePath}`);
}

/**
 * Execute the migration process
 */
function executeMigration() {
  console.log('Starting migration process...');
  
  // Step 1: Create directory structure
  createDirectoryStructure();
  
  // Step 2: Migrate files
  migrateFiles();
  
  // Step 3: Create middleware
  createMiddleware();
  
  console.log('Migration completed successfully!');
  console.log('Next steps:');
  console.log('1. Fix import references in moved files');
  console.log('2. Test the application thoroughly');
  console.log('3. Commit changes with descriptive commit message');
}

executeMigration();