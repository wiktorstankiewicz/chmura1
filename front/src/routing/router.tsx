import { Navigate, createBrowserRouter } from "react-router-dom";
import LoginPage from "../pages/LoginPage";
import SelectGamePage from "../pages/SelectGamePage";
import RegisterPage from "../pages/RegisterPage";

export const router = createBrowserRouter([
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/select-game",
    element: <SelectGamePage />,
  },
  {
    path: "*",
    element: <Navigate to="/login" />,
  },
  {
    path: "/register",
    element: <RegisterPage />,
  },
]);
