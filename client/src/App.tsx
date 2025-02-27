import { useEffect } from 'react';
import Routes from './routes';

import './styles/App.css';
import useAuthStore from './zustand/useAuthStore';
import { initializeSocket } from './lib/socket';

const App = () => {

  const initializeUser = useAuthStore(state => state.initializeUser);

  useEffect(() => {
      initializeUser();
      initializeSocket();
  }, [initializeUser, initializeSocket]);

  return (
    <Routes/>
  );
}

export default App;
