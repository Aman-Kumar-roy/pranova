import React from 'react';
import { Admin, Resource, CustomRoutes } from 'react-admin';
import { Route } from 'react-router-dom';
import { dataProvider } from './providers/dataProvider.js';
import { authProvider } from './providers/authProvider.js';
import { lightTheme, darkTheme } from './theme.js';
import { CustomLogin } from './components/Login.js';
import { Dashboard } from './components/Dashboard.js';
import { CustomLayout } from './components/Layout.js';
import { CustomError } from './components/CustomError.js';
import { SocketTestPlayground } from './components/SocketTestPlayground.js';

// Resources
import cases from './resources/cases/index.js';
import patients from './resources/patients/index.js';
import careManagers from './resources/careManagers/index.js';
import providers from './resources/providers/index.js';
import auditLogs from './resources/auditLogs/index.js';

// Icons
import MedicalServicesOutlinedIcon from '@mui/icons-material/MedicalServicesOutlined';
import PeopleAltOutlinedIcon from '@mui/icons-material/PeopleAltOutlined';
import BadgeOutlinedIcon from '@mui/icons-material/BadgeOutlined';
import LocalHospitalOutlinedIcon from '@mui/icons-material/LocalHospitalOutlined';
import PolicyOutlinedIcon from '@mui/icons-material/PolicyOutlined';

export const App: React.FC = () => {
  return (
    <Admin
      title="PRANOVA Healthcare Console"
      dataProvider={dataProvider}
      authProvider={authProvider}
      theme={lightTheme}
      darkTheme={darkTheme}
      defaultTheme="light"
      loginPage={CustomLogin}
      dashboard={Dashboard}
      layout={CustomLayout}
      error={CustomError}
      requireAuth
    >
      <Resource
        name="cases"
        options={{ label: 'Case Coordination' }}
        icon={MedicalServicesOutlinedIcon}
        list={cases.list}
        show={cases.show}
        create={cases.create}
      />
      <Resource
        name="providers"
        options={{ label: 'Healthcare Providers' }}
        icon={LocalHospitalOutlinedIcon}
        list={providers.list}
        show={providers.show}
        create={providers.create}
        edit={providers.edit}
      />
      <Resource
        name="patients"
        options={{ label: 'Patients' }}
        icon={PeopleAltOutlinedIcon}
        list={patients.list}
        show={patients.show}
        create={patients.create}
        edit={patients.edit}
      />
      <Resource
        name="care-managers"
        options={{ label: 'Care Managers' }}
        icon={BadgeOutlinedIcon}
        list={careManagers.list}
        show={careManagers.show}
        create={careManagers.create}
        edit={careManagers.edit}
      />
      <Resource
        name="audit-logs"
        options={{ label: 'Audit Logs & Compliance' }}
        icon={PolicyOutlinedIcon}
        list={auditLogs.list}
        show={auditLogs.show}
      />

      <CustomRoutes>
        <Route path="/socket-test" element={<SocketTestPlayground />} />
      </CustomRoutes>
    </Admin>
  );
};

export default App;
