import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTable("users", (t) => {
        t.increments("id").primary();
        t.string("email").notNullable().unique();
    });

    await knex.schema.createTable("google_accounts", (t) => {
        t.increments("id").primary();
        t.integer("user_id").unsigned().notNullable().unique();
        t.string("access_token").notNullable();
        t.string("refresh_token").notNullable();
        t.bigInteger("expiry_date").notNullable();
        t.foreign("user_id").references("id").inTable("users").onDelete("CASCADE");
    });
}

export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTableIfExists("google_accounts");
    await knex.schema.dropTableIfExists("users");
}
