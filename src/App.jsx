import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes";
import { BreadcrumbProvider } from "./context/BreadcrumbContext";

function App() {
  return (

    <BreadcrumbProvider>
      <Router>
        <AppRoutes />
      </Router>
    </BreadcrumbProvider>


  );
}

export default App;