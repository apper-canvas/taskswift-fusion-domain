import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { format, isValid, parseISO } from 'date-fns';
import { toast } from 'react-toastify';
import { getIcon } from '../utils/iconUtils';

const MainFeature = ({ tasks, onAddTask, onUpdateTask, onDeleteTask }) => {
  // Form states
  const [formVisible, setFormVisible] = useState(false);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    dueDate: '',
    priority: 'medium',
    category: 'personal'
  });
  const [validationErrors, setValidationErrors] = useState({});
  
  // Filter and sorting states
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('dateCreated');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Editing states
  const [editingTaskId, setEditingTaskId] = useState(null);
  
  // Dragging states
  const [draggedTaskId, setDraggedTaskId] = useState(null);
  
  // Refs
  const formRef = useRef(null);
  const searchInputRef = useRef(null);
  
  // Handle outside click for form
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (formRef.current && !formRef.current.contains(event.target) && formVisible) {
        setFormVisible(false);
        resetForm();
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [formVisible]);
  
  // Reset form fields
  const resetForm = () => {
    setNewTask({
      title: '',
      description: '',
      dueDate: '',
      priority: 'medium',
      category: 'personal'
    });
    setValidationErrors({});
    setEditingTaskId(null);
  };
  
  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewTask(prev => ({ ...prev, [name]: value }));
    
    // Clear validation error for this field if it exists
    if (validationErrors[name]) {
      setValidationErrors(prev => ({ ...prev, [name]: null }));
    }
  };
  
  // Validate form
  const validateForm = () => {
    const errors = {};
    
    if (!newTask.title.trim()) {
      errors.title = "Title is required";
    }
    
    if (newTask.dueDate && !isValid(parseISO(newTask.dueDate))) {
      errors.dueDate = "Please enter a valid date";
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error("Please fix the errors in the form");
      return;
    }
    
    if (editingTaskId) {
      // Update existing task
      onUpdateTask(editingTaskId, {
        ...newTask,
        updatedAt: new Date().toISOString()
      });
    } else {
      // Add new task
      onAddTask({
        id: Date.now().toString(),
        ...newTask,
        completed: false,
        createdAt: new Date().toISOString()
      });
    }
    
    resetForm();
    setFormVisible(false);
  };
  
  // Edit task
  const handleEditTask = (task) => {
    setNewTask({
      title: task.title,
      description: task.description || '',
      dueDate: task.dueDate || '',
      priority: task.priority || 'medium',
      category: task.category || 'personal'
    });
    setEditingTaskId(task.id);
    setFormVisible(true);
  };
  
  // Toggle task completion
  const handleToggleComplete = (id, currentStatus) => {
    onUpdateTask(id, { completed: !currentStatus });
  };
  
  // Handle search
  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };
  
  // Clear search
  const clearSearch = () => {
    setSearchQuery('');
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  };
  
  // Handle drag start
  const handleDragStart = (taskId) => {
    setDraggedTaskId(taskId);
  };
  
  // Handle drag end
  const handleDragEnd = () => {
    setDraggedTaskId(null);
  };
  
  // Filter and sort tasks
  const filteredAndSortedTasks = tasks
    .filter(task => {
      // Apply filter
      if (filter === 'completed') return task.completed;
      if (filter === 'active') return !task.completed;
      if (filter === 'high-priority') return task.priority === 'high';
      
      // Always apply search regardless of filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return task.title.toLowerCase().includes(query) || 
               (task.description && task.description.toLowerCase().includes(query));
      }
      
      return true; // 'all' filter
    })
    .sort((a, b) => {
      // Apply sorting
      switch (sortBy) {
        case 'title':
          return a.title.localeCompare(b.title);
        case 'priority':
          const priorityOrder = { high: 1, medium: 2, low: 3 };
          return priorityOrder[a.priority] - priorityOrder[b.priority];
        case 'dueDate':
          // Sort by due date, null dates at the end
          if (!a.dueDate) return 1;
          if (!b.dueDate) return -1;
          return new Date(a.dueDate) - new Date(b.dueDate);
        case 'dateCreated':
        default:
          // Newest first
          return new Date(b.createdAt) - new Date(a.createdAt);
      }
    });
  
  // Icons
  const PlusIcon = getIcon('plus');
  const SearchIcon = getIcon('search');
  const XIcon = getIcon('x');
  const CalendarIcon = getIcon('calendar');
  const TagIcon = getIcon('tag');
  const EditIcon = getIcon('edit');
  const TrashIcon = getIcon('trash-2');
  const ArrowUpIcon = getIcon('arrow-up');
  const ArrowDownIcon = getIcon('arrow-down');
  const ClockIcon = getIcon('clock');
  const CheckIcon = getIcon('check');

  // Priority colors mapping
  const priorityColors = {
    high: "text-red-500 dark:text-red-400",
    medium: "text-amber-500 dark:text-amber-400",
    low: "text-green-500 dark:text-green-400"
  };
  
  const priorityBgColors = {
    high: "bg-red-100 dark:bg-red-900/30",
    medium: "bg-amber-100 dark:bg-amber-900/30",
    low: "bg-green-100 dark:bg-green-900/30"
  };
  
  // Category colors
  const categoryColors = {
    work: "bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300",
    personal: "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300",
    shopping: "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300",
    health: "bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-300",
    other: "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300"
  };
  
  return (
    <div className="space-y-6">
      {/* Header with filter controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-surface-800 dark:text-surface-100">
            My Tasks
          </h2>
          <p className="text-surface-500 dark:text-surface-400 text-sm">
            Manage and organize your tasks
          </p>
        </div>
        
        <div className="flex flex-wrap gap-2">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="btn-neu text-sm min-w-[120px]"
          >
            <option value="all">All Tasks</option>
            <option value="active">Active</option>
            <option value="completed">Completed</option>
            <option value="high-priority">High Priority</option>
          </select>
          
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="btn-neu text-sm min-w-[120px]"
          >
            <option value="dateCreated">Date Created</option>
            <option value="dueDate">Due Date</option>
            <option value="priority">Priority</option>
            <option value="title">Title</option>
          </select>
          
          <button
            onClick={() => {
              setFormVisible(true);
              resetForm();
            }}
            className="btn-neu bg-primary text-white hover:bg-primary-dark"
          >
            <span className="flex items-center">
              <PlusIcon className="h-5 w-5 mr-1" />
              New Task
            </span>
          </button>
        </div>
      </div>
      
      {/* Search field */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <SearchIcon className="h-5 w-5 text-surface-400" />
        </div>
        <input
          type="text"
          ref={searchInputRef}
          placeholder="Search tasks..."
          value={searchQuery}
          onChange={handleSearch}
          className="pl-10 w-full"
        />
        {searchQuery && (
          <button
            onClick={clearSearch}
            className="absolute inset-y-0 right-0 pr-3 flex items-center"
          >
            <XIcon className="h-5 w-5 text-surface-400 hover:text-surface-600" />
          </button>
        )}
      </div>
      
      {/* Form for adding/editing tasks */}
      <AnimatePresence>
        {formVisible && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div 
              ref={formRef}
              className="card-neu border border-surface-200 dark:border-surface-700"
            >
              <h3 className="text-lg font-semibold mb-4 text-surface-800 dark:text-surface-100">
                {editingTaskId ? 'Edit Task' : 'Add New Task'}
              </h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">
                    Task Title *
                  </label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={newTask.title}
                    onChange={handleInputChange}
                    placeholder="Enter task title"
                    className={`w-full ${validationErrors.title ? 'border-red-500 focus:ring-red-500' : ''}`}
                  />
                  {validationErrors.title && (
                    <p className="mt-1 text-sm text-red-500">{validationErrors.title}</p>
                  )}
                </div>
                
                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">
                    Description
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={newTask.description}
                    onChange={handleInputChange}
                    placeholder="Add details about this task"
                    rows="3"
                    className="w-full"
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label htmlFor="dueDate" className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">
                      Due Date
                    </label>
                    <input
                      type="date"
                      id="dueDate"
                      name="dueDate"
                      value={newTask.dueDate}
                      onChange={handleInputChange}
                      className={`w-full ${validationErrors.dueDate ? 'border-red-500 focus:ring-red-500' : ''}`}
                    />
                    {validationErrors.dueDate && (
                      <p className="mt-1 text-sm text-red-500">{validationErrors.dueDate}</p>
                    )}
                  </div>
                  
                  <div>
                    <label htmlFor="priority" className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">
                      Priority
                    </label>
                    <select
                      id="priority"
                      name="priority"
                      value={newTask.priority}
                      onChange={handleInputChange}
                      className="w-full"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                  </div>
                  
                  <div>
                    <label htmlFor="category" className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">
                      Category
                    </label>
                    <select
                      id="category"
                      name="category"
                      value={newTask.category}
                      onChange={handleInputChange}
                      className="w-full"
                    >
                      <option value="personal">Personal</option>
                      <option value="work">Work</option>
                      <option value="shopping">Shopping</option>
                      <option value="health">Health</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>
                
                <div className="flex justify-end space-x-3 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setFormVisible(false);
                      resetForm();
                    }}
                    className="btn btn-outline"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary"
                  >
                    {editingTaskId ? 'Update Task' : 'Add Task'}
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Task list */}
      {filteredAndSortedTasks.length > 0 ? (
        <motion.div 
          layout 
          className="space-y-3"
        >
          <AnimatePresence>
            {filteredAndSortedTasks.map(task => (
              <motion.div
                key={task.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ 
                  opacity: 1, 
                  y: 0,
                  scale: draggedTaskId === task.id ? 1.02 : 1,
                  boxShadow: draggedTaskId === task.id ? '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)' : 'none'
                }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                className={`card hover:shadow-lg transform transition-all ${
                  task.completed ? 'bg-surface-50 dark:bg-surface-800/80' : ''
                }`}
                draggable
                onDragStart={() => handleDragStart(task.id)}
                onDragEnd={handleDragEnd}
              >
                <div className="flex items-start justify-between gap-4">
                  {/* Checkbox and task content */}
                  <div className="flex items-start flex-1 min-w-0">
                    <button
                      onClick={() => handleToggleComplete(task.id, task.completed)}
                      className={`flex-shrink-0 h-6 w-6 rounded-full border-2 ${
                        task.completed 
                          ? 'bg-primary border-primary text-white' 
                          : 'border-surface-300 dark:border-surface-600'
                      } flex items-center justify-center mr-3 mt-1`}
                      aria-label={task.completed ? "Mark as incomplete" : "Mark as complete"}
                    >
                      {task.completed && <CheckIcon className="h-4 w-4" />}
                    </button>
                    
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <h3 className={`font-medium break-words ${
                          task.completed ? 'line-through text-surface-500 dark:text-surface-500' : 'text-surface-800 dark:text-surface-100'
                        }`}>
                          {task.title}
                        </h3>
                        
                        {/* Priority indicator */}
                        <span className={`text-xs px-2 py-1 rounded-full ${priorityBgColors[task.priority]} ${priorityColors[task.priority]}`}>
                          {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                        </span>
                        
                        {/* Category tag */}
                        <span className={`text-xs px-2 py-1 rounded-full ${categoryColors[task.category]}`}>
                          {task.category.charAt(0).toUpperCase() + task.category.slice(1)}
                        </span>
                      </div>
                      
                      {task.description && (
                        <p className={`text-sm mb-2 break-words ${
                          task.completed ? 'text-surface-400 dark:text-surface-500' : 'text-surface-600 dark:text-surface-400'
                        }`}>
                          {task.description}
                        </p>
                      )}
                      
                      <div className="flex flex-wrap gap-3 text-xs text-surface-500 dark:text-surface-400">
                        {/* Due date */}
                        {task.dueDate && (
                          <div className="flex items-center">
                            <CalendarIcon className="h-4 w-4 mr-1" />
                            <span>
                              Due: {format(new Date(task.dueDate), 'MMM d, yyyy')}
                            </span>
                          </div>
                        )}
                        
                        {/* Created date */}
                        <div className="flex items-center">
                          <ClockIcon className="h-4 w-4 mr-1" />
                          <span>
                            Created: {format(new Date(task.createdAt), 'MMM d, yyyy')}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Task actions */}
                  <div className="flex items-center space-x-1">
                    <button
                      onClick={() => handleEditTask(task)}
                      className="p-2 rounded-full hover:bg-surface-100 dark:hover:bg-surface-700 transition-colors text-surface-500 hover:text-surface-700 dark:text-surface-400 dark:hover:text-surface-200"
                      aria-label="Edit task"
                    >
                      <EditIcon className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => onDeleteTask(task.id)}
                      className="p-2 rounded-full hover:bg-surface-100 dark:hover:bg-surface-700 transition-colors text-surface-500 hover:text-red-500 dark:text-surface-400 dark:hover:text-red-400"
                      aria-label="Delete task"
                    >
                      <TrashIcon className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      ) : (
        <div className="card text-center py-12">
          <div className="inline-flex justify-center items-center p-4 rounded-full bg-surface-100 dark:bg-surface-800 mb-4">
            {searchQuery ? (
              <SearchIcon className="h-8 w-8 text-surface-400" />
            ) : (
              <ClockIcon className="h-8 w-8 text-surface-400" />
            )}
          </div>
          <h3 className="text-lg font-medium text-surface-700 dark:text-surface-300 mb-1">
            {searchQuery ? 'No matching tasks found' : 'No tasks yet'}
          </h3>
          <p className="text-surface-500 dark:text-surface-400 mb-6">
            {searchQuery 
              ? `Try adjusting your search criteria` 
              : `Get started by adding your first task`}
          </p>
          {!searchQuery && (
            <button
              onClick={() => {
                setFormVisible(true);
                resetForm();
              }}
              className="btn btn-primary inline-flex items-center"
            >
              <PlusIcon className="h-5 w-5 mr-1" />
              Add Task
            </button>
          )}
        </div>
      )}
      
      {/* Task count */}
      {filteredAndSortedTasks.length > 0 && (
        <div className="text-center text-sm text-surface-500 dark:text-surface-400 pt-2">
          Showing {filteredAndSortedTasks.length} task{filteredAndSortedTasks.length !== 1 ? 's' : ''}
          {filter !== 'all' && ` (${filter})`}
          {searchQuery && ` matching "${searchQuery}"`}
        </div>
      )}
    </div>
  );
};

export default MainFeature;