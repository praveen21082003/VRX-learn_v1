import { Route } from 'react-router-dom';
import UserManagement from '../pages/Users/UserManagement';
import EnrollmentsManagement from '../pages/Enrollments/EnrollmentsManagement';

const AdminRoutes = () => {

  return (
    <>
      <Route path="/users" element={<UserManagement />} />
      <Route path="/enrollments" element={<EnrollmentsManagement />} />
    </>
  );
};

export default AdminRoutes;