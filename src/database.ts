import { knex as setupKnex, Knex } from "knex";

export const config: Knex.Config = {
  client: "sqlite",
  connection: {
    filename: "./src/db/app.db",
  },
  useNullAsDefault: true,
  migrations: {
    directory: "./src/db/migrations",
    extension: "ts",
  },
};

export const knex = setupKnex(config);
