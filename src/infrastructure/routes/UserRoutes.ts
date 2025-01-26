import Router from 'koa-router';

import { authenticateUser } from '../../application/useCases/AuthenticateUser';
import { jwtMiddleware } from '../middleware/JwtMiddleware';
import { UserRepository } from '../../domain/user/UserRepository';

const userRouter = new Router();

userRouter.post('/register', async (ctx) => {

  if (ctx.method !== 'POST') {
    ctx.status = 405;
    ctx.body = { error: 'Method not allowed.' };
    return;
  }
  const { username, pass } = ctx.request.body as { username: string; pass?: string };


  if (!username) {

    ctx.status = 400;
    ctx.body = { error: 'Username is required' };
    return;
  }
 const existingUser = await UserRepository.getUserByUsername(username);
  if (existingUser) {
    ctx.status = 400;
    ctx.body = { error: 'Username already exists' };
    return;
  }
  if (!pass) {
    const user = await UserRepository.createUser(username, false);
    ctx.status = 201;
    ctx.body = { message: 'User created successfully', user };
    return;
  }

  if (pass === 'admin') {
    const user = await UserRepository.createUser(username, true);
    ctx.status = 201;
    ctx.body = { message: 'Admin user created successfully', user };
    return;
  }


  ctx.status = 400;
  ctx.body = { error: 'The secret pass for admin is incorrect' };


});

userRouter.post('/login', async (ctx) => {
  const { username } = ctx.request.body as { username: string; };
  if (!username) {
    ctx.status = 400;
    ctx.body = { error: 'Username required' };
    return;
  }

  const token = await authenticateUser(username);
  if (!token) {
    ctx.status = 401;
    ctx.body = { error: 'the user name is incorrect' };
    return;
  }

  ctx.body = { message: 'Login successful', token };

  ctx.cookies.set('token', token, {
    httpOnly: true,
    secure: false,
    sameSite: 'lax',
  });
});
userRouter.post('/signout', async (ctx) => {

  ctx.cookies.set('token', null, {
    httpOnly: true,
    secure: false,
    sameSite: 'lax',
  });

  ctx.status = 200;
  ctx.body = { message: 'Successfully signed out' };
});
userRouter.get('/getall', jwtMiddleware, async (ctx) => {
  const all = await UserRepository.getUsers();
  ctx.body = all;
});
userRouter.get('/', jwtMiddleware, async (ctx) => {

  const date = new Date().toLocaleDateString()
  const username = ctx.state.user?.username;
  if (!username) {
    ctx.status = 401;
    ctx.body = { error: 'User not authenticated' };
    return;
  }

  ctx.body = { message: `Hello, ${username}!,  today is  ${date}` };
});
userRouter.get('/echo', jwtMiddleware, async (ctx) => {

  const { msg } = ctx.request.body as { msg: string; };
  if (!msg) {
    ctx.status = 400;
    ctx.body = { error: 'msg required' };
    return;
  }


  ctx.body = { message: `The message is, ${msg}!` };
});
userRouter.put('/becomeadmin', jwtMiddleware, async (ctx) => {
  const { username } = ctx.request.body as { username: string };

  const isadmin = ctx.state.user?.isadmin;


  if (!isadmin) {
    ctx.status = 403;
    ctx.body = { error: 'you are not admin' };
    return;
  }

  if (!username) {
    ctx.status = 400;
    ctx.body = { error: 'username is required' };
    return;
  }

  try {
    const result = await UserRepository.updatuseradmin(username);

    ctx.body = { message: 'the user is admin now ', data: result };
  } catch (error: any) {
    ctx.status = 500;
    ctx.body = { error: 'Failed to transfar user to admin' };
  }
});



export default userRouter;

