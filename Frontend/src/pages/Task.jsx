import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import TaskCard from '../components/TaskCard';
import TaskForm from '../components/TaskForm';

const TasksPage = () => {
  const { user } = useAuth();
  const [assignedTasks, setAssignedTasks] = useState([]);
  const [createdTasks, setCreatedTasks] = useState([]);

  const fetchTasks = async () => {
    try {
      const [assignedRes, createdRes] = await Promise.all([
        api.get('/tasks/assigned'),
        user.role === 'manager'
          ? api.get('/tasks/created')
          : Promise.resolve({ data: [] }),
      ]);

      setAssignedTasks(assignedRes.data);
      setCreatedTasks(createdRes.data);
    } catch (err) {
      console.error('Tasks page fetch error:', err);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleCreateTask = async (taskData) => {
    try {
      await api.post('/tasks', taskData);
      fetchTasks();
    } catch (err) {
      console.error('Create task error:', err);
      alert(err.response?.data?.message || 'Failed to create task');
    }
  };

  const handleStatusChange = async (taskId, status) => {
    try {
      await api.put(`/tasks/${taskId}`, { status });
      fetchTasks();
    } catch (err) {
      console.error('Status update error:', err);
    }
  };

  const handleDelete = async (taskId) => {
    try {
      await api.delete(`/tasks/${taskId}`);
      fetchTasks();
    } catch (err) {
      console.error('Delete task error:', err);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4">
      <h1 className="text-2xl font-semibold mb-4">Task Management</h1>

      {user.role === 'manager' && <TaskForm onSubmit={handleCreateTask} />}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <section>
          <h2 className="font-semibold mb-2">Assigned to You</h2>
          {assignedTasks.length === 0 ? (
            <p className="text-sm text-gray-500">No tasks assigned.</p>
          ) : (
            assignedTasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onStatusChange={handleStatusChange}
                isManager={user.role === 'manager'}
                onDelete={handleDelete}
              />
            ))
          )}
        </section>

        {user.role === 'manager' && (
          <section>
            <h2 className="font-semibold mb-2">Created by You</h2>
            {createdTasks.length === 0 ? (
              <p className="text-sm text-gray-500">No created tasks yet.</p>
            ) : (
              createdTasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onStatusChange={handleStatusChange}
                  isManager={true}
                  onDelete={handleDelete}
                />
              ))
            )}
          </section>
        )}
      </div>
    </div>
  );
};

export default TasksPage;
