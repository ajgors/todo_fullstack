import express from 'express';
import 'dotenv/config';
import routers from './routes/index.js';
import { setupDBClient, dbClient, setupDBPool, dbPool } from './db.js';
import session from 'express-session';
import connectPgSimple from 'connect-pg-simple';
import passport from 'passport';

declare global {
    namespace Express {
        interface User {
            id: string;
            username: string;
            password: string;
        }
    }
}

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

//init passport.js
app.use(passport.initialize());
app.use(passport.session()); //attaching dynamic user prop to req obj

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
