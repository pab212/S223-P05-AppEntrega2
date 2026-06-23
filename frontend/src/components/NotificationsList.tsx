/**
 * COMPONENTE: NotificationsList
 * 
 * Muestra una lista de notificaciones del usuario autenticado.
 * Permite marcar notificaciones como leídas, con actualización inmediata.
 * 
 * Características:
 * - Lista paginada de notificaciones
 * - Click para marcar como leída
 * - Visual diferente para leídas y sin leer
 * - Botón para marcar todas como leídas
 * - Carga infinita (al hacer scroll)
 * - Manejo de errores con reintentos
 */

import { useState } from "react";
import { useNotifications } from "../context/NotificationContext";

/**
 * COMPONENTE: NotificationsList
 * 
 * Muestra lista de notificaciones con interactividad
 * 
 * @returns JSX Element con la lista de notificaciones
 */
const NotificationsList = () => {
  const {
    notifications,
    unreadCount,
    isLoading,
    error,
    hasMore,
    markAsRead,
    markAllAsRead,
    loadMoreNotifications,
    clearError,
  } = useNotifications();

  const [markingAsRead, setMarkingAsRead] = useState<Set<number>>(new Set());

  /**
   * MANEJADOR: Marcar notificación como leída
   * 
   * Al hacer click en una notificación:
   * 1. Marca localmente como "marcando"
   * 2. Llama a la API
   * 3. Actualiza estado global automáticamente
   * 4. El badge disminuye inmediatamente (actualización optimista)
   */
  const handleMarkAsRead = async (notificationId: number) => {
    setMarkingAsRead((prev) => new Set([...prev, notificationId]));

    try {
      await markAsRead(notificationId);
    } finally {
      setMarkingAsRead((prev) => {
        const newSet = new Set(prev);
        newSet.delete(notificationId);
        return newSet;
      });
    }
  };

  /**
   * MANEJADOR: Marcar todas como leídas
   */
  const handleMarkAllAsRead = async () => {
    try {
      await markAllAsRead();
    } catch (err) {
      console.error("Error marcando todas como leídas:", err);
    }
  };

  /**
   * MANEJADOR: Cargar más notificaciones
   * Se llama cuando el usuario hace scroll al final
   */
  const handleLoadMore = async () => {
    try {
      await loadMoreNotifications();
    } catch (err) {
      console.error("Error cargando más notificaciones:", err);
    }
  };

  // ESTADO: Sin notificaciones
  if (!isLoading && notifications.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-white/10 bg-white/5 px-6 py-12 text-center">
        <svg
          className="mb-4 h-12 w-12 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <p className="text-gray-400">No hay notificaciones</p>
        <p className="mt-1 text-sm text-gray-500">
          Volveremos a contactarte pronto
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* ENCABEZADO CON TÍTULO Y BOTÓN DE MARCAR COMO LEÍDAS */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-white">Notificaciones</h2>
          <p className="text-sm text-gray-400">
            {unreadCount > 0 ? (
              <>
                {unreadCount} sin leer
                {" • "}
                {notifications.length} total
              </>
            ) : (
              "Todas leídas"
            )}
          </p>
        </div>

        {/* BOTÓN: Marcar todas como leídas */}
        {unreadCount > 0 && (
          <button
            onClick={handleMarkAllAsRead}
            disabled={isLoading}
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-500 disabled:opacity-50"
            title="Marcar todas como leídas"
          >
            Marcar todas como leídas
          </button>
        )}
      </div>

      {/* MENSAJE DE ERROR */}
      {error && (
        <div className="rounded-lg border border-red-500/20 bg-red-500/10 p-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-red-400">{error}</p>
            <button
              onClick={clearError}
              className="text-red-400 hover:text-red-300"
              aria-label="Cerrar error"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* LISTA DE NOTIFICACIONES */}
      <div className="space-y-2">
        {notifications.map((notification) => (
          <div
            key={notification.id}
            className={`rounded-lg border transition-all ${
              notification.read
                ? "border-white/5 bg-white/5"
                : "border-blue-500/30 bg-blue-500/10"
            } ${
              markingAsRead.has(notification.id)
                ? "opacity-50"
                : "opacity-100"
            } cursor-pointer p-4 hover:bg-white/10`}
            onClick={() => {
              if (!notification.read) {
                handleMarkAsRead(notification.id);
              }
            }}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !notification.read) {
                handleMarkAsRead(notification.id);
              }
            }}
          >
            {/* CONTENIDO DE LA NOTIFICACIÓN */}
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0 flex-1">
                {/* INDICADOR DE LEÍDA/SIN LEER */}
                <div className="mb-2 flex items-center gap-2">
                  {!notification.read && (
                    <div className="h-2 w-2 rounded-full bg-blue-500" />
                  )}
                  <span
                    className={`text-xs ${
                      notification.read
                        ? "text-gray-500"
                        : "text-gray-400"
                    }`}
                  >
                    {new Date(notification.created_at).toLocaleDateString(
                      "es-ES",
                      {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      }
                    )}
                  </span>
                </div>

                {/* MENSAJE */}
                <p
                  className={`text-sm leading-relaxed break-words ${
                    notification.read ? "text-gray-400" : "text-white"
                  } ${markingAsRead.has(notification.id) ? "line-through" : ""}`}
                >
                  {notification.message}
                </p>
              </div>

              {/* INDICADOR DE ESTADO */}
              {notification.read ? (
                <div className="flex-shrink-0 text-gray-500" title="Leída">
                  <svg
                    className="h-5 w-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              ) : (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleMarkAsRead(notification.id);
                  }}
                  className="flex-shrink-0 rounded-full bg-blue-600 p-2 text-white transition hover:bg-blue-500 disabled:opacity-50"
                  disabled={markingAsRead.has(notification.id)}
                  title="Marcar como leída"
                >
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* ESTADO DE CARGA */}
      {isLoading && (
        <div className="flex justify-center py-4">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />
        </div>
      )}

      {/* BOTÓN: Cargar más */}
      {hasMore && !isLoading && (
        <button
          onClick={handleLoadMore}
          className="w-full rounded-lg border border-white/10 bg-white/5 py-3 text-sm font-medium text-gray-400 transition hover:bg-white/10 hover:text-white"
        >
          Cargar más notificaciones
        </button>
      )}

      {/* MENSAJE: Todas cargadas */}
      {!hasMore && notifications.length > 0 && (
        <p className="text-center text-xs text-gray-500">
          No hay más notificaciones
        </p>
      )}
    </div>
  );
};

export default NotificationsList;
