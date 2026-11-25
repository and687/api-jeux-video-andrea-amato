import { app } from "./app.js";

const port = Number(process.env.PORT || 3000);
if (!Number.isInteger(port) || port < 0 || port > 65535) {
  throw new Error("PORT doit être un entier entre 0 et 65535");
}

const server = app.listen(port, () => {
  const address = server.address();
  if (address === null || typeof address === "string") {
    return;
  }

  console.log("API : http://localhost:" + address.port + "/api/games");
  console.log("Swagger : http://localhost:" + address.port + "/api/docs");
});

server.on("error", (error) => {
  console.error("Impossible de démarrer le serveur :", error.message);
  process.exitCode = 1;
});
