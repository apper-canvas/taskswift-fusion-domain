import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';
import { getIcon } from '../utils/iconUtils';
import MainFeature from '../components/MainFeature';
import * as taskService from '../services/taskService';

const Home = () => {
  const { user } = useSelector(state => state.user);
  const [stats, setStats] = useState({
    total: 0,
    completed: 0,
    pending: 0,
    highPriority: 0
  });
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load tasks from database
  useEffect(() => {
    const fetchAllTasks = async () => {
      try {
        setLoading(true);
        const fetchedTasks = await taskService.fetchTasks();
        setTasks(fetchedTasks);
        
        // Calculate stats
        const completed = fetchedTasks.filter(task => task.completed).length;
        const highPriority = fetchedTasks.filter(task => task.priority === 'high').length;
        
        setStats({
          total: fetchedTasks.length,
          completed,
          pending: fetchedTasks.length - completed,
          highPriority
        });
        
        setError(null);
      } catch (err) {
        console.error('Failed to fetch tasks:', err);
        setError('Failed to load tasks. Please try again later.');
        toast.error('Failed to load tasks');
      } finally {
        setLoading(false);
      }
    };

    fetchAllTasks();
  }, []);

  const addTask = async (taskData) => {
    try {
      setLoading(true);
      const newTask = await taskService.createTask(taskData);
      setTasks(prev => [...prev, newTask]);
      
      // Update stats
      setStats(prev => ({
        ...prev,
        total: prev.total + 1,
        pending: prev.pending + 1,
        highPriority: taskData.priority === 'high' ? prev.highPriority + 1 : prev.highPriority
      }));
      
      toast.success("Task added successfully!");
    } catch (error) {
      toast.error("Failed to add task");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  
  const updateTask = async (id, updateData) => {
    try {
      setLoading(true);
      await taskService.updateTask(id, updateData);
      
      // Update local state
      setTasks(prev => prev.map(task => task.id === id ? { ...task, ...updateData } : task));
      
      // Update stats if completion status or priority changed
      if (updateData.hasOwnProperty('completed') || updateData.hasOwnProperty('priority')) {
        const updatedTasks = tasks.map(task => task.id === id ? { ...task, ...updateData } : task);
        const completed = updatedTasks.filter(task => task.completed).length;
        const highPriority = updatedTasks.filter(task => task.priority === 'high').length;
        
        setStats({
          total: updatedTasks.length,
          completed,
          pending: updatedTasks.length - completed,
          highPriority
        });
      }
      
      toast.success("Task updated successfully!");
    } catch (error) {
      toast.error("Failed to update task");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  
  const deleteTask = async (id) => {
    try {
      setLoading(true);
      await taskService.deleteTask(id);
      
      // Update local state
      const taskToDelete = tasks.find(task => task.id === id);
      setTasks(prev => prev.filter(task => task.id !== id));
      
      // Update stats
      if (taskToDelete) {
        setStats(prev => ({
          total: prev.total - 1,
          completed: taskToDelete.completed ? prev.completed - 1 : prev.completed,
          pending: !taskToDelete.completed ? prev.pending - 1 : prev.pending,
          highPriority: taskToDelete.priority === 'high' ? prev.highPriority - 1 : prev.highPriority
        }));
      }
      
      toast.success("Task deleted successfully!");
    } catch (error) {
      toast.error("Failed to delete task");
      console.error(error);
    } finally {
      setLoading(false);
    }
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
        <h1 className="text-2xl md:text-3xl font-bold text-surface-800 dark:text-surface-100 flex items-center gap-2">
          Welcome{user && <span>back, {user.firstName || 'User'}</span>} to <span className="text-primary">TaskSwift</span>
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