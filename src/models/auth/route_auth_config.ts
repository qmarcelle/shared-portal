import { VisibilityRules } from '@/visibilityEngine/rules';

export interface RouteConfig {
  /** The title of the page, as shown in the breadcrumb trail */
  title?: string | ((text: string) => string);
  /** The path to the parent page in the breadcrumb trail. If undefined, the parent object in the RouteConfig will be used. Set to '/' to indicate the top level/end of the breadcrumb trail. */
  breadcrumbParent?: string;
  /** Alternative user-facing relative path to link the breadcrumb to (instead of the file-based one) */
  pathAlias?: string;
  /** The visibility rule controlling access to the page. Can be a hardcoded boolean, a string referring to the name of a rule in vRules, or a callback for more complex logic. If not set, all authenticated users have access. */
  rule?: string | boolean | ((rules: VisibilityRules) => boolean | undefined);
  /** Set to true if the page cannot be accessed in impersonation. */
  noImpersonation?: boolean;
  /** Set to true if the page can be accessed by ANY user, including unauthenticated. */
  public?: boolean;
  /** Set to true if the page is part of a login flow and should only be accessed by unauthenticated users. Logged-in users will be redirected to the dashboard. */
  auth?: boolean;
  /** For inbound SSO routes, this is the path to redirect users to once logged in. */
  inboundDestination?: string;
  /** Collection of child pages beneath this one in the folder structure. */
  children?: RouteConfigMap;
}

export interface RouteConfigMap {
  [path: string]: RouteConfig;
}
