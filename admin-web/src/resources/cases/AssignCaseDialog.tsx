import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Box,
  Typography,
  CircularProgress,
  Chip,
  Alert,
} from '@mui/material';
import { useDataProvider, useNotify, useRefresh } from 'react-admin';
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import axios from 'axios';

interface AssignCaseDialogProps {
  open: boolean;
  onClose: () => void;
  caseId: string;
  caseNumber: string;
  currentCareManagerId?: string | null;
}

export const AssignCaseDialog: React.FC<AssignCaseDialogProps> = ({
  open,
  onClose,
  caseId,
  caseNumber,
  currentCareManagerId,
}) => {
  const dataProvider = useDataProvider();
  const notify = useNotify();
  const refresh = useRefresh();

  const [careManagers, setCareManagers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [selectedCMId, setSelectedCMId] = useState<string>(currentCareManagerId || '');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      setLoading(true);
      setError(null);
      setSelectedCMId(currentCareManagerId || '');
      setNotes('');

      dataProvider
        .getList('care-managers', {
          pagination: { page: 1, perPage: 50 },
          sort: { field: 'createdAt', order: 'DESC' },
          filter: {},
        })
        .then(({ data }) => {
          setCareManagers(data);
        })
        .catch((err) => {
          setError('Failed to load care managers directory');
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [open, caseId, currentCareManagerId, dataProvider]);

  const handleConfirm = async () => {
    if (!selectedCMId) {
      setError('Please select a Care Manager to assign');
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const token = localStorage.getItem('pranova_access_token');
      await axios.patch(
        `http://localhost:5000/api/v1/cases/${caseId}/assign`,
        {
          careManagerId: selectedCMId,
          notes: notes.trim() || undefined,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      notify(`Case ${caseNumber} assigned successfully to Care Manager`, { type: 'success' });
      refresh();
      onClose();
    } catch (err: any) {
      const msg = err.response?.data?.message || err.message || 'Failed to assign case';
      setError(msg);
      notify(msg, { type: 'error' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ pb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
        <AssignmentIndIcon sx={{ color: '#0284c7' }} />
        <Typography variant="h6" sx={{ fontWeight: 700 }}>
          Assign Care Manager
        </Typography>
      </DialogTitle>

      <DialogContent dividers>
        <Box sx={{ mb: 2.5 }}>
          <Typography variant="body2" sx={{ color: '#64748b' }}>
            Dispatching case <strong>{caseNumber}</strong> to dedicated field care coordinator.
          </Typography>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress size={32} />
          </Box>
        ) : (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
            <FormControl fullWidth>
              <InputLabel id="care-manager-select-label">Available Care Manager</InputLabel>
              <Select
                labelId="care-manager-select-label"
                value={selectedCMId}
                label="Available Care Manager"
                onChange={(e) => setSelectedCMId(e.target.value)}
              >
                {careManagers.map((cm) => (
                  <MenuItem key={cm.id} value={cm.id}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                      <Box>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          {cm.fullName || `${cm.firstName} ${cm.lastName}`}
                        </Typography>
                        <Typography variant="caption" sx={{ color: '#64748b' }}>
                          {cm.employeeCode || 'CM'} • {cm.specialization || 'General Care'} {cm.assignedZone ? `• Zone: ${cm.assignedZone}` : ''}
                        </Typography>
                      </Box>
                      <Chip
                        label={cm.isAvailable ? 'Available' : 'Engaged'}
                        size="small"
                        sx={{
                          bgcolor: cm.isAvailable ? 'rgba(16, 185, 129, 0.12)' : 'rgba(100, 116, 139, 0.12)',
                          color: cm.isAvailable ? '#059669' : '#64748b',
                          fontWeight: 700,
                          fontSize: '0.7rem',
                        }}
                      />
                    </Box>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              label="Triage & Coordination Notes (Optional)"
              placeholder="e.g. Patient requires immediate cardiac stabilization and oxygen transport."
              multiline
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              fullWidth
            />
          </Box>
        )}
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button onClick={onClose} disabled={submitting} color="inherit">
          Cancel
        </Button>
        <Button
          onClick={handleConfirm}
          variant="contained"
          disabled={submitting || loading || !selectedCMId}
          startIcon={submitting ? <CircularProgress size={18} /> : <CheckCircleIcon />}
          sx={{
            bgcolor: '#0284c7',
            '&:hover': { bgcolor: '#0369a1' },
          }}
        >
          Confirm Assignment
        </Button>
      </DialogActions>
    </Dialog>
  );
};
