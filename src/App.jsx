import React, { useState } from 'react';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import AppLayout from './layouts/AppLayout';

function App() {
  const [mainPage, setMainPage] = useState('landing');
  const [appView, setAppView] = useState('dashboard');
  const [authMode, setAuthMode] = useState('login');
  const [user, setUser] = useState(null);

  const switchAppView = (view) => {
    setMainPage('app');
    setAppView(view);
  };

  const openAuth = (mode = 'login') => {
    setAuthMode(mode);
    setMainPage('login');
  };

  const switchMainPage = (page, mode = 'login') => {
    if (page === 'login') {
      setAuthMode(mode);
    }
    setMainPage(page);
  };

  return (
    <div className="h-full flex flex-col">
      <main className="flex-1 flex flex-col overflow-hidden relative">
        {mainPage === 'landing' && (
          <LandingPage
            setMainPage={switchMainPage}
            setAppView={switchAppView}
            openAuth={openAuth}
          />
        )}
        {mainPage === 'login' && (
          <LoginPage
            setMainPage={switchMainPage}
            setAppView={switchAppView}
            setUser={setUser}
            initialMode={authMode}
          />
        )}
        {mainPage === 'app' && (
          <AppLayout
            appView={appView}
            setAppView={setAppView}
            switchMainPage={switchMainPage}
            user={user}
          />
        )}
      </main>
    </div>
  );
}

export default App;
