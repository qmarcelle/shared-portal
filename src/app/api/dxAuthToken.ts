import { auth } from '@/auth';
import { DXAuthToken } from '@/models/auth/dx_auth_token';
import { encrypt } from '@/utils/encryption';
import { NextApiRequest, NextApiResponse } from 'next';

const UNAUTHORIZED_ERR = 'Not logged in';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  try {
    const session = await auth();
    if (!session || !session.user) {
      throw UNAUTHORIZED_ERR;
    }
    const token: DXAuthToken = {
      user: session?.user.userName,
      time: Math.floor(new Date().getTime() / 1000),
    };
    const encryptedToken = encrypt(JSON.stringify(token));
    res.status(200).json({
      token: encryptedToken,
    });
  } catch (err) {
    if (err == UNAUTHORIZED_ERR) {
      res.status(401).json({
        error: 'Not signed in',
      });
    } else {
      res.status(500).json({
        error: 'Error generating token. See the log for details.',
      });
    }
  }
}
