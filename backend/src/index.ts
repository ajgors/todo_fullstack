import express from 'express';
import 'dotenv/config';
import routers from './routes/index';
import { setupDB, db } from './db';

const app = express();
app.use(express.json());

setupDB();

app.use('/api/v1', routers);

app.use('/api/v1/status', (req, res) => {
    if (!db) {
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
