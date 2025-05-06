import { auth, SERVER_ACTION_NO_SESSION_ERROR } from '@/app/(system)/auth';

export async function getServerSideUserId(): Promise<string> {
  const session = await auth();
  if (!session || !session.user) {
    throw SERVER_ACTION_NO_SESSION_ERROR;
  }
  return session.user.id;
}
