import {sql} from 'drizzle-orm';
import {sqliteTable, text, integer, real} from 'drizzle-orm/sqlite-core';
import {createInsertSchema, createSelectSchema} from 'drizzle-zod';
import {inquiries} from './inquiries';
import {
  quotationServiceInsertSchema,
  quotationServiceSelectSchema,
} from './quotationServices';
import {z} from 'zod';
import {
  quotationProductInsertSchema,
  quotationProductSelectSchema,
} from './quotationProducts';

export const quotations = sqliteTable('quotations', {
  quotationId: integer('quotation_id').primaryKey({autoIncrement: true}),
  inquiryId: integer('inquiry_id')
    .references(() => inquiries.inquiryId, {onDelete: 'cascade'})
    .unique()
    .notNull(),
  totalPrice: real('total_price').notNull(),
  status: text('status', {
    enum: ['sent', 'accepted', 'declined'],
  }).notNull(),
  internalNote: text('internal_note'),
  externalNote: text('external_note'),
  updatedAt: integer('updated_at', {mode: 'number'})
    .default(sql`(unixepoch())`)
    .$onUpdate(() => sql`(unixepoch())`)
    .notNull(),
  createdAt: integer('created_at', {mode: 'number'})
    .default(sql`(unixepoch())`)
    .notNull(),
});

export const quotationSelectSchema = createSelectSchema(quotations)
  .pick({
    totalPrice: true,
    status: true,
    internalNote: true,
  })
  .extend({
    quotationService: quotationServiceSelectSchema.optional(),
    quotationProduct: quotationProductSelectSchema.optional(),
  });

export const quotationInsertSchema = createInsertSchema(quotations)
  .pick({
    inquiryId: true,
    totalPrice: true,
    internalNote: true,
  })
  .extend({
    quotationService: z.array(quotationServiceInsertSchema).optional(),
    quotationProduct: z.array(quotationProductInsertSchema).optional(),
  });
