import React from 'react';
import {
  Show,
  SimpleShowLayout,
  TextField,
  DateField,
  FunctionField,
} from 'react-admin';
import { Card, CardContent, Typography, Grid, Divider, Box, Chip, Alert, Paper } from '@mui/material';
import PolicyIcon from '@mui/icons-material/Policy';
import LockIcon from '@mui/icons-material/Lock';

export const AuditLogShow: React.FC = () => (
  <Show>
    <SimpleShowLayout sx={{ maxWidth: 1000 }}>
      {/* Immutability Banner */}
      <Alert
        severity="info"
        icon={<LockIcon />}
        sx={{ mb: 2.5, width: '100%', borderRadius: 2 }}
      >
        <strong>Immutable Audit Log Entry:</strong> This record is permanently archived under healthcare compliance regulations. It cannot be altered, modified, or hard-deleted.
      </Alert>

      <Card sx={{ width: '100%', mb: 2, p: 1 }}>
        <CardContent>
          <Typography variant="h6" sx={{ fontWeight: 700, color: '#0f766e', mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
            <PolicyIcon /> Audit Transaction Details
          </Typography>

          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Typography variant="caption" sx={{ color: '#64748b' }}>Action Performed</Typography>
              <TextField source="action" sx={{ display: 'block', fontWeight: 800, fontSize: '1.1rem' }} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="caption" sx={{ color: '#64748b' }}>Target Resource</Typography>
              <TextField source="resource" sx={{ display: 'block', fontWeight: 700 }} />
            </Grid>
            <Grid item xs={12} sm={4}>
              <Typography variant="caption" sx={{ color: '#64748b' }}>HTTP Method</Typography>
              <TextField source="httpMethod" sx={{ display: 'block', fontWeight: 700 }} />
            </Grid>
            <Grid item xs={12} sm={4}>
              <Typography variant="caption" sx={{ color: '#64748b' }}>Execution Status</Typography>
              <FunctionField
                render={(record: any) => (
                  <Chip
                    label={record.status}
                    size="small"
                    sx={{
                      bgcolor: record.status === 'FAILED' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(16, 185, 129, 0.1)',
                      color: record.status === 'FAILED' ? '#dc2626' : '#059669',
                      fontWeight: 800,
                    }}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <Typography variant="caption" sx={{ color: '#64748b' }}>Timestamp</Typography>
              <DateField source="createdAt" showTime sx={{ display: 'block', fontWeight: 600 }} />
            </Grid>

            <Grid item xs={12} sm={6}>
              <Typography variant="caption" sx={{ color: '#64748b' }}>Actor Email</Typography>
              <TextField source="actorEmail" emptyText="System Automated" sx={{ display: 'block', fontWeight: 600 }} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="caption" sx={{ color: '#64748b' }}>Actor Role</Typography>
              <TextField source="actorRole" emptyText="SYSTEM" sx={{ display: 'block' }} />
            </Grid>

            <Grid item xs={12}>
              <Typography variant="caption" sx={{ color: '#64748b' }}>API Endpoint Requested</Typography>
              <TextField source="endpoint" sx={{ display: 'block', fontFamily: 'monospace' }} />
            </Grid>

            {/* Reason for Action / Export */}
            <Grid item xs={12}>
              <Typography variant="caption" sx={{ color: '#64748b' }}>Stated Reason / Justification</Typography>
              <FunctionField
                render={(record: any) => (
                  <Typography variant="body1" sx={{ fontWeight: 600, color: record.reason ? '#0284c7' : '#94a3b8' }}>
                    {record.reason || 'No specific justification mandated for this action'}
                  </Typography>
                )}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <Typography variant="caption" sx={{ color: '#64748b' }}>Client IP Address</Typography>
              <TextField source="ipAddress" sx={{ display: 'block', fontFamily: 'monospace' }} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="caption" sx={{ color: '#64748b' }}>User Agent</Typography>
              <TextField source="userAgent" sx={{ display: 'block', fontSize: '0.8rem', color: '#64748b' }} />
            </Grid>
          </Grid>

          <Divider sx={{ my: 3 }} />

          {/* Request Payload */}
          <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#334155', mb: 1 }}>
            Request Payload Captured
          </Typography>
          <FunctionField
            render={(record: any) => (
              <Paper
                variant="outlined"
                sx={{
                  p: 2,
                  bgcolor: '#0f172a',
                  color: '#38bdf8',
                  borderRadius: 2,
                  fontFamily: 'monospace',
                  fontSize: '0.85rem',
                  overflowX: 'auto',
                }}
              >
                <pre style={{ margin: 0 }}>
                  {record.requestPayload
                    ? JSON.stringify(record.requestPayload, null, 2)
                    : 'No request payload body attached'}
                </pre>
              </Paper>
            )}
          />
        </CardContent>
      </Card>
    </SimpleShowLayout>
  </Show>
);
