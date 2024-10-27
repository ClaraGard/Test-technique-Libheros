import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode'; // Correct import for jwt-decode
import styled from 'styled-components';
import axios from 'axios';
import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  html, body {
    height: 100%;
    margin: 0;
    padding: 0;
  }

  #root {
    height: 100%;
  }
`;
// Styled components for layout
const PageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
`;

const Navbar = styled.div`
  background-color: #333;
  color: white;
  padding: 10px;
  text-align: center;
`;

const Container = styled.div`
  display: flex;
  flex: 1;
`;

const Sidebar = styled.div`
  width: 250px;
  background-color: #f4f4f4;
  padding: 20px;
  border-right: 1px solid #ccc;
`;

const Content = styled.div`
  flex: 1;
  padding: 20px;
`;

const TaskDetails = styled.div`
  width: 300px;
  background-color: #f9f9f9;
  padding: 20px;
  border-left: 1px solid #ccc;
`;

const Button = styled.button`
  background-color: #007bff;
  color: white;
  border: none;
  padding: 10px;
  border-radius: 5px;
  cursor: pointer;
  &:hover {
    background-color: #0056b3;
  }
`;

const Input = styled.input`
  width: 100%;
  padding: 10px;
  margin-top: 5px;
  border: 1px solid #ccc;
  border-radius: 5px;
  margin-bottom: 10px;
`;

const TaskList = styled.li`
  list-style: none;
  padding: 10px;
  margin: 10px 0;
  background-color: ${props => props.selected ? '#b0d0ff' : '#e0e0e0'};  // Different color for selected task
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  border: ${props => props.selected ? '2px solid #007bff' : 'none'};  // Add border for selected task

  &:hover {
    background-color: ${props => props.selected ? '#a0c0ee' : '#d0d0d0'};  // Hover effect changes depending on selection
    transform: scale(1.02);
  }
`;

const TaskForm = styled.form`
  display: flex;
  flex-direction: column;
  margin-top: 20px;
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 10px;
  margin-top: 5px;
  border: 1px solid #ccc;
  border-radius: 5px;
  margin-bottom: 10px;
`;

const AddTaskButton = styled(Button)`
  margin-top: 10px;
`;

const TaskItem = styled.li`
  list-style: none;
  padding: 10px;
  margin: 10px 0;
  background-color: ${props => props.selected ? '#b0d0ff' : '#e0e0e0'};  // Different color for selected task
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.2s ease;
  border: ${props => props.selected ? '2px solid #007bff' : 'none'};  // Add border for selected task

  &:hover {
    background-color: ${props => props.selected ? '#a0c0ee' : '#d0d0d0'};  // Hover effect changes depending on selection
    transform: scale(1.02);
  }
`;

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

  const navigate = useNavigate();

  const fetchUsername = async () => {
    try {
      const response = await axios.get(`${backendUrl}/user/me`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      
      // Axios automatically parses the response data as JSON
      const data = response.data;  // No need for .json() method
      console.log(data);
      setUsername(data.name); // Make sure that `data.name` exists in your backend response
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
          fetchUsername(decodedToken.sub);
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
      const updatedTaskList = { ...selectedTaskList, tasks: [...selectedTaskList.tasks, newTask] };
  
      setTaskLists(taskLists.map(list =>
        list === selectedTaskList ? updatedTaskList : list
      ));
      setTasks(updatedTaskList.tasks);
      setNewTask({ shortDescription: '', longDescription: '', dueDate: '' });
      setShowTaskForm(false);
    }
  };

  return (
    <PageWrapper>
      <GlobalStyle />
      {/* Top Navbar */}
      <Navbar>
        <h2>Hello, {username ? username : "Guest"}!</h2>
      </Navbar>

      <Container>
        {/* Left Sidebar: Task Lists */}
        <Sidebar>
          <h2>Task Lists</h2>
          <Input
            type="text"
            placeholder="New Task List"
            value={newTaskListName}
            onChange={(e) => setNewTaskListName(e.target.value)}
          />
          <Button onClick={handleAddTaskList}>Add Task List</Button>

          <ul>
            {taskLists.map((list, index) => (
              <TaskList key={index} onClick={() => handleSelectTaskList(list, index)}
              selected={selectedTaskListIndex === index}>
                {list.name}
              </TaskList>
            ))}
          </ul>
        </Sidebar>

        {/* Main Content: Task List Tasks */}
        <Content>
          <h2>{selectedTaskList ? selectedTaskList.name : 'Select a Task List'}</h2>

          {selectedTaskList ? (
            <div>
              <h3>Tasks</h3>
              {tasks.length > 0 ? (
                <ul>
                  {tasks.map((task, index) => (
                    <TaskItem key={index} 
                    onClick={() => {
                      handleSelectTask(task, index);
                    }}
                    selected={selectedTaskIndex === index}>
                    {task.shortDescription} - {formatDate(task.dueDate)}
                  </TaskItem>
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
              <AddTaskButton onClick={() => setShowTaskForm(!showTaskForm)}>
                {showTaskForm ? 'Cancel' : 'Add Task'}
              </AddTaskButton>

              {/* Task Form */}
              {showTaskForm && (
                <TaskForm onSubmit={handleAddTask}>
                  <Input
                    type="text"
                    placeholder="Short Description"
                    value={newTask.shortDescription}
                    onChange={(e) => setNewTask({ ...newTask, shortDescription: e.target.value })}
                    required
                  />
                  <TextArea
                    placeholder="Long Description"
                    value={newTask.longDescription}
                    onChange={(e) => setNewTask({ ...newTask, longDescription: e.target.value })}
                  />
                  <label htmlFor="dueDate">Due Date:</label>
                  <Input
                    type="date"
                    value={newTask.dueDate}
                    onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                    required
                  />
                  <Button type="submit">Add Task</Button>
                </TaskForm>
              )}
            </>
          )}
        </Content>

        {/* Right Sidebar: Task Details */}
        {selectedTask && (
          <TaskDetails>
            <h3>Task Details</h3>
            <p><strong>Short Description:</strong> {selectedTask.shortDescription}</p>
            <p><strong>Long Description:</strong> {selectedTask.longDescription}</p>
            <p><strong>Due Date:</strong> {formatDate(selectedTask.dueDate)}</p>
            <p><strong>Completed:</strong> {selectedTask.completed ? 'Yes' : 'No'}</p>
          </TaskDetails>
        )}
      </Container>
    </PageWrapper>
  );
}

export default MainPage;
