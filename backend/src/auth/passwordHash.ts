import bcrypt from 'bcrypt';

const HASH_SALT = 4;

export async function getPasswordHash(password: string): Promise<string> {
  const passwordHashed = await bcrypt.hash(password, HASH_SALT);

  return passwordHashed;
}

export async function comparePassword(password: string, storedPassword: string): Promise<boolean> {
  const isPasswordCorrect = await bcrypt.compare(password, storedPassword);

  return isPasswordCorrect;
}
