import passport from 'passport';
import { Strategy } from 'passport-local';
import { dbPool } from 'src/db';
import bcrypt from 'bcrypt';

passport.serializeUser((user: any, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        if (!dbPool) {
            throw new Error('Database is not reachable');
        }

        const result = await dbPool.query<User>('SELECT * FROM users WHERE id = $1', [id]);
        const user = result.rows[0];
        if (!user) throw new Error('user not found');
        done(null, user);
    } catch (err) {
        done(err, null);
    }
});

export default passport.use(
    new Strategy(async (username, password, done) => {
        try {
            if (!dbPool) {
                throw new Error('Database is not reachable');
            }

            //find user with username
            const result = await dbPool.query<User>('SELECT * FROM users WHERE username = $1', [username]);
            const user = result.rows[0];

            if (!user) {
                throw new Error('User not found');
            }

            if (!(await bcrypt.compare(password, user.password))) {
                throw new Error('Bad credentials');
            }
            done(null, user);
        } catch (error) {
            console.log();
            done(error, undefined);
        }
    }),
);
