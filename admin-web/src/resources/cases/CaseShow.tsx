import React, { useState } from 'react';
import {
  Show,
  SimpleShowLayout,
  TextField,
  DateField,
  FunctionField,
  useRecordContext,
  useUpdate,
  useNotify,
  useRefresh,
} from 'react-admin';
import {
  Card,
  CardContent,
  Typography,
  Grid,
  Divider,
  Box,
  Chip,
  Button,
  Stack,
  Paper,
} from '@mui/material';
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import TimelineIcon from '@mui/icons-material/Timeline';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import PersonIcon from '@mui/icons-material/Person';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import { AssignCaseDialog } from './AssignCaseDialog.js';

const CaseHeaderActions: React.FC<{ onOpenAssign: () => void }> = ({ onOpenAssign }) => {
  const record = useRecordContext();
  const [update, { isPending }] = useUpdate();
  const notify = useNotify();
  const refresh = useRefresh();

  if (!record) return null;

  const handleStatus = (newStatus: string) => {
    update(
      'cases',
      {
        id: record.id,
        data: { status: newStatus },
        previousData: record,
      },
      {
        onSuccess: () => {
          notify(`Case status transitioned to ${newStatus}`, { type: 'success' });
          refresh();
        },
      }
    );
  };

  return (
    <Box
      sx={{
        mb: 2.5,
        p: 2.5,
        borderRadius: 3,
        bgcolor: '#ffffff',
        border: '1px solid #e2e8f0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: 2,
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 0.5 }}>
            <Typography variant="h5" sx={{ fontWeight: 800, color: '#0f172a' }}>
              {record.caseNumber}
            </Typography>
            <Chip
              label={record.priority}
              size="small"
              sx={{
                bgcolor: record.priority === 'P1' ? '#ef4444' : record.priority === 'P2' ? '#f59e0b' : '#0284c7',
                color: '#ffffff',
                fontWeight: 800,
              }}
            />
            <Chip
              label={record.status}
              size="small"
              sx={{
                bgcolor: 'rgba(15, 118, 110, 0.1)',
                color: '#0f766e',
                fontWeight: 800,
                border: '1px solid rgba(15, 118, 110, 0.3)',
              }}
            />
          </Box>
          <Typography variant="body2" sx={{ color: '#64748b' }}>
            {record.title}
          </Typography>
        </Box>
      </Box>

      <Stack direction="row" spacing={1.5}>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AssignmentIndIcon />}
          onClick={onOpenAssign}
          sx={{
            bgcolor: '#0284c7',
            fontWeight: 700,
            textTransform: 'none',
            '&:hover': { bgcolor: '#0369a1' },
          }}
        >
          {record.careManagerId ? 'Reassign Care Manager' : 'Assign Care Manager'}
        </Button>

        {record.status !== 'RESOLVED' && (
          <Button
            variant="outlined"
            color="success"
            startIcon={<CheckCircleIcon />}
            onClick={() => handleStatus('RESOLVED')}
            disabled={isPending}
            sx={{ textTransform: 'none', fontWeight: 600 }}
          >
            Mark Resolved
          </Button>
        )}
      </Stack>
    </Box>
  );
};

