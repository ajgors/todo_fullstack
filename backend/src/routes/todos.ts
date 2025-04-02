import { Router } from "express";
import { db } from "src/db";

const router = Router();

router.get("/todos", async (req, res) => {
  const result = await db?.query<Todo>("SELECT * FROM todo");
  res.status(200).send({ todos: result?.rows });
});

export default router;
