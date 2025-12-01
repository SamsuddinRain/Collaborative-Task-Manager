import React from "react";
import { useState } from 'react';

const TaskForm = ({ onSubmit }) => {
  const [form, setForm] = useState({
    title: '',
    description: '',
    status: 'todo',
    priority: 'medium',
    dueDate: '',
    assignedTo: '',
  });

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="border rounded-lg p-4 mb-4 bg-white dark:bg-gray-800"
    >
      <h2 className="font-semibold mb-3">Create New Task</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <input
          name="title"
          placeholder="Title"
          value={form.title}
          onChange={handleChange}
          className="border rounded px-2 py-1 text-sm bg-gray-50 dark:bg-gray-700"
          required
        />
        <input
          name="assignedTo"
          placeholder="Assigned To (User ID)"
          value={form.assignedTo}
          onChange={handleChange}
          className="border rounded px-2 py-1 text-sm bg-gray-50 dark:bg-gray-700"
          required
        />
        <select
          name="status"
          value={form.status}
          onChange={handleChange}
          className="border rounded px-2 py-1 text-sm bg-gray-50 dark:bg-gray-700"
        >
          <option value="todo">Todo</option>
          <option value="in-progress">In-Progress</option>
          <option value="completed">Completed</option>
        </select>
        <select
          name="priority"
          value={form.priority}
          onChange={handleChange}
          className="border rounded px-2 py-1 text-sm bg-gray-50 dark:bg-gray-700"
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
        <input
          type="date"
          name="dueDate"
          value={form.dueDate}
          onChange={handleChange}
          className="border rounded px-2 py-1 text-sm bg-gray-50 dark:bg-gray-700"
        />
      </div>
      <textarea
        name="description"
        placeholder="Description"
        value={form.description}
        onChange={handleChange}
        className="border rounded px-2 py-1 text-sm bg-gray-50 dark:bg-gray-700 w-full mt-3"
      />
      <button
        type="submit"
        className="mt-3 px-4 py-1 rounded bg-blue-600 text-white text-sm"
      >
        Create Task
      </button>
    </form>
  );
};

export default TaskForm;
