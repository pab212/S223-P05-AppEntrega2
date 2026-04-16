import { useAuth } from "../context/AuthContext";
import type { Role } from "../context/AuthContext";

const Sidebar = () => {
  const { user } = useAuth();

  if (!user) return null;

  const menu: Record<Role, string[]> = {
    conserje: ["Inicio", "Registrar Encomienda", "Historial"],
    residente: ["Mis Encomiendas", "Notificaciones"],
  };

  return (
    <div className="w-64 h-screen bg-gray-100 p-4">
      <ul className="flex flex-col gap-3">
        {menu[user.role].map((item) => (
          <li
            key={item}
            className="cursor-pointer rounded p-2 hover:bg-gray-200"
          >
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;
