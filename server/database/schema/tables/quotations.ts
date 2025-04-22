// import {sql} from 'drizzle-orm';
// import {sqliteTable, text, integer, real} from 'drizzle-orm/sqlite-core';
// import {createInsertSchema, createSelectSchema} from 'drizzle-zod';
// import {inquiries} from '~~/server/database/schema/tables/inquiries';

// export const quotations = sqliteTable('quotations', {
//   quotationId: integer('quotation_id').primaryKey({autoIncrement: true}),
//   inquiryId: integer('inquiry_id')
//     .references(() => inquiries.inquiryId, {onDelete: 'cascade'})
//     .notNull(),
//   version: integer('version').notNull(),
//   totalPrice: real('total_price').notNull(),
//   status: text('status', {
//     enum: ['draft', 'sent', 'accepted', 'declined'],
//   }).notNull(),
//   internalNote: text('internal_note'),
//   externalNote: text('external_note'),
//   updatedAt: integer('updated_at', {mode: 'number'})
//     .default(sql`(unixepoch())`)
//     .$onUpdate(() => sql`(unixepoch())`)
//     .notNull(),
//   createdAt: integer('created_at', {mode: 'number'})
//     .default(sql`(unixepoch())`)
//     .notNull(),
// });

// export const quotationInsertSchema = createInsertSchema(quotations).omit({
//   quotationId: true,
//   version: true,
//   externalNote: true,
//   updatedAt: true,
//   createdAt: true,
// });
