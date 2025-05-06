import {sql} from 'drizzle-orm';
import {sqliteTable, text, integer, real} from 'drizzle-orm/sqlite-core';
import {createInsertSchema, createSelectSchema} from 'drizzle-zod';
import {quotations} from './quotations';
import {services} from './services';

export const quotationServices = sqliteTable('quotation_services', {
  id: integer('id').primaryKey({
    autoIncrement: true,
  }),
  quotationId: integer('quotation_id')
    .references(() => quotations.id, {onDelete: 'cascade'})
    .notNull(),
  serviceId: integer('service_id')
    .references(() => services.id, {onDelete: 'cascade'})
    .notNull(),
  quantity: integer('quantity').notNull(),
  unitPrice: integer('unit_price').notNull(),
  date: text('date').notNull(),
  updatedAt: integer('updated_at', {mode: 'number'})
    .default(sql`(unixepoch())`)
    .$onUpdate(() => sql`(unixepoch())`)
    .notNull(),
  createdAt: integer('created_at', {mode: 'number'})
    .default(sql`(unixepoch())`)
    .notNull(),
});

export const quotationServiceSelectSchema = createSelectSchema(
  quotationServices
).pick({
  serviceId: true,
  quotationId: true,
  quantity: true,
  unitPrice: true,
  date: true,
});


export const quotationServiceInsertSchema = createInsertSchema(
  quotationServices
).pick({
  serviceId: true,
  quantity: true,
  unitPrice: true,
  date: true,
});
