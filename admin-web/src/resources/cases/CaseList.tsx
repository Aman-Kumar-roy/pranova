import React, { useState } from 'react';
import {
  List,
  Datagrid,
  TextField,
  DateField,
  ShowButton,
  SearchInput,
  SelectInput,
  FunctionField,
  TopToolbar,
  CreateButton,
  useRecordContext,
} from 'react-admin';
import { Chip, Box, Typography, Button } from '@mui/material';
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import { AssignCaseDialog } from './AssignCaseDialog.js';
import { ExportCasesModal } from '../../components/ExportCasesModal.js';

const caseFilters = [
  <SearchInput source="q" alwaysOn placeholder="Search by case #, title, or patient..." />,
  <SelectInput
    source="priority"
    label="Priority"
    choices={[
      { id: 'P1', name: 'P1 - Emergency SOS' },
      { id: 'P2', name: 'P2 - Urgent' },
      { id: 'P3', name: 'P3 - Routine Coordination' },
    ]}
  />,
  <SelectInput
    source="status"
    label="Status"
    choices={[
      { id: 'OPEN', name: 'Open (Triage)' },
      { id: 'ASSIGNED', name: 'Assigned' },
      { id: 'IN_PROGRESS', name: 'In Progress' },
      { id: 'RESOLVED', name: 'Resolved' },
      { id: 'CANCELLED', name: 'Cancelled' },
    ]}
  />,
];

const CaseListActions: React.FC<{ onOpenExport: () => void }> = ({ onOpenExport }) => (
  <TopToolbar>
    <CreateButton />
    <Button
      variant="outlined"
      size="small"
      startIcon={<FileDownloadIcon />}
      onClick={onOpenExport}
      sx={{
        ml: 1,
        textTransform: 'none',
        fontWeight: 600,
        color: '#0284c7',
        borderColor: '#0284c7',
        borderRadius: 2,
        '&:hover': {
          borderColor: '#0369a1',
          bgcolor: 'rgba(2, 132, 199, 0.05)',
        },
      }}
    >
      Export to Excel (.xlsx)
    </Button>
  </TopToolbar>
);

const AssignActionCell: React.FC<{ onAssign: (record: any) => void }> = ({ onAssign }) => {
  const record = useRecordContext();
  if (!record) return null;

  return (
    <Button
      size="small"
      variant={record.careManagerId ? 'text' : 'contained'}
      color={record.careManagerId ? 'primary' : 'warning'}
      startIcon={<AssignmentIndIcon />}
      onClick={(e) => {
        e.stopPropagation();
        onAssign(record);
      }}
      sx={{
        textTransform: 'none',
        fontWeight: 600,
        fontSize: '0.75rem',
        py: 0.4,
        px: 1,
        borderRadius: 1.5,
      }}
    >
      {record.careManagerId ? 'Reassign' : 'Assign CM'}
    </Button>
  );
};

