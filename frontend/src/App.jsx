import React from "react";
import { RouterProvider } from "react-router-dom";
import router from "./routes/routes";
import { ToastContainer } from "react-toastify";
function App() {
  return (
    <>
      <RouterProvider router={router} />
      <ToastContainer draggable />
    </>
  );
}

export default App;
