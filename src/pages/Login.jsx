import { useEffect } from 'react';
import { Link } from 'react-router-dom';

function Login() {
  useEffect(() => {
    // Initialize ApperUI login component
    const { ApperUI } = window.ApperSDK;
    ApperUI.showLogin("#authentication");
  }, []);

  return (
    <div className="flex min-h-screen items-center justify-center bg-surface-50 dark:bg-surface-900">
      <div className="w-full max-w-md space-y-8 p-6 bg-white dark:bg-surface-800 rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-surface-800 dark:text-surface-100">Welcome to TaskSwift</h1>
          <p className="mt-2 text-surface-600 dark:text-surface-400">Sign in to manage your tasks</p>
        </div>
        
        {/* Authentication container */}
        <div id="authentication" className="min-h-[400px]" />
        
        <div className="text-center mt-4">
          <p className="text-sm text-surface-600 dark:text-surface-400">
            Don't have an account?{' '}
            <Link to="/signup" className="font-medium text-primary hover:text-primary-dark">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;