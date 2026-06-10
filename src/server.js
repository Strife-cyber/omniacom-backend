import app from "./app.js";
import { PORT, NODE_ENV } from "./config/env.js";

app.listen(PORT, () => {
  console.log(
    `
Serveur demarre sur http://localhost:${PORT}
Environnement : ${NODE_ENV}
API : http://localhost:${PORT}/api
  `.trim(),
  );
});
