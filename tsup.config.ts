import { defineConfig } from 'tsup';

export default defineConfig({
  entry: [
    'src/app.ts',
    'src/database.ts',
    'src/server.ts',
    'src/connection/database.ts',
    'src/controller/register.ts',
    'src/controller/token.ts',
    'src/middlewares/token.ts',
    'src/routes/index.ts',
    'src/services/analyse.ts',
    'src/db/migrations/20241125142334_tables.ts',
    'src/services/services_gpt/createRun.ts',
    'src/services/services_gpt/gptCreateMessage.ts',
    'src/services/services_gpt/gptMessage.ts',
    'src/services/services_gpt/gptThread.ts',
    'src/services/Service_oracle/insert.ts',
    'src/services/Service_oracle/select.ts'
  ],
  format: ['cjs', 'esm'],
  target: 'es2020',
  external: [
    'better-sqlite3',
    'pg-query-stream',
    'tedious',
    'mysql',
    'mysql2',
    'pg'
  ],
  splitting: false,
  sourcemap: true,
  clean: true,
});
