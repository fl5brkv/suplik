import {users} from '~~/server/database/schema/tables/users';
import {clients} from '~~/server/database/schema/tables/clients';
import {inquiries} from '~~/server/database/schema/tables/inquiries';
import {inquiryServices} from '~~/server/database/schema/tables/inquiryServices';
import {inquiryProducts} from '~~/server/database/schema/tables/inquiryProducts';
import {products} from '~~/server/database/schema/tables/products';
import {services} from '~~/server/database/schema/tables/services';
// import {quotations} from '~~/server/database/schema/tables/quotations';
// import {quotationServices} from '~~/server/database/schema/tables/quotationServices';
// import {quotationProducts} from '~~/server/database/schema/tables/quotationProducts';
import {suppliers} from '~~/server/database/schema/tables/suppliers';

export const schema = {
  users,
  clients,
  inquiries,
  inquiryServices,
  inquiryProducts,
  products,
  services,
  // quotations,
  // quotationServices,
  // quotationProducts,
  suppliers,
};
