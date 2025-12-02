
import React, { useContext } from 'react';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import { AuthContext } from './context/AuthContext';

const App: React.FC = () => {
  const authContext = useContext(AuthContext);

  if (!authContext) {
    return <div>Loading...</div>;
  }

  const { user } = authContext;

  return (
    <div className="bg-gray-900 min-h-screen text-white">
      {user ? <Dashboard /> : <Login />}
    </div>
  );
};

export default App;
