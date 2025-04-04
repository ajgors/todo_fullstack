import pg from 'pg';
const { Client } = pg;

export let db: pg.Client | undefined;

export async function setupDB() {
    console.log('connecting to db');
    try {
        const client = new Client({
            user: process.env.POSTGRES_USER,
            password: process.env.POSTGRES_PASSWORD,
            host: process.env.POSTGRES_HOST ?? 'localhost',
            database: process.env.POSTGRES_DB,
            port: 5432,
        });

        client.on('error', err => {
            //triggers on db disconnection
            console.log('PostgreSQL ERROR');
            console.log(err);
            db = undefined;
            console.log('Rettrying reconnection in 1s');
            setTimeout(setupDB, 1000);
        });

        await client.connect();
        db = client;
        console.log('connected to db');
    } catch (error) {
        console.log('Error while connecting to db');
        db = undefined;
        console.log('Rettrying reconnection in 1s');
        setTimeout(setupDB, 1000);
    }
}
