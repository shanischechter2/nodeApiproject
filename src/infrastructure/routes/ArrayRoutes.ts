import Router from 'koa-router';
import {
ArrayRepository
} from '../../domain/array/ArrayRepository';
import { jwtMiddleware } from '../middleware/JwtMiddleware';

const arrayRouter = new Router();

arrayRouter.get('/array', jwtMiddleware, async (ctx) => {

  if (ctx.method !== 'GET') {
    ctx.status = 405;
    ctx.body = { error: 'Method not allowed.' };
    return;
  }
  const all = await ArrayRepository.getArray();
  ctx.body = all;

});

arrayRouter.get('/array/:index', jwtMiddleware, async (ctx) => {
  const { index } = ctx.params as { index: string };

  if (!index) {
    ctx.status = 400;
    ctx.body = { error: 'index is required' };
    return;
  }

  try {
    const all = await ArrayRepository.getArraybyindex(index);
    ctx.body = all;
  } catch (error: any) {
   
    ctx.status = 500;
    ctx.body = { error: 'Failed to get value' };
  }

});
arrayRouter.post('/array', jwtMiddleware, async (ctx) => {
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
    const result = await ArrayRepository.addtoarray(value);
    ctx.body = { message: 'Value added successfully', data: result };
    ctx.status = 201;
  } catch (error: any) {
    console.error('Error adding value to array:', error.message);
    ctx.status = 500;
    ctx.body = { error: 'Failed to add value' };
  }
});
arrayRouter.delete('/array', jwtMiddleware, async (ctx) => {

  const isadmin = ctx.state.user?.isadmin;

  if (!isadmin) {
    ctx.status = 403;
    ctx.body = { error: 'you are not admin' };
    return;
  }

  try {
    const result = await ArrayRepository.deletlestarrayindex();
    ctx.body = { message: 'deleted successfully', data: result };
    
  } catch (error: any) {

    ctx.status = 500;
    ctx.body = { error: 'Failed to delete value' };
  }
});
arrayRouter.delete('/array/:index', jwtMiddleware, async (ctx) => {
  const value = '0';
  const { index } = ctx.params as { index: string };
  const isadmin = ctx.state.user?.isadmin;


  if (!isadmin) {
    ctx.status = 403;
    ctx.body = { error: 'you are not admin' };
    return;
  }

  try {
    const result = await ArrayRepository.updateValueAtIndex(value, index);
    ctx.body = { message: 'Value deleted successfully', data: result };
    ctx.status = 201;
  } catch (error: any) {

    ctx.status = 500;
    ctx.body = { error: 'Failed to delete value' };
  }
});
arrayRouter.put('/array/:index', jwtMiddleware, async (ctx) => {
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
    const result = await ArrayRepository.updateValueAtIndex(value, index);
    ctx.body = { message: 'Value updated successfully', data: result };
    ctx.status = 201;
  } catch (error: any) {
    console.error('Error updating value', error.message);
    ctx.status = 500;
    ctx.body = { error: 'Failed to update value' };
  }
});
arrayRouter.delete('/array/:index', jwtMiddleware, async (ctx) => {
  const value = '0';
  const { index } = ctx.params as { index: string };
  const isadmin = ctx.state.user?.isadmin;

  if (!isadmin) {
    ctx.status = 403;
    ctx.body = { error: 'you are not admin' };
    return;
  }

  try {
    const result = await ArrayRepository.updateValueAtIndex(value, index);
    ctx.body = { message: 'Value deleted successfully', data: result };
    ctx.status = 201;
  } catch (error: any) {

    ctx.status = 500;
    ctx.body = { error: 'Failed to delete value' };
  }
});
export default arrayRouter;
