import React from 'react';
import { Layout, LayoutProps } from 'react-admin';
import { CustomAppBar } from './AppBar.js';
import { CustomMenu } from './Menu.js';
import { CustomError } from './CustomError.js';
import { EmergencyAlertListener } from './EmergencyAlertListener.js';

export const CustomLayout: React.FC<LayoutProps> = (props) => {
  return (
    <>
      <Layout {...props} appBar={CustomAppBar} menu={CustomMenu} error={CustomError} />
      <EmergencyAlertListener />
    </>
  );
};
