import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {

  await knex.schema.createTable('messages', (table) => {
    table.uuid('id').primary()
    table.uuid('session_id').after('id').index()
    table.string('message_id').notNullable()
    table.timestamp('created_at').defaultTo(knex.fn.now()).notNullable()
  })
}


export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('messages')
}

