
import { knex, knexSecond } from './database';
import { v4 as uuidv4 } from 'uuid';
import jwt from 'jsonwebtoken';

const JWT_SECRET = 'shani';


export async function createUser(username: string, isadmin: boolean) {
  const id = uuidv4();
  await knex('users').insert({ id, username, isadmin });
  return { id, username };
}


export async function getUserByUsername(username: string) {
  return await knex('users').where({ username }).first();
}
export async function getUsers() {
  return await knex('users');
}

export async function authenticateUser(username: string) {
  const user = await getUserByUsername(username);
  if (!user) return null;


  console.log(user.isadmin);
  const token = jwt.sign({ id: user.id, username: user.username, isadmin: user.isadmin }, JWT_SECRET, {
    expiresIn: '1h',
  });

  return token;
}
export async function getArray() {
  try {

    const rows = await knexSecond('array').select('*');
    return rows;
  } catch (error: any) {
   // console.error('Error fetching array:', error.message);
    throw new Error('Failed to fetch array data');
  }
}
export async function getArraybyindex(index: string) {
  try {

    const row = await knexSecond('array').select('*').where('index', index).first();


    if (!row) {
      throw new Error(`No data found for index: ${index}`);
    }

    return row;
  } catch (error: any) {

    throw new Error('Failed to fetch array data');
  }
}


export async function addtoarray(value: string) {
  try {
    const id = uuidv4();
    const result = await knexSecond('array').max('index as maxIndex').first();


    const maxIndex = result?.maxIndex;
    const index = maxIndex !== null ? maxIndex + 1 : 0;
    await knexSecond('array').insert({ id, value, index });

    return { id, value, index };
  } catch (error: any) {
   // console.error('Error adding value to array:', error.message);
    throw new Error('Failed to add value to array');
  }
}

export async function deletlestarrayindex() {
  try {
    const id = uuidv4();
    const result = await knexSecond('array').max('index as maxIndex').first();

    const maxIndex = result?.maxIndex;
    const index = maxIndex !== null ? maxIndex : 0;
    await knexSecond('array').where('index', index).delete();

    return { id, index };
  } catch (error: any) {
   // console.error('Error adding value to array:', error.message);
    throw new Error('Failed to delete value to array');
  }
}
export async function updateValueAtIndex(value: string, index: string) {
  try {
    const existingRow = await knexSecond('array').where('index', index).first();
    if (!existingRow) {
      throw new Error(`No row found for index: ${index}`);
    }

    await knexSecond('array').where('index', index).update({ value });

    return { message: `Value at index ${index} updated successfully`, value, index };
  } catch (error: any) {
  //  console.error('Error updating value at index:', error.message);
    throw new Error('Failed to update value at index');
  }
}
export async function updatuseradmin(username: string) {
  try {

    const existingRow = getUserByUsername(username);
    if (!existingRow) {
      throw new Error(`No row found for user: ${username}`);
    }

    await knex('users').where('username', username).update({ isadmin: true });

    return { message: `updated successfully` };
  } catch (error: any) {
   // console.error('Error updating value at index:', error.message);
    throw new Error('Failed to update value at index');
  }
}