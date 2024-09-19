import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Landing from './pages/landingPage/Landing';
import Login from './pages/loginPage/Login';
import Register from './pages/register/Register';
import Dashboard from './pages/dashboard/AdminDashboard';
import CreateQuiz from './pages/createQuiz/CreateQuiz';
import AdminDashboard from './pages/dashboard/AdminDashboard';
import UserDashboard from './pages/dashboard/UserDashboard';
import QuizDetails from './pages/createQuiz/QuizDetails';
import AllQuizzes from './pages/createQuiz/AllQuizzes';
import Result from './pages/createQuiz/Result';
import UserResult from './pages/createQuiz/UserResult';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} /> 
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register/>}/>
        <Route path="/admin-dashboard" element={<AdminDashboard/>}/>
        <Route path="/dashboard" element={<Dashboard/>}/>
        <Route path="/createquiz/:language" element={<CreateQuiz/>}/>
        <Route path="/userdashboard" element={<UserDashboard/>}/>
        <Route path="/quizzes/:language" element={<AllQuizzes/>}/>
        <Route path="/quizdetails/:id/:userId" element={<QuizDetails/>}/>
        <Route path="/results/:quizId" element={<Result/>}/>
        <Route path="/results/:quizId/:userId" element={<UserResult/>}/>
        
      </Routes>
    </Router>
  );
};

export default App;