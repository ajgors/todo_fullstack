import { Router } from 'express';
import todos from './todos.js';
import users from './users.js';

const router = Router();
router.use(todos);
router.use(users);

export default router;
