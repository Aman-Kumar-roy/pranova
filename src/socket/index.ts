import { Server as HttpServer } from 'http';
import { Server as SocketIOServer, Socket } from 'socket.io';
import { handleEmergencyEvent, EmergencySosPayload } from './emergency.handler.js';

let io: SocketIOServer | null = null;

export const initSocketIO = (httpServer: HttpServer): SocketIOServer => {
  const allowedOrigins = process.env.CORS_ORIGIN
    ? process.env.CORS_ORIGIN.split(',').map((o) => o.trim())
    : ['http://localhost:5173', 'http://localhost:3000'];

  io = new SocketIOServer(httpServer, {
    cors: {
      origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin) || allowedOrigins.includes('*')) {
          return callback(null, true);
        }
        return callback(null, true); // Allow connection in dev
      },
      methods: ['GET', 'POST'],
      credentials: true,
    },
    pingTimeout: 60000,
    pingInterval: 25000,
  });

  io.on('connection', (socket: Socket) => {
    console.log(`[SOCKET] Client connected: ${socket.id}`);

    // Join Admin Room for alerts
    socket.on('admin:join', () => {
      socket.join('admin_room');
      console.log(`[SOCKET] Socket ${socket.id} joined 'admin_room'`);
      socket.emit('admin:joined', { message: 'Connected to Emergency Alert Stream' });
    });

    // Listen for Emergency SOS event
    socket.on('emergency:sos', async (payload: EmergencySosPayload, callback?: (res: { success: boolean; data?: unknown; message?: string }) => void) => {
      try {
        console.log(`[SOCKET] Received emergency:sos from socket ${socket.id}:`, payload);
        const result = await handleEmergencyEvent(io!, socket, payload);
        if (typeof callback === 'function') {
          callback({ success: true, data: result });
        }
      } catch (error) {
        const msg = error instanceof Error ? error.message : 'Failed to process emergency SOS';
        console.error(`[SOCKET] Error handling emergency:sos:`, error);
        if (typeof callback === 'function') {
          callback({ success: false, message: msg });
        }
      }
    });

    socket.on('disconnect', (reason) => {
      console.log(`[SOCKET] Client disconnected: ${socket.id} (Reason: ${reason})`);
    });
  });

  return io;
};

export const getIO = (): SocketIOServer => {
  if (!io) {
    throw new Error('Socket.io has not been initialized yet. Call initSocketIO first.');
  }
  return io;
};
