import React, { useState } from 'react';
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

export default function AppLayout({ appView, setAppView, switchMainPage, user }) {
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

    return (
        <div className="flex-1 flex overflow-hidden">
            <Sidebar appView={appView} setAppView={setAppView} />

            <div className="flex-1 flex flex-col min-w-0 bg-slate-50 overflow-hidden">
                <TopHeader
                    setAppView={setAppView}
                    switchMainPage={switchMainPage}
                    isUserMenuOpen={isUserMenuOpen}
                    setIsUserMenuOpen={setIsUserMenuOpen}
                    user={user}
                />

                <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
                    {appView === 'dashboard' && <Dashboard setAppView={setAppView} />}
                    {appView === 'contracts' && <Contracts setAppView={setAppView} />}
                    {appView === 'upload' && <Upload setAppView={setAppView} />}
                    {appView === 'contract-details' && <ContractDetails setAppView={setAppView} />}
                    {appView === 'obligations' && <Obligations setAppView={setAppView} />}
                    {appView === 'timeline' && <Timeline setAppView={setAppView} />}
                    {appView === 'alerts' && <Alerts setAppView={setAppView} />}
                    {appView === 'compare' && <Compare setAppView={setAppView} />}
                    {appView === 'ask-ai' && <AskAI setAppView={setAppView} />}
                    {appView === 'reports' && <Reports setAppView={setAppView} />}
                    {appView === 'settings' && <Settings setAppView={setAppView} />}
                </div>
            </div>
        </div>
    );
}
