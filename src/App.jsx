import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import LoginPage from '@/components/LoginPage';
import FundSelection from '@/components/FundSelection';
import { useEffect } from 'react';



function App() {
  const router = createBrowserRouter([
    {
      path: '/',
      element: (
        <>
          <LoginPage />
        </>
      ),
    },
    {
      path: '/login',
      element: (
        <>
          <LoginPage />
        </>
      ),
    },
    {
      path: '/fund-selection',
      element: (
        <>
          <Navbar />
          <FundSelection />
        </>
      ),
    },
  ]);

  return <RouterProvider router={router} />;
}

export default App;
