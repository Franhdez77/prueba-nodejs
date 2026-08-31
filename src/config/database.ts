import { Sequelize } from 'sequelize';
import { env } from './env';

/** Shared Sequelize connection configured from the runtime database URL. */
export const sequelize = new Sequelize(env.databaseUrl, {
  logging: false,
  dialect: 'postgres',
});
