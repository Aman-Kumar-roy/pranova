import React from 'react';
import {
  Show,
  SimpleShowLayout,
  TextField,
  DateField,
  NumberField,
  FunctionField,
  useRecordContext,
  useUpdate,
  useNotify,
  useRefresh,
} from 'react-admin';
import { Card, CardContent, Typography, Grid, Divider, Box, Chip, Button, Stack } from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import BlockIcon from '@mui/icons-material/Block';

const ProviderStatusToolbar: React.FC = () => {
  const record = useRecordContext();
  const [update, { isPending }] = useUpdate();
  const notify = useNotify();
  const refresh = useRefresh();

  if (!record) return null;

  const handleStatus = (status: 'ACTIVE' | 'PAUSED' | 'DEACTIVATED') => {
    update(
      'providers',
      { id: record.id, data: { status }, previousData: record },
      {
        onSuccess: () => {
          notify(`Provider status updated to ${status}`, { type: 'success' });
          refresh();
        },
      }
    );
  };

  return (
    <Box sx={{ mb: 2, p: 2, borderRadius: 2, bgcolor: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <Box>
        <Typography variant="body2" sx={{ fontWeight: 600, color: '#334155' }}>
          Current Operational Status: <strong>{record.status}</strong>
        </Typography>
        <Typography variant="caption" sx={{ color: '#64748b' }}>
          Change operational availability across PRANOVA coordination network
        </Typography>
      </Box>

      <Stack direction="row" spacing={1.5}>
        <Button
          variant={record.status === 'ACTIVE' ? 'contained' : 'outlined'}
          color="success"
          size="small"
          startIcon={<PlayArrowIcon />}
          onClick={() => handleStatus('ACTIVE')}
          disabled={record.status === 'ACTIVE' || isPending}
        >
          Activate
        </Button>
        <Button
          variant={record.status === 'PAUSED' ? 'contained' : 'outlined'}
          color="warning"
          size="small"
          startIcon={<PauseIcon />}
          onClick={() => handleStatus('PAUSED')}
          disabled={record.status === 'PAUSED' || isPending}
        >
          Pause
        </Button>
        <Button
          variant={record.status === 'DEACTIVATED' ? 'contained' : 'outlined'}
          color="error"
          size="small"
          startIcon={<BlockIcon />}
          onClick={() => handleStatus('DEACTIVATED')}
          disabled={record.status === 'DEACTIVATED' || isPending}
        >
          Deactivate
        </Button>
      </Stack>
    </Box>
  );
};

export const ProviderShow: React.FC = () => (
  <Show>
    <SimpleShowLayout sx={{ maxWidth: 1000 }}>
      <ProviderStatusToolbar />

      <Card sx={{ width: '100%', mb: 2, p: 1 }}>
        <CardContent>
          <Typography variant="h6" sx={{ fontWeight: 700, color: '#0284c7', mb: 2 }}>
            Healthcare Provider Overview
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Typography variant="caption" sx={{ color: '#64748b' }}>Facility Name</Typography>
              <TextField source="name" sx={{ display: 'block', fontWeight: 700, fontSize: '1.1rem' }} />
            </Grid>
            <Grid item xs={12} sm={3}>
              <Typography variant="caption" sx={{ color: '#64748b' }}>Provider Type</Typography>
              <FunctionField
                render={(record: any) => (
                  <Chip label={record.type} size="small" sx={{ fontWeight: 700, bgcolor: 'rgba(2, 132, 199, 0.1)', color: '#0284c7' }} />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <Typography variant="caption" sx={{ color: '#64748b' }}>Facility Rating</Typography>
              <NumberField source="rating" options={{ minimumFractionDigits: 1 }} sx={{ display: 'block', fontWeight: 700 }} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="caption" sx={{ color: '#64748b' }}>License Registration Number</Typography>
              <TextField source="licenseNumber" emptyText="—" sx={{ display: 'block' }} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="caption" sx={{ color: '#64748b' }}>Contact Person / Medical Superintendent</Typography>
              <TextField source="contactPerson" emptyText="—" sx={{ display: 'block' }} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="caption" sx={{ color: '#64748b' }}>Emergency Phone</Typography>
              <TextField source="phone" sx={{ display: 'block', fontWeight: 600 }} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="caption" sx={{ color: '#64748b' }}>Official Email</Typography>
              <TextField source="email" emptyText="—" sx={{ display: 'block' }} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="caption" sx={{ color: '#64748b' }}>Operating Hours</Typography>
              <TextField source="operatingHours" emptyText="24/7 Emergency Care" sx={{ display: 'block' }} />
            </Grid>
          </Grid>

          <Divider sx={{ my: 3 }} />

          <Typography variant="h6" sx={{ fontWeight: 700, color: '#0284c7', mb: 2 }}>
            Location & Physical Address
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography variant="caption" sx={{ color: '#64748b' }}>Street Address</Typography>
              <TextField source="address" sx={{ display: 'block' }} />
            </Grid>
            <Grid item xs={12} sm={4}>
              <Typography variant="caption" sx={{ color: '#64748b' }}>City</Typography>
              <TextField source="city" sx={{ display: 'block' }} />
            </Grid>
            <Grid item xs={12} sm={4}>
              <Typography variant="caption" sx={{ color: '#64748b' }}>State</Typography>
              <TextField source="state" sx={{ display: 'block' }} />
            </Grid>
            <Grid item xs={12} sm={4}>
              <Typography variant="caption" sx={{ color: '#64748b' }}>Pincode</Typography>
              <TextField source="pincode" sx={{ display: 'block' }} />
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </SimpleShowLayout>
  </Show>
);
