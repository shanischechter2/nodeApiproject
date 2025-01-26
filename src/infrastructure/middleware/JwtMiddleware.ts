import jwt from 'jsonwebtoken';
import Koa from 'koa';

const JWT_SECRET = 'shani';

export async function jwtMiddleware(ctx: Koa.Context, next: Koa.Next) {
  const token = ctx.cookies.get('token');
  if (!token) {
    ctx.status = 401;
    ctx.body = { error: 'you need to login' };
    return;
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    ctx.state.user = decoded;
    await next();
  } catch (err) {
    ctx.status = 401;
    ctx.body = { error: 'Invalid or expired token, login again' };
  }
}

