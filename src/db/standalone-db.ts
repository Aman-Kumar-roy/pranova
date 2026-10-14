import { PGlite } from '@electric-sql/pglite';
import { PGLiteSocketServer } from '@electric-sql/pglite-socket';
import path from 'path';

// Ignore ECONNRESET when client sockets disconnect abruptly
process.on('uncaughtException', (err: any) => {
  if (err && err.code === 'ECONNRESET') {
    return;
  }
  console.error('[LOCAL_POSTGRES_UNCAUGHT]', err);
});

async function main() {
  const dataDir = path.resolve(process.cwd(), '.pgdata');
  console.log(`[LOCAL_POSTGRES] Initializing local embedded PostgreSQL database in: ${dataDir}`);
  
  const db = await PGlite.create(dataDir);
  const port = parseInt(process.env.PGPORT || '5432', 10);

  const server = new PGLiteSocketServer({
    db,
    port,
    host: '127.0.0.1',
  });

  await server.start();
  console.log(`====================================================`);
  console.log(`  Local Embedded PostgreSQL Server is ONLINE        `);
  console.log(`  Host: 127.0.0.1                                   `);
  console.log(`  Port: ${port}                                     `);
  console.log(`  Wire Protocol: Native PostgreSQL Compatible       `);
  console.log(`  Zero Docker - Zero Dependencies - Pure Local      `);
  console.log(`====================================================`);

  const shutdown = async () => {
    console.log('[LOCAL_POSTGRES] Stopping PostgreSQL server...');
    try {
      await server.stop();
      await db.close();
    } catch {
      // ignore
    }
    process.exit(0);
  };

  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);
}

main().catch((err) => {
  console.error('[LOCAL_POSTGRES_ERROR] Failed to start local PostgreSQL:', err);
  process.exit(1);
});
