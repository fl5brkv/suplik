import {sql} from 'drizzle-orm';
import {sqliteTable, text, integer} from 'drizzle-orm/sqlite-core';
import {createInsertSchema, createSelectSchema} from 'drizzle-zod';
import {z} from 'zod';

export const services = sqliteTable('services', {
  serviceId: integer('service_id').primaryKey({
    autoIncrement: true,
  }),
  name: text('name').notNull(),
  unitPrice: text('unit_price'),
  details: text('details', {mode: 'json'}).$type<{group: string}>().notNull(),
  updatedAt: integer('updated_at', {mode: 'number'})
    .default(sql`(unixepoch())`)
    .$onUpdate(() => sql`(unixepoch())`)
    .notNull(),
  createdAt: integer('created_at', {mode: 'number'})
    .default(sql`(unixepoch())`)
    .notNull(),
});

export const serviceSelectSchema = createSelectSchema(services).pick({
  serviceId: true,
  name: true,
  details: true,
});
