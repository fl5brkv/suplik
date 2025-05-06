import {relations, sql} from 'drizzle-orm';
import {sqliteTable, text, integer, check} from 'drizzle-orm/sqlite-core';
import {createInsertSchema, createSelectSchema} from 'drizzle-zod';
import {products} from './products';
import {inquiries} from './inquiries';
import { z } from 'zod';

export const inquiryProducts = sqliteTable('inquiry_products', {
  id: integer('id').primaryKey({
    autoIncrement: true,
  }),
  inquiryId: integer('inquiry_id')
    .references(() => inquiries.id, {onDelete: 'cascade'})
    .notNull(),
  productId: integer('product_id')
    .references(() => products.id, {
      onDelete: 'cascade',
    })
    .notNull(),
  quantity: integer('quantity').notNull(),
  date: text('date'),
  updatedAt: integer('updated_at', {mode: 'number'})
    .default(sql`(unixepoch())`)
    .$onUpdate(() => sql`(unixepoch())`)
    .notNull(),
  createdAt: integer('created_at', {mode: 'number'})
    .default(sql`(unixepoch())`)
    .notNull(),
});

export const inquiryProductSelectSchema = createSelectSchema(
  inquiryProducts
).pick({
  id: true,
  quantity: true,
  date: true,
});

export const inquiryProductInsertSchema = createInsertSchema(
  inquiryProducts
).pick({
  productId: true,
  quantity: true,
  date: true,
});

export type InquiryProductInsert = z.infer<typeof inquiryProductInsertSchema>;