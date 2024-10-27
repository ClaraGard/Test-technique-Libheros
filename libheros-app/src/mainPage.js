import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

function MainPage() {
  const [username, setUsername] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        if(decodedToken.exp * 1000 < Date.now()) {
          localStorage.removeItem("token");
          navigate("/login");
        }else{
          setUsername(decodedToken.email);
        }
      } catch (error) {
        console.error("Error decoding token:", error);
        localStorage.removeItem("token");
        navigate("/login");
      }
    }else{
      navigate("/login");
    }
  }, [navigate]);
  return (
    <div>
      <h1>Welcome {username ? username : "Guest"}!</h1>
      {/* Render other main page content */}
    </div>
  );
}

export default MainPage;