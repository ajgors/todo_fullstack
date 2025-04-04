import express from 'express';
import 'dotenv/config';
import routers from './routes/index';
import { setupDBClient, dbClient, setupDBPool, dbPool } from './db';
import session from 'express-session';
import connectPgSimple from 'connect-pg-simple';

const PGStore = connectPgSimple(session);

const app = express();
setupDBClient();
setupDBPool();
app.use(express.json());

app.use(
    session({
        secret: process.env.SESSION_SECRET!,
        saveUninitialized: false,
        resave: false,
        cookie: {
            maxAge: 1000 * 60 * 60, //hour
        },
        store: new PGStore({
            pool: dbPool,
            createTableIfMissing: true,
        }),
    }),
);

app.use('/api/v1', routers);

app.use('/api/v1/status', (req, res) => {
    if (!dbClient) {
        res.status(500).send('Database not reachable');
        return;
    }

    res.status(200).json('Database is connected');
    return;
});

const config = {
    PORT: process.env.PORT,
};

app.listen(config.PORT, () => {
    console.log(`Server is running on port ${config.PORT}`);
});
