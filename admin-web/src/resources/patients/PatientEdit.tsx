import React from 'react';
import {
  Edit,
  SimpleForm,
  TextInput,
  SelectInput,
  required,
  email,
} from 'react-admin';
import { Grid, Typography, Divider } from '@mui/material';

export const PatientEdit: React.FC = () => (
  <Edit redirect="show">
    <SimpleForm sx={{ maxWidth: 900 }}>
      <Typography variant="h6" sx={{ fontWeight: 700, mb: 1, color: '#0284c7' }}>
        Edit Patient Record
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
          <TextInput source="email" label="Email Address" validate={[email()]} fullWidth />
        </Grid>
        <Grid item xs={12} sm={4}>
          <SelectInput
            source="gender"
            label="Gender"
            choices={[
              { id: 'Male', name: 'Male' },
              { id: 'Female', name: 'Female' },
              { id: 'Other', name: 'Other' },
            ]}
            fullWidth
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <SelectInput
            source="bloodGroup"
            label="Blood Group"
            choices={[
              { id: 'A+', name: 'A+' },
              { id: 'A-', name: 'A-' },
              { id: 'B+', name: 'B+' },
              { id: 'B-', name: 'B-' },
              { id: 'AB+', name: 'AB+' },
              { id: 'AB-', name: 'AB-' },
              { id: 'O+', name: 'O+' },
              { id: 'O-', name: 'O-' },
            ]}
            fullWidth
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextInput source="dateOfBirth" label="Date of Birth (YYYY-MM-DD)" fullWidth />
        </Grid>
      </Grid>

      <Typography variant="subtitle1" sx={{ fontWeight: 600, mt: 2, mb: 1, color: '#475569' }}>
        Address & Emergency Contacts
      </Typography>
      <Divider sx={{ mb: 2, width: '100%' }} />

      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextInput source="primaryAddress" label="Address" fullWidth multiline rows={2} />
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextInput source="city" label="City" fullWidth />
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextInput source="state" label="State" fullWidth />
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextInput source="pincode" label="Pincode" fullWidth />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextInput source="emergencyContactName" label="Emergency Contact Name" fullWidth />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextInput source="emergencyContactPhone" label="Emergency Contact Phone" fullWidth />
        </Grid>
      </Grid>
    </SimpleForm>
  </Edit>
);
