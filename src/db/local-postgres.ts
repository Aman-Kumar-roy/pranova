import { PGlite } from '@electric-sql/pglite';
import { PGLiteSocketServer } from '@electric-sql/pglite-socket';
import net from 'net';
import path from 'path';

let localPgServer: PGLiteSocketServer | null = null;
let localPgDb: PGlite | null = null;

// Prevent socket client abrupt disconnects from terminating process
process.on('uncaughtException', (err: any) => {
  if (err && err.code === 'ECONNRESET') {
    return;
  }
  console.error('[LOCAL_POSTGRES_UNCAUGHT]', err);
});

const isPortListening = (port: number, host = '127.0.0.1'): Promise<boolean> => {
  return new Promise((resolve) => {
    const socket = new net.Socket();
    socket.setTimeout(1000);
    socket.on('connect', () => {
      socket.destroy();
      resolve(true);
    });
    socket.on('timeout', () => {
      socket.destroy();
      resolve(false);
    });
    socket.on('error', () => {
      resolve(false);
    });
    socket.connect(port, host);
  });
};

export const ensureLocalPostgres = async (port = 5432) => {
  const alreadyRunning = await isPortListening(port);
  if (alreadyRunning) {
    console.log(`[POSTGRES] Active PostgreSQL instance connected on 127.0.0.1:${port}`);
    return;
  }

  const dataDir = path.resolve(process.cwd(), '.pgdata');
  console.log(`[POSTGRES] Starting local embedded PostgreSQL server in ${dataDir}...`);
  localPgDb = await PGlite.create(dataDir);
  localPgServer = new PGLiteSocketServer({
    db: localPgDb,
    port,
    host: '127.0.0.1',
  });

  await localPgServer.start();
  console.log(`[POSTGRES] Embedded PostgreSQL server online at 127.0.0.1:${port}`);
};

export const stopLocalPostgres = async () => {
  if (localPgServer) {
    try {
      await localPgServer.stop();
    } catch {
      // ignore on exit
    }
    localPgServer = null;
  }
  if (localPgDb) {
    try {
      await localPgDb.close();
    } catch {
      // ignore on exit
    }
    localPgDb = null;
  }
};
