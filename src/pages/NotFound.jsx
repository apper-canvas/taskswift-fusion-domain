import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getIcon } from '../utils/iconUtils';

const NotFound = () => {
  const AlertCircleIcon = getIcon('alert-circle');
  const ArrowLeftIcon = getIcon('arrow-left');

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4"
    >
      <div className="mb-6 p-6 rounded-full bg-surface-100 dark:bg-surface-800 shadow-neu-light dark:shadow-neu-dark">
        <AlertCircleIcon className="h-16 w-16 text-primary" />
      </div>
      
      <h1 className="text-4xl md:text-5xl font-bold mb-4 text-surface-800 dark:text-surface-100">
        404
      </h1>
      
      <p className="text-xl md:text-2xl font-medium mb-2 text-surface-700 dark:text-surface-200">
        Page Not Found
      </p>
      
      <p className="text-surface-500 dark:text-surface-400 max-w-md mb-8">
        The page you're looking for doesn't exist or has been moved.
      </p>
      
      <Link 
        to="/"
        className="btn-neu flex items-center space-x-2 text-primary"
      >
        <ArrowLeftIcon className="h-5 w-5" />
        <span>Back to Home</span>
      </Link>
    </motion.div>
  );
};

export default NotFound;