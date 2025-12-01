import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import TaskCard from '../components/TaskCard';

const Dashboard = () => {
  const { user } = useAuth();
  const [assignedTasks, setAssignedTasks] = useState([]);
  const [createdTasks, setCreatedTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const [assignedRes, createdRes] = await Promise.all([
        api.get('/tasks/assigned'),
        user.role === 'manager' ? api.get('/tasks/created') : Promise.resolve({ data: [] }),
      ]);

      setAssignedTasks(assignedRes.data);
      setCreatedTasks(createdRes.data);
    } catch (err) {
      console.error('Dashboard fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

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

  if (loading) return <div className="p-4">Loading dashboard...</div>;

  return (
    <div className="max-w-5xl mx-auto px-4">
      <h1 className="text-2xl font-semibold mb-4">Dashboard</h1>

      <section className="mb-6">
        <h2 className="font-semibold mb-2">Tasks Assigned to You</h2>
        {assignedTasks.length === 0 ? (
          <p className="text-sm text-gray-500">No tasks assigned.</p>
        ) : (
          assignedTasks.map((task) => (
            <TaskCard
              key={task._id}
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
          <h2 className="font-semibold mb-2">Tasks You Created</h2>
          {createdTasks.length === 0 ? (
            <p className="text-sm text-gray-500">You haven&apos;t created any tasks yet.</p>
          ) : (
            createdTasks.map((task) => (
              <TaskCard
                key={task._id}
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
  );
};

export default Dashboard;
