import Koa from 'koa';
import Router from 'koa-router';
import bodyParser from 'koa-bodyparser';
import cors from '@koa/cors';
import userRouter from './routes/UserRoutes';
import arrayRouter from './routes/ArrayRoutes';


const app = new Koa();
const router = new Router();

app.use(bodyParser());
app.use(cors({ origin: 'http://localhost:3000', credentials: true }));


app.use(userRouter.routes());
app.use(arrayRouter.routes());




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
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
