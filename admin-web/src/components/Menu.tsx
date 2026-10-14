import React from 'react';
import { Menu } from 'react-admin';
import DashboardIcon from '@mui/icons-material/Dashboard';

export const CustomMenu: React.FC = () => {
  return (
    <Menu sx={{ mt: 1 }}>
      {/* Explicit leftIcon prevents Vite CJS double-wrapping of default @mui/icons-material/Dashboard */}
      <Menu.DashboardItem leftIcon={<DashboardIcon />} primaryText="Command Center" />
      <Menu.ResourceItems />
    </Menu>
  );
};
