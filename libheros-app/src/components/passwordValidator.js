import React from 'react';

import styled from 'styled-components';
const Input = styled.input`
  width: 100%;
  padding: 10px;
  margin-top: 5px;
  border: 1px solid #ccc;
  border-radius: 5px;
`;

const specialCaracters = /[!@#$%^&*(),.?":{}|<>+/= -]/;

const PasswordValidator = ({ password, onPasswordChange, setValidation }) => {
  const validatePassword = (password) => {
    const validation = {
      hasUpperCase: /[A-Z]/.test(password),
      hasLowerCase: /[a-z]/.test(password),
      hasNumber: /\d/.test(password),
      hasSpecialChar: specialCaracters.test(password),
      hasGoodLength: password.length >=8 && password.length <= 32
    };
    
    setValidation(validation);
  };

  const handleChange = (e) => {
    const newPassword = e.target.value;
    onPasswordChange(newPassword);
    validatePassword(newPassword);
  };


  return (
    <div>
      <Input
        type="password"
        placeholder="Enter your password"
        value={password}
        onChange={handleChange}
      />
      <ul>
        <li style={{ color: /[A-Z]/.test(password) ? 'green' : 'red' }}>
          {/[A-Z]/.test(password) ? '✔' : '❌'} Must contain at least one uppercase letter
        </li>
        <li style={{ color: /[a-z]/.test(password) ? 'green' : 'red' }}>
          {/[a-z]/.test(password) ? '✔' : '❌'} Must contain at least one lowercase letter
        </li>
        <li style={{ color: /\d/.test(password) ? 'green' : 'red' }}>
          {/\d/.test(password) ? '✔' : '❌'} Must contain at least one number
        </li>
        <li style={{ color: specialCaracters.test(password) ? 'green' : 'red' }}>
          {specialCaracters.test(password) ? '✔' : '❌'} Must contain at least one special character
        </li>
        <li style={{ color: password.length >=8 && password.length ? 'green' : 'red' }}>
          {password.length >=8 && password.length <= 32 ? '✔' : '❌'} Password must be between 8 and 32 characters
        </li>
      </ul>
    </div>
  );
};

export default PasswordValidator;
