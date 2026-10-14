import React from 'react';
import { useSidebarState, UserMenu, Logout } from 'react-admin';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import { Box, Typography, Chip, Tooltip, Button } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import SensorsIcon from '@mui/icons-material/Sensors';
import ApiIcon from '@mui/icons-material/Api';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';

export const CustomAppBar: React.FC = () => {
  const [open, setOpen] = useSidebarState();

  return (
    <MuiAppBar
      position="sticky"
      elevation={0}
      sx={{
        backgroundColor: '#ffffff',
        color: '#0f172a',
        borderBottom: '1px solid #e2e8f0',
        boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        zIndex: (theme) => theme.zIndex.drawer + 1,
      }}
    >
      <Toolbar sx={{ minHeight: 64, px: 2.5 }}>
        {/* Sidebar Toggle Button with verified ES module MenuIcon */}
        <Tooltip title={open ? 'Close sidebar' : 'Open sidebar'}>
          <IconButton
            color="inherit"
            aria-label="toggle sidebar"
            onClick={() => setOpen(!open)}
            edge="start"
            sx={{ mr: 1.5, color: '#334155' }}
          >
            <MenuIcon />
          </IconButton>
        </Tooltip>

        {/* Brand Logo & Name */}
        <Box
          sx={{ display: 'flex', alignItems: 'center', mr: 2, cursor: 'pointer' }}
          onClick={() => { window.location.hash = '#/'; }}
        >
          <Box
            sx={{
              width: 34,
              height: 34,
              borderRadius: 2,
              bgcolor: '#0284c7',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              mr: 1.5,
            }}
          >
            <LocalHospitalIcon sx={{ fontSize: 20 }} />
          </Box>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 800,
              letterSpacing: '0.04em',
              color: '#0f172a',
              fontSize: '1.15rem',
              lineHeight: 1,
            }}
          >
            PRANOVA
          </Typography>
        </Box>

        {/* API Connection Indicator */}
        <Tooltip title="Connected to Backend API Engine (http://localhost:5000/api/v1)">
          <Chip
            icon={<FiberManualRecordIcon sx={{ fontSize: '10px !important', color: '#10b981 !important' }} />}
            label="API Connected"
            size="small"
            sx={{
              bgcolor: 'rgba(16, 185, 129, 0.1)',
              color: '#047857',
              fontWeight: 600,
              fontSize: '0.75rem',
              border: '1px solid rgba(16, 185, 129, 0.25)',
              mr: 'auto',
            }}
          />
        </Tooltip>

        {/* Direct Engineering & Telemetry Actions */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mr: 2 }}>
          <Button
            size="small"
            variant="outlined"
            startIcon={<SensorsIcon sx={{ color: '#0284c7' }} />}
            onClick={() => { window.location.hash = '#/socket-test'; }}
            sx={{
              textTransform: 'none',
              fontWeight: 700,
              fontSize: '0.78rem',
              color: '#0284c7',
              borderColor: '#e2e8f0',
              bgcolor: 'rgba(2, 132, 199, 0.04)',
              '&:hover': {
                borderColor: '#0284c7',
                bgcolor: 'rgba(2, 132, 199, 0.1)',
              },
            }}
          >
            Socket Test Bench
          </Button>

          <Button
            size="small"
            variant="outlined"
            startIcon={<ApiIcon sx={{ color: '#0f766e' }} />}
            onClick={() => { window.open('http://localhost:5000/api-docs', '_blank'); }}
            sx={{
              textTransform: 'none',
              fontWeight: 700,
              fontSize: '0.78rem',
              color: '#0f766e',
              borderColor: '#e2e8f0',
              bgcolor: 'rgba(15, 118, 110, 0.04)',
              '&:hover': {
                borderColor: '#0f766e',
                bgcolor: 'rgba(15, 118, 110, 0.1)',
              },
            }}
          >
            API Docs (Swagger)
          </Button>
        </Box>

        {/* User Menu with explicit verified icons */}
        <UserMenu icon={<AccountCircleIcon sx={{ fontSize: 24, color: '#475569' }} />}>
          <Logout icon={<ExitToAppIcon />} />
        </UserMenu>
      </Toolbar>
    </MuiAppBar>
  );
};

export default CustomAppBar;
