import React, { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { useNotify, useRefresh } from 'react-admin';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Chip,
  Card,
  CardContent,
  Grid,
} from '@mui/material';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import { playEmergencyChime } from '../utils/sound.js';

interface EmergencyData {
  caseId: string;
  caseNumber: string;
  priority: string;
  status: string;
  title: string;
  description: string;
  patientId: string;
  patientName: string;
  patientPhone: string;
  patientBloodGroup?: string;
  incidentAddress?: string;
  incidentLatitude?: number;
  incidentLongitude?: number;
  timestamp: string;
}

export const EmergencyAlertListener: React.FC = () => {
  const notify = useNotify();
  const refresh = useRefresh();
  const [activeEmergency, setActiveEmergency] = useState<EmergencyData | null>(null);

  useEffect(() => {
    // Request browser notification permissions if not granted
    if (typeof window !== 'undefined' && 'Notification' in window) {
      if (Notification.permission === 'default') {
        Notification.requestPermission();
      }
    }

    const socketUrl = 'http://localhost:5000';
    const socket: Socket = io(socketUrl, {
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: 20,
      reconnectionDelay: 2000,
    });

    socket.on('connect', () => {
      console.log('[SOCKET] Connected to PRANOVA Real-Time Gateway:', socket.id);
      socket.emit('admin:join');
    });

    socket.on('admin:new_emergency', (data: EmergencyData) => {
      console.log('🚨 [REALTIME] NEW EMERGENCY ALERT RECEIVED:', data);

      // 1. Play Emergency Audio Chime
      playEmergencyChime();

      // 2. Open High-Priority Modal
      setActiveEmergency(data);

      // 3. React-Admin UI Toast
      notify(`🚨 P1 EMERGENCY: ${data.caseNumber} - ${data.patientName}`, {
        type: 'warning',
        autoHideDuration: 15000,
      });

      // 4. Automatically refresh React-Admin cases list
      refresh();

      // 5. Trigger Native Desktop HTML5 Notification
      if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
        try {
          new Notification(`🚨 PRANOVA EMERGENCY: ${data.caseNumber}`, {
            body: `${data.patientName} triggered SOS at ${data.incidentAddress || 'GPS Location'}`,
            icon: '/favicon.ico',
          });
        } catch (e) {
          // Ignore notification restriction errors
        }
      }
    });

    return () => {
      socket.disconnect();
    };
  }, [notify, refresh]);

  if (!activeEmergency) return null;

  return (
    <Dialog
      open={Boolean(activeEmergency)}
      onClose={() => setActiveEmergency(null)}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        className: 'pulse-emergency',
        sx: {
          border: '2px solid #ef4444',
          borderRadius: 3,
          boxShadow: '0 25px 50px -12px rgba(239, 68, 68, 0.4)',
        },
      }}
    >
      <DialogTitle
        sx={{
          bgcolor: '#ef4444',
          color: '#ffffff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          py: 2,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <WarningAmberIcon sx={{ fontSize: 28, animation: 'pulse 1s infinite' }} />
          <Typography variant="h6" sx={{ fontWeight: 800, letterSpacing: '0.02em' }}>
            CRITICAL P1 EMERGENCY SOS
          </Typography>
        </Box>
        <Chip
          icon={<VolumeUpIcon sx={{ color: '#ffffff !important', fontSize: 16 }} />}
          label="AUDIBLE ALERT"
          size="small"
          sx={{ bgcolor: 'rgba(0, 0, 0, 0.25)', color: '#ffffff', fontWeight: 700 }}
        />
      </DialogTitle>

      <DialogContent sx={{ pt: 3 }}>
        <Box sx={{ mb: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 800, color: '#0f172a' }}>
            {activeEmergency.caseNumber}: {activeEmergency.title}
          </Typography>
          <Typography variant="body2" sx={{ color: '#64748b', mt: 0.5 }}>
            {activeEmergency.description}
          </Typography>
        </Box>

        <Card variant="outlined" sx={{ bgcolor: '#fef2f2', borderColor: '#fecaca', mb: 2, borderRadius: 2 }}>
          <CardContent sx={{ py: 1.5 }}>
            <Grid container spacing={1.5}>
              <Grid item xs={12} sm={6}>
                <Typography variant="caption" sx={{ color: '#991b1b', fontWeight: 700 }}>
                  PATIENT NAME
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 800, color: '#0f172a' }}>
                  {activeEmergency.patientName}
                </Typography>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Typography variant="caption" sx={{ color: '#991b1b', fontWeight: 700 }}>
                  BLOOD GROUP
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 800, color: '#dc2626' }}>
                  {activeEmergency.patientBloodGroup || 'Unknown'}
                </Typography>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Typography variant="caption" sx={{ color: '#991b1b', fontWeight: 700 }}>
                  CONTACT PHONE
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 700 }}>
                  {activeEmergency.patientPhone}
                </Typography>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Typography variant="caption" sx={{ color: '#991b1b', fontWeight: 700 }}>
                  TRIGGER TIME
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  {new Date(activeEmergency.timestamp).toLocaleTimeString()}
                </Typography>
              </Grid>

              <Grid item xs={12}>
                <Typography variant="caption" sx={{ color: '#991b1b', fontWeight: 700 }}>
                  INCIDENT / PICKUP ADDRESS
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 600, color: '#334155' }}>
                  {activeEmergency.incidentAddress || 'GPS Coordinates Broadcast'}
                </Typography>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2.5 }}>
        <Button
          onClick={() => setActiveEmergency(null)}
          color="inherit"
          sx={{ fontWeight: 600 }}
        >
          Acknowledge & Dismiss
        </Button>

        <Button
          variant="contained"
          color="error"
          startIcon={<LocalHospitalIcon />}
          onClick={() => {
            const id = activeEmergency.caseId;
            setActiveEmergency(null);
            window.location.hash = `#/cases/${id}/show`;
          }}
          sx={{
            bgcolor: '#ef4444',
            fontWeight: 800,
            px: 2.5,
            boxShadow: '0 4px 12px rgba(239, 68, 68, 0.4)',
            '&:hover': { bgcolor: '#dc2626' },
          }}
        >
          Open Triage & Dispatch
        </Button>
      </DialogActions>
    </Dialog>
  );
};
