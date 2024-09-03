const express = require("express");
const { Todo } = require("../mongo");
const router = express.Router();

const findByIdMiddleware = async (req, res, next) => {
  const { id } = req.params;
  try {
    req.todo = await Todo.findById(id);

    if (!req.todo) {
      return res.sendStatus(404);
    }
    next();
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

/* GET todos listing. */
router.get("/", async (_, res) => {
  const todos = await Todo.find({});
  res.send(todos);
});

/* POST todo to listing. */
router.post("/", async (req, res) => {
  const todo = await Todo.create({
    text: req.body.text,
    done: false,
  });
  res.send(todo);
});

/* GET todo. */
router.get("/:id", findByIdMiddleware, async (req, res) => {
  if (!req.todo) {
    return res.status(404).json({ message: "Todo not found" });
  }

  res.json(req.todo);
});

/* DELETE todo. */
router.delete("/", async (req, res) => {
  await req.todo.delete();
  res.sendStatus(200);
});

/* PUT todo. */
router.put("/:id", findByIdMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    if (String(id) !== String(req.todo.id)) {
      return res.status(403).json({ message: "Not autorized" });
    }

    // Actualizar el todo
    const updatedTodo = await Todo.findByIdAndUpdate(id, updateData, {
      new: true,
    });

    if (!updatedTodo) {
      return res.status(404).json({
        message: "Todo not find",
      });
    }

    res.json(updatedTodo);
  } catch (error) {
    console.error("Error to update todo:", error);
    res.status(500).json({ error: "Error to update todo" });
  }
});

module.exports = router;
