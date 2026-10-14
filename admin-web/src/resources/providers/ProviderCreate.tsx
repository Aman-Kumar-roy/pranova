import React from 'react';
import {
  Create,
  SimpleForm,
  TextInput,
  SelectInput,
  NumberInput,
  required,
  email,
} from 'react-admin';
import { Grid, Typography, Divider } from '@mui/material';

export const ProviderCreate: React.FC = () => (
  <Create redirect="show">
    <SimpleForm sx={{ maxWidth: 900 }}>
      <Typography variant="h6" sx={{ fontWeight: 700, mb: 1, color: '#0284c7' }}>
        Onboard Healthcare Provider Facility
      </Typography>
      <Divider sx={{ mb: 2.5, width: '100%' }} />

      <Grid container spacing={2}>
        <Grid item xs={12} sm={8}>
          <TextInput source="name" label="Facility / Provider Name" validate={[required()]} fullWidth />
        </Grid>
        <Grid item xs={12} sm={4}>
          <SelectInput
            source="type"
            label="Provider Category"
            validate={[required()]}
            choices={[
              { id: 'HOSPITAL', name: 'Hospital' },
              { id: 'LAB', name: 'Diagnostic Lab' },
              { id: 'CLINIC', name: 'Specialty Clinic' },
              { id: 'AMBULANCE', name: 'Ambulance Service' },
              { id: 'PHARMACY', name: 'Pharmacy Network' },
            ]}
            fullWidth
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextInput source="phone" label="Emergency Contact Phone" validate={[required()]} fullWidth />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextInput source="email" label="Official Facility Email" validate={[email()]} fullWidth />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextInput source="licenseNumber" label="State Healthcare License No." fullWidth />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextInput source="contactPerson" label="Contact Person / Superintendent" fullWidth />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextInput source="operatingHours" label="Operating Hours (e.g. 24/7 or 08:00 - 20:00)" fullWidth defaultValue="24/7" />
        </Grid>
        <Grid item xs={12} sm={3}>
          <NumberInput source="rating" label="Initial Rating (0-5)" defaultValue={4.5} fullWidth />
        </Grid>
        <Grid item xs={12} sm={3}>
          <SelectInput
            source="status"
            label="Initial Status"
            choices={[
              { id: 'ACTIVE', name: 'Active' },
              { id: 'PAUSED', name: 'Paused' },
              { id: 'DEACTIVATED', name: 'Deactivated' },
            ]}
            defaultValue="ACTIVE"
            fullWidth
          />
        </Grid>
      </Grid>

      <Typography variant="subtitle1" sx={{ fontWeight: 600, mt: 2, mb: 1, color: '#475569' }}>
        Location Details
      </Typography>
      <Divider sx={{ mb: 2, width: '100%' }} />

      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextInput source="address" label="Physical Street Address" validate={[required()]} fullWidth multiline rows={2} />
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextInput source="city" label="City" validate={[required()]} fullWidth />
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextInput source="state" label="State" validate={[required()]} fullWidth />
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextInput source="pincode" label="Pincode" validate={[required()]} fullWidth />
        </Grid>
      </Grid>
    </SimpleForm>
  </Create>
);
