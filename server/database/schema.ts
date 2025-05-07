import {sql} from 'drizzle-orm';
import {sqliteTable, text, integer} from 'drizzle-orm/sqlite-core';
import {createInsertSchema, createSelectSchema} from 'drizzle-zod';
import {z} from 'zod';

// #region clients
export const clients = sqliteTable('clients', {
  id: integer('id').primaryKey({
    autoIncrement: true,
  }),
  firstName: text('first_name').notNull(),
  lastName: text('last_name').notNull(),
  email: text('email').notNull(),
  phoneNumber: text('phone_number').notNull(),
  company: text('company'),
  companyNumber: text('ico'),
  updatedAt: integer('updated_at', {mode: 'number'})
    .default(sql`(unixepoch())`)
    .$onUpdate(() => sql`(unixepoch())`)
    .notNull(),
  createdAt: integer('created_at', {mode: 'number'})
    .default(sql`(unixepoch())`)
    .notNull(),
});

export const clientSelectSchema = createSelectSchema(clients).pick({
  id: true,
  firstName: true,
  lastName: true,
  email: true,
  phoneNumber: true,
  company: true,
  companyNumber: true,
});

export const clientInsertSchema = createInsertSchema(clients)
  .pick({
    firstName: true,
    lastName: true,
    email: true,
    phoneNumber: true,
    company: true,
    companyNumber: true,
  })
  .extend({
    firstName: z
      .string()
      .min(1, {
        message: 'First name is required',
      })
      .regex(/^[A-Za-z]+$/, {
        message: 'First name must contain only alphabets',
      }),
    lastName: z
      .string()
      .min(2, {
        message: 'Last name is required',
      })
      .regex(/^[A-Za-z]+$/, {
        message: 'Last name must contain only alphabets',
      }),
    email: z.string().email({
      message: 'Invalid email address',
    }),
    phoneNumber: z.string().min(1, {message: 'Phone number is required'}),
  });

export const clientUpdateSchema = createSelectSchema(clients).pick({
  id: true,
  firstName: true,
  lastName: true,
  email: true,
  phoneNumber: true,
  company: true,
  companyNumber: true,
});

export const clientDeleteSchema = createSelectSchema(clients).pick({
  id: true,
});
// #endregion

// #region items
export const items = sqliteTable('items', {
  id: integer('id').primaryKey({
    autoIncrement: true,
  }),
  type: text('type', {enum: ['product', 'service']}).notNull(),
  name: text('name').notNull(),
  unitPrice: text('unit_price'),
  group: text('group').notNull(),
  // details: text('details', {mode: 'json'}).$type<{group: string}>().notNull(),
  updatedAt: integer('updated_at', {mode: 'number'})
    .default(sql`(unixepoch())`)
    .$onUpdate(() => sql`(unixepoch())`)
    .notNull(),
  createdAt: integer('created_at', {mode: 'number'})
    .default(sql`(unixepoch())`)
    .notNull(),
});

export const itemSelectSchema = createSelectSchema(items).pick({
  id: true,
  name: true,
  group: true,
});

export type ItemSelect = z.infer<typeof itemSelectSchema>;
// #endregion

// #region itemProductDetails
export const itemProductDetails = sqliteTable('item_product_details', {
  id: integer('id').primaryKey({
    autoIncrement: true,
  }),
  itemId: integer('item_id')
    .references(() => items.id)
    .notNull(),
  supplierId: integer('supplier_id')
    .references(() => suppliers.id)
    .notNull(),
  quantity: integer().notNull(),
  reserved: integer(),
  updatedAt: integer('updated_at', {mode: 'number'})
    .default(sql`(unixepoch())`)
    .$onUpdate(() => sql`(unixepoch())`)
    .notNull(),
  createdAt: integer('created_at', {mode: 'number'})
    .default(sql`(unixepoch())`)
    .notNull(),
});
// #endregion

// #region orderItems
export const orderItems = sqliteTable('order_items', {
  id: integer('id').primaryKey({
    autoIncrement: true,
  }),
  orderId: integer('order_id')
    .references(() => orders.id, {onDelete: 'cascade'})
    .notNull(),
  itemId: integer('item_id')
    .references(() => items.id)
    .notNull(),
  quantity: integer('quantity').notNull(),
  updatedAt: integer('updated_at', {mode: 'number'})
    .default(sql`(unixepoch())`)
    .$onUpdate(() => sql`(unixepoch())`)
    .notNull(),
  createdAt: integer('created_at', {mode: 'number'})
    .default(sql`(unixepoch())`)
    .notNull(),
});

export const orderItemSelectSchema = createSelectSchema(orderItems).pick({
  itemId: true,
  quantity: true,
});

export const orderItemInsertSchema = createInsertSchema(orderItems).pick({
  itemId: true,
  quantity: true,
});

export const orderItemUpdateSchema = createSelectSchema(orderItems).pick({
  itemId: true,
  quantity: true,
});

export type OrderItem = z.infer<typeof orderItemUpdateSchema>;
// #endregion

// #region orders
export const orders = sqliteTable('orders', {
  id: integer('id').primaryKey({
    autoIncrement: true,
  }),
  clientId: integer('client_id')
    .references(() => clients.id, {onDelete: 'cascade'})
    .notNull(),
  type: text('type', {enum: ['inquiry', 'quotation']})
    .default('inquiry')
    .notNull(),
  status: text('status', {
    enum: ['new', 'declined', 'draft', 'sent', 'accepted'],
  })
    .default('new')
    .notNull(),
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

export const orderSelectSchema = createSelectSchema(orders)
  .pick({
    id: true,
    type: true,
    status: true,
    internalNote: true,
    externalNote: true,
  })
  .extend({
    client: clientSelectSchema.pick({
      firstName: true,
      lastName: true,
      email: true,
    }),
    orderItems: z.array(
      orderItemSelectSchema.extend({
        name: itemSelectSchema.pick({name: true}).shape.name,
      })
    ),
  });

export type OrderSelect = z.infer<typeof orderSelectSchema>;

export const orderInsertSchema = createInsertSchema(orders)
  .pick({externalNote: true})
  .extend({
    client: clientInsertSchema,
    orderItems: z.array(orderItemInsertSchema),
  });

export type OrderInsert = z.infer<typeof orderInsertSchema>;

export const orderUpdateSchema = createSelectSchema(orders)
  .pick({
    id: true,
    type: true,
    status: true,
    internalNote: true,
    externalNote: true,
  })
  .extend({
    client: clientUpdateSchema.pick({
      email: true,
    }),
    orderItems: z.array(orderItemUpdateSchema),
  });

export type OrderUpdate = z.infer<typeof orderUpdateSchema>;
// #endregion

// #region suppliers
export const suppliers = sqliteTable('suppliers', {
  id: integer('id').primaryKey({
    autoIncrement: true,
  }),
  name: text('name').notNull(),
  email: text('email'),
  phoneNumber: text('phone_number'),
  updatedAt: integer('updated_at', {mode: 'number'})
    .default(sql`(unixepoch())`)
    .$onUpdate(() => sql`(unixepoch())`)
    .notNull(),
  createdAt: integer('created_at', {mode: 'number'})
    .default(sql`(unixepoch())`)
    .notNull(),
});
// #endregion

// #region users
export const users = sqliteTable('users', {
  id: integer('id').primaryKey({
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
// #endregion
