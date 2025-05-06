import {drizzle} from 'drizzle-orm/d1';
export {sql, eq, and, or} from 'drizzle-orm';

import {schema} from '~~/server/database/schema/index';

export const tables = schema;

export const useDrizzle = () => {
  return drizzle(hubDatabase(), {schema});
}

