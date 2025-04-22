import {sql} from 'drizzle-orm';
import {sqliteTable, text, integer} from 'drizzle-orm/sqlite-core';
import {createInsertSchema, createSelectSchema} from 'drizzle-zod';

export const users = sqliteTable('users', {
  userId: integer('user_id').primaryKey({
    autoIncrement: true,
  }),
  role: text('role', {
    enum: ['admin', 'technician'],
  }).default('technician'),
  email: text('email').unique().notNull(),
  password: text('password').notNull(),
  updatedAt: integer('updated_at', {mode: 'number'})
    .default(sql`(unixepoch())`)
    .$onUpdate(() => sql`(unixepoch())`)
    .notNull(),
  createdAt: integer('created_at', {mode: 'number'})
    .default(sql`(unixepoch())`)
    .notNull(),
});

export const signupSchema = createInsertSchema(users).pick({
  email: true,
  password: true,
});
// .extend({
//   email: z.string().email({message: 'Invalid email address'}),
// });

export const loginSchema = createSelectSchema(users).pick({
  email: true,
  password: true,
});
