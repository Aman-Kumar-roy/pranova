import React from 'react';
import {
  Show,
  SimpleShowLayout,
  TextField,
  DateField,
  FunctionField,
} from 'react-admin';
import { Card, CardContent, Typography, Grid, Divider, Box, Chip } from '@mui/material';

export const PatientShow: React.FC = () => (
  <Show>
    <SimpleShowLayout sx={{ maxWidth: 1000 }}>
      <Card sx={{ width: '100%', mb: 2, p: 1 }}>
        <CardContent>
          <Typography variant="h6" sx={{ fontWeight: 700, color: '#0284c7', mb: 2 }}>
            Demographics & Contact Information
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Typography variant="caption" sx={{ color: '#64748b' }}>Full Name</Typography>
              <TextField source="fullName" sx={{ display: 'block', fontWeight: 600 }} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="caption" sx={{ color: '#64748b' }}>Primary Phone</Typography>
              <TextField source="phone" sx={{ display: 'block', fontWeight: 600 }} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="caption" sx={{ color: '#64748b' }}>Email</Typography>
              <TextField source="email" emptyText="—" sx={{ display: 'block' }} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="caption" sx={{ color: '#64748b' }}>Gender</Typography>
              <TextField source="gender" emptyText="—" sx={{ display: 'block' }} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="caption" sx={{ color: '#64748b' }}>Blood Group</Typography>
              <FunctionField
                render={(record: any) => (
                  <Chip
                    label={record.bloodGroup || 'Not Specified'}
                    size="small"
                    sx={{ bgcolor: 'rgba(239, 68, 68, 0.1)', color: '#dc2626', fontWeight: 700 }}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="caption" sx={{ color: '#64748b' }}>Date of Birth</Typography>
              <DateField source="dateOfBirth" emptyText="—" sx={{ display: 'block' }} />
            </Grid>
          </Grid>

          <Divider sx={{ my: 3 }} />

          <Typography variant="h6" sx={{ fontWeight: 700, color: '#0284c7', mb: 2 }}>
            Location & Emergency Contact
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Typography variant="caption" sx={{ color: '#64748b' }}>Emergency Contact Name</Typography>
              <TextField source="emergencyContactName" emptyText="—" sx={{ display: 'block' }} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="caption" sx={{ color: '#64748b' }}>Emergency Contact Phone</Typography>
              <TextField source="emergencyContactPhone" emptyText="—" sx={{ display: 'block' }} />
            </Grid>
            <Grid item xs={12}>
              <Typography variant="caption" sx={{ color: '#64748b' }}>Residential Address</Typography>
              <TextField source="primaryAddress" emptyText="—" sx={{ display: 'block' }} />
            </Grid>
            <Grid item xs={12} sm={4}>
              <Typography variant="caption" sx={{ color: '#64748b' }}>City</Typography>
              <TextField source="city" emptyText="—" sx={{ display: 'block' }} />
            </Grid>
            <Grid item xs={12} sm={4}>
              <Typography variant="caption" sx={{ color: '#64748b' }}>State</Typography>
              <TextField source="state" emptyText="—" sx={{ display: 'block' }} />
            </Grid>
            <Grid item xs={12} sm={4}>
              <Typography variant="caption" sx={{ color: '#64748b' }}>Pincode</Typography>
              <TextField source="pincode" emptyText="—" sx={{ display: 'block' }} />
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </SimpleShowLayout>
  </Show>
);
