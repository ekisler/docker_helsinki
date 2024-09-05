const { setAsync, getAsync } = require("../redis");
const Todo = require("../mongo/models/Todo");

async function incrementPendingTasks(tasks) {
  try {
    const currentCount = await getAsync("pending_tasks_count");
    let newCount = currentCount ? parseInt(currentCount) : 0;

    if (isNaN(newCount)) {
      console.error("Error: pending_tasks_count is not a number");
      newCount = 0;
    }

    newCount += tasks.filter((task) => !task.done).length;

    console.log(
      `Updating pending tasks count from ${currentCount} to ${newCount}`
    );
    await setAsync("pending_tasks_count", newCount.toString());
    console.log(`Value saved in Redis: ${newCount}`);

    if (tasks.some((task) => task.done)) {
      newCount -= 1;
      console.log(
        `Updating pending tasks count from ${currentCount} to ${newCount}`
      );
      await setAsync("pending_tasks_count", newCount.toString());
      console.log(`Value saved in Redis: ${newCount}`);
    }

    return newCount;
  } catch (error) {
    console.error("Error updating pending tasks count:", error);
    throw error;
  }
}

async function decrementPendingTasks(tasksId) {
  try {
    const currentCount = await getAsync("pending_tasks_count");
    let newCount = currentCount ? parseInt(currentCount) : 0;

    if (isNaN(newCount)) {
      console.error("Error: pending_tasks_count is not a number");
      newCount = 0;
    }

    const task = await Todo.findById(tasksId); // Obtener la tarea por ID
    if (task && task.done) {
      newCount -= 1; // Solo decrementa si la tarea estaba completada
    }

    // Ensure the count does not go below zero
    if (newCount < 0) {
      console.warn("Warning: pending_tasks_count cannot be negative. Resetting to 0.");
      newCount = 0;
    }

    console.log(
      `Updating pending tasks count from ${currentCount} to ${newCount}`
    );
    await setAsync("pending_tasks_count", newCount.toString());
    console.log(`Value saved in Redis: ${newCount}`);

    return newCount;
  } catch (error) {
    console.error("Error updating pending tasks count:", error);
    throw error;
  }
}

async function getPendingTasksCount() {
  let count = await getAsync("pending_tasks_count");
  console.log(`Valor actual de pending_tasks_count: ${count}`);
  return count;
}

// Export the functions

module.exports = {
  incrementPendingTasks,
  getPendingTasksCount,
  decrementPendingTasks
};
