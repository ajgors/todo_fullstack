import { Router } from 'express';
import todos from './todos';
import users from './users';

const router = Router();
router.use(todos);
router.use(users);

export default router;
