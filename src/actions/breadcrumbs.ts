'use server';

import { rewriteRules } from '@/lib/rewrites';
import { Breadcrumb } from '@/models/app/breadcrumb';
import { getBreadcrumbs } from '@/utils/routing';

export async function getBreadcrumbTrail(
  clientPath: string,
  templateText?: string,
): Promise<Breadcrumb[]> {
  const path = rewriteRules[clientPath] || clientPath;
  return getBreadcrumbs(path, templateText);
}
