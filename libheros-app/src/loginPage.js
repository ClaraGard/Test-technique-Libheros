import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PasswordValidator from './components/passwordValidator';
import styled from 'styled-components';
import axios from 'axios';

const SplitLayout = styled.div`
  display: flex;
  height: 100vh;
`;

const Section = styled.div`
  flex: 1;
  padding: 20px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: ${props => (props.type === 'login' ? '#f0f0f0' : '#ffffff')};
`;

const Form = styled.form`
  width: 80%;
  max-width: 400px;
`;

const Input = styled.input`
  width: 100%;
  padding: 10px;
  margin-top: 5px;
  border: 1px solid #ccc;
  border-radius: 5px;
`;

const Button = styled.button`
  padding: 10px 20px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  &:hover {
    background-color: #0056b3;
  }
`;

const backendUrl = `${process.env.REACT_APP_BACKEND_URL}:${process.env.REACT_APP_BACKEND_PORT}`;

function LoginPage() {
  const [emailLogin, setEmailLogin] = useState('');
  const [emailRegister, setEmailRegister] = useState('');
  const [emailConfirm, setEmailConfirm] = useState('');
  const [passwordLogin, setPasswordLogin] = useState('');
  const [passwordRegister, setPasswordRegister] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [validation, setValidation] = useState({
    hasUpperCase: false,
    hasLowerCase: false,
    hasNumber: false,
    hasSpecialChar: false,
    hasGoodLength: false
  });
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${backendUrl}/auth/login`, {
        email: emailLogin,
        password: passwordLogin,
      });

      if (response.data.success) {
        localStorage.setItem('token', response.data.token);
        navigate('/main');
      } else {
        alert(response.data.message);
      }

    } catch (error) {
      console.error(error);
      alert('Login failed. This is something on our end, contact the support.');
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (emailRegister !== emailConfirm) {
      alert('Emails do not match!');
      return;
    }
    if (passwordRegister !== passwordConfirm) {
      alert('Passwords do not match!');
      return;
    }
    if (!validation.hasUpperCase || !validation.hasLowerCase || !validation.hasNumber || !validation.hasSpecialChar || !validation.hasGoodLength) {
      alert('Please make sure your password meets all the requirements!')
      return;
    }
    
    try {
      const response = await axios.post(`${backendUrl}/auth/register`, {
        email: emailRegister,
        password: passwordRegister,
        name: "User Name" // TO DO
      });
  
      if (response.data.success) {
        localStorage.setItem('token', response.data.token);
        navigate('/main');
      } else {
        alert(response.data.message);
      }
    } catch (error) {
      console.error(error);
      alert('Registration failed. This is something on our end, contact the support.');
    }
  };

  return (
    <SplitLayout>
      {/* Login Section */}
      <Section type="login">
        <h2>Login</h2>
        <Form onSubmit={handleLogin}>
          <div>
            <label>Email:</label>
            <Input
              type="email"
              value={emailLogin}
              onChange={(e) => setEmailLogin(e.target.value)}
              required
            />
          </div>
          <div>
            <label>Password:</label>
            <Input
              type="password"
              value={passwordLogin}
              onChange={(e) => setPasswordLogin(e.target.value)}
              required
            />
          </div>
          <Button type="submit">Login</Button>
        </Form>
      </Section>

      {/* Register Section */}
      <Section type="register">
        <h2>Register</h2>
        <Form onSubmit={handleRegister}>
          <div>
            <label>Email:</label>
            <Input
              type="email"
              value={emailRegister}
              onChange={(e) => setEmailRegister(e.target.value)}
              required
            />
          </div>
          <div>
            <label>Confirm Email:</label>
            <Input
              type="email"
              value={emailConfirm}
              onChange={(e) => setEmailConfirm(e.target.value)}
              required
            />
          </div>
          <div>
            <label>Password:</label>
            <PasswordValidator
              password={passwordRegister}
              onPasswordChange={setPasswordRegister}
              setValidation={setValidation}
            />
          </div>
          <div>
            <label>Confirm Password:</label>
            <Input
              type="password"
              value={passwordConfirm}
              onChange={(e) => setPasswordConfirm(e.target.value)}
              required
            />
          </div>
          <Button type="submit">Register</Button>
        </Form>
      </Section>
    </SplitLayout>
  );
}

export default LoginPage;
