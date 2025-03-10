import { GuestContextProvider } from '../context/GuestContext';
import DashboardFilter from '../features/dashboard/DashboardFilter';
import DashboardLayout from '../features/dashboard/DashboardLayout';
import CountryInput from '../ui/CountryInput';
import Heading from '../ui/Heading';
import Row from '../ui/Row';

function Dashboard() {
  return (
    <>
      <Row type="horizontal">
        <Heading as="h1">Dashboard</Heading>
        <DashboardFilter />
      </Row>
      <GuestContextProvider>
        <CountryInput />
      </GuestContextProvider>
      <DashboardLayout />
    </>
  );
}

export default Dashboard;
