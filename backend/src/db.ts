import pg from 'pg';
const { Client, Pool } = pg;

export let dbClient: pg.Client | undefined;
export let dbPool: pg.Pool | undefined;

const dbConfig = {
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    host: process.env.POSTGRES_HOST ?? 'localhost',
    database: process.env.POSTGRES_DB,
    port: parseInt(process.env.POSTGRES_PORT ?? '5432'),
};

export async function setupDBClient() {
    console.log('connecting to db Client');
    try {
        const client = new Client(dbConfig);

        client.on('error', err => {
            //triggers on db disconnection
            console.log('PostgreSQL ERROR');
            console.log(err);
            dbClient = undefined;
            console.log('Rettrying reconnection in 1s');
            setTimeout(setupDBClient, 1000);
        });

        await client.connect();
        dbClient = client;
        console.log('connected to db Client');
    } catch (error) {
        console.log('Error while connecting to db');
        dbClient = undefined;
        console.log('Rettrying reconnection in 1s');
        setTimeout(setupDBClient, 1000);
    }
}

export async function setupDBPool() {
    console.log('connecting to db Pool');
    try {
        const pool = new Pool(dbConfig);

        pool.on('error', err => {
            //triggers on db disconnection
            console.log('PostgreSQL ERROR');
            console.log(err);
            dbPool = undefined;
            console.log('Rettrying reconnection in 1s');
            setTimeout(setupDBClient, 1000);
        });
        dbPool = pool;
    } catch (error) {
        console.log('Error while connecting to db');
        dbPool = undefined;
        console.log('Rettrying reconnection in 1s');
        setTimeout(setupDBPool, 1000);
    }
}
