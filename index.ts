import Koa from 'koa';
import Router from 'koa-router';
import bodyParser from 'koa-bodyparser';
import jwt from 'jsonwebtoken';
import { knex, knexSecond } from './database';
import cors from '@koa/cors';
import { createUser, getUserByUsername, authenticateUser, getUsers, addtoarray, updatuseradmin, getArray, getArraybyindex, updateValueAtIndex, deletlestarrayindex } from './userService';

const app = new Koa();
const router = new Router();

const JWT_SECRET = 'shani';

app.use(bodyParser());
app.use(router.routes()).use(router.allowedMethods());
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
}));


async function jwtMiddleware(ctx: Koa.Context, next: Koa.Next) {



  const token = ctx.cookies.get('token');

  if (!token) {

    ctx.status = 401;
    ctx.body = { error: 'login please' };
    return;
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    ctx.state.user = decoded;
    await next();
  } catch (err: any) {
    ctx.status = 401;
    ctx.body = { error: 'Invalid or expired token. Please log in again.' };
    return;
  }

}


knex.raw('SELECT 1')
  .then(() => console.log('Connected to SQLite database'))
  .catch((error) => console.error('Database connection error:', error));

knexSecond.raw('SELECT 1')
  .then(() => console.log('Connected to sec SQLite database'))
  .catch((error) => console.error('Database connection error:', error));


router.post('/register', async (ctx) => {

  if (ctx.method !== 'POST') {
    ctx.status = 405;
    ctx.body = { error: 'Method not allowed.' };
    return;
  }
  const { username, pass } = ctx.request.body as { username: string; pass?: string };

 // console.log(ctx.request.body);
  if (!username) {
   // console.log(username);
    ctx.status = 400;
    ctx.body = { error: 'Username is required' };
    return;
  }



  const existingUser = await getUserByUsername(username);
  if (existingUser) {
    ctx.status = 400;
    ctx.body = { error: 'Username already exists' };
    return;
  }
  if (!pass) {
    const user = await createUser(username, false);
    ctx.status = 201;
    ctx.body = { message: 'User created successfully', user };
    return;
  }

  if (pass === 'admin') {
    const user = await createUser(username, true);
    ctx.status = 201;
    ctx.body = { message: 'Admin user created successfully', user };
    return;
  }


  ctx.status = 400;
  ctx.body = { error: 'The secret pass for admin is incorrect' };


});


router.post('/login', async (ctx) => {
  const { username } = ctx.request.body as { username: string; };
  if (!username) {
    ctx.status = 400;
    ctx.body = { error: 'Username required' };
    return;
  }

  const token = await authenticateUser(username);
  if (!token) {
    ctx.status = 401;
    ctx.body = { error: 'Invalid credentials' };
    return;
  }

  ctx.body = { message: 'Login successful', token };

  ctx.cookies.set('token', token, {
    httpOnly: true,
    secure: false,
    sameSite: 'lax',
  });
});
router.get('/getall', jwtMiddleware, async (ctx) => {
  const all = await getUsers();
  ctx.body = all;
});
router.get('/array', jwtMiddleware, async (ctx) => {

  if (ctx.method !== 'GET') {
    ctx.status = 405;
    ctx.body = { error: 'Method not allowed.' };
    return;
  }
  const all = await getArray();
  ctx.body = all;

});
router.get('/array/:index', jwtMiddleware, async (ctx) => {
  const { index } = ctx.params as { index: string };

  if (!index) {
    ctx.status = 400;
    ctx.body = { error: 'index is required' };
    return;
  }

  try {
    const all = await getArraybyindex(index);
    ctx.body = all;
  } catch (error: any) {
    //console.error('Error adding value to array:', error.message);
    ctx.status = 500;
    ctx.body = { error: 'Failed to get value' };
  }

});

