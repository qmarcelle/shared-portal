'use server';

import { Breadcrumb } from '@/models/app/breadcrumb';
import { getBreadcrumbs, getURLRewrite } from '@/utils/routing';

export async function getBreadcrumbTrail(
  clientPath: string,
  templateText?: string,
): Promise<Breadcrumb[]> {
  const path = getURLRewrite(clientPath);
  const crumbs = getBreadcrumbs(path || clientPath, templateText);
  //logger.info(`getBreadCrumbTrail ${path} ${JSON.stringify(crumbs)}`);
  return crumbs;
}
