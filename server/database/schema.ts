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
  updatedAt: integer('updated_at', {mode: 'number'})
    .default(sql`(unixepoch())`)
    .$onUpdate(() => sql`(unixepoch())`)
    .notNull(),
  createdAt: integer('created_at', {mode: 'number'})
    .default(sql`(unixepoch())`)
    .notNull(),
});

export const categorySelectSchema = createSelectSchema(categories).pick({
  id: true,
  name: true,
});

export type CategorySelect = z.infer<typeof categorySelectSchema>;

export const categoryInsertSchema = createInsertSchema(categories).pick({
  name: true,
});

export type CategoryInsert = z.infer<typeof categoryInsertSchema>;

export const categoriesRelations = relations(categories, ({many}) => ({
  products: many(products),
  services: many(services),
}));
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

export const supplierSelectSchema = createSelectSchema(suppliers).pick({
  id: true,
  name: true,
  email: true,
  phoneNumber: true,
});

export type SupplierSelect = z.infer<typeof supplierSelectSchema>;

export const supplierInsertSchema = createInsertSchema(suppliers).pick({
  name: true,
  email: true,
  phoneNumber: true,
});

export type SupplierInsert = z.infer<typeof supplierInsertSchema>;

export const supplierUpdateSchema = createSelectSchema(suppliers).pick({
  id: true,
  name: true,
  email: true,
  phoneNumber: true,
});

export type SupplierUpdate = z.infer<typeof supplierUpdateSchema>;

export const supplierDeleteSchema = createSelectSchema(suppliers).pick({
  id: true,
});

export type SupplierDelete = z.infer<typeof supplierDeleteSchema>;

export const suppliersRelations = relations(suppliers, ({many}) => ({
  products: many(products),
}));
// #endregion

// #region products
export const products = sqliteTable('products', {
  id: integer('id').primaryKey({autoIncrement: true}),
  categoryId: integer('category_id')
    .references(() => categories.id)
    .notNull(),
  supplierId: integer('supplier_id')
    .references(() => suppliers.id)
    .notNull(),
  name: text('name').notNull(),
  // unitPrice: text('unit_price'),
  stock: integer('stock').notNull(),
  reserved: integer('reserved').notNull(),
  // purchasePrice: text('purchase_price'),
  isPublic: integer('is_public', {mode: 'boolean'}).notNull(),
  updatedAt: integer('updated_at', {mode: 'number'})
    .default(sql`(unixepoch())`)
    .$onUpdate(() => sql`(unixepoch())`)
    .notNull(),
  createdAt: integer('created_at', {mode: 'number'})
    .default(sql`(unixepoch())`)
    .notNull(),
});

export const productSelectSchema = createSelectSchema(products)
  .pick({
    id: true,
    categoryId: true,
    supplierId: true,
    name: true,
    stock: true,
    reserved: true,
    isPublic: true,
  })
  .extend({
    category: categorySelectSchema.pick({name: true}),
  });

export type ProductSelect = z.infer<typeof productSelectSchema>;

export const productInsertSchema = createInsertSchema(products).pick({
  categoryId: true,
  supplierId: true,
  name: true,
  stock: true,
  reserved: true,
  isPublic: true,
});
export type ProductInsert = z.infer<typeof productInsertSchema>;

export const productUpdateSchema = createSelectSchema(products).pick({
  id: true,
  categoryId: true,
  supplierId: true,
  name: true,
  stock: true,
  reserved: true,
  isPublic: true,
});

export type ProductUpdate = z.infer<typeof productUpdateSchema>;

export const productDeleteSchema = createSelectSchema(products).pick({
  id: true,
});

export const productsRelations = relations(products, ({one}) => ({
  category: one(categories, {
    fields: [products.categoryId],
    references: [categories.id],
  }),
  supplier: one(suppliers, {
    fields: [products.supplierId],
    references: [suppliers.id],
  }),
}));

// #endregion

