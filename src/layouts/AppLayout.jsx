import React, { useState, useEffect, useCallback } from 'react';
import Sidebar from '../components/Sidebar';
import TopHeader from '../components/TopHeader';
import Dashboard from '../pages/Dashboard';
import Contracts from '../pages/Contracts';
import Upload from '../pages/Upload';
import ContractDetails from '../pages/ContractDetails';
import Obligations from '../pages/Obligations';
import Timeline from '../pages/Timeline';
import Alerts from '../pages/Alerts';
import Compare from '../pages/Compare';
import AskAI from '../pages/AskAI';
import Reports from '../pages/Reports';
import Settings from '../pages/Settings';
import { getAlertsCount } from '../lib/contractService';

export default function AppLayout({
    appView, setAppView, switchMainPage, user,
    selectedContractId, setSelectedContractId,
    refreshContracts, contractsRefreshKey, handleLogout
}) {
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const [alertCount, setAlertCount] = useState(0);

    const refreshAlertCount = useCallback(async () => {
        try {
            const count = await getAlertsCount();
            setAlertCount(count);
        } catch (e) {
            console.error('Failed to load alert count:', e);
        }
    }, []);

    useEffect(() => {
        refreshAlertCount();
    }, [contractsRefreshKey, refreshAlertCount]);

    const navigateToContract = (contractId) => {
        setSelectedContractId(contractId);
        setAppView('contract-details');
    };

    return (
        <div className="flex-1 flex overflow-hidden">
            <Sidebar appView={appView} setAppView={setAppView} alertCount={alertCount} />

            <div className="flex-1 flex flex-col min-w-0 bg-slate-50 overflow-hidden">
                <TopHeader
                    setAppView={setAppView}
                    switchMainPage={switchMainPage}
                    isUserMenuOpen={isUserMenuOpen}
                    setIsUserMenuOpen={setIsUserMenuOpen}
                    user={user}
                    handleLogout={handleLogout}
                    alertCount={alertCount}
                />

                <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
                    {appView === 'dashboard' && (
                        <Dashboard
                            setAppView={setAppView}
                            user={user}
                            navigateToContract={navigateToContract}
                            contractsRefreshKey={contractsRefreshKey}
                        />
                    )}
                    {appView === 'contracts' && (
                        <Contracts
                            setAppView={setAppView}
                            navigateToContract={navigateToContract}
                            contractsRefreshKey={contractsRefreshKey}
                        />
                    )}
                    {appView === 'upload' && (
                        <Upload
                            setAppView={setAppView}
                            user={user}
                            refreshContracts={refreshContracts}
                            navigateToContract={navigateToContract}
                        />
                    )}
                    {appView === 'contract-details' && (
                        <ContractDetails
                            setAppView={setAppView}
                            contractId={selectedContractId}
                            navigateToContract={navigateToContract}
                        />
                    )}
                    {appView === 'obligations' && (
                        <Obligations
                            setAppView={setAppView}
                            contractId={selectedContractId}
                        />
                    )}
                    {appView === 'timeline' && (
                        <Timeline
                            setAppView={setAppView}
                            contractId={selectedContractId}
                            navigateToContract={navigateToContract}
                        />
                    )}
                    {appView === 'alerts' && (
                        <Alerts
                            setAppView={setAppView}
                            navigateToContract={navigateToContract}
                            onAlertsCountChange={setAlertCount}
                        />
                    )}
                    {appView === 'compare' && <Compare setAppView={setAppView} />}
                    {appView === 'ask-ai' && (
                        <AskAI
                            setAppView={setAppView}
                            contractId={selectedContractId}
                            navigateToContract={navigateToContract}
                        />
                    )}
                    {appView === 'reports' && (
                        <Reports
                            setAppView={setAppView}
                            contractId={selectedContractId}
                            navigateToContract={navigateToContract}
                        />
                    )}
                    {appView === 'settings' && (
                        <Settings
                            setAppView={setAppView}
                            user={user}
                            handleLogout={handleLogout}
                        />
                    )}
                </div>
            </div>
        </div>
    );
}
