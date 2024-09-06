import express from "express";
import { render } from "./src/entry-server.jsx";

const app = express();
const PORT = 3000;

app.use(express.static("./dist/client"));

app.get("*", async (req, res) => {
  const html = await render();
  res.status(200).send(html);
});

app.listen(PORT, () => {
  console.log(`Server is running on url: http://localhost:${PORT}`);
});
