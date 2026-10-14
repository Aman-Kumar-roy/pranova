import React from 'react';
import {
  List,
  Datagrid,
  TextField,
  NumberField,
  ShowButton,
  EditButton,
  SearchInput,
  SelectInput,
  FunctionField,
  useUpdate,
  useNotify,
  useRefresh,
  useRecordContext,
} from 'react-admin';
import {
  Chip,
  Box,
  Typography,
  Button,
  ButtonGroup,
  Tooltip,
} from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import BlockIcon from '@mui/icons-material/Block';

const providerFilters = [
  <SearchInput source="q" alwaysOn placeholder="Search by name, city, contact..." />,
  <SelectInput
    source="type"
    label="Provider Type"
    choices={[
      { id: 'HOSPITAL', name: 'Hospital' },
      { id: 'LAB', name: 'Diagnostic Lab' },
      { id: 'CLINIC', name: 'Specialty Clinic' },
      { id: 'AMBULANCE', name: 'Ambulance Fleet' },
      { id: 'PHARMACY', name: 'Pharmacy' },
    ]}
  />,
  <SelectInput
    source="status"
    label="Status"
    choices={[
      { id: 'ACTIVE', name: 'Active' },
      { id: 'PAUSED', name: 'Paused' },
      { id: 'DEACTIVATED', name: 'Deactivated' },
    ]}
  />,
];

const StatusActionButtons: React.FC = () => {
  const record = useRecordContext();
  const [update, { isPending }] = useUpdate();
  const notify = useNotify();
  const refresh = useRefresh();

  if (!record) return null;

  const handleStatusChange = (newStatus: 'ACTIVE' | 'PAUSED' | 'DEACTIVATED') => {
    update(
      'providers',
      { id: record.id, data: { status: newStatus }, previousData: record },
      {
        onSuccess: () => {
          notify(`Provider status updated to ${newStatus}`, { type: 'success' });
          refresh();
        },
        onError: (error: any) => {
          notify(`Error updating status: ${error.message}`, { type: 'error' });
        },
      }
    );
  };

  return (
    <ButtonGroup size="small" variant="outlined" disabled={isPending}>
      {record.status !== 'ACTIVE' && (
        <Tooltip title="Activate Provider">
          <Button
            onClick={(e) => {
              e.stopPropagation();
              handleStatusChange('ACTIVE');
            }}
            sx={{ color: '#10b981', borderColor: 'rgba(16, 185, 129, 0.4)', px: 0.8 }}
          >
            <PlayArrowIcon fontSize="small" />
          </Button>
        </Tooltip>
      )}

      {record.status !== 'PAUSED' && (
        <Tooltip title="Pause Operations">
          <Button
            onClick={(e) => {
              e.stopPropagation();
              handleStatusChange('PAUSED');
            }}
            sx={{ color: '#f59e0b', borderColor: 'rgba(245, 158, 11, 0.4)', px: 0.8 }}
          >
            <PauseIcon fontSize="small" />
          </Button>
        </Tooltip>
      )}

      {record.status !== 'DEACTIVATED' && (
        <Tooltip title="Deactivate Provider">
          <Button
            onClick={(e) => {
              e.stopPropagation();
              handleStatusChange('DEACTIVATED');
            }}
            sx={{ color: '#ef4444', borderColor: 'rgba(239, 68, 68, 0.4)', px: 0.8 }}
          >
            <BlockIcon fontSize="small" />
          </Button>
        </Tooltip>
      )}
    </ButtonGroup>
  );
};

export const ProviderList: React.FC = () => (
  <List
    filters={providerFilters}
    sort={{ field: 'createdAt', order: 'DESC' }}
    perPage={10}
  >
    <Datagrid rowClick="show" bulkActionButtons={false}>
      <FunctionField
        label="Provider Facility"
        render={(record: any) => (
          <Box>
            <Typography variant="body2" sx={{ fontWeight: 700, color: '#0284c7' }}>
              {record.name}
            </Typography>
            <Typography variant="caption" sx={{ color: '#64748b' }}>
              {record.city}, {record.state}
            </Typography>
          </Box>
        )}
      />
      <FunctionField
        label="Type"
        render={(record: any) => {
          const colors: Record<string, { bg: string; text: string }> = {
            HOSPITAL: { bg: 'rgba(2, 132, 199, 0.1)', text: '#0284c7' },
            LAB: { bg: 'rgba(139, 92, 246, 0.1)', text: '#7c3aed' },
            CLINIC: { bg: 'rgba(15, 118, 110, 0.1)', text: '#0f766e' },
            AMBULANCE: { bg: 'rgba(239, 68, 68, 0.1)', text: '#dc2626' },
            PHARMACY: { bg: 'rgba(16, 185, 129, 0.1)', text: '#059669' },
          };
          const style = colors[record.type] || { bg: '#e2e8f0', text: '#475569' };
          return (
            <Chip
              label={record.type}
              size="small"
              sx={{ bgcolor: style.bg, color: style.text, fontWeight: 700, fontSize: '0.75rem' }}
            />
          );
        }}
      />
      <FunctionField
        label="Operational Status"
        render={(record: any) => {
          const statusMap: Record<string, { bg: string; text: string; label: string }> = {
            ACTIVE: { bg: 'rgba(16, 185, 129, 0.12)', text: '#059669', label: 'ACTIVE' },
            PAUSED: { bg: 'rgba(245, 158, 11, 0.12)', text: '#d97706', label: 'PAUSED' },
            DEACTIVATED: { bg: 'rgba(239, 68, 68, 0.12)', text: '#dc2626', label: 'DEACTIVATED' },
          };
          const conf = statusMap[record.status] || { bg: '#e2e8f0', text: '#64748b', label: record.status };
          return (
            <Chip
              label={conf.label}
              size="small"
              sx={{ bgcolor: conf.bg, color: conf.text, fontWeight: 800, fontSize: '0.72rem' }}
            />
          );
        }}
      />
      <TextField source="phone" label="Phone" />
      <TextField source="contactPerson" label="Contact Person" emptyText="—" />
      <NumberField source="rating" label="Rating" options={{ minimumFractionDigits: 1 }} />
      <FunctionField
        label="Status Action"
        render={() => <StatusActionButtons />}
      />
      <Box sx={{ display: 'flex', gap: 1 }}>
        <ShowButton />
        <EditButton />
      </Box>
    </Datagrid>
  </List>
);
