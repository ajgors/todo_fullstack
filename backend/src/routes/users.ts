import { type Request, type Response, Router } from 'express';
import { checkSchema, matchedData, validationResult } from 'express-validator';
import passport from 'passport';
import { dbPool } from '../db.js';
import { hashPassword } from '../uitls/passwordEncryption.js';
import { userSchema } from '../validationSchemas/userSchema.js';
import '../strategies/local-strategy.js';
import { isLoggedIn } from '../uitls/middlewares.js';
import type { ErrorType, PostUser, User } from '../types.js';

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

    const data = matchedData<PostUser>(req);

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

router.get('/users', isLoggedIn, (req: Request, res: Response) => {
    res.status(200).json(req.user);
});

router.post('/logout', isLoggedIn, (req, res, next) => {
    res.clearCookie('connect.sid');
    req.logout(err => {
        if (err) {
            return next(err);
        }
        req.session.destroy(err => {
            // destroys the session
            res.send();
        });
    });
});

export default router;
