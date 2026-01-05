import { AuthProvider } from './context/AuthContext';
import { ToasterProvider } from './components/ui/Toaster';
import DashboardLayout from './components/layout/DashboardLayout';
import { UploadZone } from './components/features/UploadZone';
import FlowController from './components/workflow/FlowController';
import { useWorkflowState } from './hooks/useWorkflowState';
import { useState } from 'react';

// Placeholder for now
const RightPanelPlaceholder = () => (
  <div style={{ color: 'var(--color-text-muted)' }}>
    <h3>Output Context</h3>
    <p style={{ marginTop: '1rem', fontSize: '0.9rem' }}>
      Select an action to see results here.
    </p>
  </div>
);

import { HistoryView } from './components/features/HistoryView';

function AppContent() {
  const [media, setMedia] = useState(null);
  const [rightPanelContent, setRightPanelContent] = useState(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const workflow = useWorkflowState();

  const handleUpload = (uploadedMedia) => {
    setMedia(uploadedMedia);
    workflow.setUploaded();
  };

  const renderContent = () => {
    if (activeTab === 'history') {
      return <HistoryView />;
    }

    if (!media) {
      return <UploadZone onUpload={handleUpload} />;
    }

    return (
      <div className="animate-in fade-in h-full">
        <FlowController
          media={media}
          setMedia={setMedia}
          setRightPanelContent={setRightPanelContent}
          workflow={workflow}
        />
      </div>
    );
  };

  return (
    <DashboardLayout
      rightPanel={rightPanelContent || <RightPanelPlaceholder />}
      workflowStatus={activeTab === 'dashboard' ? workflow.status : 'completed'}
      activeTab={activeTab}
      onNavigate={setActiveTab}
    >
      {renderContent()}
    </DashboardLayout>
  );
}

function App() {
  return (
    <AuthProvider>
      <ToasterProvider>
        <AppContent />
      </ToasterProvider>
    </AuthProvider>
  );
}

export default App;
