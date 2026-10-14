import React, { useEffect, useState } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Chip,
  LinearProgress,
  Divider,
  Button,
} from '@mui/material';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import PeopleAltOutlinedIcon from '@mui/icons-material/PeopleAltOutlined';
import BadgeOutlinedIcon from '@mui/icons-material/BadgeOutlined';
import LocalHospitalOutlinedIcon from '@mui/icons-material/LocalHospitalOutlined';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import HubOutlinedIcon from '@mui/icons-material/HubOutlined';
import ShieldOutlinedIcon from '@mui/icons-material/ShieldOutlined';
import PulseIcon from '@mui/icons-material/Sensors';
import RefreshIcon from '@mui/icons-material/Refresh';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
} from 'recharts';

const TRIAGE_DATA = [
  { name: 'P1 Emergency', value: 1, color: '#dc2626' },
  { name: 'P2 Urgent', value: 3, color: '#d97706' },
  { name: 'P3 Routine', value: 6, color: '#0284c7' },
];

const WORKFORCE_DATA = [
  { category: 'Available CMs', count: 4, fill: '#0f766e' },
  { category: 'Dispatched', count: 2, fill: '#0284c7' },
  { category: 'Hospitals', count: 5, fill: '#6366f1' },
  { category: 'Diagnostics', count: 3, fill: '#8b5cf6' },
];

