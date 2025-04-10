import { Router, type Request, type Response } from 'express';
import { dbPool } from '../db.js';
import { checkSchema, matchedData, validationResult } from 'express-validator';
import { todoSchema } from '../validationSchemas/todoSchema.js';
import { idSchema } from '../validationSchemas/idSchema.js';
import { isLoggedIn } from '../uitls/middlewares.js';
import type { Todo, PostTodo, User } from '../types.js';

const router = Router();

router.get('/todos', isLoggedIn, async (req, res) => {
    if (!dbPool) {
        res.status(500).send('Database not reachable');
        return;
    }
    //get loged in user todos
    const result = await dbPool.query<Todo>('SELECT * FROM todos WHERE user_id = $1', [req.user?.id]);
    res.status(200).send({ todos: result?.rows });
});

router.post('/todos', isLoggedIn, checkSchema(todoSchema), async (req: Request, res: Response) => {
    if (!dbPool) {
        res.status(500).send('Database not reachable');
        return;
    }

    //validation of body
    const valResult = validationResult(req);
    if (!valResult.isEmpty()) {
        res.status(400).json({ errors: valResult.array() });
        return;
    }

    const data = matchedData<PostTodo>(req);

    try {
        //check if use with user_id exists
        const user = await dbPool.query<User>('SELECT * FROM users WHERE id = $1', [req.user?.id]);
        if (!user) {
            res.status(400).send('User with this UUID does not exist');
            return;
        }

        //save todo to db
        const result = await dbPool.query<Todo>(
            'INSERT INTO todos(user_id, title, context, checked) VALUES($1, $2, $3, $4) RETURNING *',
            [req.user?.id, data.title, data.context, data.checked],
        );
        res.json(result.rows[0]);
    } catch (error) {
        res.status(500).send(`Server error ${error}`);
    }
});

router.delete('/todos/:id', isLoggedIn, checkSchema(idSchema), async (req: Request, res: Response) => {
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
    const data = matchedData<{ id: string }>(req);

    try {
        await dbPool.query<Todo>('DELETE FROM todos where id = $1 and user_id = $2', [data.id, req.user?.id]);
        res.sendStatus(204);
    } catch (error) {
        res.status(500).send(`Server error ${error}`);
    }
});

export default router;
