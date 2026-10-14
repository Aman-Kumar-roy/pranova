import React from 'react';
import {
  Create,
  SimpleForm,
  TextInput,
  BooleanInput,
  required,
  email,
} from 'react-admin';
import { Grid, Typography, Divider } from '@mui/material';

export const CareManagerCreate: React.FC = () => (
  <Create redirect="show">
    <SimpleForm sx={{ maxWidth: 900 }}>
      <Typography variant="h6" sx={{ fontWeight: 700, mb: 1, color: '#0f766e' }}>
        Onboard Care Manager
      </Typography>
      <Divider sx={{ mb: 2.5, width: '100%' }} />

      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <TextInput source="firstName" label="First Name" validate={[required()]} fullWidth />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextInput source="lastName" label="Last Name" validate={[required()]} fullWidth />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextInput source="phone" label="Phone (e.g. +919876543210)" validate={[required()]} fullWidth />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextInput source="email" label="Official Work Email" validate={[email()]} fullWidth />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextInput source="employeeCode" label="Employee Code (e.g. CM-2024)" fullWidth />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextInput source="licenseNumber" label="Clinical License Number" fullWidth />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextInput source="specialization" label="Clinical Specialization" fullWidth />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextInput source="assignedZone" label="Assigned Operational Zone" fullWidth />
        </Grid>
        <Grid item xs={12}>
          <BooleanInput source="isAvailable" label="Currently Available for Dispatch" defaultValue={true} />
        </Grid>
      </Grid>
    </SimpleForm>
  </Create>
);
