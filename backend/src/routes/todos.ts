import { Router, type Request, type Response } from 'express';
import { dbPool } from '../db.js';
import { checkSchema, matchedData, validationResult } from 'express-validator';
import { todoSchema, todoPatchSchema } from '../validationSchemas/todoSchema.js';
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

router.patch(
    '/todos/:id',
    isLoggedIn,
    checkSchema(idSchema),
    checkSchema(todoPatchSchema),
    async (req: Request, res: Response) => {
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
        const validatedID = matchedData<{ id: string }>(req, { locations: ['params'] }).id; //validated id
        const validatedTodo = matchedData<Partial<PostTodo>>(req, { locations: ['body'] }); //validated req body

        //check if validatedTodoBody is empty
        if (Object.keys(validatedTodo).length === 0) {
            res.status(401).json('No fields were provided to patch method, aborting');
            return;
        }

        try {
            //find that todo
            const todoToUpdate = (
                await dbPool.query<Todo>('SELECT * FROM todos where id = $1 and user_id = $2', [
                    validatedID,
                    req.user?.id,
                ])
            ).rows[0];

            if (!todoToUpdate) {
                res.status(400).send('TOOD with this UUID does not exist');
                return;
            }

            //update fields
            const setClauses: string[] = [];
            const values: any[] = [];

            let i = 1;
            if (validatedTodo.checked !== undefined) {
                setClauses.push(`checked = $${i++}`);
                values.push(validatedTodo.checked);
            }

            if (validatedTodo.title !== undefined) {
                setClauses.push(`title = $${i++}`);
                values.push(validatedTodo.title);
            }

            if (validatedTodo.context !== undefined) {
                setClauses.push(`context = $${i++}`);
                values.push(validatedTodo.context);
            }
            //patch todo
            const patchedTodo = await dbPool.query<Todo>(
                `UPDATE todos SET ${setClauses.join(', ')} WHERE id = $${i++} and user_id = $${i++} RETURNING *`,
                [...values, validatedID, req.user?.id],
            );

            res.status(200).json(patchedTodo.rows[0]);
        } catch (error) {
            res.status(500).send(`Server error ${error}`);
        }
    },
);

export default router;
