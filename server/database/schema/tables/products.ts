import {sql} from 'drizzle-orm';
import {sqliteTable, text, integer} from 'drizzle-orm/sqlite-core';
import {createInsertSchema, createSelectSchema} from 'drizzle-zod';
import {suppliers} from './suppliers';
import {z} from 'zod';
import { inquiryProducts } from './inquiryProducts';

export const products = sqliteTable('products', {
  productId: integer('product_id').primaryKey({
    autoIncrement: true,
  }),
  // supplierId: integer('supplier_id')
  //  .references(() => suppliers.supplierId, {
  //    onDelete: 'cascade',
  //  })
  //  .notNull(), // this cant be on delete cascade
  name: text('name').notNull(),
  unitPrice: text('unit_price'),
  quantity: integer('quantity').default(0).notNull(),
  reserved: integer('reserved').default(0).notNull(),
  details: text('details', {mode: 'json'}).$type<{group: string}>().notNull(),
  updatedAt: integer('updated_at', {mode: 'number'})
    .default(sql`(unixepoch())`)
    .$onUpdate(() => sql`(unixepoch())`)
    .notNull(),
  createdAt: integer('created_at', {mode: 'number'})
    .default(sql`(unixepoch())`)
    .notNull(),
});

export const productSelectSchema = createSelectSchema(products).pick({
  productId: true,
  name: true,
  details: true,
});
