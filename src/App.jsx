import { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { getIcon } from './utils/iconUtils';
import Home from './pages/Home';
import NotFound from './pages/NotFound';

const App = () => {
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem('darkMode') === 'true' || 
    window.matchMedia('(prefers-color-scheme: dark)').matches
  );

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('darkMode', darkMode);
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode(prev => !prev);
  };

  return (
    <div className="min-h-screen bg-surface-50 dark:bg-surface-900 text-surface-800 dark:text-surface-100 transition-colors duration-200">
      <header className="sticky top-0 z-10 bg-white dark:bg-surface-800 shadow-sm border-b border-surface-200 dark:border-surface-700">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <span className="text-primary font-bold text-xl">TaskSwift</span>
          </div>
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-full bg-surface-100 dark:bg-surface-700 hover:bg-surface-200 dark:hover:bg-surface-600 transition-colors"
            aria-label="Toggle dark mode"
          >
            {darkMode ? 
              (() => {
                const SunIcon = getIcon('sun');
                return <SunIcon className="h-5 w-5 text-yellow-400" />;
              })() : 
              (() => {
                const MoonIcon = getIcon('moon');
                return <MoonIcon className="h-5 w-5 text-surface-600" />;
              })()
            }
          </button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      <footer className="mt-auto py-4 border-t border-surface-200 dark:border-surface-700">
        <div className="container mx-auto px-4 text-center text-sm text-surface-500">
          &copy; {new Date().getFullYear()} TaskSwift. All rights reserved.
        </div>
      </footer>

      <ToastContainer
        position="bottom-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme={darkMode ? "dark" : "light"}
        toastClassName="bg-surface-50 dark:bg-surface-800 shadow-card"
      />
    </div>
  );
};

export default App;