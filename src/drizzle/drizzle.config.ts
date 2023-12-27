import type { Config } from "drizzle-kit";
import { env_get } from "../utils.js";

export default {
  schema: "./schema/*",
  out: "./drizzle",
  driver: 'pg',
  dbCredentials: {
    connectionString: env_get("DATABASE_URL") ?? " ", //todo make better default so esLint does not complain 
  }
} satisfies Config;