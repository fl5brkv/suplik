import {loginSchema} from '~~/server/database/schema';

export default eventHandler(async (event) => {
  const result = await readValidatedBody(event, (body) =>
    loginSchema.safeParse(body)
  );

  if (!result.success)
    throw createError({
      statusCode: 400,
      statusMessage: 'The provided data is invalid',
    });

  const {email, password} = result.data;

  const selected = await useDrizzle()
    .select({
      id: tables.users.id,
      email: tables.users.email,
      password: tables.users.password,
      technician: {
        id: tables.technicians.id,
      },
    })
    .from(tables.users)
    .leftJoin(
      tables.technicians,
      eq(tables.users.id, tables.technicians.userId)
    )
    .where(eq(tables.users.email, email))
    .get();

  if (!selected || !(await verifyPassword(selected.password, password)))
    throw createError({
      statusCode: 401,
      statusMessage: 'Incorrect email or password.',
    });

  await replaceUserSession(event, {
    user: {
      id: selected.id,
      email: selected.email,
      technician: selected.technician ? {id: selected.technician.id} : null,
    },
  });

  return sendNoContent(event);
});
