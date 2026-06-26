import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useModuleStore } from './store/moduleStore';
import { Layout } from './components/Layout/Layout';
import { Dashboard } from './components/Dashboard/Dashboard';
import { ModuleEditor } from './components/Editor/ModuleEditor';
import { ModulePreview } from './components/Preview/ModulePreview';

const pageVariants = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
};

const pageTransition = {
  type: 'tween' as const,
  duration: 0.2,
  ease: 'easeInOut',
};

export default function App() {
  const activeView = useModuleStore((s) => s.activeView);

  return (
    <Layout>
      <AnimatePresence mode="wait">
        {activeView === 'dashboard' && (
          <motion.div
            key="dashboard"
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={pageTransition}
          >
            <Dashboard />
          </motion.div>
        )}

        {activeView === 'editor' && (
          <motion.div
            key="editor"
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={pageTransition}
          >
            <ModuleEditor />
          </motion.div>
        )}

        {activeView === 'preview' && (
          <motion.div
            key="preview"
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={pageTransition}
          >
            <ModulePreview />
          </motion.div>
        )}
      </AnimatePresence>
    </Layout>
  );
}
