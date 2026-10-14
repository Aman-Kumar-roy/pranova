import React from 'react';
import {
  List,
  Datagrid,
  TextField,
  DateField,
  ShowButton,
  SearchInput,
  SelectInput,
  FunctionField,
} from 'react-admin';
import { Chip, Box, Typography } from '@mui/material';

const auditLogFilters = [
  <SearchInput source="q" alwaysOn placeholder="Search by actor, action, reason..." />,
  <SelectInput
    source="resource"
    label="Resource"
    choices={[
      { id: 'Case', name: 'Cases' },
      { id: 'Provider', name: 'Providers' },
      { id: 'Patient', name: 'Patients' },
      { id: 'CareManager', name: 'Care Managers' },
      { id: 'User', name: 'Users' },
    ]}
  />,
];

export const AuditLogList: React.FC = () => (
  <List
    filters={auditLogFilters}
    sort={{ field: 'createdAt', order: 'DESC' }}
    perPage={15}
    exporter={false}
  >
    <Datagrid rowClick="show" bulkActionButtons={false}>
      <DateField source="createdAt" label="Timestamp" showTime sx={{ fontWeight: 600 }} />

      <FunctionField
        label="Method"
        render={(record: any) => {
          const colors: Record<string, { bg: string; text: string }> = {
            POST: { bg: 'rgba(16, 185, 129, 0.12)', text: '#059669' },
            PATCH: { bg: 'rgba(245, 158, 11, 0.12)', text: '#d97706' },
            PUT: { bg: 'rgba(245, 158, 11, 0.12)', text: '#d97706' },
            DELETE: { bg: 'rgba(239, 68, 68, 0.12)', text: '#dc2626' },
          };
          const style = colors[record.httpMethod] || { bg: '#f1f5f9', text: '#64748b' };
          return (
            <Chip
              label={record.httpMethod}
              size="small"
              sx={{ bgcolor: style.bg, color: style.text, fontWeight: 800, fontSize: '0.7rem' }}
            />
          );
        }}
      />

      <FunctionField
        label="Action"
        render={(record: any) => (
          <Typography variant="body2" sx={{ fontWeight: 700, color: '#0f172a' }}>
            {record.action.replace(/_/g, ' ')}
          </Typography>
        )}
      />

      <TextField source="resource" label="Resource" sx={{ fontWeight: 600 }} />

      <FunctionField
        label="Actor"
        render={(record: any) => (
          <Box>
            <Typography variant="body2" sx={{ fontWeight: 600, color: '#0284c7' }}>
              {record.actorEmail || 'System Automated'}
            </Typography>
            <Typography variant="caption" sx={{ color: '#64748b' }}>
              {record.actorRole || 'SYSTEM'}
            </Typography>
          </Box>
        )}
      />

      <FunctionField
        label="Reason / Purpose"
        render={(record: any) =>
          record.reason ? (
            <Chip
              label={record.reason}
              size="small"
              sx={{
                bgcolor: 'rgba(2, 132, 199, 0.08)',
                color: '#0369a1',
                maxWidth: 220,
                fontWeight: 600,
                fontSize: '0.72rem',
              }}
            />
          ) : (
            <span style={{ color: '#94a3b8' }}>—</span>
          )
        }
      />

      <TextField source="ipAddress" label="IP Address" />

      <FunctionField
        label="Status"
        render={(record: any) => (
          <Chip
            label={record.status || 'SUCCESS'}
            size="small"
            sx={{
              bgcolor: record.status === 'FAILED' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(16, 185, 129, 0.1)',
              color: record.status === 'FAILED' ? '#dc2626' : '#059669',
              fontWeight: 800,
              fontSize: '0.7rem',
            }}
          />
        )}
      />

      <ShowButton />
    </Datagrid>
  </List>
);
