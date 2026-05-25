import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { fetchUsers, updateUserRole, type AdminUser } from "../services/admin";
import type { Role } from "../services/auth";

const ALL_ROLES: Role[] = ["residente", "conserje", "administrador"];

const ROLE_LABELS: Record<Role, string> = {
  residente: "Residente",
  conserje: "Conserje",
  administrador: "Administrador",
};

const ROLE_COLORS: Record<Role, string> = {
  residente: "bg-blue-500/15 text-blue-300 border-blue-500/30",
  conserje: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
  administrador: "bg-purple-500/15 text-purple-300 border-purple-500/30",
};

const Admin = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [pendingRole, setPendingRole] = useState<Record<string, Role>>({});
  const [saving, setSaving] = useState<Record<string, boolean>>({});
  const [savedFeedback, setSavedFeedback] = useState<Record<string, boolean>>({});

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setLoading(true);
      setError("");
      try {
        const data = await fetchUsers();
        if (!cancelled) setUsers(data);
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err.message : "Error al cargar usuarios");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    void load();
    return () => { cancelled = true; };
  }, []);

  const handleRoleChange = (userId: string, role: Role) => {
    setPendingRole((prev) => ({ ...prev, [userId]: role }));
    setSavedFeedback((prev) => ({ ...prev, [userId]: false }));
  };

  const handleSaveRole = async (userId: string) => {
    const role = pendingRole[userId];
    if (!role) return;

    setSaving((prev) => ({ ...prev, [userId]: true }));
    setError("");

    try {
      await updateUserRole(userId, role);
      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, role } : u))
      );
      setPendingRole((prev) => {
        const next = { ...prev };
        delete next[userId];
        return next;
      });
      setSavedFeedback((prev) => ({ ...prev, [userId]: true }));
      setTimeout(() => {
        setSavedFeedback((prev) => ({ ...prev, [userId]: false }));
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al actualizar rol");
    } finally {
      setSaving((prev) => ({ ...prev, [userId]: false }));
    }
  };

  const formatDate = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleDateString("es-CL", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white sm:text-3xl">
          Panel de Administración
        </h1>
        <p className="mt-2 text-sm text-gray-400">
          Gestiona usuarios y roles del sistema.
        </p>
      </div>

      {error && (
        <div className="rounded-2xl border border-red-400/25 bg-red-400/10 px-4 py-3 text-sm text-red-300">
          {error}
        </div>
      )}

      <div className="rounded-2xl border border-white/10 bg-[#2a2a2a]">
        <div className="border-b border-white/10 px-5 py-4">
          <h2 className="text-base font-semibold text-white">
            Usuarios del sistema
          </h2>
          {!loading && (
            <p className="mt-0.5 text-xs text-gray-400">
              {users.length} {users.length === 1 ? "usuario registrado" : "usuarios registrados"}
            </p>
          )}
        </div>

        {loading ? (
          <div className="flex items-center gap-3 px-5 py-8 text-sm text-gray-400">
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-gray-600 border-t-gray-300" />
            Cargando usuarios...
          </div>
        ) : users.length === 0 ? (
          <p className="px-5 py-8 text-sm text-gray-400">
            No hay usuarios registrados.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-sm">
              <thead>
                <tr className="border-b border-white/8 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                  <th className="px-5 py-3">Nombre</th>
                  <th className="px-5 py-3">Email / Usuario</th>
                  <th className="px-5 py-3">Rol actual</th>
                  <th className="px-5 py-3">Cambiar rol</th>
                  <th className="px-5 py-3">Registrado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {users.map((u) => {
                  const isSelf = u.id === user?.id;
                  const currentRole = u.role;
                  const selected = pendingRole[u.id] ?? currentRole;
                  const isDirty = pendingRole[u.id] !== undefined && pendingRole[u.id] !== currentRole;
                  const isSaving = saving[u.id] ?? false;
                  const justSaved = savedFeedback[u.id] ?? false;

                  return (
                    <tr
                      key={u.id}
                      className={`transition hover:bg-white/3 ${isSelf ? "opacity-60" : ""}`}
                    >
                      <td className="px-5 py-3.5">
                        <p className="font-medium text-white">{u.name}</p>
                        {isSelf && (
                          <p className="mt-0.5 text-xs text-yellow-400/80">
                            Tu cuenta
                          </p>
                        )}
                      </td>
                      <td className="px-5 py-3.5 text-gray-300">
                        <p>{u.email}</p>
                        <p className="mt-0.5 text-xs text-gray-500">@{u.username}</p>
                      </td>
                      <td className="px-5 py-3.5">
                        <span
                          className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${ROLE_COLORS[currentRole]}`}
                        >
                          {ROLE_LABELS[currentRole]}
                        </span>
                      </td>
                      <td className="px-5 py-3.5">
                        {isSelf ? (
                          <span className="text-xs text-gray-500">
                            No disponible
                          </span>
                        ) : (
                          <div className="flex items-center gap-2">
                            <select
                              value={selected}
                              onChange={(e) =>
                                handleRoleChange(u.id, e.target.value as Role)
                              }
                              disabled={isSaving}
                              className="rounded-xl border border-white/10 bg-[#1f1f1f] px-3 py-1.5 text-sm text-white outline-none transition focus:border-emerald-400 disabled:opacity-50"
                            >
                              {ALL_ROLES.map((r) => (
                                <option key={r} value={r}>
                                  {ROLE_LABELS[r]}
                                </option>
                              ))}
                            </select>

                            {isDirty && (
                              <button
                                type="button"
                                onClick={() => void handleSaveRole(u.id)}
                                disabled={isSaving}
                                className="rounded-xl bg-emerald-500 px-3 py-1.5 text-xs font-semibold text-slate-950 transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-60"
                              >
                                {isSaving ? (
                                  <span className="flex items-center gap-1.5">
                                    <span className="h-3 w-3 animate-spin rounded-full border-2 border-slate-950/20 border-t-slate-950" />
                                    Guardando
                                  </span>
                                ) : (
                                  "Guardar"
                                )}
                              </button>
                            )}

                            {justSaved && !isDirty && (
                              <span className="text-xs text-emerald-400">
                                Guardado
                              </span>
                            )}
                          </div>
                        )}
                      </td>
                      <td className="px-5 py-3.5 text-xs text-gray-500">
                        {formatDate(u.created_at)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Admin;
