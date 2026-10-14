import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Typography,
  Box,
  CircularProgress,
  Alert,
} from '@mui/material';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import SecurityIcon from '@mui/icons-material/Security';
import { useNotify } from 'react-admin';
import axios from 'axios';

interface ExportCasesModalProps {
  open: boolean;
  onClose: () => void;
}

export const ExportCasesModal: React.FC<ExportCasesModalProps> = ({ open, onClose }) => {
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const notify = useNotify();

  const handleExport = async () => {
    if (!reason || reason.trim().length < 3) {
      setError('Please provide a specific clinical or administrative reason for this export.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem('pranova_access_token');
      const response = await axios.post(
        'http://localhost:5000/api/v1/cases/export/excel',
        { reason: reason.trim() },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          responseType: 'blob',
        }
      );

      // Create download link from received binary blob
      const blob = new Blob([response.data], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute(
        'download',
        `PRANOVA_Cases_Export_${new Date().toISOString().slice(0, 10)}.xlsx`
      );
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      notify('Cases exported successfully. Event recorded in immutable Audit Log.', {
        type: 'success',
      });
      setReason('');
      onClose();
    } catch (err: any) {
      const msg = err.response?.data?.message || err.message || 'Failed to generate Excel export';
      setError(msg);
      notify(msg, { type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1.5, pb: 1 }}>
        <FileDownloadIcon sx={{ color: '#0284c7' }} />
        <Typography variant="h6" sx={{ fontWeight: 700 }}>
          Export Healthcare Cases to Excel
        </Typography>
      </DialogTitle>

      <DialogContent dividers>
        <Box sx={{ mb: 2 }}>
          <Alert severity="info" icon={<SecurityIcon />} sx={{ borderRadius: 2 }}>
            <strong>Healthcare Compliance Requirement:</strong> Exporting protected healthcare information (PHI) requires an explicit reason. This download and its stated purpose will be recorded in the immutable Audit Log.
          </Alert>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <TextField
          autoFocus
          label="Reason for Data Export *"
          placeholder="e.g. Monthly clinical quality assurance and triage time audit"
          multiline
          rows={3}
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          disabled={loading}
          fullWidth
          helperText="Minimum 3 characters required. Stored permanently for compliance."
        />
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button onClick={onClose} disabled={loading} color="inherit">
          Cancel
        </Button>
        <Button
          onClick={handleExport}
          variant="contained"
          disabled={loading || !reason.trim()}
          startIcon={loading ? <CircularProgress size={18} /> : <FileDownloadIcon />}
          sx={{
            bgcolor: '#0284c7',
            '&:hover': { bgcolor: '#0369a1' },
          }}
        >
          {loading ? 'Generating Excel...' : 'Authorize & Download (.xlsx)'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
