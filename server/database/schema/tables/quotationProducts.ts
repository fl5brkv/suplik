import {sql} from 'drizzle-orm';
import {sqliteTable, text, integer, real} from 'drizzle-orm/sqlite-core';
import {createInsertSchema, createSelectSchema} from 'drizzle-zod';
import {quotations} from './quotations';
import {products} from './products';

export const quotationProducts = sqliteTable('quotation_products', {
  quotationProductId: integer('quotation_product_id').primaryKey({
    autoIncrement: true,
  }),
  quotationId: integer('quotation_id')
    .references(() => quotations.quotationId, {onDelete: 'cascade'})
    .notNull(),
  productId: integer('product_id')
    .references(() => products.productId, {onDelete: 'cascade'})
    .notNull(),
  quantity: integer('quantity').notNull(),
  unitPrice: integer('unit_price').notNull(),
  updatedAt: integer('updated_at', {mode: 'number'})
    .default(sql`(unixepoch())`)
    .$onUpdate(() => sql`(unixepoch())`)
    .notNull(),
  createdAt: integer('created_at', {mode: 'number'})
    .default(sql`(unixepoch())`)
    .notNull(),
});

export const quotationProductSelectSchema = createSelectSchema(
  quotationProducts
).pick({
  productId: true,
  quantity: true,
  unitPrice: true,
});


export const quotationProductInsertSchema = createInsertSchema(
  quotationProducts
).pick({
  productId: true,
  quantity: true,
  unitPrice: true,
});
