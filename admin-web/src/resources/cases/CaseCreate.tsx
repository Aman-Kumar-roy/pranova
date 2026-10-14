import React from 'react';
import {
  Create,
  SimpleForm,
  TextInput,
  SelectInput,
  ReferenceInput,
  required,
} from 'react-admin';
import { Grid, Typography, Divider } from '@mui/material';

export const CaseCreate: React.FC = () => (
  <Create redirect="show">
    <SimpleForm sx={{ maxWidth: 900 }}>
      <Typography variant="h6" sx={{ fontWeight: 700, mb: 1, color: '#0284c7' }}>
        Initiate New Healthcare Coordination Case
      </Typography>
      <Divider sx={{ mb: 2.5, width: '100%' }} />

      <Grid container spacing={2}>
        <Grid item xs={12} sm={8}>
          <TextInput source="title" label="Case Title / Medical Objective" validate={[required()]} fullWidth />
        </Grid>
        <Grid item xs={12} sm={4}>
          <SelectInput
            source="priority"
            label="Priority Level"
            validate={[required()]}
            choices={[
              { id: 'P1', name: 'P1 - Emergency SOS' },
              { id: 'P2', name: 'P2 - Urgent' },
              { id: 'P3', name: 'P3 - Routine Care' },
            ]}
            defaultValue="P2"
            fullWidth
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <ReferenceInput source="patientId" reference="patients">
            <SelectInput optionText="fullName" label="Target Patient" validate={[required()]} fullWidth />
          </ReferenceInput>
        </Grid>
        <Grid item xs={12} sm={6}>
          <ReferenceInput source="providerId" reference="providers">
            <SelectInput optionText="name" label="Healthcare Facility (Optional)" fullWidth />
          </ReferenceInput>
        </Grid>
        <Grid item xs={12}>
          <TextInput source="description" label="Clinical Notes / Incident Summary" multiline rows={3} fullWidth />
        </Grid>
        <Grid item xs={12}>
          <TextInput source="incidentAddress" label="Incident / Patient Pickup Address" fullWidth />
        </Grid>
      </Grid>
    </SimpleForm>
  </Create>
);