export const CaseList: React.FC = () => {
  const [selectedCase, setSelectedCase] = useState<any | null>(null);
  const [exportOpen, setExportOpen] = useState(false);

  return (
    <>
      <List
        filters={caseFilters}
        actions={<CaseListActions onOpenExport={() => setExportOpen(true)} />}
        sort={{ field: 'createdAt', order: 'DESC' }}
        perPage={10}
      >
        <Datagrid rowClick="show" bulkActionButtons={false}>
          {/* Case Number */}
          <FunctionField
            label="Case #"
            render={(record: any) => (
              <Box>
                <Typography variant="body2" sx={{ fontWeight: 800, color: '#0f172a' }}>
                  {record.caseNumber}
                </Typography>
                <Typography variant="caption" sx={{ color: '#64748b' }}>
                  {record.triggerSource}
                </Typography>
              </Box>
            )}
          />

          {/* Priority Chip with distinct visual styling */}
          <FunctionField
            label="Priority"
            render={(record: any) => {
              if (record.priority === 'P1') {
                return (
                  <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.8 }}>
                    <Box
                      className="pulse-emergency"
                      sx={{
                        width: 8,
                        height: 8,
                        borderRadius: '50%',
                        bgcolor: '#dc2626',
                        display: 'inline-block',
                      }}
                    />
                    <Chip
                      icon={<WarningAmberIcon sx={{ fontSize: '14px !important', color: '#ffffff !important' }} />}
                      label="P1 EMERGENCY"
                      size="small"
                      sx={{
                        bgcolor: '#dc2626',
                        color: '#ffffff',
                        fontWeight: 800,
                        fontSize: '0.72rem',
                        boxShadow: '0 2px 6px rgba(220, 38, 38, 0.4)',
                      }}
                    />
                  </Box>
                );
              }
              if (record.priority === 'P2') {
                return (
                  <Chip
                    label="P2 URGENT"
                    size="small"
                    sx={{
                      bgcolor: 'rgba(245, 158, 11, 0.15)',
                      color: '#d97706',
                      fontWeight: 700,
                      fontSize: '0.72rem',
                      border: '1px solid rgba(245, 158, 11, 0.3)',
                    }}
                  />
                );
              }
              return (
                <Chip
                  label="P3 ROUTINE"
                  size="small"
                  sx={{
                    bgcolor: 'rgba(2, 132, 199, 0.1)',
                    color: '#0284c7',
                    fontWeight: 700,
                    fontSize: '0.72rem',
                  }}
                />
              );
            }}
          />

          {/* Title */}
          <TextField source="title" label="Case Title" sx={{ fontWeight: 600, maxWidth: 220 }} />

          {/* Patient */}
          <FunctionField
            label="Patient"
            render={(record: any) => (
              <Box>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  {record.patientName}
                </Typography>
                <Typography variant="caption" sx={{ color: '#64748b' }}>
                  {record.patientPhone}
                </Typography>
              </Box>
            )}
          />

          {/* Status */}
          <FunctionField
            label="Status"
            render={(record: any) => {
              const statusColors: Record<string, { bg: string; text: string }> = {
                OPEN: { bg: 'rgba(59, 130, 246, 0.12)', text: '#2563eb' },
                ASSIGNED: { bg: 'rgba(139, 92, 246, 0.12)', text: '#7c3aed' },
                IN_PROGRESS: { bg: 'rgba(15, 118, 110, 0.12)', text: '#0f766e' },
                RESOLVED: { bg: 'rgba(16, 185, 129, 0.12)', text: '#059669' },
                CANCELLED: { bg: 'rgba(100, 116, 139, 0.12)', text: '#64748b' },
              };
              const style = statusColors[record.status] || { bg: '#f1f5f9', text: '#475569' };
              return (
                <Chip
                  label={record.status}
                  size="small"
                  sx={{
                    bgcolor: style.bg,
                    color: style.text,
                    fontWeight: 800,
                    fontSize: '0.72rem',
                  }}
                />
              );
            }}
          />

          {/* Assigned Care Manager */}
          <FunctionField
            label="Care Manager"
            render={(record: any) => (
              <Box>
                {record.careManagerId ? (
                  <Typography variant="body2" sx={{ fontWeight: 600, color: '#0f766e' }}>
                    {record.careManagerName}
                  </Typography>
                ) : (
                  <Chip
                    label="Unassigned"
                    size="small"
                    sx={{
                      bgcolor: 'rgba(239, 68, 68, 0.1)',
                      color: '#dc2626',
                      fontWeight: 700,
                      fontSize: '0.7rem',
                    }}
                  />
                )}
              </Box>
            )}
          />

          <DateField source="createdAt" label="Triggered At" showTime />

          {/* Actions */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <AssignActionCell onAssign={(rec) => setSelectedCase(rec)} />
            <ShowButton />
          </Box>
        </Datagrid>
      </List>

      {/* Assignment Modal */}
      {selectedCase && (
        <AssignCaseDialog
          open={Boolean(selectedCase)}
          onClose={() => setSelectedCase(null)}
          caseId={selectedCase.id}
          caseNumber={selectedCase.caseNumber}
          currentCareManagerId={selectedCase.careManagerId}
        />
      )}

      {/* Export to Excel Modal */}
      <ExportCasesModal
        open={exportOpen}
        onClose={() => setExportOpen(false)}
      />
    </>
  );
};
