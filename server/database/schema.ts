import {relations, sql} from 'drizzle-orm';
import {sqliteTable, text, integer, blob} from 'drizzle-orm/sqlite-core';
import {createInsertSchema, createSelectSchema} from 'drizzle-zod';
import {z} from 'zod';

// #region users
export const users = sqliteTable('users', {
  id: integer('id').primaryKey({autoIncrement: true}),
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

// #region categories
export const categories = sqliteTable('categories', {
  id: integer('id').primaryKey({autoIncrement: true}),
  name: text('name').notNull(),
  type: text('type', {enum: ['product', 'service']}).notNull(),
  updatedAt: integer('updated_at', {mode: 'number'})
    .default(sql`(unixepoch())`)
    .$onUpdate(() => sql`(unixepoch())`)
    .notNull(),
  createdAt: integer('created_at', {mode: 'number'})
    .default(sql`(unixepoch())`)
    .notNull(),
});
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

// #region items
export const items = sqliteTable('items', {
  id: integer('id').primaryKey({autoIncrement: true}),
  categoryId: integer('category_id').references(() => categories.id),
  type: text('type', {enum: ['product', 'service']}).notNull(),
  name: text('name').notNull(),
  // unitPrice: text('unit_price'),
  // details: text('details', {mode: 'json'}).$type<{group: string}>().notNull(),
  // isPublic: integer('is_public', {mode: 'boolean'}),
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
});

export type ItemSelect = z.infer<typeof itemSelectSchema>;
// #endregion

// #region productDetails
export const productDetails = sqliteTable('product_details', {
  id: integer('id').primaryKey({autoIncrement: true}),
  itemId: integer('item_id')
    .references(() => items.id)
    .notNull(),
  supplierId: integer('supplier_id')
    .references(() => suppliers.id)
    .notNull(),
  stock: integer('stock').default(0),
  reserved: integer('reserved').default(0),
  // purchasePrice: text('purchase_price'),
  updatedAt: integer('updated_at', {mode: 'number'})
    .default(sql`(unixepoch())`)
    .$onUpdate(() => sql`(unixepoch())`)
    .notNull(),
  createdAt: integer('created_at', {mode: 'number'})
    .default(sql`(unixepoch())`)
    .notNull(),
});
// #endregion

// #region demandItems
export const demandItems = sqliteTable('demand_items', {
  id: integer('id').primaryKey({autoIncrement: true}),
  demandId: integer('demand_id')
    .references(() => demands.id, {onDelete: 'cascade'})
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

export const demandItemSelectSchema = createSelectSchema(demandItems).pick({
  itemId: true,
  quantity: true,
});

export const demandItemInsertSchema = createInsertSchema(demandItems).pick({
  itemId: true,
  quantity: true,
});

export const demandItemsRelations = relations(demandItems, ({one}) => ({
  demand: one(demands, {
    fields: [demandItems.demandId],
    references: [demands.id],
  }),
  item: one(items, {fields: [demandItems.itemId], references: [items.id]}),
}));

// export const demandItemUpdateSchema = createSelectSchema(demandItems).pick({
//   itemId: true,
//   quantity: true,
// });

// export type DemandItem = z.infer<typeof demandItemUpdateSchema>;
// #endregion

// #region demands
export const demands = sqliteTable('demands', {
  id: integer('id').primaryKey({autoIncrement: true}),
  clientId: integer('client_id')
    .references(() => clients.id, {onDelete: 'cascade'})
    .notNull(),
  status: text('status', {
    enum: ['new', 'quoted', 'declined'],
  })
    .default('new')
    .notNull(),
  // date: text({ mode: 'json' }),
  // address: text('address'),
  additionalInfo: text('additional_info'),
  updatedAt: integer('updated_at', {mode: 'number'})
    .default(sql`(unixepoch())`)
    .$onUpdate(() => sql`(unixepoch())`)
    .notNull(),
  createdAt: integer('created_at', {mode: 'number'})
    .default(sql`(unixepoch())`)
    .notNull(),
});

export const demandSelectSchema = createSelectSchema(demands)
  .pick({
    id: true,
    status: true,
    additionalInfo: true,
  })
  .extend({
    client: clientSelectSchema.pick({
      firstName: true,
      lastName: true,
      email: true,
    }),
    demandItems: z.array(
      demandItemSelectSchema.extend({
        item: itemSelectSchema,
      })
    ),
  });
export type DemandSelect = z.infer<typeof demandSelectSchema>;

export const demandInsertSchema = createInsertSchema(demands)
  .pick({additionalInfo: true})
  .extend({
    client: clientInsertSchema,
    demandItems: z.array(demandItemInsertSchema),
  });

export type DemandInsert = z.infer<typeof demandInsertSchema>;

export const demandsRelations = relations(demands, ({one, many}) => ({
  client: one(clients, {
    fields: [demands.clientId],
    references: [clients.id],
  }),
  demandItems: many(demandItems),
}));

// export const demandUpdateSchema = createSelectSchema(demands)
//   .pick({
//     id: true,
//     status: true,
//     internalNote: true,
//     externalNote: true,
//   })
//   .extend({
//     client: clientUpdateSchema.pick({
//       email: true,
//     }),
//     demandItems: z.array(demandItemUpdateSchema),
//   });

// export type DemandUpdate = z.infer<typeof demandUpdateSchema>;
// #endregion

// #region quoteItems
export const quoteItems = sqliteTable('quote_items', {
  id: integer('id').primaryKey({autoIncrement: true}),
  quoteId: integer('quote_id')
    .references(() => quotes.id, {onDelete: 'cascade'})
    .notNull(),
  itemId: integer('item_id')
    .references(() => items.id)
    .notNull(),
  quantity: integer('quantity').notNull(),
  // unitPrice: text('unit_price').notNull(),
  updatedAt: integer('updated_at', {mode: 'number'})
    .default(sql`(unixepoch())`)
    .$onUpdate(() => sql`(unixepoch())`)
    .notNull(),
  createdAt: integer('created_at', {mode: 'number'})
    .default(sql`(unixepoch())`)
    .notNull(),
});

export const quoteItemInsertSchema = createInsertSchema(quoteItems).pick({
  itemId: true,
  quantity: true,
});

export const quoteItemsRelations = relations(quoteItems, ({one}) => ({
  item: one(items, {
    fields: [quoteItems.itemId],
    references: [items.id],
  }),
}));
// #endregion

// #region quotes
export const quotes = sqliteTable('quotes', {
  id: integer('id').primaryKey({autoIncrement: true}),
  demandId: integer('demand_id')
    .references(() => demands.id)
    .notNull(),
  status: text('status', {
    enum: ['sent', 'accepted', 'commented', 'declined'],
  })
    .default('sent')
    .notNull(),
  expiresAt: integer('expires_at', {mode: 'number'}).notNull(),
  additionalInfo: text('additional_info'),
  // attachment: blob(),
  version: integer('version').default(1).notNull(),
  updatedAt: integer('updated_at', {mode: 'number'})
    .default(sql`(unixepoch())`)
    .$onUpdate(() => sql`(unixepoch())`)
    .notNull(),
  createdAt: integer('created_at', {mode: 'number'})
    .default(sql`(unixepoch())`)
    .notNull(),
});

export const quoteInsertSchema = createInsertSchema(quotes)
  .pick({demandId: true, expiresAt: true, additionalInfo: true})
  .extend({
    client: clientInsertSchema.pick({email: true}),
    quoteItems: z.array(quoteItemInsertSchema),
  });

export type QuoteInsert = z.infer<typeof quoteInsertSchema>;
// #endregion

// #region jobItems
export const jobItems = sqliteTable('job_items', {
  id: integer('id').primaryKey({autoIncrement: true}),
  jobId: integer('job_id')
    .references(() => jobs.id, {onDelete: 'cascade'})
    .notNull(),
  itemId: integer('item_id')
    .references(() => items.id)
    .notNull(),
  status: text('status', {
    enum: ['pending', 'in_progress', 'completed', 'blocked'],
  })
    .default('pending')
    .notNull(),
  quantity: integer('quantity').notNull(), // Quantity of the item used
  // date: text({ mode: 'json' }),
  additionalInfo: text('additional_info'),
  updatedAt: integer('updated_at', {mode: 'number'})
    .default(sql`(unixepoch())`)
    .$onUpdate(() => sql`(unixepoch())`)
    .notNull(),
  createdAt: integer('created_at', {mode: 'number'})
    .default(sql`(unixepoch())`)
    .notNull(),
});
// #endregion

// #region jobs
export const jobs = sqliteTable('jobs', {
  id: integer('id').primaryKey({autoIncrement: true}),
  demandId: integer('demand_id')
    .references(() => demands.id, {onDelete: 'cascade'})
    .notNull(),
  // attachment: blob(),
  // signed: integer({mode: 'boolean'}),
  // signedAt: integer({mode: 'timestamp'}),
  // clientSigned: integer({mode: 'boolean'}),
  // clientSignedAt: integer({mode: 'timestamp'}),
  additionalInfo: text('additional_info'),
  updatedAt: integer('updated_at', {mode: 'number'})
    .default(sql`(unixepoch())`)
    .$onUpdate(() => sql`(unixepoch())`)
    .notNull(),
  createdAt: integer('created_at', {mode: 'number'})
    .default(sql`(unixepoch())`)
    .notNull(),
});
// #endregion

// #region order
export const orders = sqliteTable('orders', {
  id: integer('id').primaryKey({autoIncrement: true}),
  itemId: integer('item_id')
    .references(() => items.id)
    .notNull(),
  status: text('status', {
    enum: ['pending', 'ordered', 'delivered', 'canceled'],
  })
    .default('pending')
    .notNull(),
  quantity: integer('quantity').notNull(),
  expectedDelivery: text('expected_delivery'),
  updatedAt: integer('updated_at', {mode: 'number'})
    .default(sql`(unixepoch())`)
    .$onUpdate(() => sql`(unixepoch())`)
    .notNull(),
  createdAt: integer('created_at', {mode: 'number'})
    .default(sql`(unixepoch())`)
    .notNull(),
});
// #endregion

// #region jobItemsToOrders
export const jobItemsToOrders = sqliteTable('job_items_to_orders', {
  jobItemId: integer('job_item_id')
    .notNull()
    .references(() => jobItems.id),
  orderId: integer('order_id')
    .notNull()
    .references(() => orders.id),
});
// #endregion
