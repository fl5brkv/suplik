import {relations, sql} from 'drizzle-orm';
import {sqliteTable, text, integer, check} from 'drizzle-orm/sqlite-core';
import {createInsertSchema, createSelectSchema} from 'drizzle-zod';
import {services} from './services';
import {inquiries} from './inquiries';

export const inquiryServices = sqliteTable('inquiry_services', {
  inquiryServiceId: integer('inquiry_service_id').primaryKey({
    autoIncrement: true,
  }),
  inquiryId: integer('inquiry_id')
    .references(() => inquiries.inquiryId, {onDelete: 'cascade'})
    .notNull(),
  serviceId: integer('service_id')
    .references(() => services.serviceId, {
      onDelete: 'cascade',
    })
    .notNull(),
  quantity: integer('quantity').notNull(),
  date: text('date').notNull(),
  updatedAt: integer('updated_at', {mode: 'number'})
    .default(sql`(unixepoch())`)
    .$onUpdate(() => sql`(unixepoch())`)
    .notNull(),
  createdAt: integer('created_at', {mode: 'number'})
    .default(sql`(unixepoch())`)
    .notNull(),
});

export const inquiryServiceSelectSchema = createSelectSchema(
  inquiryServices
).pick({
  serviceId: true,
  quantity: true,
  date: true,
});

export const inquiryServiceInsertSchema = createInsertSchema(
  inquiryServices
).pick({
  serviceId: true,
  quantity: true,
  date: true,
});
