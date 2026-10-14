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
} from 'react-admin';
import { Chip, Box, Typography } from '@mui/material';

const careManagerFilters = [
  <SearchInput source="q" alwaysOn placeholder="Search by name, code or zone..." />,
  <SelectInput
    source="isAvailable"
    label="Availability"
    choices={[
      { id: 'true', name: 'Available On-Duty' },
      { id: 'false', name: 'Off-Duty / Busy' },
    ]}
  />,
];

export const CareManagerList: React.FC = () => (
  <List
    filters={careManagerFilters}
    sort={{ field: 'createdAt', order: 'DESC' }}
    perPage={10}
  >
    <Datagrid rowClick="show" bulkActionButtons={false}>
      <TextField source="employeeCode" label="Employee ID" sx={{ fontWeight: 700 }} />
      <FunctionField
        label="Care Manager"
        render={(record: any) => (
          <Box>
            <Typography variant="body2" sx={{ fontWeight: 700, color: '#0f766e' }}>
              {record.fullName || `${record.firstName} ${record.lastName}`}
            </Typography>
            <Typography variant="caption" sx={{ color: '#64748b' }}>
              {record.phone}
            </Typography>
          </Box>
        )}
      />
      <TextField source="specialization" label="Specialization" emptyText="General Coordination" />
      <TextField source="assignedZone" label="Operational Zone" emptyText="Unassigned" />
      <FunctionField
        label="Status"
        render={(record: any) =>
          record.isAvailable ? (
            <Chip
              label="Available"
              size="small"
              sx={{
                bgcolor: 'rgba(16, 185, 129, 0.12)',
                color: '#059669',
                fontWeight: 700,
                fontSize: '0.75rem',
              }}
            />
          ) : (
            <Chip
              label="Off-Duty"
              size="small"
              sx={{
                bgcolor: 'rgba(100, 116, 139, 0.12)',
                color: '#64748b',
                fontWeight: 600,
                fontSize: '0.75rem',
              }}
            />
          )
        }
      />
      <NumberField source="assignedCasesCount" label="Active Cases" />
      <Box sx={{ display: 'flex', gap: 1 }}>
        <ShowButton />
        <EditButton />
      </Box>
    </Datagrid>
  </List>
);
