import {relations, sql} from 'drizzle-orm';
import {sqliteTable, text, integer} from 'drizzle-orm/sqlite-core';
import {createInsertSchema, createSelectSchema} from 'drizzle-zod';
import {clientInsertSchema, clients, clientSelectSchema} from './clients';
import {z} from 'zod';
import {
  inquiryServiceInsertSchema,
  inquiryServiceSelectSchema,
} from './inquiryServices';
import {
  inquiryProductInsertSchema,
  inquiryProductSelectSchema,
} from './inquiryProducts';
import {productSelectSchema} from './products';
import {serviceSelectSchema} from './services';
import {quotationSelectSchema} from './quotations';

export const inquiries = sqliteTable('inquiries', {
  id: integer('id').primaryKey({
    autoIncrement: true,
  }),
  clientId: integer('client_id')
    .references(() => clients.id, {onDelete: 'cascade'})
    .notNull(),
  status: text('status', {
    enum: ['new', 'quoted', 'rejected'],
  })
    .default('new')
    .notNull(),
  additionalInfo: text('additional_info'),
  updatedAt: integer('updated_at', {mode: 'number'})
    .default(sql`(unixepoch())`)
    .$onUpdate(() => sql`(unixepoch())`)
    .notNull(),
  createdAt: integer('created_at', {mode: 'number'})
    .default(sql`(unixepoch())`)
    .notNull(),
});

export const inquirySelectSchema = createSelectSchema(inquiries)
  .pick({
    id: true,
    clientId: true,
    status: true,
    additionalInfo: true,
  })
  .extend({
    client: clientSelectSchema.pick({
      firstName: true,
      lastName: true,
      email: true,
    }),
    inquiryServices: z.array(
      inquiryServiceSelectSchema.extend({
        name: serviceSelectSchema.pick({name: true}).shape.name,
      })
    ).optional(),
    inquiryProducts: z.array(
      inquiryProductSelectSchema.extend({
        name: productSelectSchema.pick({name: true}).shape.name,
      })
    ).optional(),
  });

export type InquirySelect = z.infer<typeof inquirySelectSchema>;

export const inquiryInsertSchema = createInsertSchema(inquiries)
  .pick({additionalInfo: true})
  .extend({
    client: clientInsertSchema,
    inquiryServices: z.array(inquiryServiceInsertSchema).optional(),
    inquiryProducts: z.array(inquiryProductInsertSchema).optional(),
  });

export type InquiryInsert = z.infer<typeof inquiryInsertSchema>;
