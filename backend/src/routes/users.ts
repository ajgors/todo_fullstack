import { Request, Response, Router } from 'express';
import { checkSchema, matchedData, validationResult } from 'express-validator';
import passport from 'passport';
import { dbPool } from 'src/db';
import { hashPassword } from 'src/uitls/passwordEncryption';
import { userSchema } from 'src/validationSchemas/userSchema';
import '../strategies/local-strategy';

const router = Router();

router.post('/register', checkSchema(userSchema), async (req: Request, res: Response) => {
    if (!dbPool) {
        res.status(500).send('Database not reachable');
        return;
    }

    //validation
    const valResult = validationResult(req);

    if (!valResult.isEmpty()) {
        res.status(400).json({ errors: valResult.array() });
        return;
    }

    const data = matchedData<UserWithoutId>(req);

    //check if user with this username exists in db
    const result = await dbPool.query<User>('SELECT * FROM users WHERE username = $1', [data.username]);
    const user = result.rows[0];
    if (user) {
        const err: ErrorType = {
            msg: 'Username already exists',
            value: data.username,
            path: 'username',
        };

        res.status(409).json({ errors: [err] });
        return;
    }

    //save user
    const hashedPassword = await hashPassword(data.password);
    const newUser = await dbPool.query<User>('INSERT INTO users(username, password) VALUES($1, $2) RETURNING *', [
        data.username,
        hashedPassword,
    ]);

    res.status(201).json({ user: newUser.rows[0] });
    return;
});

router.post('/login', passport.authenticate('local'), (req: Request, res: Response) => {
    res.sendStatus(200);
    return;
});

export default router;
