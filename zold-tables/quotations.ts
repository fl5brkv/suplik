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
  id: integer('id').primaryKey({
    autoIncrement: true,
  }),
  inquiryId: integer('inquiry_id')
    .references(() => inquiries.id, {onDelete: 'cascade'})
    .unique()
    .notNull(),
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
    status: true,
    internalNote: true,
  })
  .extend({
    quotationServices: quotationServiceSelectSchema.optional(),
    quotationProducts: quotationProductSelectSchema.optional(),
  });

export type QuotationSelect = z.infer<typeof quotationSelectSchema>;

export const quotationInsertSchema = createInsertSchema(quotations)
  .pick({
    inquiryId: true,
    internalNote: true,
  })
  .extend({
    quotationServices: z.array(quotationServiceInsertSchema).optional(),
    quotationProducts: z.array(quotationProductInsertSchema).optional(),
  });

export type QuotationInsert = z.infer<typeof quotationInsertSchema>;
