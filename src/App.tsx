import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { Dashboard } from './components/Dashboard';
import { InstitutionInfo } from './components/InstitutionInfo';
import { StudentsView } from './components/StudentsView';
import { TeachersView } from './components/TeachersView';
import { ExamView } from './components/ExamView';
import { ResultView } from './components/ResultView';
import { CertificatesView } from './components/CertificatesView';
import { FeesView } from './components/FeesView';
import { NoticesView } from './components/NoticesView';
import { QuestionBankView } from './components/QuestionBankView';
import { QuestionPaperMakerView } from './components/QuestionPaperMakerView';
import { SettingsView } from './components/SettingsView';
import { LockScreen } from './components/LockScreen';

const MainLayout: React.FC = () => {
  const { activeTab } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const renderActiveView = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'institution':
        return <InstitutionInfo />;
      case 'students':
        return <StudentsView />;
      case 'teachers':
        return <TeachersView />;
      case 'exam-routine':
        return <ExamView initialSubTab="routine" key="exam-routine" />;
      case 'admit-card':
        return <ExamView initialSubTab="admit" key="admit-card" />;
      case 'seat-plan':
        return <ExamView initialSubTab="seat" key="seat-plan" />;
      case 'question-bank':
        return <QuestionBankView />;
      case 'saved-papers':
        return <QuestionPaperMakerView initialTab="saved-papers" key="saved-papers" />;
      case 'add-question':
      case 'exam-questions':
        return <QuestionPaperMakerView initialTab="builder" key="exam-questions" />;
      case 'results':
        return <ResultView />;
      case 'certificates':
        return <CertificatesView />;
      case 'fees':
        return <FeesView />;
      case 'notices':
        return <NoticesView />;
      case 'settings':
        return <SettingsView />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="h-screen w-screen overflow-hidden flex bg-[#eae8d9] text-[#1f332c] font-['Hind_Siliguri','Plus_Jakarta_Sans',sans-serif]">
      {/* 
        FIXED LEFT SIDEBAR:
        - Stationary on desktop with modern deep slate-green palette
        - Responsive slide-over for mobile/tablet screens
      */}
      <Sidebar mobileOpen={mobileMenuOpen} setMobileOpen={setMobileMenuOpen} />

      {/* 
        MAIN CONTENT CONTAINER:
        - Natural soft off-white/beige background canvas (#eae8d9)
        - Sticky header with light blue hairline borders (#c0dfe1)
      */}
      <div className="flex-1 h-screen flex flex-col min-w-0 overflow-hidden bg-[#eae8d9]">
        {/* Top Header */}
        <Header onToggleMobileMenu={() => setMobileMenuOpen(!mobileMenuOpen)} />

        {/* 
          SCROLLABLE CONTENT AREA:
          - Independent vertical scrolling with styled sage scrollbar
        */}
        <main className="flex-1 overflow-y-auto p-3 sm:p-5 md:p-6 w-full">
          {renderActiveView()}
        </main>
      </div>

      {/* Security Lock Screen Modal */}
      <LockScreen />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}
