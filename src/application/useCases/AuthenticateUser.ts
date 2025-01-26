import jwt from 'jsonwebtoken';
import { UserRepository } from '../../domain/user/UserRepository';

const JWT_SECRET = 'shani';

export async function authenticateUser(username: string): Promise<string | null> {
  const user = await UserRepository.getUserByUsername(username);
  if (!user) return null;


  return jwt.sign({ id: user.id, username: user.username, isadmin: user.isadmin }, JWT_SECRET, {
    expiresIn: '1h',
  });
}
