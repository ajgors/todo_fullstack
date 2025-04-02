import pg from "pg";
const { Client } = pg;

export let db: pg.Client | undefined;

export async function setupDB() {
  const client = new Client({
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    host: process.env.POSTGRES_HOST ?? "localhost",
    database: process.env.POSTGRES_DB,
    port: 5432,
  });

  client.on("error", (err) => {
    console.log(`PostgreSQL error ${err}`);
  });

  await client.connect();
  db = client;
}
