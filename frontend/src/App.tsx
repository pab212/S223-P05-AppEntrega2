import "./index.css";
import MainLayout from "./layouts/MainLayout";
import Login from "./pages/Login";
import Conserje from "./pages/Conserje";
import Residente from "./pages/Residente";
import { useAuth } from "./context/AuthContext";

export default function App() {
  const { user } = useAuth();

  if (!user) {
    return <Login />;
  }

  return (
    <MainLayout>
      {user.role === "conserje" ? <Conserje /> : <Residente />}
    </MainLayout>
  );
}
