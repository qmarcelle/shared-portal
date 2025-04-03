'use server';

import { logger } from '@/utils/logger';
import { revalidateTag } from 'next/cache';

export async function revalidateUser(userId: string) {
  logger.info(`Going to purge data for ${userId}`);
  revalidateTag(userId);
}
