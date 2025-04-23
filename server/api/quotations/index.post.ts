import {
  quotationInsertSchema,
} from '~~/server/database/schema/tables/quotations';

export default eventHandler(async (event) => {
  await requireAdminSession(event);

  const result = await readValidatedBody(event, (body) =>
    quotationInsertSchema.safeParse(body)
  );

  if (!result.success)
    throw createError({
      statusCode: 400,
      statusMessage: 'The provided data is invalid',
    });

  const {
    inquiryId,
    totalPrice,
    internalNote,
    quotationService,
    quotationProduct,
  } = result.data;
  
  const inserted = await useDrizzle()
    .insert(tables.quotations)
    .values({inquiryId, totalPrice, internalNote, status: 'sent'})
    .onConflictDoNothing()
    .returning({quotationId: tables.quotations.quotationId})
    .get();

  if (!inserted)
    throw createError({
      statusCode: 409,
      statusMessage: 'There was an error inserting quotation!',
    });

  if (quotationService && quotationService.length > 0) {
    await Promise.all(
      quotationService.map((service) =>
        useDrizzle()
          .insert(tables.quotationServices)
          .values({
            ...service,
            quotationId: inserted.quotationId,
          })
          .onConflictDoNothing()
      )
    );
  }

  if (quotationProduct && quotationProduct.length > 0) {
    await Promise.all(
      quotationProduct.map((product) =>
        useDrizzle()
          .insert(tables.quotationProducts)
          .values({
            ...product,
            quotationId: inserted.quotationId,
          })
          .onConflictDoNothing()
      )
    );
  }
});
