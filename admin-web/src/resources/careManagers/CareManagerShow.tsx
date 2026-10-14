import React from 'react';
import {
  Show,
  SimpleShowLayout,
  TextField,
  DateField,
  FunctionField,
} from 'react-admin';
import { Card, CardContent, Typography, Grid, Divider, Chip } from '@mui/material';

export const CareManagerShow: React.FC = () => (
  <Show>
    <SimpleShowLayout sx={{ maxWidth: 1000 }}>
      <Card sx={{ width: '100%', mb: 2, p: 1 }}>
        <CardContent>
          <Typography variant="h6" sx={{ fontWeight: 700, color: '#0f766e', mb: 2 }}>
            Field Agent Profile & Credentials
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Typography variant="caption" sx={{ color: '#64748b' }}>Employee Code</Typography>
              <TextField source="employeeCode" sx={{ display: 'block', fontWeight: 700 }} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="caption" sx={{ color: '#64748b' }}>Duty Status</Typography>
              <FunctionField
                render={(record: any) =>
                  record.isAvailable ? (
                    <Chip
                      label="Available for Dispatch"
                      size="small"
                      sx={{ bgcolor: 'rgba(16, 185, 129, 0.12)', color: '#059669', fontWeight: 700 }}
                    />
                  ) : (
                    <Chip
                      label="Off-Duty / Engaged"
                      size="small"
                      sx={{ bgcolor: 'rgba(100, 116, 139, 0.12)', color: '#64748b', fontWeight: 600 }}
                    />
                  )
                }
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="caption" sx={{ color: '#64748b' }}>Full Name</Typography>
              <TextField source="fullName" sx={{ display: 'block', fontWeight: 600 }} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="caption" sx={{ color: '#64748b' }}>Contact Phone</Typography>
              <TextField source="phone" sx={{ display: 'block', fontWeight: 600 }} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="caption" sx={{ color: '#64748b' }}>Email</Typography>
              <TextField source="email" emptyText="—" sx={{ display: 'block' }} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="caption" sx={{ color: '#64748b' }}>License / Certification No.</Typography>
              <TextField source="licenseNumber" emptyText="—" sx={{ display: 'block' }} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="caption" sx={{ color: '#64748b' }}>Clinical Specialization</Typography>
              <TextField source="specialization" emptyText="General Healthcare Coordination" sx={{ display: 'block' }} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="caption" sx={{ color: '#64748b' }}>Assigned Zone</Typography>
              <TextField source="assignedZone" emptyText="Unassigned" sx={{ display: 'block' }} />
            </Grid>
          </Grid>

          <Divider sx={{ my: 3 }} />

          <Typography variant="h6" sx={{ fontWeight: 700, color: '#0f766e', mb: 2 }}>
            Field Telemetry & System Metadata
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={4}>
              <Typography variant="caption" sx={{ color: '#64748b' }}>Current Latitude</Typography>
              <TextField source="currentLatitude" emptyText="No telemetry" sx={{ display: 'block' }} />
            </Grid>
            <Grid item xs={12} sm={4}>
              <Typography variant="caption" sx={{ color: '#64748b' }}>Current Longitude</Typography>
              <TextField source="currentLongitude" emptyText="No telemetry" sx={{ display: 'block' }} />
            </Grid>
            <Grid item xs={12} sm={4}>
              <Typography variant="caption" sx={{ color: '#64748b' }}>Last Location Ping</Typography>
              <DateField source="lastLocationUpdate" emptyText="Never" showTime sx={{ display: 'block' }} />
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </SimpleShowLayout>
  </Show>
);
