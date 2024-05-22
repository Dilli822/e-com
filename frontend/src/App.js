import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate from React Router
import './App.css';

import MainRouter from "./routes"
import Main from './components/apps/e-com/main/main';
import { BrowserRouter as Router, Route } from "react-router-dom";

const App = () => {

  return (
       <Router>
        <MainRouter/>
       </Router>
  );
};

export default App;
