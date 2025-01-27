import { useEffect } from 'react';

import Routes from './routes';

import useAuthStore from './zustand/useAuthStore';

import './styles/App.css';


const App = () => {

  const initializeUser = useAuthStore(state => state.initializeUser);

  useEffect(() => {
    initializeUser();
  }, [initializeUser]);

  return (
    <Routes/>
  );
}

export default App;
