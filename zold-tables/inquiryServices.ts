import {relations, sql} from 'drizzle-orm';
import {sqliteTable, text, integer, check} from 'drizzle-orm/sqlite-core';
import {createInsertSchema, createSelectSchema} from 'drizzle-zod';
import {services} from './services';
import {inquiries} from './inquiries';
import { z } from 'zod';

export const inquiryServices = sqliteTable('inquiry_services', {
  id: integer('id').primaryKey({
    autoIncrement: true,
  }),
  inquiryId: integer('inquiry_id')
    .references(() => inquiries.id, {onDelete: 'cascade'})
    .notNull(),
  serviceId: integer('service_id')
    .references(() => services.id, {
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
  id: true,
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

export type InquiryServiceInsert = z.infer<typeof inquiryServiceInsertSchema>;