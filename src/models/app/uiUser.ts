/**
 * App Model to pass User information to Client UI
 * stripping off hidden info like memberCK, groupCK, etc.
 */
export type UIUser = {
  id: string;
  name: string;
};
