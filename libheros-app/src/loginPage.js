import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PasswordValidator from './components/passwordValidator';
import styled from 'styled-components';

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

function LoginPage() {
  const [email, setEmail] = useState('');
  const [emailConfirm, setEmailConfirm] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [validation, setValidation] = useState({
    hasUpperCase: false,
    hasLowerCase: false,
    hasNumber: false,
    hasSpecialChar: false,
    hasGoodLength: false
  });
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    navigate('/main');
  };

  const handleRegister = (e) => {
    e.preventDefault();
    if (email !== emailConfirm) {
      alert('Emails do not match!');
      return;
    }
    if (password !== passwordConfirm) {
      alert('Passwords do not match!');
      return;
    }
    if (!validation.hasUpperCase || !validation.hasLowerCase || !validation.hasNumber || !validation.hasSpecialChar || !validation.hasGoodLength) {
      alert('Please make sure your password meets all the requirements!')
      return;
    }
    
    navigate('/main');
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
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label>Password:</label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
              password={password}
              onPasswordChange={setPassword}
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
