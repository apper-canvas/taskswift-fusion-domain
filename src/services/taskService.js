/**
 * Service for performing CRUD operations on tasks using the Apper backend
 */

// Get all tasks with optional filtering
export const fetchTasks = async (filter = null, sortBy = 'createdAt') => {
  try {
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });

    // Define fields to retrieve based on the task table
    const fields = [
      'Id', 'title', 'description', 'dueDate', 'priority', 
      'category', 'completed', 'createdAt', 'updatedAt'
    ];

    // Create the query parameters
    let params = {
      fields: fields,
      pagingInfo: { 
        limit: 100,
        offset: 0
      }
    };

    // Add where conditions based on filter
    if (filter) {
      let whereConditions = [];
      
      if (filter === 'completed') {
        whereConditions.push({
          fieldName: 'completed',
          operator: 'ExactMatch',
          values: [true]
        });
      } else if (filter === 'active') {
        whereConditions.push({
          fieldName: 'completed',
          operator: 'ExactMatch',
          values: [false]
        });
      } else if (filter === 'high-priority') {
        whereConditions.push({
          fieldName: 'priority',
          operator: 'ExactMatch',
          values: ['high']
        });
      }

      if (whereConditions.length > 0) {
        params.where = whereConditions;
      }
    }

    // Add sorting
    let orderBy = [];
    switch (sortBy) {
      case 'title':
        orderBy.push({ fieldName: 'title', SortType: 'ASC' });
        break;
      case 'priority':
        orderBy.push({ fieldName: 'priority', SortType: 'ASC' });
        break;
      case 'dueDate':
        orderBy.push({ fieldName: 'dueDate', SortType: 'ASC' });
        break;
      case 'dateCreated':
      default:
        orderBy.push({ fieldName: 'createdAt', SortType: 'DESC' });
        break;
    }
    params.orderBy = orderBy;

    // Execute the query
    const response = await apperClient.fetchRecords('task', params);
    
    if (!response || !response.data) {
      return [];
    }
    
    return response.data.map(task => ({
      id: task.Id.toString(),
      title: task.title,
      description: task.description,
      dueDate: task.dueDate,
      priority: task.priority,
      category: task.category,
      completed: task.completed,
      createdAt: task.createdAt,
      updatedAt: task.updatedAt
    }));
  } catch (error) {
    console.error('Error fetching tasks:', error);
    throw error;
  }
};

// Create a new task
export const createTask = async (taskData) => {
  try {
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });

    // Convert the data to the format expected by the server
    const record = {
      title: taskData.title,
      description: taskData.description,
      dueDate: taskData.dueDate,
      priority: taskData.priority,
      category: taskData.category,
      completed: taskData.completed || false,
      createdAt: new Date().toISOString(),
    };

    const params = { records: [record] };
    const response = await apperClient.createRecord('task', params);
    
    if (response && response.success && response.results && response.results[0].success) {
      const createdTask = response.results[0].data;
      return {
        id: createdTask.Id.toString(),
        ...createdTask
      };
    } else {
      throw new Error(response?.results?.[0]?.message || 'Failed to create task');
    }
  } catch (error) {
    console.error('Error creating task:', error);
    throw error;
  }
};

// Update an existing task
export const updateTask = async (taskId, updateData) => {
  try {
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });

    const params = { records: [{ Id: parseInt(taskId), ...updateData, updatedAt: new Date().toISOString() }] };
    const response = await apperClient.updateRecord('task', params);
    
    return response && response.success;
  } catch (error) {
    console.error('Error updating task:', error);
    throw error;
  }
};

// Delete a task
export const deleteTask = async (taskId) => {
  try {
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });

    const params = { RecordIds: [parseInt(taskId)] };
    const response = await apperClient.deleteRecord('task', params);
    
    return response && response.success;
  } catch (error) {
    console.error('Error deleting task:', error);
    throw error;
  }
};