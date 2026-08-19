import { Router } from "express";
import { authenticate, requireRoles } from "../middleware/auth.js";
import { createUser, listUsers, removeUser } from "../services/authService.js";

const router = Router();

router.use(authenticate);
router.use(requireRoles("teacher", "admin"));

// GET /api/users
router.get("/", async (_req, res, next) => {
  try {
    res.json(await listUsers());
  } catch (e) {
    next(e);
  }
});

// POST /api/users
router.post("/", async (req, res, next) => {
  try {
    const user = await createUser(req.body || {});
    res.status(201).json(user);
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
});

// DELETE /api/users/:id
router.delete("/:id", async (req, res, next) => {
  try {
    await removeUser(req.params.id);
    res.status(204).end();
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
});

export default router;