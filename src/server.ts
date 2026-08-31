import { app } from './app';
import { sequelize } from './config/database';
import { env } from './config/env';

const start = async (): Promise<void> => {
  await sequelize.authenticate();
  if (env.dbSync) await sequelize.sync();
  app.listen(env.port, () =>
    console.log(`API running at http://localhost:${env.port}; docs at /docs`),
  );
};
start().catch((error) => {
  console.error('Unable to start API', error);
  process.exit(1);
});