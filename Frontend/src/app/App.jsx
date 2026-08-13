import './App.css'
import { RouterProvider } from 'react-router'
import { router } from "./app.routes"
import { useSelector } from 'react-redux';
import { useEffect } from 'react';
import { useAuth } from '../features/auth/hook/useAuth';

export default function App() {

  const { handleGetMe } = useAuth()
  const user = useSelector((state) => state.auth)
  console.log(user)

  useEffect(() => {
    handleGetMe()
  }, [])
  return (
    <RouterProvider router={router} />
  );
}