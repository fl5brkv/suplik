import {drizzle} from 'drizzle-orm/d1';
export {sql, eq, and, or, gt} from 'drizzle-orm';

import * as schema from '../database/schema';

export const tables = schema;

export const useDrizzle = () => {
  return drizzle(hubDatabase(), {schema});
};
