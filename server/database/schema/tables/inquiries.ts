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
  inquiryId: integer('inquiry_id').primaryKey({
    autoIncrement: true,
  }),
  clientId: integer('client_id')
    .references(() => clients.clientId, {onDelete: 'cascade'})
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
    inquiryId: true,
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
    inquiryService: inquiryServiceSelectSchema,
    inquiryProduct: inquiryProductSelectSchema,
    service: serviceSelectSchema.pick({
      serviceId: true,
    }),
    product: productSelectSchema.pick({
      productId: true,
    }),
  });

export const inquiryInsertSchema = createInsertSchema(inquiries)
  .pick({additionalInfo: true})
  .extend({
    client: clientInsertSchema,
    inquiryService: z.array(inquiryServiceInsertSchema).optional(),
    inquiryProduct: z.array(inquiryProductInsertSchema).optional(),
  });
