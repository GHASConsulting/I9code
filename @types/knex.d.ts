// definição de tipos

//eslint-disable-next-line
import { Knex } from "knex";

declare module "knex/types/tables" {
  export interface Tables {
    transactions: {
      id: string;
      crated_at: string;
      session_id: string;
      message_id: string;
    };
  }
}
