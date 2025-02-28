import React, { useState, useEffect, Fragment } from 'react';


const Tasks = () => {
  const [tasks, setTasks] = useState([]); 
  const [students, setStudents] = useState([]);
  const [taskData, setTaskData] = useState({
    title: '',
    description: '',
    assigned_to: '',
    created_by: '1', 
    deadline: '',
    status: 'pending',
  });
  const [editTaskId, setEditTaskId] = useState(null);

  
  useEffect(() => {
    fetchTasks();
    fetchStudents();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await fetch('http://localhost:5000/tasks');
      const data = await response.json();
      setTasks(data);
    } catch (err) {
      console.error(err.message);
    }
  };
  const fetchStudents = async () => {
    try {
      const response = await fetch('http://localhost:5000/students/');
      const data = await response.json();
      setStudents(data);
    } catch (err) {
      console.error(err.message);
    }
  };
  const createTask = async (e) => {
    e.preventDefault();
    var date = new Date(taskData.deadline)
    console.log(date.getTime());
    console.log(Date.now());
    if(date.getTime() < Date.now()){
      alert("Deadline should be later than today");
      return;
    }
    try {
      
      const response = await fetch('http://localhost:5000/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(taskData),
      });
      const newTask = await response.json();
      setTasks([newTask.task, ...tasks]);
      setTaskData({ title: '', description: '', assigned_to: '', deadline: '', status: 'pending', created_by: '1' });
    } catch (err) {
      console.error(err.message);
    }
  };

  

  const updateTask = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/tasks/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(taskData),
      });
      const updatedTask = await response.json();
      setTasks(tasks.map(task => (task.id === id ? updatedTask.task : task)));
      setEditTaskId(null);
      setTaskData({ title: '', description: '', assigned_to: '', deadline: '', status: 'pending', created_by: '1' });
    } catch (err) {
      console.error(err.message);
    }
  };

  const deleteTask = async (id) => {
    try {
      await fetch(`http://localhost:5000/tasks/${id}`, {
        method: 'DELETE',
      });
      setTasks(tasks.filter(task => task.id !== id));
    } catch (err) {
      console.error(err.message);
    }
  };

  return (
    <Fragment>
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-6">Task Management</h1>

        {/* Task Form */}
        <form
          className="grid grid-cols-1 gap-4 p-4 border rounded shadow"
          onSubmit={editTaskId ? () => updateTask(editTaskId) : createTask}
        >
          <input
            type="text"
            placeholder="Task Title"
            className="p-2 border rounded"
            value={taskData.title}
            onChange={(e) => setTaskData({ ...taskData, title: e.target.value })}
            required
          />
          <textarea
            placeholder="Task Description"
            className="p-2 border rounded"
            value={taskData.description}
            onChange={(e) => setTaskData({ ...taskData, description: e.target.value })}
          />
          <select>
            <option value="" disabled>Select student here</option>
           {students.map(student =>(<option value={student.id}>
            {student.id} {student.username}
           </option>))}
          

          </select>
          
          <input
            type="date"
            className="p-2 border rounded"
            value={taskData.deadline}
            onChange={(e) => setTaskData({ ...taskData, deadline: e.target.value })}
            required
          />
          <button
            type="submit"
            className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            {editTaskId ? 'Update Task' : 'Create Task'}
          </button>
        </form>

        {/* Task List */}
        <div className="mt-6">
          {tasks.map((task) => (
            <div
              key={task.id}
              className="p-4 border rounded shadow mb-4 flex justify-between items-center"
            >
              <div>
                <h2 className="text-xl font-bold">{task.title}</h2>
                <p>{task.description}</p>
                <p className="text-sm text-gray-500">Assigned To: {task.assigned_to_user || 'N/A'}</p>
                <p className="text-sm text-gray-500">Deadline: {task.deadline}</p>
              </div>
              <div className="flex space-x-2">
                <button
                  className="p-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                  onClick={() => {
                    setEditTaskId(task.id);
                    setTaskData(task);
                  }}
                >
                  Edit
                </button>
                <button
                  className="p-2 bg-red-500 text-white rounded hover:bg-red-600"
                  onClick={() => deleteTask(task.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Fragment>
  );
};

export default Tasks;
