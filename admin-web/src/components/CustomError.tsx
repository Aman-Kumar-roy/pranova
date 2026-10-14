import React from 'react';
import { Box, Card, CardContent, Typography, Button, Paper } from '@mui/material';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import HomeIcon from '@mui/icons-material/Home';
import RefreshIcon from '@mui/icons-material/Refresh';

interface CustomErrorProps {
  error?: Error;
  errorInfo?: React.ErrorInfo;
  resetErrorBoundary?: (...args: any[]) => void;
}

export const CustomError: React.FC<CustomErrorProps> = ({
  error,
  errorInfo,
  resetErrorBoundary,
}) => {
  const errorMessage = error?.message || 'An unexpected client-side error occurred.';
  const componentStack = errorInfo?.componentStack || error?.stack || '';

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '80vh',
        p: 3,
      }}
    >
      <Card
        sx={{
          maxWidth: 720,
          width: '100%',
          borderRadius: 3,
          border: '1px solid #fecaca',
          boxShadow: '0 10px 25px -5px rgba(220, 38, 38, 0.1)',
        }}
      >
        <CardContent sx={{ p: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
            <Box
              sx={{
                width: 44,
                height: 44,
                borderRadius: '50%',
                bgcolor: 'rgba(220, 38, 38, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#dc2626',
              }}
            >
              <WarningAmberIcon sx={{ fontSize: 26 }} />
            </Box>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 800, color: '#0f172a' }}>
                Application State Interruption
              </Typography>
              <Typography variant="body2" sx={{ color: '#64748b' }}>
                The console caught an uncaught rendering exception.
              </Typography>
            </Box>
          </Box>

          <Paper
            variant="outlined"
            sx={{
              p: 2,
              mb: 3,
              bgcolor: '#f8fafc',
              borderColor: '#e2e8f0',
              borderRadius: 2,
              fontFamily: 'monospace',
              fontSize: '0.82rem',
              color: '#dc2626',
            }}
          >
            {errorMessage}
          </Paper>

          {componentStack && (
            <Box
              component="pre"
              sx={{
                p: 2,
                mb: 3,
                maxHeight: 180,
                overflowY: 'auto',
                bgcolor: '#0f172a',
                color: '#94a3b8',
                borderRadius: 2,
                fontSize: '0.72rem',
                fontFamily: 'monospace',
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word',
              }}
            >
              {componentStack}
            </Box>
          )}

          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
            <Button
              variant="outlined"
              startIcon={<RefreshIcon />}
              onClick={() => {
                if (resetErrorBoundary) resetErrorBoundary();
                else window.location.reload();
              }}
              sx={{ textTransform: 'none', fontWeight: 600 }}
            >
              Retry View
            </Button>
            <Button
              variant="contained"
              startIcon={<HomeIcon />}
              onClick={() => {
                window.location.hash = '#/';
                window.location.reload();
              }}
              sx={{
                textTransform: 'none',
                fontWeight: 700,
                bgcolor: '#0284c7',
                '&:hover': { bgcolor: '#0369a1' },
              }}
            >
              Return to Command Center
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default CustomError;
