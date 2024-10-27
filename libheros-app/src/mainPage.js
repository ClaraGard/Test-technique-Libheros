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

  const [taskLists, setTaskLists] = useState([]); // To store the task lists
  const [selectedTaskList, setSelectedTaskList] = useState(null); // To store the selected task list
  const [selectedTaskListIndex, setSelectedTaskListIndex] = useState(null); // Track selected task by index
  const [tasks, setTasks] = useState([]); // To store tasks for the selected list
  const [selectedTask, setSelectedTask] = useState(null); // To store selected task details
  const [selectedTaskIndex, setSelectedTaskIndex] = useState(null); // Track selected task by index

  const [newTaskListName, setNewTaskListName] = useState(''); // To store new task list name

  const [newTask, setNewTask] = useState({ shortDescription: '', longDescription: '', dueDate: '' }); 
  const [showTaskForm, setShowTaskForm] = useState(false); 

  const [showCompleted, setShowCompleted] = useState(false); // To track if completed tasks are shown

  const navigate = useNavigate();

  const fetchUsername = async () => {
    try {
      const response = await axios.get(`${backendUrl}/user/me`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
  
      const data = response.data; // Axios automatically parses the response
      setUsername(data.name); // Ensure 'name' exists in the response
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

  useEffect(() => {
    validateToken();
  }, [validateToken]);

  const handleAddTaskList = () => {
    if (newTaskListName) {
      setTaskLists([...taskLists, { name: newTaskListName, tasks: [] }]);
      setNewTaskListName(''); // Clear input
    }
  };

  const handleSelectTaskList = (list, index) => {
    console.log(selectedTaskListIndex);
    if (selectedTaskListIndex === index) return;
    setSelectedTaskList(list);
    setSelectedTaskListIndex(index);

    setTasks(list.tasks);
    setSelectedTask(null);
  };

  const handleSelectTask = (task, index) => {
    if (selectedTaskIndex === index) return;
    setSelectedTask(task);
    setSelectedTaskIndex(index);
  };

  const handleAddTask = (e) => {
    e.preventDefault();
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
    if (selectedTaskList) {
      const updatedTasks = [...tasks, newTask]; // Spread to append task, not overwrite
      const updatedTaskList = { ...selectedTaskList, tasks: [...selectedTaskList.tasks, newTask] };
  
      setTaskLists(taskLists.map(list =>
        list === selectedTaskList ? updatedTaskList : list
      ));
      setTasks(updatedTasks);
      setNewTask({ shortDescription: '', longDescription: '', dueDate: '' });
      setShowTaskForm(false);
    }
  };

  const handleCompleteTask = (task) => {
    const updatedTask = { ...task, completed: !task.completed };
  
    const updatedTasks = tasks.map((t) =>
      t === task ? updatedTask : t
    );
  
    const updatedTaskList = { ...selectedTaskList, tasks: updatedTasks };
    setTaskLists(taskLists.map(list =>
      list === selectedTaskList ? updatedTaskList : list
    ));
  
    setTasks(updatedTasks);
    };
  

  const handleDeleteTask = () => {
    const confirmed = window.confirm("Are you sure you want to delete this task?");
    if (confirmed) {
      const updatedTasks = tasks.filter((task) => task !== selectedTask);
      setTasks(updatedTasks);
  
      const updatedTaskList = { ...selectedTaskList, tasks: updatedTasks };
      setTaskLists(taskLists.map(list =>
        list === selectedTaskList ? updatedTaskList : list
      ));
      setSelectedTask(null);
      setSelectedTaskIndex(null);
    }
  };

  const handleDeleteTaskList = () => {
    if (!selectedTaskList) return; 
  
    const confirmed = window.confirm(
      `Are you sure you want to delete the task list "${selectedTaskList.name}" and all its tasks?`
    );
  
    if (confirmed) {
      const updatedTaskLists = taskLists.filter((list) => list !== selectedTaskList);
  
      setTaskLists(updatedTaskLists);
  
      setSelectedTaskList(null);
      setSelectedTaskListIndex(null);
      setSelectedTaskIndex(null);
      setSelectedTask(null);
      setTasks([]);
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
        <Styles.Sidebar>
          <h2>Task Lists</h2>
          <Styles.Input
            type="text"
            placeholder="New Task List"
            value={newTaskListName}
            onChange={(e) => setNewTaskListName(e.target.value)}
          />
          <Styles.Button onClick={handleAddTaskList}>Add Task List</Styles.Button>

          <ul>
            {taskLists.map((list, index) => (
              <Styles.TaskList key={index} onClick={() => handleSelectTaskList(list, index)}
              selected={selectedTaskListIndex === index}>
                {list.name}
              </Styles.TaskList>
            ))}
          </ul>
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
                  .filter(task => !task.completed || showCompleted) // Show only incomplete or all based on toggle
                  .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate)) // Sort tasks by due date
                  .map((task, index) => (
                    <Styles.TaskItem 
                      key={index} 
                      onClick={() => handleSelectTask(task, index)}
                      selected={selectedTaskIndex === index}>
                      {task.shortDescription} - {formatDate(task.dueDate)} - {task.completed ? 'Completed' : 'Not Completed'}
                      <Styles.Button onClick={(e) => {
                        e.stopPropagation();
                        handleCompleteTask(task, index);
                        }
                      }>
                        {task.completed ? 'Mark as Incomplete' : 'Mark as Completed'}
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
            <p><strong>Completed:</strong> {selectedTask.completed ? 'Yes' : 'No'}</p>
            {/* Delete Task Button */}
            <Styles.Button onClick={handleDeleteTask}>Delete Task</Styles.Button>
          </Styles.TaskDetails>
        )}
      </Styles.Container>
    </Styles.PageWrapper>
  );
}

export default MainPage;
