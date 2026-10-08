import { useLocation } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar";
import AppRoutes from "./routes/AppRoutes";

function App() {
  const location = useLocation();

  const isAdminRoute =
    location.pathname.startsWith("/admin");

  return (
    <div className="bg-[#faf6f0] min-h-screen">
      {!isAdminRoute && <Navbar />}

      <AppRoutes />
    </div>
  );
}

export default App;