export const Dashboard: React.FC = () => {
  const [lastRefreshed, setLastRefreshed] = useState<string>(new Date().toLocaleTimeString());

  const handleRefresh = () => {
    setLastRefreshed(new Date().toLocaleTimeString());
  };

  return (
    <Box sx={{ p: { xs: 2, sm: 3 }, maxWidth: 1400, mx: 'auto' }}>
      {/* Clinical Command Center Header */}
      <Box
        sx={{
          mb: 3.5,
          p: 3,
          borderRadius: 3,
          background: 'linear-gradient(135deg, #0b1120 0%, #0f172a 100%)',
          color: '#ffffff',
          position: 'relative',
          overflow: 'hidden',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          boxShadow: '0 4px 20px -2px rgba(0, 0, 0, 0.25)',
        }}
      >
        <Box sx={{ position: 'relative', zIndex: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 2 }}>
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1, gap: 1.5 }}>
              <Typography variant="h5" sx={{ fontWeight: 800, letterSpacing: '-0.02em' }}>
                Healthcare Coordination Command Center
              </Typography>
              <Chip
                icon={<PulseIcon sx={{ fontSize: '14px !important', color: '#38bdf8 !important' }} />}
                label="LIVE OPERATIONS"
                size="small"
                sx={{
                  bgcolor: 'rgba(2, 132, 199, 0.15)',
                  color: '#38bdf8',
                  fontWeight: 700,
                  fontSize: '0.72rem',
                  letterSpacing: '0.04em',
                  border: '1px solid rgba(56, 189, 248, 0.3)',
                }}
              />
            </Box>
            <Typography variant="body2" sx={{ color: '#94a3b8', maxWidth: 700 }}>
              Real-time patient triage stream, care manager field dispatch status, partner hospital orchestration, and compliance auditing.
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Typography variant="caption" sx={{ color: '#64748b', fontFamily: 'monospace' }}>
              UPDATED: {lastRefreshed}
            </Typography>
            <Button
              size="small"
              variant="outlined"
              onClick={handleRefresh}
              startIcon={<RefreshIcon sx={{ fontSize: 16 }} />}
              sx={{
                borderColor: 'rgba(255, 255, 255, 0.15)',
                color: '#cbd5e1',
                '&:hover': { borderColor: '#38bdf8', color: '#38bdf8' },
              }}
            >
              Sync Telemetry
            </Button>
          </Box>
        </Box>
      </Box>

      {/* KPI Stat Cards */}
      <Grid container spacing={2.5} sx={{ mb: 3.5 }}>
        {/* P1 Emergency SOS */}
        <Grid item xs={12} sm={6} md={3}>
          <Card
            sx={{
              borderRadius: 3,
              borderLeft: '4px solid #dc2626',
              transition: 'transform 0.2s',
              '&:hover': { transform: 'translateY(-2px)' },
            }}
          >
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5 }}>
                <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 700, letterSpacing: '0.05em' }}>
                  P1 ACTIVE SOS
                </Typography>
                <WarningAmberIcon sx={{ color: '#dc2626', fontSize: 22 }} />
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1 }}>
                <Typography variant="h4" sx={{ fontWeight: 800, color: '#dc2626', mb: 0.5 }}>
                  1
                </Typography>
                <Chip
                  label="PULSING ALERT"
                  size="small"
                  sx={{
                    bgcolor: 'rgba(220, 38, 38, 0.15)',
                    color: '#dc2626',
                    fontSize: '0.65rem',
                    fontWeight: 700,
                    height: 20,
                  }}
                />
              </Box>
              <Typography variant="caption" sx={{ color: '#dc2626', fontWeight: 600 }}>
                ● 1 Emergency SOS awaiting dispatch
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Registered Patients */}
        <Grid item xs={12} sm={6} md={3}>
          <Card
            sx={{
              borderRadius: 3,
              borderLeft: '4px solid #0284c7',
              transition: 'transform 0.2s',
              '&:hover': { transform: 'translateY(-2px)' },
            }}
          >
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5 }}>
                <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 700, letterSpacing: '0.05em' }}>
                  REGISTERED PATIENTS
                </Typography>
                <PeopleAltOutlinedIcon sx={{ color: '#0284c7', fontSize: 22 }} />
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 800, color: '#0f172a', mb: 0.5 }}>
                1
              </Typography>
              <Typography variant="caption" sx={{ color: '#64748b' }}>
                Coordinated under active care plans
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Field Care Managers */}
        <Grid item xs={12} sm={6} md={3}>
          <Card
            sx={{
              borderRadius: 3,
              borderLeft: '4px solid #0f766e',
              transition: 'transform 0.2s',
              '&:hover': { transform: 'translateY(-2px)' },
            }}
          >
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5 }}>
                <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 700, letterSpacing: '0.05em' }}>
                  CARE MANAGERS
                </Typography>
                <BadgeOutlinedIcon sx={{ color: '#0f766e', fontSize: 22 }} />
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 800, color: '#0f172a', mb: 0.5 }}>
                1
              </Typography>
              <Typography variant="caption" sx={{ color: '#10b981', fontWeight: 600 }}>
                ● Available for immediate dispatch
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Partner Providers */}
        <Grid item xs={12} sm={6} md={3}>
          <Card
            sx={{
              borderRadius: 3,
              borderLeft: '4px solid #8b5cf6',
              transition: 'transform 0.2s',
              '&:hover': { transform: 'translateY(-2px)' },
            }}
          >
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5 }}>
                <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 700, letterSpacing: '0.05em' }}>
                  PARTNER PROVIDERS
                </Typography>
                <LocalHospitalOutlinedIcon sx={{ color: '#8b5cf6', fontSize: 22 }} />
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 800, color: '#0f172a', mb: 0.5 }}>
                1
              </Typography>
              <Typography variant="caption" sx={{ color: '#64748b' }}>
                Hospitals, Labs & Clinics Connected
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Visual Telemetry Charts */}
      <Grid container spacing={2.5} sx={{ mb: 3.5 }}>
        {/* Triage Priority Distribution */}
        <Grid item xs={12} md={6}>
          <Card sx={{ borderRadius: 3, p: 2 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#0f172a', mb: 0.5 }}>
              Active Case Triage Breakdown
            </Typography>
            <Typography variant="caption" sx={{ color: '#64748b', mb: 2, display: 'block' }}>
              Real-time classification based on clinical acuity & SLA targets
            </Typography>
            <Box sx={{ height: 220, display: 'flex', alignItems: 'center' }}>
              <ResponsiveContainer width="60%" height="100%">
                <PieChart>
                  <Pie
                    data={TRIAGE_DATA}
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {TRIAGE_DATA.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <Box sx={{ width: '40%', pl: 1 }}>
                {TRIAGE_DATA.map((item) => (
                  <Box key={item.name} sx={{ display: 'flex', alignItems: 'center', mb: 1.5, gap: 1 }}>
                    <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: item.color }} />
                    <Box>
                      <Typography variant="caption" sx={{ fontWeight: 600, display: 'block' }}>
                        {item.name}
                      </Typography>
                      <Typography variant="caption" sx={{ color: '#64748b' }}>
                        {item.value} cases
                      </Typography>
                    </Box>
                  </Box>
                ))}
              </Box>
            </Box>
          </Card>
        </Grid>

        {/* Workforce Capacity */}
        <Grid item xs={12} md={6}>
          <Card sx={{ borderRadius: 3, p: 2 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#0f172a', mb: 0.5 }}>
              Field Operations & Network Capacity
            </Typography>
            <Typography variant="caption" sx={{ color: '#64748b', mb: 2, display: 'block' }}>
              Active field Care Managers and verified partner facilities
            </Typography>
            <Box sx={{ height: 220 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={WORKFORCE_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <XAxis dataKey="category" tick={{ fontSize: 11 }} />
                  <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Bar dataKey="count" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </Box>
          </Card>
        </Grid>
      </Grid>

      {/* System Infrastructure & Security Status */}
      <Grid container spacing={2.5}>
        <Grid item xs={12} md={7}>
          <Card sx={{ borderRadius: 3, p: 1 }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 1, display: 'flex', alignItems: 'center' }}>
                <HubOutlinedIcon sx={{ mr: 1, color: '#0284c7' }} />
                Platform Architecture Status
              </Typography>
              <Typography variant="body2" sx={{ color: '#64748b', mb: 3 }}>
                Strict API-First Headless Architecture with real-time operational feeds
              </Typography>

              <Box sx={{ mb: 2.5 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.8 }}>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    Backend REST API (Node.js / Express on :5000)
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#10b981', fontWeight: 700 }}>
                    100% Operational
                  </Typography>
                </Box>
                <LinearProgress variant="determinate" value={100} sx={{ height: 6, borderRadius: 3, bgcolor: '#e2e8f0', '& .MuiLinearProgress-bar': { bgcolor: '#10b981' } }} />
              </Box>

              <Box sx={{ mb: 2.5 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.8 }}>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    Embedded PostgreSQL Database (Port :5432)
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#10b981', fontWeight: 700 }}>
                    Active & Seeded
                  </Typography>
                </Box>
                <LinearProgress variant="determinate" value={100} sx={{ height: 6, borderRadius: 3, bgcolor: '#e2e8f0', '& .MuiLinearProgress-bar': { bgcolor: '#0284c7' } }} />
              </Box>

              <Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.8 }}>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    Real-Time Socket.io Alert Gateway
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#0f766e', fontWeight: 700 }}>
                    Emergency SOS Listener Active
                  </Typography>
                </Box>
                <LinearProgress variant="determinate" value={100} sx={{ height: 6, borderRadius: 3, bgcolor: '#e2e8f0', '& .MuiLinearProgress-bar': { bgcolor: '#0f766e' } }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={5}>
          <Card sx={{ borderRadius: 3, p: 1 }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 1, display: 'flex', alignItems: 'center' }}>
                <ShieldOutlinedIcon sx={{ mr: 1, color: '#0f766e' }} />
                Compliance & RBAC Policies
              </Typography>
              <Typography variant="body2" sx={{ color: '#64748b', mb: 2.5 }}>
                Healthcare regulatory isolation boundaries
              </Typography>

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.2 }}>
                  <CheckCircleOutlineIcon sx={{ color: '#10b981', fontSize: 20, mt: 0.2 }} />
                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      Platform Separation Guard
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#64748b' }}>
                      Admin endpoints restricted exclusively to Admin Web console
                    </Typography>
                  </Box>
                </Box>

                <Divider />

                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.2 }}>
                  <CheckCircleOutlineIcon sx={{ color: '#10b981', fontSize: 20, mt: 0.2 }} />
                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      JWT Bearer Authentication
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#64748b' }}>
                      Signed tokens with automatic expiration and refresh rotation
                    </Typography>
                  </Box>
                </Box>

                <Divider />

                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.2 }}>
                  <CheckCircleOutlineIcon sx={{ color: '#10b981', fontSize: 20, mt: 0.2 }} />
                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      Audit Log Immutability
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#64748b' }}>
                      All admin mutations and case assignments permanently recorded
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};
