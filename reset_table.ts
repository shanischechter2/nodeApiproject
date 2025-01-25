import { knexSecond } from "./database"; 

async function resetTable() {
  try {

    await knexSecond.schema.dropTableIfExists("array");

    await knexSecond.schema.createTable("array", (table) => {
      table.uuid("id").primary(); 
      table.string("value").notNullable(); 
      table.integer("index").unique().notNullable(); 
      table.timestamps(true, true);
    });

    console.log("Table 'array' has been dropped and recreated successfully.");
  } catch (error:any) {
    console.error("Error resetting the table:", error.message);
  } finally {
    knexSecond.destroy();
  }
}

resetTable();
