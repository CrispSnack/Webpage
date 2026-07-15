/**
 * Creates an Express app wired identically to production but with an
 * in-memory session store, so tests never touch Postgres.
 *
 * All @workspace/db calls must be mocked by the test file itself via
 *   vi.mock('@workspace/db', ...)
 * before importing this helper.
 */
import express from "express";
import session from "express-session";
import router from "../../routes/index.js";

export function createTestApp() {
  const app = express();

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Built-in MemoryStore — no DB required for tests
  app.use(
    session({
      secret: "test-secret-not-for-production",
      resave: false,
      saveUninitialized: true,
      cookie: { secure: false },
    }),
  );

  app.use("/api", router);
  return app;
}
