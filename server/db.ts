import { Pool, PoolConfig } from "pg";
import "dotenv/config";

const poolConfig: PoolConfig = {
  user: process.env.DB_USER as string,
  password: process.env.DB_PASSWORD as string,
  host: process.env.DB_HOST as string,
  port: parseInt(process.env.DB_PORT || "5432", 10),
  database: process.env.DB_NAME as string,
  max: 5,
};

const pool: Pool = new Pool(poolConfig);

export default pool;
