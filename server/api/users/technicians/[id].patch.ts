import z from 'zod';
import {technicianUpdateSchema} from '~~/server/database/schema';

export default eventHandler(async (event) => {
  await requireAdminSession(event);

  const result = await readValidatedBody(event, (body) =>
    technicianUpdateSchema.safeParse(body)
  );

  if (!result.success)
    throw createError({
      statusCode: 400,
      statusMessage: 'The provided data is invalid',
    });

  const params = await getValidatedRouterParams(event, (params) =>
    z
      .object({
        id: z.coerce.number().int().positive(),
      })
      .safeParse(params)
  );

  if (!params.success)
    throw createError({
      statusCode: 400,
      statusMessage: 'The provided param is invalid',
    });

  const updatedTechnician = await useDrizzle()
    .update(tables.technicians)
    .set({
      firstName: result.data.firstName,
      lastName: result.data.lastName,
    })
    .where(eq(tables.technicians.id, params.data.id))
    .returning({
      id: tables.technicians.id,
      userId: tables.technicians.userId,
    })
    .get();

  if (!updatedTechnician)
    throw createError({
      statusCode: 400,
      statusMessage: 'The technician could not be updated!',
    });

  const updatedUser = await useDrizzle()
    .update(tables.users)
    .set({
      email: result.data.user.email,
    })
    .where(eq(tables.users.id, updatedTechnician.userId))
    .returning({
      id: tables.users.id,
      email: tables.users.email,
    })
    .get();

  if (!updatedUser)
    throw createError({
      statusCode: 400,
      statusMessage: 'The technician could not be updated',
    });

  await replaceUserSession(event, {
    user: {
      id: updatedUser.id,
      email: updatedUser.email,
      technician: updatedTechnician ? {id: updatedTechnician.id} : null,
    },
  });

  return sendNoContent(event);
});