// #region services
export const services = sqliteTable('services', {
  id: integer('id').primaryKey({autoIncrement: true}),
  categoryId: integer('category_id')
    .references(() => categories.id)
    .notNull(),
  name: text('name').notNull(),
  // unitPrice: text('unit_price'),
  // purchasePrice: text('purchase_price'),
  isPublic: integer('is_public', {mode: 'boolean'}).notNull(),
  updatedAt: integer('updated_at', {mode: 'number'})
    .default(sql`(unixepoch())`)
    .$onUpdate(() => sql`(unixepoch())`)
    .notNull(),
  createdAt: integer('created_at', {mode: 'number'})
    .default(sql`(unixepoch())`)
    .notNull(),
});

export const serviceSelectSchema = createSelectSchema(services)
  .pick({
    id: true,
    categoryId: true,
    name: true,
    isPublic: true,
  })
  .extend({
    category: categorySelectSchema.pick({name: true}),
  });

export type ServiceSelect = z.infer<typeof serviceSelectSchema>;

export const serviceInsertSchema = createInsertSchema(services).pick({
  categoryId: true,
  name: true,
  isPublic: true,
});
export type ServiceInsert = z.infer<typeof serviceInsertSchema>;

export const serviceUpdateSchema = createSelectSchema(services).pick({
  id: true,
  categoryId: true,
  name: true,
  isPublic: true,
});

export type ServiceUpdate = z.infer<typeof serviceUpdateSchema>;

export const serviceDeleteSchema = createSelectSchema(services).pick({
  id: true,
});

export const servicesRelations = relations(services, ({one}) => ({
  category: one(categories, {
    fields: [services.categoryId],
    references: [categories.id],
  }),
}));
// #endregion

