import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <div className="w-full bg-gray-800 p-4 text-white flex justify-between">
      <h1 className="font-bold">Encomiendas App</h1>

      {user && (
        <div className="flex items-center gap-4">
          <span>{user.role}</span>
          <button
            type="button"
            onClick={logout}
            className="rounded bg-red-500 px-3 py-1"
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
};

export default Navbar;
