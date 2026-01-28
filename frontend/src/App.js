import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Signup from './components/Signup';
import Dashboard from './components/Dashboard';
import CreateEvent from './components/CreateEvent';
import EventRegistrations from './components/EventRegistrations';
import PublicEventPage from './components/PublicEventPage';
import TicketPage from './components/TicketPage';
import CheckRegistration from './components/CheckRegistration';

function App() {
  const isAuthenticated = () => {
    return localStorage.getItem('token') !== null;
  };

  const PrivateRoute = ({ children }) => {
    return isAuthenticated() ? children : <Navigate to="/login" />;
  };

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/" element={
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        } />
        <Route path="/create-event" element={
          <PrivateRoute>
            <CreateEvent />
          </PrivateRoute>
        } />
        <Route path="/event/:id/registrations" element={
          <PrivateRoute>
            <EventRegistrations />
          </PrivateRoute>
        } />
        <Route path="/event/:id" element={<PublicEventPage />} />
        <Route path="/ticket/:ticketId" element={<TicketPage />} />
        <Route path="/check-registration" element={<CheckRegistration />} />
      </Routes>
    </Router>
  );
}

export default App;
