'use server';

import * as z from 'zod';
import bcrypt from 'bcryptjs';

import { db } from '@/lib/db';

import { getUserByEmail } from '@/data/user';

import { RegisterSchema } from '@/schemas';

export const register = async (values: z.infer<typeof RegisterSchema>) => {
  const validatedFields = RegisterSchema.safeParse(values);

  if (!validatedFields) {
    return {
      error: 'Invalid fields!',
    };
  }

  const { email, password, name } = values;
  const hashPassword = await bcrypt.hash(password, 10);

  const existingUser = await getUserByEmail(email);

  if (existingUser) {
    return {
      error: 'Email already in use.',
    };
  }

  await db.user.create({
    data: {
      name,
      email,
      password: hashPassword,
    },
  });

  // TODO: Send verification token email

  return { success: 'User created!' };
};
