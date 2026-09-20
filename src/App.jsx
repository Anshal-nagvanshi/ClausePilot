import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from './lib/supabaseClient';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import AppLayout from './layouts/AppLayout';

function App() {
  const [mainPage, setMainPage] = useState('landing');
  const [appView, setAppView] = useState('dashboard');
  const [authMode, setAuthMode] = useState('login');
  const [user, setUser] = useState(null);
  const [selectedContractId, setSelectedContractId] = useState(null);
  const [contractsRefreshKey, setContractsRefreshKey] = useState(0);
  const [authLoading, setAuthLoading] = useState(true);

  // Check for existing session on mount
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser(session.user);
        setMainPage('app');
      }
      setAuthLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (session?.user) {
          setUser(session.user);
        } else {
          setUser(null);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const refreshContracts = useCallback(() => {
    setContractsRefreshKey(k => k + 1);
  }, []);

  const switchAppView = (view, contractId = null) => {
    setMainPage('app');
    setAppView(view);
    if (contractId) {
      setSelectedContractId(contractId);
    }
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

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setMainPage('landing');
    setAppView('dashboard');
    setSelectedContractId(null);
  };

  if (authLoading) {
    return (
      <div className="h-full flex items-center justify-center bg-slate-50">
        <div className="text-center space-y-3">
          <i className="fa-solid fa-file-contract text-brand-600 text-3xl"></i>
          <p className="text-sm font-semibold text-slate-600">Loading ClausePilot...</p>
        </div>
      </div>
    );
  }

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
            setAppView={switchAppView}
            switchMainPage={switchMainPage}
            user={user}
            selectedContractId={selectedContractId}
            setSelectedContractId={setSelectedContractId}
            refreshContracts={refreshContracts}
            contractsRefreshKey={contractsRefreshKey}
            handleLogout={handleLogout}
          />
        )}
      </main>
    </div>
  );
}

export default App;
