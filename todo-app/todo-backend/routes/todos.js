const express = require("express");
const { Todo } = require("../mongo");
const { decrementPendingTasks, incrementPendingTasks } = require("../util/counter");
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
  try {
    const todo = await Todo.create({
      text: req.body.text,
      done: false,
    });

    const newCount = await incrementPendingTasks([todo]);

    res.json({ 
      todo: todo.toJSON(), 
      added_todos: newCount 
    });
  } catch (error) {
    console.error("Error to create todo:", error);
    res.status(500).json({ error: "Error to create todo" });
  }
});

/* GET todo. */
router.get("/:id", findByIdMiddleware, async (req, res) => {
  if (!req.todo) {
    return res.status(404).json({ message: "Todo not found" });
  }

  res.json(req.todo);
});

/* DELETE todo. */
router.delete("/:id", async (req, res) => {
  try {
    const todo = await Todo.findByIdAndDelete(req.params.id)
    if (!todo) {
      return res.status(404).json({ message: "Todo not found" });
    }
    // Devolver el todo eliminado

    const newCount = await decrementPendingTasks(req.params.id);

    res.json({
      todo: todo.toJSON(),
      remaining_todos: newCount
    })
  } catch (error) {
    console.error("Error deleting todo:", error)
    res.status(500).json({ message: "Error to delete" });
  }
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
