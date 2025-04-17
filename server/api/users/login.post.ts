import {loginSchema} from '~~/server/database/schema/tables/users';

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
      userId: tables.users.userId,
      role: tables.users.role,
      email: tables.users.email,
      password: tables.users.password,
    })
    .from(tables.users)
    .where(eq(tables.users.email, email))
    .get();

  if (!selected || !(await verifyPassword(selected.password, password)))
    throw createError({
      statusCode: 401,
      statusMessage: 'Incorrect email or password.',
    });

  await replaceUserSession(event, {
    user: {
      userId: selected.userId,
      role: selected.role,
      email: selected.email,
    },
  });

  return 'sfsdf';
});