const TimelineSection: React.FC = () => {
  const record = useRecordContext();
  if (!record || !record.timeline || record.timeline.length === 0) {
    return (
      <Card sx={{ width: '100%', mt: 2.5, p: 2 }}>
        <CardContent>
          <Typography variant="h6" sx={{ fontWeight: 700, color: '#0f766e', mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
            <TimelineIcon /> Case Timeline & Audit History
          </Typography>
          <Typography variant="body2" sx={{ color: '#94a3b8' }}>
            No timeline events recorded yet.
          </Typography>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card sx={{ width: '100%', mt: 2.5, p: 1 }}>
      <CardContent>
        <Typography variant="h6" sx={{ fontWeight: 700, color: '#0f766e', mb: 2.5, display: 'flex', alignItems: 'center', gap: 1 }}>
          <TimelineIcon /> Case Coordination Timeline
        </Typography>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {record.timeline.map((event: any, index: number) => (
            <Paper
              key={event.id || index}
              variant="outlined"
              sx={{
                p: 2,
                borderRadius: 2,
                borderLeft: '4px solid #0284c7',
                bgcolor: '#fafafa',
              }}
            >
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.8 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#0f172a' }}>
                    {event.action.replace(/_/g, ' ')}
                  </Typography>
                  {event.newStatus && (
                    <Chip
                      label={event.newStatus}
                      size="small"
                      sx={{ bgcolor: 'rgba(2, 132, 199, 0.1)', color: '#0284c7', fontWeight: 700, fontSize: '0.68rem' }}
                    />
                  )}
                </Box>
                <Typography variant="caption" sx={{ color: '#64748b' }}>
                  {new Date(event.createdAt).toLocaleString()}
                </Typography>
              </Box>

              {event.notes && (
                <Typography variant="body2" sx={{ color: '#334155', mb: 0.8 }}>
                  {event.notes}
                </Typography>
              )}

              <Typography variant="caption" sx={{ color: '#64748b', display: 'block' }}>
                Recorded by: <strong>{event.actorName || event.actorRole || 'System'}</strong>
              </Typography>
            </Paper>
          ))}
        </Box>
      </CardContent>
    </Card>
  );
};

export const CaseShow: React.FC = () => {
  const [assignOpen, setAssignOpen] = useState(false);

  return (
    <Show>
      <SimpleShowLayout sx={{ maxWidth: 1100 }}>
        <CaseHeaderActions onOpenAssign={() => setAssignOpen(true)} />

        {/* Top Grid: Patient & Care Manager */}
        <Grid container spacing={2.5} sx={{ mb: 1 }}>
          {/* Patient Card */}
          <Grid item xs={12} md={6}>
            <Card sx={{ height: '100%', p: 1 }}>
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 700, color: '#0284c7', mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <PersonIcon /> Patient Medical Demographics
                </Typography>

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                  <Box>
                    <Typography variant="caption" sx={{ color: '#64748b' }}>Full Name</Typography>
                    <TextField source="patientName" sx={{ display: 'block', fontWeight: 700, fontSize: '1.05rem' }} />
                  </Box>
                  <Box>
                    <Typography variant="caption" sx={{ color: '#64748b' }}>Contact Phone</Typography>
                    <TextField source="patientPhone" sx={{ display: 'block', fontWeight: 600 }} />
                  </Box>
                  <Box>
                    <Typography variant="caption" sx={{ color: '#64748b' }}>Blood Group</Typography>
                    <TextField source="patientBloodGroup" emptyText="Not specified" sx={{ display: 'block', fontWeight: 600, color: '#ef4444' }} />
                  </Box>
                  <Box>
                    <Typography variant="caption" sx={{ color: '#64748b' }}>Emergency Contact</Typography>
                    <TextField source="patientEmergencyContact" emptyText="—" sx={{ display: 'block' }} />
                  </Box>
                  <Box>
                    <Typography variant="caption" sx={{ color: '#64748b' }}>Primary Address</Typography>
                    <TextField source="patientAddress" emptyText="—" sx={{ display: 'block' }} />
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Care Manager Card */}
          <Grid item xs={12} md={6}>
            <Card sx={{ height: '100%', p: 1 }}>
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 700, color: '#0f766e', mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <AssignmentIndIcon /> Field Care Manager Assigned
                </Typography>

                <FunctionField
                  render={(record: any) =>
                    record.careManagerId ? (
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                        <Box>
                          <Typography variant="caption" sx={{ color: '#64748b' }}>Agent Name</Typography>
                          <Typography variant="body1" sx={{ fontWeight: 700, color: '#0f766e', fontSize: '1.05rem' }}>
                            {record.careManagerName}
                          </Typography>
                        </Box>
                        <Box>
                          <Typography variant="caption" sx={{ color: '#64748b' }}>Employee Code</Typography>
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>
                            {record.careManagerCode || '—'}
                          </Typography>
                        </Box>
                        <Box>
                          <Typography variant="caption" sx={{ color: '#64748b' }}>Phone</Typography>
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>
                            {record.careManagerPhone || '—'}
                          </Typography>
                        </Box>
                        <Box>
                          <Typography variant="caption" sx={{ color: '#64748b' }}>Assigned On</Typography>
                          <Typography variant="body2">
                            {record.assignedAt ? new Date(record.assignedAt).toLocaleString() : '—'}
                          </Typography>
                        </Box>
                      </Box>
                    ) : (
                      <Box sx={{ textAlign: 'center', py: 3 }}>
                        <Typography variant="body2" sx={{ color: '#dc2626', fontWeight: 600, mb: 1.5 }}>
                          No Care Manager currently assigned to this case.
                        </Typography>
                        <Button
                          variant="contained"
                          size="small"
                          onClick={() => setAssignOpen(true)}
                          startIcon={<AssignmentIndIcon />}
                          sx={{ bgcolor: '#0284c7' }}
                        >
                          Assign Now
                        </Button>
                      </Box>
                    )
                  }
                />
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Healthcare Facility Card */}
        <Card sx={{ width: '100%', mt: 2, p: 1 }}>
          <CardContent>
            <Typography variant="h6" sx={{ fontWeight: 700, color: '#0284c7', mb: 1.5, display: 'flex', alignItems: 'center', gap: 1 }}>
              <LocalHospitalIcon /> Incident Location & Provider Coordination
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Typography variant="caption" sx={{ color: '#64748b' }}>Coordinating Provider Facility</Typography>
                <TextField source="providerName" emptyText="No hospital linked" sx={{ display: 'block', fontWeight: 600 }} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="caption" sx={{ color: '#64748b' }}>Provider Phone</Typography>
                <TextField source="providerPhone" emptyText="—" sx={{ display: 'block' }} />
              </Grid>
              <Grid item xs={12}>
                <Typography variant="caption" sx={{ color: '#64748b' }}>Incident Physical Address</Typography>
                <TextField source="incidentAddress" emptyText="Address not captured" sx={{ display: 'block' }} />
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* Case Timeline History */}
        <TimelineSection />

        <FunctionField
          render={(record: any) =>
            record ? (
              <AssignCaseDialog
                open={assignOpen}
                onClose={() => setAssignOpen(false)}
                caseId={record.id}
                caseNumber={record.caseNumber}
                currentCareManagerId={record.careManagerId}
              />
            ) : null
          }
        />
      </SimpleShowLayout>
    </Show>
  );
};
