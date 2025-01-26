import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('array', (table) => {
    table.uuid('id').primary();
    table.string('value').notNullable();
    table.integer('index').unique().notNullable();

    table.timestamps(true, true);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('array');
}

