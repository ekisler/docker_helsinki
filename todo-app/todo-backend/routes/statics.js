const express = require("express");
const { getPendingTasksCount } = require("../util/counter");

const router = express.Router();

console.log("Importing counter functions...");
console.log(getPendingTasksCount); // Verifica que es una función

router.get("/", async (_, res) => {
  console.log("About to call getPendingTasksCount...");
  const count = await getPendingTasksCount();
  console.log(`Count returned: ${count}`);
  console.log(`Type of count: ${typeof count}`);
  res.json({ added_todos: count });
});

module.exports = router;
