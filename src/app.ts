import { bookRoute } from "./routes/book/book.route";
import { healthRoute } from "./routes/health/health.route";
import { homeRoute } from "./routes/home/home.route";
import { ConfigManager } from "./shared/config";
import { createApp } from "./shared/fastify";

export function bootstrap() {
  const app = createApp({ logger: true });

  app.register(homeRoute);
  app.register(healthRoute);
  app.register(bookRoute);

  app.listen(
    { port: ConfigManager.get("PORT"), host: ConfigManager.get("HOST") },
    (err) => {
      if (err) {
        app.log.error(
          {
            err,
            port: ConfigManager.get("PORT"),
            host: ConfigManager.get("HOST"),
          },
          "Failed to start server",
        );
        process.exit(1);
      }
    },
  );
}
