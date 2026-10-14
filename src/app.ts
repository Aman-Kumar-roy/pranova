import fs from 'fs';
import path from 'path';
import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import swaggerUi from 'swagger-ui-express';
import { errorHandler } from './middlewares/errorHandler.js';
import { ApiError } from './utils/apiError.js';
import { ApiResponse } from './utils/apiResponse.js';
import apiRoutes from './routes/index.js';

const app: Application = express();

// Security Middlewares (contentSecurityPolicy disabled to permit Swagger UI interactive client)
app.use(helmet({ contentSecurityPolicy: false }));

// Cookie parsing
app.use(cookieParser());

// CORS configuration supporting web and mobile environments
const allowedOrigins = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(',').map((o) => o.trim())
  : ['http://localhost:5173', 'http://localhost:3000'];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (e.g. mobile apps, curl, server-to-server)
      if (!origin || allowedOrigins.includes(origin) || allowedOrigins.includes('*')) {
        return callback(null, true);
      }
      return callback(new ApiError(403, `CORS blocked for origin: ${origin}`));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  })
);

// Logging
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan(process.env.NODE_ENV === 'development' ? 'dev' : 'combined'));
}

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Swagger / OpenAPI Interactive Documentation (Loaded dynamically from dedicated swagger/ folder)
const swaggerJsonPath = path.resolve(process.cwd(), 'swagger', 'swagger.json');

app.use('/api-docs', swaggerUi.serve, (req: Request, res: Response, next: NextFunction) => {
  if (fs.existsSync(swaggerJsonPath)) {
    try {
      const rawSwagger = fs.readFileSync(swaggerJsonPath, 'utf-8');
      const swaggerDoc = JSON.parse(rawSwagger);
      return swaggerUi.setup(swaggerDoc, {
        customSiteTitle: 'PRANOVA Healthcare API Explorer',
        swaggerOptions: {
          persistAuthorization: true,
          displayRequestDuration: true,
          docExpansion: 'list',
          filter: true,
        },
      })(req, res, next);
    } catch (err) {
      next(err);
    }
  } else {
    return res.status(200).json({
      success: true,
      message: 'PRANOVA Healthcare Coordination API Engine is running.',
      documentation: 'Swagger documentation is kept in an uncommitted/local folder for open-source compliance.',
      instruction: "Run 'npm run generate:swagger' locally to generate and enable interactive API documentation.",
    });
  }
});

// OpenAPI JSON Schema specification endpoint
app.get('/api-docs.json', (_req: Request, res: Response) => {
  if (fs.existsSync(swaggerJsonPath)) {
    const rawSwagger = fs.readFileSync(swaggerJsonPath, 'utf-8');
    res.setHeader('Content-Type', 'application/json');
    return res.send(rawSwagger);
  }
  return res.status(404).json({
    success: false,
    message: 'swagger.json not found. Run npm run generate:swagger.',
  });
});

// Health Check Endpoints
app.get('/health', (_req: Request, res: Response) => {
  return ApiResponse.success(res, 'PRANOVA API Engine is healthy', {
    status: 'ONLINE',
    service: 'pranova-backend',
    version: '1.0.0',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

app.get('/api/v1/health', (_req: Request, res: Response) => {
  return ApiResponse.success(res, 'PRANOVA API Engine v1 is healthy', {
    status: 'ONLINE',
    service: 'pranova-backend-v1',
    timestamp: new Date().toISOString(),
  });
});

// API Routes Mount Point (v1)
app.use('/api/v1', apiRoutes);

// Handle 404 for undefined routes
app.use((req: Request, _res: Response, next: NextFunction) => {
  next(ApiError.notFound(`Route not found: [${req.method}] ${req.originalUrl}`));
});

// Global Error Handler
app.use(errorHandler);

export default app;
