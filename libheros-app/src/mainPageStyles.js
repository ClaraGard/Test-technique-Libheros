import { createGlobalStyle } from 'styled-components';
import styled from 'styled-components';

export const GlobalStyle = createGlobalStyle`
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

export const PageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
`;

export const Container = styled.div`
  display: flex;
  flex: 1;
`;

export const Sidebar = styled.div`
  width: ${({ $sidebaropen }) => ($sidebaropen ? '200px' : '20px')};
  transition: width 0.3s ease;
  overflow: hidden;
  background-color: #f4f4f4;
  padding: ${({ $sidebaropen }) => ($sidebaropen ? '10px' : '0')};
  position: relative;
`;

export const ToggleButton = styled.button`
  position: absolute;
  top: 0px;
  right: 0px;
  width: 20px;
  height: 40px;
  background-color: #666;
  color: white;
  border: none;
  cursor: pointer;
  z-index: 1;
  border-radius: 0 5px 5px 0;
  transform: translateX(0);
`;

export const Content = styled.div`
  flex: 1;
  padding: 20px;
`;

export const TaskDetails = styled.div`
  width: 300px;
  background-color: #f9f9f9;
  padding: 20px;
  border-left: 1px solid #ccc;
`;

export const Button = styled.button`
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

export const Input = styled.input`
  width: 100%;
  padding: 10px;
  margin-top: 5px;
  border: 1px solid #ccc;
  border-radius: 5px;
  margin-bottom: 10px;
`;

export const TaskList = styled.li`
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

export const TaskForm = styled.form`
  display: flex;
  flex-direction: column;
  margin-top: 20px;
`;

export const TextArea = styled.textarea`
  width: 100%;
  padding: 10px;
  margin-top: 5px;
  border: 1px solid #ccc;
  border-radius: 5px;
  margin-bottom: 10px;
`;

export const AddTaskButton = styled(Button)`
  margin-top: 10px;
`;

export const TaskItem = styled.li`
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

export const Navbar = styled.div`
  background-color: #333;
  color: white;
  padding: 10px;
  text-align: center;
  position: relative; /* Important to make the logout button position relative to the navbar */
  display: flex;
  align-items: center; /* Center text vertically */
  height: 60px; /* You can adjust this height as needed */
`;

export const LogoutButton = styled(Button)`
  position: absolute;
  right: 20px; /* Adjust the distance from the right edge */
  top: 50%; /* Place it halfway down */
  transform: translateY(-50%); /* Adjust the position to center it vertically */
  padding: 10px 20px;
`;

export const DeleteTaskListButtonLeft = styled.button`
  background: transparent;
  border: none;
  color: #888;
  font-size: 14px;
  cursor: pointer;
  margin-left: 8px;

  &:hover {
    color: #ff4d4d;
  }
`;

export const CompletedTasksSection = styled.div`
  margin-top: 20px;
  padding-top: 15px;
  border-top: 1px solid #ccc;
  h3 {
    margin-bottom: 10px;
    color: #666;
  }
`;