'use server';
import { auth } from '@/auth';

type FunctionCaller = <F extends (...args: any[]) => any>(
  method: F,
  ...args: Parameters<F> | []
) => Promise<ReturnType<F>>;

export const withMemberCk: FunctionCaller = async (fn, ...args) => {
  const session = await auth();
  return fn(session?.user.currUsr.plan?.memCk);
};
