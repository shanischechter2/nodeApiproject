import { knex } from '../../infrastructure/database/database';
import { v4 as uuidv4 } from 'uuid';

export class UserRepository {
  static async createUser(username: string, isadmin: boolean) {
    const id = uuidv4();
    await knex('users').insert({ id, username, isadmin });
    return { id, username };
  }

  static async getUserByUsername(username: string) {
    return await knex('users').where({ username }).first();
  }
  static async getUsers() {
    return await knex('users');
  }
  static async updatuseradmin(username: string) {
    try {
  const existingRow = this.getUserByUsername(username);
      if (!existingRow) {
        throw new Error(`No row found for user: ${username}`);
      }
  
      await knex('users').where('username', username).update({ isadmin: true });
  
      return { message: `updated successfully` };
    } catch (error: any) {
      throw new Error('Failed to update value at index');
    }
  }
}