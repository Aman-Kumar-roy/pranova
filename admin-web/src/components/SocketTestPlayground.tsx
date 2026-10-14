import React, { useState, useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Grid,
  Chip,
  Divider,
  Paper,
  Alert,
} from '@mui/material';
import SensorsIcon from '@mui/icons-material/Sensors';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import SendIcon from '@mui/icons-material/Send';
import DeleteSweepIcon from '@mui/icons-material/DeleteSweep';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

interface SocketLogEntry {
  id: string;
  timestamp: string;
  direction: 'OUTGOING' | 'INCOMING' | 'SYSTEM';
  event: string;
  data: any;
}

export const SocketTestPlayground: React.FC = () => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [connected, setConnected] = useState<boolean>(false);
  const [socketId, setSocketId] = useState<string>('');
  const [transport, setTransport] = useState<string>('unknown');
  const [logs, setLogs] = useState<SocketLogEntry[]>([]);

  // Simulation Form State
  const [patientPhone, setPatientPhone] = useState<string>('+919123456789');
  const [title, setTitle] = useState<string>('CRITICAL: Acute Severe Chest Pain');
  const [description, setDescription] = useState<string>('Patient collapsed at residential address. Immediate dispatch required.');
  const [address, setAddress] = useState<string>('Flat 402, Green Glen Layout, Bellandur, Bengaluru');
  const [latitude, setLatitude] = useState<number>(12.9279);
  const [longitude, setLongitude] = useState<number>(77.6748);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const logEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const s: Socket = io('http://localhost:5000', {
      transports: ['websocket', 'polling'],
      reconnection: true,
    });

    s.on('connect', () => {
      setConnected(true);
      setSocketId(s.id || '');
      setTransport(s.io.engine.transport.name);

      s.emit('admin:join');

      setLogs((prev) => [
        ...prev,
        {
          id: Math.random().toString(36).substring(2, 9),
          timestamp: new Date().toLocaleTimeString(),
          direction: 'SYSTEM',
          event: 'connect',
          data: { socketId: s.id, transport: s.io.engine.transport.name, joinedRoom: 'admin_room' },
        },
      ]);
    });

    s.on('disconnect', (reason) => {
      setConnected(false);
      setLogs((prev) => [
        ...prev,
        {
          id: Math.random().toString(36).substring(2, 9),
          timestamp: new Date().toLocaleTimeString(),
          direction: 'SYSTEM',
          event: 'disconnect',
          data: { reason },
        },
      ]);
    });

    s.on('admin:new_emergency', (data: any) => {
      setLogs((prev) => [
        ...prev,
        {
          id: Math.random().toString(36).substring(2, 9),
          timestamp: new Date().toLocaleTimeString(),
          direction: 'INCOMING',
          event: 'admin:new_emergency',
          data,
        },
      ]);
    });

    setSocket(s);

    return () => {
      s.disconnect();
    };
  }, []);

  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  const handleSendSOS = () => {
    if (!socket || !connected) return;

    setIsSubmitting(true);
    const payload = {
      patientPhone,
      title,
      description,
      incidentAddress: address,
      incidentLatitude: Number(latitude),
      incidentLongitude: Number(longitude),
    };

    const startTime = performance.now();

    setLogs((prev) => [
      ...prev,
      {
        id: Math.random().toString(36).substring(2, 9),
        timestamp: new Date().toLocaleTimeString(),
        direction: 'OUTGOING',
        event: 'emergency:sos',
        data: payload,
      },
    ]);

    socket.emit('emergency:sos', payload, (response: any) => {
      const elapsed = Math.round(performance.now() - startTime);
      setIsSubmitting(false);
      setLogs((prev) => [
        ...prev,
        {
          id: Math.random().toString(36).substring(2, 9),
          timestamp: new Date().toLocaleTimeString(),
          direction: 'INCOMING',
          event: 'emergency:sos:ack',
          data: { ...response, roundtripMs: `${elapsed}ms` },
        },
      ]);
    });
  };

  const clearLogs = () => {
    setLogs([]);
  };

  return (
    <Box sx={{ p: { xs: 2, sm: 3 }, maxWidth: 1400, mx: 'auto' }}>
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
          <Typography variant="h5" sx={{ fontWeight: 800, color: '#0f172a' }}>
            Real-Time Socket Gateway Playground
          </Typography>
          <Chip
            icon={connected ? <CheckCircleOutlineIcon sx={{ fontSize: 16 }} /> : <ErrorOutlineIcon sx={{ fontSize: 16 }} />}
            label={connected ? `CONNECTED (${transport.toUpperCase()})` : 'DISCONNECTED'}
            size="small"
            sx={{
              bgcolor: connected ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
              color: connected ? '#059669' : '#dc2626',
              fontWeight: 800,
              fontSize: '0.72rem',
            }}
          />
        </Box>
        <Typography variant="body2" sx={{ color: '#64748b' }}>
          Interactive clinical test bench to simulate mobile client SOS broadcasts, verify real-time latency, and inspect WebSocket telemetry payloads.
        </Typography>
      </Box>

      {/* Connection Metadata Banner */}
      <Card sx={{ mb: 3, bgcolor: '#0b1120', color: '#f8fafc', borderRadius: 2 }}>
        <CardContent sx={{ py: 1.5 }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={3}>
              <Typography variant="caption" sx={{ color: '#64748b', display: 'block' }}>
                GATEWAY ENDPOINT
              </Typography>
              <Typography variant="body2" sx={{ fontFamily: 'monospace', fontWeight: 600, color: '#38bdf8' }}>
                ws://localhost:5000
              </Typography>
            </Grid>
            <Grid item xs={12} sm={3}>
              <Typography variant="caption" sx={{ color: '#64748b', display: 'block' }}>
                ACTIVE ROOM
              </Typography>
              <Typography variant="body2" sx={{ fontFamily: 'monospace', fontWeight: 600, color: '#10b981' }}>
                admin_room
              </Typography>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Typography variant="caption" sx={{ color: '#64748b', display: 'block' }}>
                SOCKET CLIENT ID
              </Typography>
              <Typography variant="body2" sx={{ fontFamily: 'monospace', fontWeight: 600, color: '#e2e8f0' }}>
                {socketId || 'Pending handshake...'}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={2} sx={{ textAlign: 'right' }}>
              <Button
                size="small"
                variant="outlined"
                startIcon={<DeleteSweepIcon />}
                onClick={clearLogs}
                sx={{ color: '#94a3b8', borderColor: '#334155', textTransform: 'none' }}
              >
                Clear Log
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      <Grid container spacing={3}>
        {/* SOS Dispatch Simulator Panel */}
        <Grid item xs={12} md={5}>
          <Card sx={{ borderRadius: 3, border: '1px solid #e2e8f0' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <WarningAmberIcon sx={{ color: '#dc2626' }} />
                <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#0f172a' }}>
                  Simulate Patient Mobile SOS
                </Typography>
              </Box>

              <Alert severity="info" sx={{ mb: 2.5, fontSize: '0.8rem' }}>
                Emits an <code>emergency:sos</code> payload identical to the native Flutter patient application.
              </Alert>

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <TextField
                  label="Registered Patient Phone"
                  value={patientPhone}
                  onChange={(e) => setPatientPhone(e.target.value)}
                  fullWidth
                  size="small"
                  helperText="Matches seeded patient +919123456789"
                />

                <TextField
                  label="Alert Headline"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  fullWidth
                  size="small"
                />

                <TextField
                  label="Clinical Emergency Notes"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  fullWidth
                  multiline
                  rows={2}
                  size="small"
                />

                <TextField
                  label="Incident Pickup Address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  fullWidth
                  size="small"
                />

                <Grid container spacing={1.5}>
                  <Grid item xs={6}>
                    <TextField
                      label="Latitude"
                      type="number"
                      value={latitude}
                      onChange={(e) => setLatitude(Number(e.target.value))}
                      fullWidth
                      size="small"
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      label="Longitude"
                      type="number"
                      value={longitude}
                      onChange={(e) => setLongitude(Number(e.target.value))}
                      fullWidth
                      size="small"
                    />
                  </Grid>
                </Grid>

                <Button
                  variant="contained"
                  color="error"
                  size="large"
                  disabled={!connected || isSubmitting}
                  onClick={handleSendSOS}
                  startIcon={<SendIcon />}
                  sx={{
                    mt: 1,
                    py: 1.2,
                    fontWeight: 800,
                    textTransform: 'none',
                    bgcolor: '#dc2626',
                    '&:hover': { bgcolor: '#b91c1c' },
                  }}
                >
                  {isSubmitting ? 'Transmitting Alert...' : 'Broadcast Simulated Emergency SOS'}
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Live Event Stream Terminal */}
        <Grid item xs={12} md={7}>
          <Card sx={{ borderRadius: 3, bgcolor: '#0b1120', color: '#f8fafc', height: '100%', minHeight: 480 }}>
            <CardContent sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <SensorsIcon sx={{ color: '#38bdf8' }} />
                  <Typography variant="subtitle2" sx={{ fontWeight: 700, letterSpacing: '0.04em' }}>
                    LIVE EVENT TELEMETRY STREAM
                  </Typography>
                </Box>
                <Typography variant="caption" sx={{ color: '#64748b', fontFamily: 'monospace' }}>
                  {logs.length} events logged
                </Typography>
              </Box>

              <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.1)', mb: 2 }} />

              <Box
                sx={{
                  flexGrow: 1,
                  maxHeight: 450,
                  overflowY: 'auto',
                  pr: 1,
                  fontFamily: 'monospace',
                  fontSize: '0.78rem',
                }}
              >
                {logs.length === 0 ? (
                  <Box sx={{ py: 8, textAlign: 'center', color: '#64748b' }}>
                    <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                      Ready. No events received yet. Broadcast an SOS alert to begin.
                    </Typography>
                  </Box>
                ) : (
                  logs.map((log) => {
                    const isIncoming = log.direction === 'INCOMING';
                    const isSystem = log.direction === 'SYSTEM';
                    return (
                      <Paper
                        key={log.id}
                        sx={{
                          mb: 1.5,
                          p: 1.5,
                          borderRadius: 1.5,
                          bgcolor: isSystem
                            ? 'rgba(30, 41, 59, 0.5)'
                            : isIncoming
                            ? 'rgba(15, 118, 110, 0.2)'
                            : 'rgba(2, 132, 199, 0.2)',
                          border: '1px solid',
                          borderColor: isSystem
                            ? 'rgba(255, 255, 255, 0.08)'
                            : isIncoming
                            ? 'rgba(20, 184, 166, 0.4)'
                            : 'rgba(56, 189, 248, 0.4)',
                        }}
                      >
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Chip
                              label={log.direction}
                              size="small"
                              sx={{
                                height: 18,
                                fontSize: '0.65rem',
                                fontWeight: 800,
                                bgcolor: isSystem ? '#475569' : isIncoming ? '#0f766e' : '#0284c7',
                                color: '#ffffff',
                              }}
                            />
                            <Typography variant="caption" sx={{ fontWeight: 700, color: '#38bdf8' }}>
                              {log.event}
                            </Typography>
                          </Box>
                          <Typography variant="caption" sx={{ color: '#94a3b8' }}>
                            {log.timestamp}
                          </Typography>
                        </Box>
                        <Box
                          component="pre"
                          sx={{
                            m: 0,
                            p: 1,
                            bgcolor: '#030712',
                            borderRadius: 1,
                            overflowX: 'auto',
                            color: '#e2e8f0',
                            fontSize: '0.72rem',
                          }}
                        >
                          {JSON.stringify(log.data, null, 2)}
                        </Box>
                      </Paper>
                    );
                  })
                )}
                <div ref={logEndRef} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};
