import {defineConfig} from 'drizzle-kit';

export default defineConfig({
  dialect: 'sqlite',
  schema: './server/database/schema/tables', 
  out: './server/database/migrations',
});
