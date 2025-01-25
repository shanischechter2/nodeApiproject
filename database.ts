import Knex from 'knex';
import config from './knexfile';
import config2 from './knexfiletwo';


const environment = process.env.NODE_ENV || 'development';

const knex = Knex(config[environment]);
const knexSecond = Knex(config2[environment]);

export { knex, knexSecond };



