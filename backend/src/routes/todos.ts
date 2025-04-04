import { Router, Request, Response } from 'express';
import { dbPool } from 'src/db';
import { checkSchema, matchedData, validationResult } from 'express-validator';
import { todoSchema } from 'src/validationSchemas/todoSchema';
import { idSchema } from 'src/validationSchemas/idSchema';
import { isLoggedIn } from 'src/uitls/middlewares';

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
