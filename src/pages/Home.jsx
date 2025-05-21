import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { toast } from 'react-toastify';
import { getIcon } from '../utils/iconUtils';
import MainFeature from '../components/MainFeature';

const Home = () => {
  const [stats, setStats] = useState({
    total: 0,
    completed: 0,
    pending: 0,
    highPriority: 0
  });
  
  const [tasks, setTasks] = useState(() => {
    const savedTasks = localStorage.getItem('tasks');
    return savedTasks ? JSON.parse(savedTasks) : [];
  });
  
  // Update stats when tasks change
  useEffect(() => {
    const completed = tasks.filter(task => task.completed).length;
    const highPriority = tasks.filter(task => task.priority === 'high').length;
    
    setStats({
      total: tasks.length,
      completed,
      pending: tasks.length - completed,
      highPriority
    });
    
    // Save to localStorage
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  const addTask = (task) => {
    setTasks(prev => [...prev, task]);
    toast.success("Task added successfully!");
  };
  
  const updateTask = (id, updateData) => {
    setTasks(prev => 
      prev.map(task => task.id === id ? { ...task, ...updateData } : task)
    );
    toast.success("Task updated successfully!");
  };
  
  const deleteTask = (id) => {
    setTasks(prev => prev.filter(task => task.id !== id));
    toast.success("Task deleted successfully!");
  };
  
  // Get today's date in a nice format
  const today = format(new Date(), "EEEE, MMMM do, yyyy");
  
  // Icons for the stats cards
  const ListIcon = getIcon('list-checks');
  const CheckIcon = getIcon('check-circle');
  const ClockIcon = getIcon('clock');
  const AlertIcon = getIcon('alert-triangle');

  return (
    <div>
      <motion.section 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <h1 className="text-2xl md:text-3xl font-bold text-surface-800 dark:text-surface-100">
          Welcome to <span className="text-primary">TaskSwift</span>
        </h1>
        <p className="mt-2 text-surface-600 dark:text-surface-300">
          Today is {today}
        </p>
      </motion.section>

      <motion.section 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
      >
        <div className="card-neu flex items-center">
          <div className="p-3 rounded-lg bg-blue-100 dark:bg-blue-900/30 mr-4">
            <ListIcon className="h-6 w-6 text-blue-500 dark:text-blue-400" />
          </div>
          <div>
            <p className="text-surface-500 dark:text-surface-400 text-sm font-medium">Total Tasks</p>
            <p className="text-2xl font-bold text-surface-800 dark:text-surface-100">{stats.total}</p>
          </div>
        </div>
        
        <div className="card-neu flex items-center">
          <div className="p-3 rounded-lg bg-green-100 dark:bg-green-900/30 mr-4">
            <CheckIcon className="h-6 w-6 text-green-500 dark:text-green-400" />
          </div>
          <div>
            <p className="text-surface-500 dark:text-surface-400 text-sm font-medium">Completed</p>
            <p className="text-2xl font-bold text-surface-800 dark:text-surface-100">{stats.completed}</p>
          </div>
        </div>
        
        <div className="card-neu flex items-center">
          <div className="p-3 rounded-lg bg-amber-100 dark:bg-amber-900/30 mr-4">
            <ClockIcon className="h-6 w-6 text-amber-500 dark:text-amber-400" />
          </div>
          <div>
            <p className="text-surface-500 dark:text-surface-400 text-sm font-medium">Pending</p>
            <p className="text-2xl font-bold text-surface-800 dark:text-surface-100">{stats.pending}</p>
          </div>
        </div>
        
        <div className="card-neu flex items-center">
          <div className="p-3 rounded-lg bg-red-100 dark:bg-red-900/30 mr-4">
            <AlertIcon className="h-6 w-6 text-red-500 dark:text-red-400" />
          </div>
          <div>
            <p className="text-surface-500 dark:text-surface-400 text-sm font-medium">High Priority</p>
            <p className="text-2xl font-bold text-surface-800 dark:text-surface-100">{stats.highPriority}</p>
          </div>
        </div>
      </motion.section>

      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <MainFeature 
          tasks={tasks} 
          onAddTask={addTask} 
          onUpdateTask={updateTask} 
          onDeleteTask={deleteTask} 
        />
      </motion.section>
    </div>
  );
};

export default Home;