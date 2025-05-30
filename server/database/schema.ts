import {relations, sql} from 'drizzle-orm';
import {sqliteTable, text, integer} from 'drizzle-orm/sqlite-core';
import {
  createInsertSchema,
  createSelectSchema,
  createUpdateSchema,
} from 'drizzle-zod';
import {z} from 'zod';

// #region users
export const users = sqliteTable('users', {
  id: integer('id').primaryKey({autoIncrement: true}),
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

export const userSelectSchema = createSelectSchema(users).pick({
  email: true,
  password: true,
});

export const userInsertSchema = createInsertSchema(users).pick({
  email: true,
  password: true,
});

export const userUpdateSchema = createUpdateSchema(users);

export const loginSchema = createSelectSchema(users).pick({
  email: true,
  password: true,
});

export type Login = z.infer<typeof loginSchema>;

export const passwordSchema = createSelectSchema(users)
  .pick({
    password: true,
  })
  .extend({
    newPassword: z.string(),
  });

export type Password = z.infer<typeof passwordSchema>;

export const usersRelations = relations(users, ({one, many}) => ({
  technician: one(technicians),
}));
// #endregion

// #region technicians
export const technicians = sqliteTable('technicians', {
  id: integer('id').primaryKey({autoIncrement: true}),
  userId: integer('user_id')
    .references(() => users.id)
    .unique()
    .notNull(),
  firstName: text('first_name').notNull(),
  lastName: text('last_name').notNull(),
  updatedAt: integer('updated_at', {mode: 'number'})
    .default(sql`(unixepoch())`)
    .$onUpdate(() => sql`(unixepoch())`)
    .notNull(),
  createdAt: integer('created_at', {mode: 'number'})
    .default(sql`(unixepoch())`)
    .notNull(),
});

export const technicianSelectSchema = createSelectSchema(technicians)
  .pick({
    id: true,
    firstName: true,
    lastName: true,
  })
  .extend({
    user: userSelectSchema,
  });

export type TechnicianSelect = z.infer<typeof technicianSelectSchema>;

export const technicianSecSelectSchema = createSelectSchema(users)
  .pick({
    email: true,
  })
  .extend({
    technician: technicianSelectSchema.pick({
      id: true,
      firstName: true,
      lastName: true,
    }),
  });

export type TechnicianSecSelect = z.infer<typeof technicianSecSelectSchema>;

export const technicianInsertSchema = createInsertSchema(technicians)
  .pick({
    firstName: true,
    lastName: true,
  })
  .extend({
    user: userInsertSchema,
  });

export type TechnicianInsert = z.infer<typeof technicianInsertSchema>;

export const technicianUpdateSchema = createUpdateSchema(technicians).extend({
  user: userUpdateSchema,
});

export type TechnicianUpdate = z.infer<typeof technicianUpdateSchema>;

export const techniciansRelations = relations(technicians, ({one, many}) => ({
  user: one(users, {fields: [technicians.userId], references: [users.id]}),
}));
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

export type ClientSelect = z.infer<typeof clientSelectSchema>;

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

export type ClientInsert = z.infer<typeof clientInsertSchema>;

export const clientUpdateSchema = createUpdateSchema(clients);

export type ClientUpdate = z.infer<typeof clientUpdateSchema>;

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

export const supplierUpdateSchema = createUpdateSchema(suppliers);

export type SupplierUpdate = z.infer<typeof supplierUpdateSchema>;

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

export const productUpdateSchema = createUpdateSchema(products);

export type ProductUpdate = z.infer<typeof productUpdateSchema>;

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

export const serviceUpdateSchema = createUpdateSchema(services);

export type ServiceUpdate = z.infer<typeof serviceUpdateSchema>;

export const servicesRelations = relations(services, ({one}) => ({
  category: one(categories, {
    fields: [services.categoryId],
    references: [categories.id],
  }),
}));
// #endregion

// #region cases
export const cases = sqliteTable('cases', {
  id: integer('id').primaryKey({autoIncrement: true}),
  clientId: integer('client_id')
    .references(() => clients.id, {onDelete: 'cascade'})
    .notNull(),
  code: text('code').unique().notNull(),
  updatedAt: integer('updated_at', {mode: 'number'})
    .default(sql`(unixepoch())`)
    .$onUpdate(() => sql`(unixepoch())`)
    .notNull(),
  createdAt: integer('created_at', {mode: 'number'})
    .default(sql`(unixepoch())`)
    .notNull(),
});

const caseSelectSchema = createSelectSchema(cases).pick({
  code: true,
});

export const caseInsertSchema = createInsertSchema(cases).pick({
  clientId: true,
});

export const casesRelations = relations(cases, ({one, many}) => ({
  client: one(clients, {
    fields: [cases.clientId],
    references: [clients.id],
  }),
  demand: one(demands),
  quote: one(quotes),
  offer: one(offers),
  job: one(jobs),
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
  caseId: integer('case_id')
    .references(() => cases.id, {onDelete: 'cascade'})
    .unique()
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
    case: caseSelectSchema.pick({code: true}).extend({
      client: clientSelectSchema.pick({
        firstName: true,
        lastName: true,
        company: true,
      }),
    }),
    demandProducts: z.array(
      demandProductSelectSchema.extend({
        product: productSelectSchema.pick({
          name: true,
        }),
      })
    ),
    demandServices: z.array(
      demandServiceSelectSchema.extend({
        service: serviceSelectSchema.pick({
          name: true,
        }),
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
  case: one(cases, {
    fields: [demands.caseId],
    references: [cases.id],
  }),
  demandProducts: many(demandProducts),
  demandServices: many(demandServices),
}));
// #endregion

// #region quoteAudits
export const quoteAudits = sqliteTable('quote_audits', {
  id: integer('id').primaryKey({autoIncrement: true}),
  quoteId: integer('quote_id')
    .references(() => quotes.id, {onDelete: 'cascade'})
    .notNull(),
  snapshot: text('snapshot', {mode: 'json'}).notNull(),
  createdAt: integer('created_at', {mode: 'number'})
    .default(sql`(unixepoch())`)
    .notNull(),
});

export const quoteAuditsRelations = relations(quoteAudits, ({one}) => ({
  quote: one(quotes, {
    fields: [quoteAudits.quoteId],
    references: [quotes.id],
  }),
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
  caseId: integer('case_id')
    .references(() => cases.id, {onDelete: 'cascade'})
    .unique()
    .notNull(),
  status: text('status', {
    enum: ['sent', 'accepted', 'declined', 'commented'],
  })
    .default('sent')
    .notNull(),
  // attachment: blob(),
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
    status: true,
    additionalInfo: true,
  })
  .extend({
    case: caseSelectSchema
      .pick({
        code: true,
      })
      .extend({
        client: clientSelectSchema.pick({
          firstName: true,
          lastName: true,
          company: true,
        }),
      }),
    quoteProducts: z.array(
      quoteProductSelectSchema.extend({
        product: productSelectSchema.pick({
          name: true,
        }),
      })
    ),
    quoteServices: z.array(
      quoteServiceSelectSchema.extend({
        service: serviceSelectSchema.pick({
          name: true,
        }),
      })
    ),
  });

export type QuoteSelect = z.infer<typeof quoteSelectSchema>;

const quoteEmailSelectSchema = createSelectSchema(quotes)
  .pick({
    additionalInfo: true,
  })
  .extend({
    case: caseSelectSchema
      .pick({
        code: true,
      })
      .extend({
        client: clientSelectSchema.pick({
          email: true,
        }),
      }),
    quoteProducts: z.array(
      quoteProductSelectSchema
        .pick({
          quantity: true,
        })
        .extend({
          product: productSelectSchema.pick({
            name: true,
          }),
        })
    ),
    quoteServices: z.array(
      quoteServiceSelectSchema
        .pick({
          quantity: true,
        })
        .extend({
          service: serviceSelectSchema.pick({
            name: true,
          }),
        })
    ),
  });

export type QuoteEmailSelect = z.infer<typeof quoteEmailSelectSchema>;

export const quoteInsertSchema = createInsertSchema(quotes)
  .pick({additionalInfo: true})
  .extend({
    quoteProducts: z.array(quoteProductInsertSchema).optional(),
    quoteServices: z.array(quoteServiceInsertSchema).optional(),
  });

export type QuoteInsert = z.infer<typeof quoteInsertSchema>;

const quoteResponseSelectSchema = createSelectSchema(quotes)
  .pick({
    additionalInfo: true,
  })
  .extend({
    quoteProducts: z.array(
      quoteProductSelectSchema
        .pick({
          quantity: true,
        })
        .extend({
          product: productSelectSchema.pick({
            name: true,
          }),
        })
    ),
    quoteServices: z.array(
      quoteServiceSelectSchema
        .pick({
          quantity: true,
        })
        .extend({
          service: serviceSelectSchema.pick({
            name: true,
          }),
        })
    ),
  });

export type QuoteResponseSelect = z.infer<typeof quoteResponseSelectSchema>;

export const quoteResponseInsertSchema = createSelectSchema(quotes).pick({
  status: true,
  additionalInfo: true,
});

export type QuoteResponseInsert = z.infer<typeof quoteResponseInsertSchema>;

export const quoteUpdateSchema = createUpdateSchema(quotes)
  .pick({additionalInfo: true})
  .extend({
    quoteProducts: z.array(quoteProductInsertSchema).optional(),
    quoteServices: z.array(quoteServiceInsertSchema).optional(),
  });

export type QuoteUpdate = z.infer<typeof quoteUpdateSchema>;

export const quotesRelations = relations(quotes, ({one, many}) => ({
  case: one(cases, {
    fields: [quotes.caseId],
    references: [cases.id],
  }),
  quoteProducts: many(quoteProducts),
  quoteServices: many(quoteServices),
  quoteAudits: many(quoteAudits),
}));
// #endregion

// #region offerAudits
export const offerAudits = sqliteTable('offer_audits', {
  id: integer('id').primaryKey({autoIncrement: true}),
  offerId: integer('offer_id')
    .references(() => offers.id, {onDelete: 'cascade'})
    .notNull(),
  snapshot: text('snapshot', {mode: 'json'}).notNull(),
  createdAt: integer('created_at', {mode: 'number'})
    .default(sql`(unixepoch())`)
    .notNull(),
});

export const offerAuditsRelations = relations(offerAudits, ({one}) => ({
  offer: one(offers, {
    fields: [offerAudits.offerId],
    references: [offers.id],
  }),
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
  technicianId: integer('technician_id')
    .references(() => technicians.id)
    .notNull(),
  quantity: integer('quantity').notNull(), // Quantity of the service needed
  // scheduledAt: integer('scheduled_at', {mode: 'timestamp'}).notNull(),
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
  technicianId: true,
  quantity: true,
});

export const offerServiceInsertSchema = createInsertSchema(offerServices).pick({
  serviceId: true,
  technicianId: true,
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
    technician: one(technicians, {
      fields: [offerServices.technicianId],
      references: [technicians.id],
    }),
    offerProducts: many(offerProducts),
  })
);

// #endregion

// #region offers
export const offers = sqliteTable('offers', {
  id: integer('id').primaryKey({autoIncrement: true}),
  caseId: integer('case_id')
    .references(() => cases.id, {onDelete: 'cascade'})
    .unique()
    .notNull(),
  status: text('status', {
    enum: ['sent', 'accepted', 'declined', 'commented'],
  })
    .default('sent')
    .notNull(),
  // attachment: blob(),
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
    status: true,
    additionalInfo: true,
  })
  .extend({
    case: caseSelectSchema
      .pick({
        code: true,
      })
      .extend({
        client: clientSelectSchema.pick({
          firstName: true,
          lastName: true,
          company: true,
        }),
      }),
    offerServices: z.array(
      offerServiceSelectSchema
        .pick({
          serviceId: true,
          technicianId: true,
          quantity: true,
        })
        .extend({
          technician: technicianSelectSchema.pick({
            firstName: true,
            lastName: true,
          }),
          service: serviceSelectSchema.pick({
            name: true,
          }),
          offerProducts: z
            .array(
              offerProductSelectSchema
                .pick({
                  productId: true,
                  quantity: true,
                })
                .extend({
                  product: productSelectSchema.pick({
                    name: true,
                  }),
                })
            )
            .optional(),
        })
    ),
  });

export type OfferSelect = z.infer<typeof offerSelectSchema>;

export const offerEmailSelectSchema = createSelectSchema(offers)
  .pick({
    additionalInfo: true,
  })
  .extend({
    offerServices: z.array(
      offerServiceSelectSchema
        .pick({
          quantity: true,
        })
        .extend({
          service: serviceSelectSchema.pick({
            name: true,
          }),
          offerProducts: z
            .array(
              offerProductSelectSchema
                .pick({
                  quantity: true,
                })
                .extend({
                  product: productSelectSchema.pick({
                    name: true,
                  }),
                })
            )
            .optional(),
        })
    ),
  });

export type OfferEmailSelect = z.infer<typeof offerEmailSelectSchema>;

const offerResponseSelectSchema = createSelectSchema(offers)
  .pick({
    additionalInfo: true,
  })
  .extend({
    offerServices: z.array(
      offerServiceSelectSchema
        .pick({
          quantity: true,
        })
        .extend({
          service: serviceSelectSchema.pick({
            name: true,
          }),
          offerProducts: z.array(
            offerProductSelectSchema
              .pick({
                quantity: true,
              })
              .extend({
                product: productSelectSchema.pick({
                  name: true,
                }),
              })
          ),
        })
    ),
  });

export type OfferResponseSelect = z.infer<typeof offerResponseSelectSchema>;

export const offerInsertSchema = createInsertSchema(offers)
  .pick({
    additionalInfo: true,
  })
  .extend({
    offerServices: z.array(
      offerServiceInsertSchema.extend({
        offerProducts: z.array(offerProductInsertSchema),
      })
    ),
  });

export type OfferInsert = z.infer<typeof offerInsertSchema>;

export const offerResponseInsertSchema = createSelectSchema(offers).pick({
  status: true,
  additionalInfo: true,
});

export type OfferResponseInsert = z.infer<typeof offerResponseInsertSchema>;

export const offerUpdateSchema = createUpdateSchema(offers)
  .pick({
    additionalInfo: true,
  })
  .extend({
    offerServices: z.array(
      offerServiceInsertSchema.extend({
        offerProducts: z.array(offerProductInsertSchema.optional()),
      })
    ),
  });

export type OfferUpdate = z.infer<typeof offerUpdateSchema>;

export const technicianOfferSelectSchema = createSelectSchema(offers)
  .pick({
    id: true,
  })
  .extend({
    case: caseSelectSchema
      .pick({
        code: true,
      })
      .extend({
        client: clientSelectSchema.pick({
          firstName: true,
          lastName: true,
          company: true,
        }),
      }),
    offerServices: z.array(
      offerServiceSelectSchema
        .pick({
          quantity: true,
        })
        .extend({
          technician: technicianSelectSchema,
          service: serviceSelectSchema.pick({
            name: true,
          }),
          offerProducts: z
            .array(
              offerProductSelectSchema
                .pick({
                  quantity: true,
                })
                .extend({
                  product: productSelectSchema.pick({
                    name: true,
                  }),
                })
            )
            .optional(),
        })
    ),
  });

export type TechnicianOfferSelect = z.infer<typeof technicianOfferSelectSchema>;

export const offersRelations = relations(offers, ({one, many}) => ({
  case: one(cases, {
    fields: [offers.caseId],
    references: [cases.id],
  }),
  offerProducts: many(offerProducts),
  offerServices: many(offerServices),
  offerAudits: many(offerAudits),
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
  technicianId: integer('technician_id')
    .references(() => technicians.id)
    .notNull(),
  status: text('status', {
    enum: ['pending', 'in_progress', 'completed', 'blocked'],
  })
    .default('pending')
    .notNull(),
  // scheduledAt: integer('scheduled_at', {mode: 'timestamp'}).notNull(),
  // date: integer('scheduled_at', {mode: 'timestamp'}), // when the job was done
  quantity: integer('quantity').notNull(),
  // signed: integer({mode: 'boolean'}),
  // signedAt: integer({mode: 'timestamp'}),
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
  status: true,
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
  technician: one(technicians, {
    fields: [jobServices.technicianId],
    references: [technicians.id],
  }),
  jobProducts: many(jobProducts),
}));
// #endregion

// #region jobs
export const jobs = sqliteTable('jobs', {
  id: integer('id').primaryKey({autoIncrement: true}),
  caseId: integer('case_id')
    .references(() => cases.id, {onDelete: 'cascade'})
    .unique()
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
    additionalInfo: true,
  })
  .extend({
    case: caseSelectSchema
      .pick({
        code: true,
      })
      .extend({
        client: clientSelectSchema.pick({
          firstName: true,
          lastName: true,
          phoneNumber: true,
          company: true,
        }),
      }),
    jobServices: z.array(
      jobServiceSelectSchema
        .pick({
          status: true,
          quantity: true,
        })
        .extend({
          technician: technicianSelectSchema.pick({
            firstName: true,
            lastName: true,
          }),
          service: serviceSelectSchema.pick({
            name: true,
          }),
          jobProducts: z.array(
            jobProductSelectSchema
              .pick({
                quantity: true,
              })
              .extend({
                product: productSelectSchema.pick({
                  name: true,
                }),
              })
          ),
        })
    ),
  });

export type JobSelect = z.infer<typeof jobSelectSchema>;

export const technicianJobSelectSchema = createSelectSchema(jobs)
  .pick({
    id: true,
    additionalInfo: true,
  })
  .extend({
    case: caseSelectSchema
      .pick({
        code: true,
      })
      .extend({
        client: clientSelectSchema.pick({
          firstName: true,
          lastName: true,
          phoneNumber: true,
          company: true,
        }),
      }),
    jobServices: z.array(
      jobServiceSelectSchema
        .pick({
          status: true,
          quantity: true,
        })
        .extend({
          technician: technicianSelectSchema,
          service: serviceSelectSchema.pick({
            name: true,
          }),
          jobProducts: z.array(
            jobProductSelectSchema
              .pick({
                quantity: true,
              })
              .extend({
                product: productSelectSchema.pick({
                  name: true,
                }),
              })
          ),
        })
    ),
  });

export type TechnicianJobSelect = z.infer<typeof technicianJobSelectSchema>;

// export const jobInsertSchema = createInsertSchema(jobs)
//   .pick({
//     demandId: true,
//     additionalInfo: true,
//   })
//   .extend({
//     client: clientInsertSchema.pick({email: true}),
//     jobServices: z.array(
//       jobServiceInsertSchema.extend({
//         additionalInfo: z.string().optional(),
//         jobProducts: z.array(
//           jobProductInsertSchema.extend({
//             additionalInfo: z.string().optional(),
//           })
//         ),
//       })
//     ),
//   });

// export type JobInsert = z.infer<typeof jobInsertSchema>;

export const jobResponseInsertSchema = createSelectSchema(jobs).pick({
  additionalInfo: true,
});

export type JobResponseInsert = z.infer<typeof jobResponseInsertSchema>;

export const jobsRelations = relations(jobs, ({one, many}) => ({
  case: one(cases, {
    fields: [jobs.caseId],
    references: [cases.id],
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

export const orderUpdateSchema = createUpdateSchema(orders);

export type OrderUpdate = z.infer<typeof orderUpdateSchema>;

export const orderResponseUpdateSchema = createSelectSchema(orders).pick({
  status: true,
  delivery: true,
});

export type OrderResponseUpdate = z.infer<typeof orderResponseUpdateSchema>;

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

// export const caseSelectSchema = caseSelectSchema.extend({
//   client: clientSelectSchema.pick({
//     firstName: true,
//     lastName: true,
//     company: true,
//   }),
//   demand: demandSelectSchema.pick({
//     additionalInfo: true,
//     demandProducts: true,
//     demandServices: true,
//   }),
//   quote: quoteSelectSchema.pick({
//     additionalInfo: true,
//     quoteProducts: true,
//     quoteServices: true,
//   }),
//   offer: offerSelectSchema.pick({
//     additionalInfo: true,
//     offerServices: true,
//   }),
// });
