import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';
import * as Styles from './mainPageStyles';

const backendUrl = `${process.env.REACT_APP_BACKEND_URL}:${process.env.REACT_APP_BACKEND_PORT}`;

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-GB');
};



function MainPage() {
  const [username, setUsername] = useState(null);

  const [taskLists, setTaskLists] = useState([]);
  const [selectedTaskList, setSelectedTaskList] = useState(null);
  const [selectedTaskListIndex, setSelectedTaskListIndex] = useState(null); 
  const [tasks, setTasks] = useState([]); 
  const [selectedTask, setSelectedTask] = useState(null); 
  const [selectedTaskIndex, setSelectedTaskIndex] = useState(null); 

  const [newTaskListName, setNewTaskListName] = useState(''); 

  const [newTask, setNewTask] = useState({ shortDescription: '', longDescription: '', dueDate: '' }); 
  const [showTaskForm, setShowTaskForm] = useState(false); 

  const [showCompleted, setShowCompleted] = useState(false); 

  const [sidebarOpen, setSidebarOpen] = useState(true);

  const navigate = useNavigate();

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  }

  const fetchUsername = async () => {
    try {
      const response = await axios.get(`${backendUrl}/user/me`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
  
      const data = response.data;
      setUsername(data.name);
    } catch (error) {
      console.error('Error fetching username:', error);
    }
  };

  const validateToken = useCallback(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        if (decodedToken.exp * 1000 < Date.now()) {
          localStorage.removeItem("token");
          navigate("/login");
        } else {
          fetchUsername();
        }
      } catch (error) {
        console.error("Error decoding token:", error);
        localStorage.removeItem("token");
        navigate("/login");
      }
    } else {
      navigate("/login");
    }
  }, [navigate]);

  const fetchTaskLists = async () => {
    try {
      const response = await axios.get(`${backendUrl}/tasklist`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      if (response.data.success) {
        setTaskLists(response.data.taskLists);
      } else {
        alert(response.data.message);
      }
    } catch (error) {
      console.error("Error fetching task lists:", error);
    }
  }

  useEffect(() => {
    validateToken();
    fetchTaskLists();
  }, [validateToken]);

  const handleAddTaskList = async () => {
    if (!newTaskListName) return;
  
    try {
      const response = await axios.post(
        `${backendUrl}/tasklist`,
        { name: newTaskListName },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      if (response.data.success) {
        setTaskLists([...taskLists, response.data.taskList]);
        setNewTaskListName('');
      } else {
        alert(response.data.message);
      }
    } catch (error) {
      console.error("Error adding task list:", error);
    }
  };

  const handleSelectTaskList = async (list, index) => {
    if (selectedTaskListIndex === index) return;

    try {
      const response = await axios.get(`${backendUrl}/task/tasklist/${list.id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      if (response.data.success) {
        setSelectedTaskList(list);
        setSelectedTaskListIndex(index);
        setTasks(response.data.tasks);
        setSelectedTask(null);
        setSelectedTaskIndex(null);
      } else {
        alert(response.data.message);
      }
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  const handleSelectTask = (task, index) => {
    if (selectedTaskIndex === index) return;
    setSelectedTask(task);
    setSelectedTaskIndex(index);
  };

  const handleAddTask = async (e) => {
    e.preventDefault();
    if (!selectedTaskList) return;

    const today = new Date();
    const dueDate = new Date(newTask.dueDate);
    const maxAllowedDate = new Date();
    maxAllowedDate.setFullYear(today.getFullYear() + 30);
    if (dueDate > maxAllowedDate) {
      alert('Due date cannot be more than 30 years in the future!');
      return;
    }
    // Check if the due date is before today
    if (dueDate < today.setHours(0, 0, 0, 0)) { // We set hours to 0 to only compare dates
      alert('Due date cannot be in the past!');
      return;
    }

    try {
      const response = await axios.post(
        `${backendUrl}/task`,
        {
          shortDescription: newTask.shortDescription,
          longDescription: newTask.longDescription,
          dueDate: newTask.dueDate,
          taskListId: selectedTaskList.id,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      if (response.data.success) {
        const updatedTasks = [...tasks, response.data.task];
        setTasks(updatedTasks);
        setNewTask({ shortDescription: '', longDescription: '', dueDate: '' });
        setShowTaskForm(false);
      } else {
        alert(response.data.message);
      }
    } catch (error) {
      console.error("Error adding task:", error);
    }
  };

  const handleCompleteTask = async (task) => {
    const updatedTask = { ...task, isCompleted: !task.isCompleted };

    try {
      const response = await axios.put(
        `${backendUrl}/task/${task.id}`,
        updatedTask,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );

      if (response.data.success) {
        const updatedTasks = tasks.map((t) => (t.id === task.id ? response.data.task : t));
        setTasks(updatedTasks); 
        if (selectedTask && selectedTask.id === updatedTask.id) {
          setSelectedTask(updatedTask);
        }
      } else {
        alert(response.data.message);
      }
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };
  

  const handleDeleteTask = async () => {
    const confirmed = window.confirm("Are you sure you want to delete this task?");
    if (!confirmed) return;
    try {
      const response = await axios.delete(`${backendUrl}/task/${selectedTask.id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      if (response.data.success) {
        const updatedTasks = tasks.filter((task) => task.id !== selectedTask.id);
        setTasks(updatedTasks);
        setSelectedTask(null);
        setSelectedTaskIndex(null);
      }else {
        alert(response.data.message);
      }
    } catch (error) {
      console.error("Error deleting task:", error);
    }    
  };

  const handleDeleteTaskList = async () => {
    if (!selectedTaskList) return; 
  
    const confirmed = window.confirm(
      `Are you sure you want to delete the task list "${selectedTaskList.name}" and all its tasks?`
    );
    if (!confirmed) return;
    try {
      const response = await axios.delete(`${backendUrl}/tasklist/${selectedTaskList.id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      if (response.data.success) {
        const updatedTaskLists = taskLists.filter(list => list.id !== selectedTaskList.id);
        setTaskLists(updatedTaskLists);
        
        setSelectedTaskList(null);
        setSelectedTaskListIndex(null);
        setSelectedTask(null);
        setSelectedTaskIndex(null);
        setTasks([]);
      }else {
        alert(response.data.message);
      }
    } catch (error) {
      console.error("Error deleting task list:", error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <Styles.PageWrapper>
      <Styles.GlobalStyle />
      {/* Top Navbar */}
      <Styles.Navbar>
        <h2>Hello, {username ? username : "Guest"}!</h2>
        <Styles.LogoutButton onClick={handleLogout}>Logout</Styles.LogoutButton>
      </Styles.Navbar>

      <Styles.Container>
        {/* Left Sidebar: Task Lists */}
        <Styles.Sidebar sidebarOpen={sidebarOpen}>
          <Styles.ToggleButton sidebarOpen={sidebarOpen} onClick={toggleSidebar}>
            {sidebarOpen ? '<' : '>'}
          </Styles.ToggleButton>
          {sidebarOpen && (
            <>
              <h2>Task Lists</h2>
              <Styles.Input
                type="text"
                placeholder="New Task List"
                onChange={(e) => setNewTaskListName(e.target.value)}
              />
              <Styles.Button onClick={handleAddTaskList}>Add Task List</Styles.Button>
              <ul>
                {taskLists.map((list, index) => (
                  <Styles.TaskList key={index} onClick={() => handleSelectTaskList(list, index)}>
                    {list.name}
                  </Styles.TaskList>
                ))}
              </ul>
            </>
          )}
        </Styles.Sidebar>
        {/* Main Content: Task List Tasks */}
        <Styles.Content>
          <h2>{selectedTaskList ? selectedTaskList.name : 'Select a Task List'}</h2>

          {selectedTaskList ? (
            <div>
              <h3>Tasks</h3>
              {tasks.length > 0 ? (
                <ul>
                {tasks
                  .filter(task => !task.isCompleted || showCompleted) // Show only incomplete or all based on toggle
                  .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
                  .map((task, index) => (
                    <Styles.TaskItem 
                      key={index} 
                      onClick={() => handleSelectTask(task, index)}
                      selected={selectedTaskIndex === index}>
                      {task.shortDescription} - {formatDate(task.dueDate)} - {task.isCompleted ? 'Completed' : 'Not Completed'}
                      <Styles.Button onClick={(e) => {
                        e.stopPropagation();
                        handleCompleteTask(task, index);
                        }
                      }>
                        {task.isCompleted ? 'Mark as Incomplete' : 'Mark as Completed'}
                      </Styles.Button>
                    </Styles.TaskItem>
                  ))}
              </ul>
              ) : (
                <p>No tasks in this list.</p>
              )}
            </div>
          ) : (
            <p>Please select a task list to view tasks.</p>
          )}
          {selectedTaskList && (
            <>
              {/* Button to show/hide task form */}
              <Styles.AddTaskButton onClick={() => setShowTaskForm(!showTaskForm)}>
                {showTaskForm ? 'Cancel' : 'Add Task'}
              </Styles.AddTaskButton>
              {/* Button to show/hide completed tasks */}
              <Styles.Button onClick={() => setShowCompleted(!showCompleted)}>
                {showCompleted ? 'Hide Completed Tasks' : 'Show Completed Tasks'}
              </Styles.Button>
              <Styles.Button onClick={handleDeleteTaskList} style={{ marginTop: '10px', backgroundColor: 'red' }}>
                Delete Task List
              </Styles.Button>
              {/* Task Form */}
              {showTaskForm && (
                <Styles.TaskForm onSubmit={handleAddTask}>
                  <Styles.Input
                    type="text"
                    placeholder="Short Description"
                    value={newTask.shortDescription}
                    onChange={(e) => setNewTask({ ...newTask, shortDescription: e.target.value })}
                    required
                  />
                  <Styles.TextArea
                    placeholder="Long Description"
                    value={newTask.longDescription}
                    onChange={(e) => setNewTask({ ...newTask, longDescription: e.target.value })}
                  />
                  <label htmlFor="dueDate">Due Date:</label>
                  <Styles.Input
                    type="date"
                    value={newTask.dueDate}
                    onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                    required
                  />
                  <Styles.Button type="submit">Add Task</Styles.Button>
                </Styles.TaskForm>
              )}
            </>
          )}
        </Styles.Content>

        {/* Right Sidebar: Task Details */}
        {selectedTask && (
          <Styles.TaskDetails>
            <h3>Task Details</h3>
            <p><strong>Short Description:</strong> {selectedTask.shortDescription}</p>
            <p><strong>Long Description:</strong> {selectedTask.longDescription}</p>
            <p><strong>Due Date:</strong> {formatDate(selectedTask.dueDate)}</p>
            <p><strong>Completed:</strong> {selectedTask.isCompleted ? 'Yes' : 'No'}</p>
            {/* Delete Task Button */}
            <Styles.Button onClick={handleDeleteTask}>Delete Task</Styles.Button>
          </Styles.TaskDetails>
        )}
      </Styles.Container>
    </Styles.PageWrapper>
  );
}

export default MainPage;
