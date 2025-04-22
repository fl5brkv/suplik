import {sql} from 'drizzle-orm';
import {sqliteTable, text, integer} from 'drizzle-orm/sqlite-core';
import {createInsertSchema, createSelectSchema} from 'drizzle-zod';

export const clients = sqliteTable('clients', {
  clientId: integer('client_id').primaryKey({
    autoIncrement: true,
  }),
  firstName: text('firstName').notNull(),
  lastName: text('firstName').notNull(),
  email: text('email').notNull(),
  phoneNumber: text('phone_number').notNull(),
  company: text('company'),
  company_number: text('ico'),
  updatedAt: integer('updated_at', {mode: 'number'})
    .default(sql`(unixepoch())`)
    .$onUpdate(() => sql`(unixepoch())`)
    .notNull(),
  createdAt: integer('created_at', {mode: 'number'})
    .default(sql`(unixepoch())`)
    .notNull(),
});

export const clientSelectSchema = createSelectSchema(clients).omit({
  updatedAt: true,
  createdAt: true,
});

export const clientInsertSchema = createInsertSchema(clients).omit({
  clientId: true,
  updatedAt: true,
  createdAt: true,
});

export const clientUpdateSchema = createSelectSchema(clients).omit({
  clientId: true,
  updatedAt: true,
  createdAt: true,
});

export const clientDeleteSchema = createSelectSchema(clients).pick({
  clientId: true,
});
