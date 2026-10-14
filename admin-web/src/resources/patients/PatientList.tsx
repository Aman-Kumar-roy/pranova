import React from 'react';
import {
  List,
  Datagrid,
  TextField,
  DateField,
  NumberField,
  ShowButton,
  EditButton,
  SearchInput,
  FunctionField,
} from 'react-admin';
import { Chip, Box, Typography } from '@mui/material';

const patientFilters = [
  <SearchInput source="q" alwaysOn placeholder="Search by name, phone or city..." />,
];

export const PatientList: React.FC = () => (
  <List
    filters={patientFilters}
    sort={{ field: 'createdAt', order: 'DESC' }}
    perPage={10}
  >
    <Datagrid rowClick="show" bulkActionButtons={false}>
      <FunctionField
        label="Patient Name"
        render={(record: any) => (
          <Box>
            <Typography variant="body2" sx={{ fontWeight: 700, color: '#0284c7' }}>
              {record.fullName || `${record.firstName || ''} ${record.lastName || ''}`.trim() || 'Patient'}
            </Typography>
            <Typography variant="caption" sx={{ color: '#64748b' }}>
              ID: {record.id.slice(0, 8)}...
            </Typography>
          </Box>
        )}
      />
      <TextField source="phone" label="Contact Phone" />
      <TextField source="city" label="City" />
      <FunctionField
        label="Blood Group"
        render={(record: any) =>
          record.bloodGroup ? (
            <Chip
              label={record.bloodGroup}
              size="small"
              sx={{
                bgcolor: 'rgba(239, 68, 68, 0.1)',
                color: '#dc2626',
                fontWeight: 700,
                fontSize: '0.75rem',
              }}
            />
          ) : (
            <span style={{ color: '#94a3b8' }}>—</span>
          )
        }
      />
      <NumberField source="casesCount" label="Active Cases" />
      <DateField source="createdAt" label="Registered On" showTime />
      <Box sx={{ display: 'flex', gap: 1 }}>
        <ShowButton />
        <EditButton />
      </Box>
    </Datagrid>
  </List>
);
