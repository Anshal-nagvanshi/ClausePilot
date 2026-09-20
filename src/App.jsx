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
      (event, session) => {
        if (session?.user) {
          setUser(session.user);
          if (event === 'SIGNED_IN') {
            setMainPage('app');
          }
        } else {
          setUser(null);
          if (event === 'SIGNED_OUT') {
            setMainPage('login');
          }
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  // Strict route guard: redirect to login if unauthenticated user attempts to view app workspace
  useEffect(() => {
    if (!authLoading && !user && mainPage === 'app') {
      setMainPage('login');
    }
  }, [authLoading, user, mainPage]);

  const refreshContracts = useCallback(() => {
    setContractsRefreshKey(k => k + 1);
  }, []);

  const switchAppView = (view, contractId = null) => {
    if (!user) {
      setAuthMode('login');
      setMainPage('login');
      return;
    }
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
    if (page === 'app' && !user) {
      setAuthMode('login');
      setMainPage('login');
      return;
    }
    if (page === 'login') {
      setAuthMode(mode);
    }
    setMainPage(page);
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
    } catch (e) {
      console.error('Sign out error:', e);
    }
    setUser(null);
    setSelectedContractId(null);
    setMainPage('login');
    setAppView('dashboard');
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
        {mainPage === 'app' && user ? (
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
        ) : mainPage === 'app' ? (
          <LoginPage
            setMainPage={switchMainPage}
            setAppView={switchAppView}
            setUser={setUser}
            initialMode="login"
          />
        ) : null}
      </main>
    </div>
  );
}

export default App;
