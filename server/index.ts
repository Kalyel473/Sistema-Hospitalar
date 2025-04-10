import express, { type Request, Response, NextFunction } from "express";
import session from "express-session"; // 👈 Importar o middleware de sessão
import dotenv from "dotenv"; // 👈 Importar dotenv para variáveis de ambiente
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";

dotenv.config(); // 👈 Carregar variáveis de ambiente do .env

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// ✅ Configuração do middleware de sessão
app.use(session({
  secret: process.env.SESSION_SECRET || "meuSegredoSeguro", // 👈 Evitar hardcode em produção
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24, // 1 dia
  },
}));

// Middleware para log de requisições
app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

(async () => {
  const server = await registerRoutes(app);

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({ message });
    throw err;
  });

  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  const port = 5000;
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true,
  }, () => {
    log(`serving on port ${port}`);
  });
})();
