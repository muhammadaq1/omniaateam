import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useStore } from '@/store/useStore';
import { Layout } from '@/components/Layout';
import { Dashboard } from '@/components/Dashboard';
import { BoardView } from '@/components/BoardView';

function App() {
  const { initializeDemoData, currentProject } = useStore();

  useEffect(() => {
    // Initialize demo data if no project exists
    if (!currentProject) {
      initializeDemoData();
    }
  }, [currentProject, initializeDemoData]);

  return (
    <Router>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
        <Layout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/board" element={<BoardView />} />
            <Route path="/board/:boardId" element={<BoardView />} />
          </Routes>
        </Layout>
      </div>
    </Router>
  );
}

export default App;
