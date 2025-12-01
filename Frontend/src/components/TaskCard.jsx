import React from "react";
const TaskCard = ({ task, onStatusChange, isManager, onDelete }) => {
  const handleChange = (e) => {
    onStatusChange(task._id, e.target.value);
  };

  return (
    <div className="border rounded-lg p-3 bg-white dark:bg-gray-800 mb-2">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-semibold">{task.title}</h3>
          {task.description && (
            <p className="text-sm text-gray-600 dark:text-gray-300">
              {task.description}
            </p>
          )}
          <p className="text-xs mt-1">
            Status:{' '}
            <span className="font-medium uppercase">{task.status}</span> | Priority:{' '}
            {task.priority}
          </p>
          {task.assignedTo && (
            <p className="text-xs">
              Assigned to: {task.assignedTo.name || 'You'}
            </p>
          )}
          {task.createdBy && (
            <p className="text-xs">
              Created by: {task.createdBy.name || 'Unknown'}
            </p>
          )}
        </div>
        <div className="flex flex-col gap-2 items-end">
          <select
            value={task.status}
            onChange={handleChange}
            className="text-xs border rounded px-2 py-1 bg-gray-50 dark:bg-gray-700"
          >
            <option value="todo">Todo</option>
            <option value="in-progress">In-Progress</option>
            <option value="completed">Completed</option>
          </select>
          {isManager && (
            <button
              onClick={() => onDelete(task._id)}
              className="text-xs text-red-500 underline"
            >
              Delete
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
