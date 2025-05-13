import { logger } from '@/utils/logger';
import fs from 'fs';
import { NextRequest, NextResponse } from 'next/server';
import path from 'path';

/**
 * API endpoint to check if sound files can be loaded
 * Used for debugging audio issues in Genesys chat
 */
export async function GET(request: NextRequest) {
  try {
    const publicPath = path.join(process.cwd(), 'public');
    const genesysPath = path.join(publicPath, 'assets', 'genesys');
    const soundsPath = path.join(genesysPath, 'sounds');

    // Make sure the sounds directory exists
    if (!fs.existsSync(soundsPath)) {
      fs.mkdirSync(soundsPath, { recursive: true });
      logger.info('[API:soundcheck] Created sounds directory', {
        path: soundsPath,
      });
    }

    // Check for existing bell.mp3
    const bellFile = path.join(soundsPath, 'bell.mp3');
    const hasExistingFile = fs.existsSync(bellFile);

    // If file doesn't exist, create a simple audio file
    // (In a real scenario, you would copy a proper audio file here)
    if (!hasExistingFile) {
      // We're just creating an empty file for testing - in production,
      // you'd want to copy a real MP3 file
      fs.writeFileSync(bellFile, '');
      logger.info('[API:soundcheck] Created placeholder bell.mp3 file', {
        path: bellFile,
      });
    }

    // List all audio files in the sounds directory
    const files = fs.readdirSync(soundsPath);

    return NextResponse.json({
      success: true,
      message: 'Sound check completed',
      soundsPath: soundsPath.replace(process.cwd(), ''),
      hasGenesysDirectory: fs.existsSync(genesysPath),
      hasSoundsDirectory: fs.existsSync(soundsPath),
      hasExistingBellFile: hasExistingFile,
      files,
    });
  } catch (error) {
    logger.error('[API:soundcheck] Error checking sound files', {
      error: error instanceof Error ? error.message : String(error),
    });

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 },
    );
  }
}
