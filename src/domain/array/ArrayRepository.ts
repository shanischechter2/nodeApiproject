import { knexSecond } from '../../infrastructure/database/database';
import { v4 as uuidv4 } from 'uuid';

export class ArrayRepository {
  static async getArray() {
    try {
  
      const rows = await knexSecond('array').select('*');
      return rows;
    } catch (error: any) {

      throw new Error('Failed to fetch array data');
    }
  }

  static async addtoarray(value: string) {
    try {
      const id = uuidv4();
      const result = await knexSecond('array').max('index as maxIndex').first();
  
  
      const maxIndex = result?.maxIndex;
      const index = maxIndex !== null ? maxIndex + 1 : 0;
      await knexSecond('array').insert({ id, value, index });
  
      return { id, value, index };
    } catch (error: any) {

      throw new Error('Failed to add value to array');
    }
  }
   static async getArraybyindex(index: string) {
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
  static async deletlestarrayindex() {
    try {
      const id = uuidv4();
      const result = await knexSecond('array').max('index as maxIndex').first();
  
      const maxIndex = result?.maxIndex;
      const index = maxIndex !== null ? maxIndex : 0;
      await knexSecond('array').where('index', index).delete();
  
      return { id, index };
    } catch (error: any) {
    
      throw new Error('Failed to delete value to array');
    }
  }
  static async updateValueAtIndex(value: string, index: string) {
    try {
      const existingRow = await knexSecond('array').where('index', index).first();
      if (!existingRow) {
        throw new Error(`No row found for index: ${index}`);
      }
  
      await knexSecond('array').where('index', index).update({ value });
  
      return { message: `Value at index ${index} updated successfully`, value, index };
    } catch (error: any) {

      throw new Error('Failed to update value at index');
    }
  }
  
  

}
