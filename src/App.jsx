import React, { useState } from 'react';
import Navigation from './components/Navigation';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import AppLayout from './layouts/AppLayout';

function App() {
  const [mainPage, setMainPage] = useState('landing');
  const [appView, setAppView] = useState('dashboard');

  const switchAppView = (view) => {
    setMainPage('app');
    setAppView(view);
  };

  const switchMainPage = (page) => {
    setMainPage(page);
  };

  return (
    <div className="h-full flex flex-col">
      <Navigation
        mainPage={mainPage}
        setMainPage={switchMainPage}
        appView={appView}
        setAppView={switchAppView}
      />
      <main className="flex-1 flex flex-col overflow-hidden relative">
        {mainPage === 'landing' && <LandingPage setMainPage={switchMainPage} setAppView={switchAppView} />}
        {mainPage === 'login' && <LoginPage setMainPage={switchMainPage} setAppView={switchAppView} />}
        {mainPage === 'app' && <AppLayout appView={appView} setAppView={setAppView} switchMainPage={switchMainPage} />}
      </main>
    </div>
  );
}

export default App;
