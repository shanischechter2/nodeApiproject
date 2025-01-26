import Knex from 'knex';
import config from './knexfile';
import config2 from './knexfiletwo';

const knex = Knex(config[process.env.NODE_ENV || 'development']);
const knexSecond = Knex(config2[process.env.NODE_ENV || 'development']);

export { knex, knexSecond };



