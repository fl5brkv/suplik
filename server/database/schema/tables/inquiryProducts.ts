import {sql} from 'drizzle-orm';
import {sqliteTable, text, integer, check} from 'drizzle-orm/sqlite-core';
import {createInsertSchema, createSelectSchema} from 'drizzle-zod';
import {products} from './products';
import {inquiries} from './inquiries';

export const inquiryProducts = sqliteTable('inquiry_products', {
  inquiryProductId: integer('inquiry_product_id').primaryKey({
    autoIncrement: true,
  }),
  inquiryId: integer('inquiry_id')
    .references(() => inquiries.inquiryId, {onDelete: 'cascade'})
    .notNull(),
  productId: integer('product_id')
    .references(() => products.productId, {
      onDelete: 'cascade',
    })
    .notNull(),
  quantity: integer('quantity').notNull(),
  updatedAt: integer('updated_at', {mode: 'number'})
    .default(sql`(unixepoch())`)
    .$onUpdate(() => sql`(unixepoch())`)
    .notNull(),
  createdAt: integer('created_at', {mode: 'number'})
    .default(sql`(unixepoch())`)
    .notNull(),
});

export const inquiryProductInsertSchema = createInsertSchema(inquiryProducts).pick({
  productId: true,
  quantity: true
});
