import React from 'react';
import {
  Edit,
  SimpleForm,
  TextInput,
  BooleanInput,
  required,
  email,
} from 'react-admin';
import { Grid, Typography, Divider } from '@mui/material';

export const CareManagerEdit: React.FC = () => (
  <Edit redirect="show">
    <SimpleForm sx={{ maxWidth: 900 }}>
      <Typography variant="h6" sx={{ fontWeight: 700, mb: 1, color: '#0f766e' }}>
        Edit Care Manager Profile
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
          <TextInput source="phone" label="Phone" validate={[required()]} fullWidth />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextInput source="email" label="Official Email" validate={[email()]} fullWidth />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextInput source="employeeCode" label="Employee Code" fullWidth />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextInput source="licenseNumber" label="License Number" fullWidth />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextInput source="specialization" label="Specialization" fullWidth />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextInput source="assignedZone" label="Assigned Zone" fullWidth />
        </Grid>
        <Grid item xs={12}>
          <BooleanInput source="isAvailable" label="Available for Dispatch" />
        </Grid>
      </Grid>
    </SimpleForm>
  </Edit>
);
