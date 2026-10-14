import http from 'http';
// Load environment variables and Bagisto-style database configuration
import './config/env.config.js';

import app from './app.js';
import { prisma } from './utils/prisma.js';
import { initSocketIO } from './socket/index.js';
import { ensureLocalPostgres, stopLocalPostgres } from './db/local-postgres.js';

const PORT = process.env.PORT || 5000;
const server = http.createServer(app);

// Initialize Socket.io Real-Time Alert Engine
const io = initSocketIO(server);

// Graceful Shutdown Handler
const gracefulShutdown = async (signal: string) => {
  console.log(`\n[PRANOVA] Received ${signal}. Initiating graceful shutdown...`);

  server.close(async () => {
    console.log('[PRANOVA] HTTP & Socket.io server closed.');
    try {
      await prisma.$disconnect();
      await stopLocalPostgres();
      console.log('[PRANOVA] Database connections closed successfully.');
      process.exit(0);
    } catch (error) {
      console.error('[PRANOVA] Error during database disconnection:', error);
      process.exit(1);
    }
  });

  // Force close after 10 seconds if shutdown hangs
  setTimeout(() => {
    console.error('[PRANOVA] Forced shutdown timeout exceeded. Exiting immediately.');
    process.exit(1);
  }, 10000);
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

process.on('unhandledRejection', (reason: unknown) => {
  console.error('[PRANOVA_FATAL] Unhandled Promise Rejection:', reason);
});

process.on('uncaughtException', (error: Error) => {
  console.error('[PRANOVA_FATAL] Uncaught Exception:', error);
  process.exit(1);
});

async function startServer() {
  try {
    // 1. Ensure local embedded PostgreSQL wire-protocol server is active
    await ensureLocalPostgres();

    // 2. Start HTTP & WebSocket server
    server.listen(PORT, () => {
      console.log(`====================================================`);
      console.log(`  PRANOVA Healthcare Coordination API Engine        `);
      console.log(`  Mode: ${process.env.NODE_ENV || 'development'}    `);
      console.log(`  Server running at: http://localhost:${PORT}       `);
      console.log(`  Healthcheck:       http://localhost:${PORT}/health`);
      console.log(`  Interactive API:   http://localhost:${PORT}/api-docs`);
      console.log(`  Socket.io Stream:  Online (Emergency alerts ready)`);
      console.log(`====================================================`);
    });
  } catch (error) {
    console.error('[PRANOVA_FATAL] Failed to start server:', error);
    process.exit(1);
  }
}

startServer();

export { server, io };
