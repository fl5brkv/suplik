// import {sql} from 'drizzle-orm';
// import {sqliteTable, text, integer, real} from 'drizzle-orm/sqlite-core';
// import {createInsertSchema, createSelectSchema} from 'drizzle-zod';
// import {quotations} from './quotations';
// import {services} from './services';

// export const quotationServices = sqliteTable('quotation_services', {
//   quotationServiceId: integer('quotation_service_id').primaryKey({
//     autoIncrement: true,
//   }),
//   quotationId: integer('quotation_id')
//     .references(() => quotations.quotationId, {onDelete: 'cascade'})
//     .notNull(),
//   serviceId: integer('service_id')
//     .references(() => services.serviceId, {onDelete: 'cascade'})
//     .notNull(),
//   quantity: integer('quantity').notNull(),
//   unitPrice: real('unit_price').notNull(),
//   createdAt: integer('created_at', {mode: 'number'})
//     .default(sql`(unixepoch())`)
//     .notNull(),
//   updatedAt: integer('updated_at', {mode: 'number'})
//     .default(sql`(unixepoch())`)
//     .$onUpdate(() => sql`(unixepoch())`)
//     .notNull(),
// });