// #region demandProducts
export const demandProducts = sqliteTable('demand_products', {
  id: integer('id').primaryKey({autoIncrement: true}),
  demandId: integer('demand_id')
    .references(() => demands.id, {onDelete: 'cascade'})
    .notNull(),
  productId: integer('product_id')
    .references(() => products.id)
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

export const demandProductSelectSchema = createSelectSchema(
  demandProducts
).pick({
  productId: true,
  quantity: true,
});

export const demandProductInsertSchema = createInsertSchema(
  demandProducts
).pick({
  productId: true,
  quantity: true,
});

export const demandProductsRelations = relations(demandProducts, ({one}) => ({
  demand: one(demands, {
    fields: [demandProducts.demandId],
    references: [demands.id],
  }),
  product: one(products, {
    fields: [demandProducts.productId],
    references: [products.id],
  }),
}));
// #endregion

// #region demandServices
export const demandServices = sqliteTable('demand_services', {
  id: integer('id').primaryKey({autoIncrement: true}),
  demandId: integer('demand_id')
    .references(() => demands.id, {onDelete: 'cascade'})
    .notNull(),
  serviceId: integer('service_id')
    .references(() => services.id)
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

export const demandServiceSelectSchema = createSelectSchema(
  demandServices
).pick({
  serviceId: true,
  quantity: true,
});

export const demandServiceInsertSchema = createInsertSchema(
  demandServices
).pick({
  serviceId: true,
  quantity: true,
});

export const demandServicesRelations = relations(demandServices, ({one}) => ({
  demand: one(demands, {
    fields: [demandServices.demandId],
    references: [demands.id],
  }),
  service: one(services, {
    fields: [demandServices.serviceId],
    references: [services.id],
  }),
}));
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
    demandProducts: z.array(
      demandProductSelectSchema.extend({
        product: productSelectSchema,
      })
    ),
    demandServices: z.array(
      demandServiceSelectSchema.extend({
        service: serviceSelectSchema,
      })
    ),
  });

export type DemandSelect = z.infer<typeof demandSelectSchema>;

export const demandInsertSchema = createInsertSchema(demands)
  .pick({additionalInfo: true})
  .extend({
    client: clientInsertSchema,
    demandProducts: z.array(demandProductInsertSchema).optional(),
    demandServices: z.array(demandServiceInsertSchema).optional(),
  });

export type DemandInsert = z.infer<typeof demandInsertSchema>;

export const demandsRelations = relations(demands, ({one, many}) => ({
  client: one(clients, {
    fields: [demands.clientId],
    references: [clients.id],
  }),
  demandProducts: many(demandProducts),
  demandServices: many(demandServices),
  quotes: many(quotes),
}));
// #endregion

// #region quoteProducts
export const quoteProducts = sqliteTable('quote_products', {
  id: integer('id').primaryKey({autoIncrement: true}),
  quoteId: integer('quote_id')
    .references(() => quotes.id, {onDelete: 'cascade'})
    .notNull(),
  productId: integer('product_id')
    .references(() => products.id)
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

export const quoteProductSelectSchema = createSelectSchema(quoteProducts).pick({
  productId: true,
  quantity: true,
});

export const quoteProductInsertSchema = createInsertSchema(quoteProducts).pick({
  productId: true,
  quantity: true,
});

export const quoteProductsRelations = relations(quoteProducts, ({one}) => ({
  product: one(products, {
    fields: [quoteProducts.productId],
    references: [products.id],
  }),
  quote: one(quotes, {
    fields: [quoteProducts.quoteId],
    references: [quotes.id],
  }),
}));
// #endregion

// #region quoteServices
export const quoteServices = sqliteTable('quote_services', {
  id: integer('id').primaryKey({autoIncrement: true}),
  quoteId: integer('quote_id')
    .references(() => quotes.id, {onDelete: 'cascade'})
    .notNull(),
  serviceId: integer('service_id')
    .references(() => services.id)
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

export const quoteServiceSelectSchema = createSelectSchema(quoteServices).pick({
  serviceId: true,
  quantity: true,
});

export const quoteServiceInsertSchema = createInsertSchema(quoteServices).pick({
  serviceId: true,
  quantity: true,
});

export const quoteServicesRelations = relations(quoteServices, ({one}) => ({
  service: one(services, {
    fields: [quoteServices.serviceId],
    references: [services.id],
  }),
  quote: one(quotes, {
    fields: [quoteServices.quoteId],
    references: [quotes.id],
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
    enum: ['sent', 'accepted', 'declined', 'commented'],
  })
    .default('sent')
    .notNull(),
  // attachment: blob(),
  version: integer('version').default(1).notNull(),
  additionalInfo: text('additional_info'),
  updatedAt: integer('updated_at', {mode: 'number'})
    .default(sql`(unixepoch())`)
    .$onUpdate(() => sql`(unixepoch())`)
    .notNull(),
  createdAt: integer('created_at', {mode: 'number'})
    .default(sql`(unixepoch())`)
    .notNull(),
});

export const quoteSelectSchema = createSelectSchema(quotes)
  .pick({
    id: true,
    demandId: true,
    status: true,
    version: true,
    additionalInfo: true,
  })
  .extend({
    quoteProducts: z.array(
      quoteProductSelectSchema.extend({
        product: productSelectSchema,
      })
    ),
    quoteServices: z.array(
      quoteServiceSelectSchema.extend({
        service: serviceSelectSchema,
      })
    ),
  });

export type QuoteSelect = z.infer<typeof quoteSelectSchema>;

export const quoteInsertSchema = createInsertSchema(quotes)
  .pick({demandId: true, additionalInfo: true})
  .extend({
    client: clientInsertSchema.pick({email: true}),
    quoteProducts: z.array(quoteProductInsertSchema).optional(),
    quoteServices: z.array(quoteServiceInsertSchema).optional(),
  });

export type QuoteInsert = z.infer<typeof quoteInsertSchema>;

export const quoteResponseInsertSchema = createSelectSchema(quotes).pick({
  status: true,
  additionalInfo: true,
});

export type QuoteResponseInsert = z.infer<typeof quoteResponseInsertSchema>;

export const quotesRelations = relations(quotes, ({one, many}) => ({
  demand: one(demands, {
    fields: [quotes.demandId],
    references: [demands.id],
  }),
  quoteProducts: many(quoteProducts),
  quoteServices: many(quoteServices),
}));
// #endregion

// #region offerProducts
export const offerProducts = sqliteTable('offer_products', {
  id: integer('id').primaryKey({autoIncrement: true}),
  offerId: integer('offer_id')
    .references(() => offers.id, {onDelete: 'cascade'})
    .notNull(),
  productId: integer('product_id')
    .references(() => products.id)
    .notNull(),
  offerServiceId: integer('offer_service_id')
    .references(() => offerServices.id)
    .notNull(),
  quantity: integer('quantity').notNull(),
  additionalInfo: text('additional_info'),
  updatedAt: integer('updated_at', {mode: 'number'})
    .default(sql`(unixepoch())`)
    .$onUpdate(() => sql`(unixepoch())`)
    .notNull(),
  createdAt: integer('created_at', {mode: 'number'})
    .default(sql`(unixepoch())`)
    .notNull(),
});

export const offerProductSelectSchema = createSelectSchema(offerProducts).pick({
  productId: true,
  quantity: true,
});

export const offerProductInsertSchema = createInsertSchema(offerProducts).pick({
  productId: true,
  quantity: true,
});

export const offerProductsRelations = relations(offerProducts, ({one}) => ({
  product: one(products, {
    fields: [offerProducts.productId],
    references: [products.id],
  }),
  offer: one(offers, {
    fields: [offerProducts.offerId],
    references: [offers.id],
  }),
  offerService: one(offerServices, {
    fields: [offerProducts.offerServiceId],
    references: [offerServices.id],
  }),
}));
// #endregion

// #region offerServices
export const offerServices = sqliteTable('offer_services', {
  id: integer('id').primaryKey({autoIncrement: true}),
  offerId: integer('offer_id')
    .references(() => offers.id, {onDelete: 'cascade'})
    .notNull(),
  serviceId: integer('service_id')
    .references(() => services.id)
    .notNull(),
  quantity: integer('quantity').notNull(), // Quantity of the service needed
  // scheduledAt: integer('scheduled_at', {mode: 'timestamp'}),
  additionalInfo: text('additional_info'),
  updatedAt: integer('updated_at', {mode: 'number'})
    .default(sql`(unixepoch())`)
    .$onUpdate(() => sql`(unixepoch())`)
    .notNull(),
  createdAt: integer('created_at', {mode: 'number'})
    .default(sql`(unixepoch())`)
    .notNull(),
});

export const offerServiceSelectSchema = createSelectSchema(offerServices).pick({
  serviceId: true,
  quantity: true,
});

export const offerServiceInsertSchema = createInsertSchema(offerServices).pick({
  serviceId: true,
  quantity: true,
});

export const offerServicesRelations = relations(
  offerServices,
  ({one, many}) => ({
    service: one(services, {
      fields: [offerServices.serviceId],
      references: [services.id],
    }),
    offer: one(offers, {
      fields: [offerServices.offerId],
      references: [offers.id],
    }),
    offerProducts: many(offerProducts),
  })
);

// #endregion

// #region offers
export const offers = sqliteTable('offers', {
  id: integer('id').primaryKey({autoIncrement: true}),
  demandId: integer('demand_id')
    .references(() => demands.id, {onDelete: 'cascade'})
    .notNull(),
  status: text('status', {
    enum: ['sent', 'accepted', 'declined', 'commented'],
  })
    .default('sent')
    .notNull(),
  // attachment: blob(),
  version: integer('version').default(1).notNull(),
  additionalInfo: text('additional_info'),
  updatedAt: integer('updated_at', {mode: 'number'})
    .default(sql`(unixepoch())`)
    .$onUpdate(() => sql`(unixepoch())`)
    .notNull(),
  createdAt: integer('created_at', {mode: 'number'})
    .default(sql`(unixepoch())`)
    .notNull(),
});

export const offerSelectSchema = createSelectSchema(offers)
  .pick({
    id: true,
    demandId: true,
    status: true,
    version: true,
    additionalInfo: true,
  })
  .extend({
    offerServices: z.array(
      offerServiceSelectSchema.extend({
        service: serviceSelectSchema,
        offerProducts: z.array(
          offerProductSelectSchema.extend({
            product: productSelectSchema,
          })
        ),
      })
    ),
  });

export type OfferSelect = z.infer<typeof offerSelectSchema>;

export const offerInsertSchema = createInsertSchema(offers)
  .pick({
    demandId: true,
    additionalInfo: true,
  })
  .extend({
    client: clientInsertSchema.pick({email: true}),
    offerServices: z.array(
      offerServiceInsertSchema.extend({
        additionalInfo: z.string().optional(),
        offerProducts: z.array(
          offerProductInsertSchema.extend({
            additionalInfo: z.string().optional(),
          })
        ),
      })
    ),
  });

export type OfferInsert = z.infer<typeof offerInsertSchema>;

export const offerResponseInsertSchema = createSelectSchema(offers).pick({
  status: true,
  additionalInfo: true,
});

export type OfferResponseInsert = z.infer<typeof offerResponseInsertSchema>;

export const offersRelations = relations(offers, ({one, many}) => ({
  demand: one(demands, {
    fields: [offers.demandId],
    references: [demands.id],
  }),
  offerProducts: many(offerProducts),
  offerServices: many(offerServices),
}));
// #endregion

// #region jobProducts
export const jobProducts = sqliteTable('job_products', {
  id: integer('id').primaryKey({autoIncrement: true}),
  jobId: integer('job_id')
    .references(() => jobs.id, {onDelete: 'cascade'})
    .notNull(),
  productId: integer('product_id')
    .references(() => products.id)
    .notNull(),
  jobServiceId: integer('job_service_id')
    .references(() => jobServices.id)
    .notNull(),
  quantity: integer('quantity').notNull(),
  additionalInfo: text('additional_info'),
  updatedAt: integer('updated_at', {mode: 'number'})
    .default(sql`(unixepoch())`)
    .$onUpdate(() => sql`(unixepoch())`)
    .notNull(),
  createdAt: integer('created_at', {mode: 'number'})
    .default(sql`(unixepoch())`)
    .notNull(),
});

export const jobProductSelectSchema = createSelectSchema(jobProducts).pick({
  productId: true,
  quantity: true,
});

export const jobProductInsertSchema = createInsertSchema(jobProducts).pick({
  productId: true,
  quantity: true,
});

export const jobProductsRelations = relations(jobProducts, ({one}) => ({
  product: one(products, {
    fields: [jobProducts.productId],
    references: [products.id],
  }),
  job: one(jobs, {
    fields: [jobProducts.jobId],
    references: [jobs.id],
  }),
  jobService: one(jobServices, {
    fields: [jobProducts.jobServiceId],
    references: [jobServices.id],
  }),
}));
// #endregion

// #region jobServices
export const jobServices = sqliteTable('job_services', {
  id: integer('id').primaryKey({autoIncrement: true}),
  jobId: integer('job_id')
    .references(() => jobs.id, {onDelete: 'cascade'})
    .notNull(),
  serviceId: integer('service_id')
    .references(() => services.id)
    .notNull(),
  status: text('status', {
    enum: ['pending', 'in_progress', 'completed', 'blocked'],
  }),
  // signed: integer({mode: 'boolean'}),
  // signedAt: integer({mode: 'timestamp'}),
  // date: integer('scheduled_at', {mode: 'timestamp'}), // when the job was done
  quantity: integer('quantity').notNull(),
  additionalInfo: text('additional_info'),
  updatedAt: integer('updated_at', {mode: 'number'})
    .default(sql`(unixepoch())`)
    .$onUpdate(() => sql`(unixepoch())`)
    .notNull(),
  createdAt: integer('created_at', {mode: 'number'})
    .default(sql`(unixepoch())`)
    .notNull(),
});

export const jobServiceSelectSchema = createSelectSchema(jobServices).pick({
  serviceId: true,
  quantity: true,
});

export const jobServiceInsertSchema = createInsertSchema(jobServices).pick({
  serviceId: true,
  quantity: true,
});

export const jobServicesRelations = relations(jobServices, ({one, many}) => ({
  service: one(services, {
    fields: [jobServices.serviceId],
    references: [services.id],
  }),
  job: one(jobs, {
    fields: [jobServices.jobId],
    references: [jobs.id],
  }),
  jobProducts: many(jobProducts),
}));
// #endregion

// #region jobs
export const jobs = sqliteTable('jobs', {
  id: integer('id').primaryKey({autoIncrement: true}),
  demandId: integer('demand_id')
    .references(() => demands.id, {onDelete: 'cascade'})
    .notNull(),
  // attachment: blob(),
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

export const jobSelectSchema = createSelectSchema(jobs)
  .pick({
    id: true,
    demandId: true,
    additionalInfo: true,
  })
  .extend({
    jobServices: z.array(
      jobServiceSelectSchema.extend({
        service: serviceSelectSchema,
        jobProducts: z.array(
          jobProductSelectSchema.extend({
            product: productSelectSchema,
          })
        ),
      })
    ),
  });

export type JobSelect = z.infer<typeof jobSelectSchema>;

export const jobInsertSchema = createInsertSchema(jobs)
  .pick({
    demandId: true,
    additionalInfo: true,
  })
  .extend({
    client: clientInsertSchema.pick({email: true}),
    jobServices: z.array(
      jobServiceInsertSchema.extend({
        additionalInfo: z.string().optional(),
        jobProducts: z.array(
          jobProductInsertSchema.extend({
            additionalInfo: z.string().optional(),
          })
        ),
      })
    ),
  });

export type JobInsert = z.infer<typeof jobInsertSchema>;

export const jobResponseInsertSchema = createSelectSchema(jobs).pick({
  additionalInfo: true,
});

export type JobResponseInsert = z.infer<typeof jobResponseInsertSchema>;

export const jobsRelations = relations(jobs, ({one, many}) => ({
  demand: one(demands, {
    fields: [jobs.demandId],
    references: [demands.id],
  }),
  jobProducts: many(jobProducts),
  jobServices: many(jobServices),
}));
// #endregion

// #region orders
export const orders = sqliteTable('orders', {
  id: integer('id').primaryKey({autoIncrement: true}),
  productId: integer('product_id')
    .references(() => products.id)
    .notNull(),
  status: text('status', {
    enum: ['sent', 'accepted', 'declined', 'delivered'],
  })
    .default('sent')
    .notNull(),
  quantity: integer('quantity').notNull(),
  delivery: text('delivery'),
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
    productId: true,
    status: true,
    quantity: true,
    delivery: true,
  })
  .extend({
    product: productSelectSchema.pick({
      name: true,
    }),
  });

export type OrderSelect = z.infer<typeof orderSelectSchema>;

export const orderInsertSchema = createInsertSchema(orders).pick({
  productId: true,
  quantity: true,
});

export type OrderInsert = z.infer<typeof orderInsertSchema>;

export const orderUpdateSchema = createSelectSchema(orders).pick({
  id: true,
  status: true,
  delivery: true,
});

export type OrderUpdate = z.infer<typeof orderUpdateSchema>;

export const orderResponseUpdateSchema = createSelectSchema(orders).pick({
  status: true,
  delivery: true,
});

export type OrderResponseUpdate = z.infer<typeof orderResponseUpdateSchema>;

export const orderDeleteSchema = createSelectSchema(orders).pick({
  id: true,
});

export type OrderDelete = z.infer<typeof orderDeleteSchema>;

export const ordersRelations = relations(orders, ({one}) => ({
  product: one(products, {
    fields: [orders.productId],
    references: [products.id],
  }),
}));
// #endregion

// #region jobProductsToOrders
// export const jobProductsToOrders = sqliteTable('job_products_to_orders', {
//   jobProductId: integer('job_product_id')
//     .notNull()
//     .references(() => jobProducts.id),
//   orderId: integer('order_id')
//     .notNull()
//     .references(() => orders.id),
// });
// #endregion
