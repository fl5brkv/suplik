import {sql} from 'drizzle-orm';
import {sqliteTable, text, integer} from 'drizzle-orm/sqlite-core';
import {createInsertSchema, createSelectSchema} from 'drizzle-zod';
import {clientInsertSchema, clients} from './clients';
import {z} from 'zod';
import {inquiryServiceInsertSchema} from './inquiryServices';
import {inquiryProductInsertSchema} from './inquiryProducts';

export const inquiries = sqliteTable('inquiries', {
  inquiryId: integer('inquiry_id').primaryKey({
    autoIncrement: true,
  }),
  clientId: integer('client_id')
    .references(() => clients.clientId, {onDelete: 'cascade'})
    .notNull(),
  status: text('status', {
    enum: ['new', 'quoted', 'rejected'],
  }).default('new'),
  additionalInfo: text('additional_info'),
  updatedAt: integer('updated_at', {mode: 'number'})
    .default(sql`(unixepoch())`)
    .$onUpdate(() => sql`(unixepoch())`)
    .notNull(),
  createdAt: integer('created_at', {mode: 'number'})
    .default(sql`(unixepoch())`)
    .notNull(),
});

export const inquiryInsertSchema = createInsertSchema(inquiries)
  .pick({additionalInfo: true})
  .extend({
    client: clientInsertSchema,
    inquiryService: z.array(inquiryServiceInsertSchema).optional(),
    inquiryProduct: z.array(inquiryProductInsertSchema).optional(),
  });

  export type InquiryInsert = z.infer<typeof inquiryInsertSchema>;


// type InquiryInsert = {
//   client: {
//       firstName: string;
//       lastName: string;
//       email: string;
//       phoneNumber: string;
//       company?: string | null | undefined;
//       company_number?: string | null | undefined;
//   };
//   additionalInfo?: string | null | undefined;
//   inquiryService?: {
//     date: string;
//     serviceId: number;
//     quantity: number;
// }[] | undefined;
//   inquiryProduct?: {
//     productId: number;
//     quantity: number;
// }[] | undefined;
// }