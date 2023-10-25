
import { addOnAuthStateChangedListener, removeOnAuthStateChangedListener } from './firebase/auth';
import { useEffect, useState } from 'react';
import { userIsAdmin } from './firebase/firestore';
import {
  Routes,
  Route,
  Link,
  useNavigate,
} from 'react-router-dom';
import React from 'react';
import { User } from 'firebase/auth';
import MainPage from './pages/user/MainPage';
import AdminPage from './pages/admin/AdminPage';
import BookingPage from './pages/user/BookingPage';
import EditWorkPage from './pages/admin/EditWorkPage';
import RentalPage from './pages/user/RentalPage';
import EditAppointmentPage from './pages/admin/EditAppointmentPage';
import EditRentalItemPage from './pages/admin/EditRentalItemPage';

function App() {
  const navigate = useNavigate();

  useEffect(() => {
    function onAuthChanged(user: User | null) {
      userIsAdmin((isAdmin: boolean) => {
        if (user && isAdmin) {
          navigate('/admin');
        }
        else {
          navigate('/');
        }
      });
    }

    addOnAuthStateChangedListener((user: any) => onAuthChanged(user));

    return () => {
      removeOnAuthStateChangedListener((user: any) => onAuthChanged(user));
    };
  }, [navigate]);

  return <Routes>
    <Route index element={<MainPage />} />
    <Route path='/booking' element={<BookingPage />} />
    <Route path='/admin' element={<AdminPage />} />
    <Route path='/works/edit/:workTitle' element={<EditWorkPage />} />
    <Route path='/appointments/edit/:appointmentId' element={<EditAppointmentPage />} />
    <Route path='/items/edit/:itemId' element={<EditRentalItemPage />} />
    <Route path='/rental' element={<RentalPage />} />
  </Routes>;
}

export default App;
