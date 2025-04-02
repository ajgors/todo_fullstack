import express from 'express';
import 'dotenv/config';
import routers from './routes/index';
import { setupDB, db } from './db';

const app = express();
app.use(express.json());

setupDB();

app.use('/api/v1', routers);

app.use('/api/v1/status', (req, res) => {
    if (db) {
        console.log(db);
        res.status(200).send({ msg: 'db connected' });
    }
});

const config = {
    PORT: process.env.PORT,
};

app.listen(config.PORT, () => {
    console.log(`Server is running on port ${config.PORT}`);
});