router.post('/array', jwtMiddleware, async (ctx) => {
  const { value } = ctx.request.body as { value: string };
  const isadmin = ctx.state.user?.isadmin;

  if (!isadmin) {
    ctx.status = 403;
    ctx.body = { error: 'you are not admin' };
    return;
  }
  if (!value) {
    ctx.status = 400;
    ctx.body = { error: 'Value is required' };
    return;
  }

  try {
    const result = await addtoarray(value);
    ctx.body = { message: 'Value added successfully', data: result };
  } catch (error: any) {
    console.error('Error adding value to array:', error.message);
    ctx.status = 500;
    ctx.body = { error: 'Failed to add value' };
  }
});
router.delete('/array', jwtMiddleware, async (ctx) => {

  const isadmin = ctx.state.user?.isadmin;

  if (!isadmin) {
    ctx.status = 403;
    ctx.body = { error: 'you are not admin' };
    return;
  }

  try {
    const result = await deletlestarrayindex();
    ctx.body = { message: 'deleted successfully', data: result };
  } catch (error: any) {

    ctx.status = 500;
    ctx.body = { error: 'Failed to delete value' };
  }
});
router.put('/array/:index', jwtMiddleware, async (ctx) => {
  const { value } = ctx.request.body as { value: string };
  const { index } = ctx.params as { index: string };
  const isadmin = ctx.state.user?.isadmin;

  if (!isadmin) {
    ctx.status = 403;
    ctx.body = { error: 'you are not admin' };
    return;
  }

  if (!value) {
    ctx.status = 400;
    ctx.body = { error: 'Value is required' };
    return;
  }

  try {
    const result = await updateValueAtIndex(value, index);
    ctx.body = { message: 'Value updated successfully', data: result };
  } catch (error: any) {
    console.error('Error updating value', error.message);
    ctx.status = 500;
    ctx.body = { error: 'Failed to update value' };
  }
});
router.put('/becomeadmin', jwtMiddleware, async (ctx) => {
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
    const result = await updatuseradmin(username);

    ctx.body = { message: 'the user is admin now ', data: result };
  } catch (error: any) {
   // console.error('Error adding value to array:', error.message);
    ctx.status = 500;
    ctx.body = { error: 'Failed to transfar user to admin' };
  }
});
router.delete('/array/:index', jwtMiddleware, async (ctx) => {
  const value = '0';
  const { index } = ctx.params as { index: string };
  const isadmin = ctx.state.user?.isadmin;

  if (!isadmin) {
    ctx.status = 403;
    ctx.body = { error: 'you are not admin' };
    return;
  }

  try {
    const result = await updateValueAtIndex(value, index);
    ctx.body = { message: 'Value deleted successfully', data: result };
  } catch (error: any) {
   // console.error('Error adding value to array:', error.message);
    ctx.status = 500;
    ctx.body = { error: 'Failed to delete value' };
  }
});
router.get('/', jwtMiddleware, async (ctx) => {

  const date = new Date().toLocaleDateString()
  const username = ctx.state.user?.username;
  if (!username) {
    ctx.status = 401;
    ctx.body = { error: 'User not authenticated' };
    return;
  }

  ctx.body = { message: `Hello, ${username}!,  today is  ${date}` };
});


router.get('/echo', jwtMiddleware, async (ctx) => {

  const { msg } = ctx.request.body as { msg: string; };
  if (!msg) {
    ctx.status = 400;
    ctx.body = { error: 'msg required' };
    return;
  }


  ctx.body = { message: `The message is, ${msg}!` };
});


app.use(router.routes()).use(router.allowedMethods());
app.use(async (ctx, next) => {
  try {
    await next();

    if (ctx.status === 404) {
      ctx.status = 404;
      ctx.body = { error: 'Route not found' };
    }
  } catch (err: any) {

    if (err.status === 405) {
      ctx.status = 405;
      ctx.body = { error: 'Method Not Allowed', allowed: err.headers?.allow };
    }
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
