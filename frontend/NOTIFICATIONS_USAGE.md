/**
 * GUÍA DE USO: NOTIFICACIONES (FRONTEND)
 * 
 * Cómo usar el sistema de notificaciones en componentes React
 * con TypeScript y el contexto centralizado.
 */

// ============================================
// 1. USAR EL HOOK EN COMPONENTES
// ============================================

import { useNotifications } from "../context/NotificationContext";

/**
 * EJEMPLO BÁSICO: Acceder a notificaciones
 */
function MyComponentExample() {
  const { notifications, unreadCount, isLoading } = useNotifications();

  return (
    <div>
      <p>Notificaciones sin leer: {unreadCount}</p>
      <p>Total de notificaciones: {notifications.length}</p>
      
      {isLoading && <p>Cargando...</p>}
      
      {notifications.map((notif) => (
        <div key={notif.id}>
          <p>{notif.message}</p>
          <span>{notif.read ? "Leída" : "Sin leer"}</span>
        </div>
      ))}
    </div>
  );
}

// ============================================
// 2. MARCAR NOTIFICACIONES COMO LEÍDAS
// ============================================

import { useNotifications } from "../context/NotificationContext";

/**
 * EJEMPLO: Componente con botón para marcar como leída
 */
function NotificationItemExample() {
  const { notifications, markAsRead } = useNotifications();

  const handleMarkAsRead = async (notificationId: number) => {
    try {
      await markAsRead(notificationId);
      // El estado se actualiza automáticamente
      // El badge disminuye inmediatamente (actualización optimista)
    } catch (error) {
      console.error("Error marcando como leída:", error);
    }
  };

  return (
    <div>
      {notifications.map((notif) => (
        <div
          key={notif.id}
          className={notif.read ? "opacity-50" : "opacity-100"}
        >
          <p>{notif.message}</p>
          {!notif.read && (
            <button onClick={() => handleMarkAsRead(notif.id)}>
              Marcar como leída
            </button>
          )}
        </div>
      ))}
    </div>
  );
}

// ============================================
// 3. USAR EL BADGE EN NAVBAR
// ============================================

import NotificationBadge from "../components/NotificationBadge";

/**
 * EJEMPLO: El badge se muestra automáticamente
 * Ya está integrado en el Navbar.tsx
 * 
 * El badge:
 * - Muestra el contador de notificaciones sin leer
 * - Se oculta si no hay notificaciones sin leer
 * - Al hacer click, abre el panel de notificaciones
 */
function NavbarExample() {
  const handleNotificationClick = () => {
    // Abrir modal o panel de notificaciones
    console.log("Abriendo panel de notificaciones");
  };

  return (
    <div>
      <NotificationBadge onClick={handleNotificationClick} />
    </div>
  );
}

// ============================================
// 4. LISTA COMPLETA DE NOTIFICACIONES
// ============================================

import NotificationsList from "../components/NotificationsList";

/**
 * EJEMPLO: Página o sección con lista completa
 */
function NotificationsPageExample() {
  return (
    <div className="p-6">
      <h1>Centro de Notificaciones</h1>
      <NotificationsList />
    </div>
  );
}

// ============================================
// 5. ACCIONES AVANZADAS DEL CONTEXTO
// ============================================

import { useNotifications } from "../context/NotificationContext";

/**
 * EJEMPLO: Todas las acciones disponibles
 */
function AdvancedNotificationsExample() {
  const {
    notifications,
    unreadCount,
    isLoading,
    error,
    hasMore,
    currentPage,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
    loadMoreNotifications,
    clearError,
  } = useNotifications();

  return (
    <div>
      {/* MOSTRAR ERRORES */}
      {error && (
        <div className="error-message">
          {error}
          <button onClick={clearError}>Cerrar</button>
        </div>
      )}

      {/* INFORMACIÓN */}
      <div>
        <p>Página: {currentPage}</p>
        <p>Total sin leer: {unreadCount}</p>
        <p>Hay más: {hasMore ? "Sí" : "No"}</p>
        <p>Cargando: {isLoading ? "Sí" : "No"}</p>
      </div>

      {/* LISTA DE NOTIFICACIONES */}
      {notifications.map((notif) => (
        <div key={notif.id}>
          <p>{notif.message}</p>
          <button onClick={() => markAsRead(notif.id)}>
            Marcar como leída
          </button>
        </div>
      ))}

      {/* ACCIONES */}
      <div>
        <button onClick={() => fetchNotifications(1)}>
          Recargar
        </button>
        
        <button onClick={markAllAsRead} disabled={unreadCount === 0}>
          Marcar todas como leídas
        </button>
        
        {hasMore && (
          <button onClick={loadMoreNotifications} disabled={isLoading}>
            Cargar más
          </button>
        )}
      </div>
    </div>
  );
}

// ============================================
// 6. TIPOS DISPONIBLES
// ============================================

import type {
  Notification,
  NotificationContextType,
  PaginatedNotificationsResponse,
  ApiNotificationResponse,
} from "../types/notification";

/**
 * INTERFAZ: Notification
 * 
 * {
 *   id: number;
 *   user_id: number;
 *   message: string;
 *   read: boolean;
 *   created_at: string; // ISO 8601
 * }
 */

/**
 * INTERFAZ: NotificationContextType
 * 
 * {
 *   notifications: Notification[];
 *   unreadCount: number;
 *   isLoading: boolean;
 *   error: string | null;
 *   hasMore: boolean;
 *   currentPage: number;
 *   
 *   fetchNotifications: (page?: number, limit?: number) => Promise<void>;
 *   markAsRead: (notificationId: number) => Promise<void>;
 *   markAllAsRead: () => Promise<void>;
 *   loadMoreNotifications: () => Promise<void>;
 *   clearError: () => void;
 * }
 */

// ============================================
// 7. SERVICIO DIRECTO (sin contexto)
// ============================================

import { NotificationService } from "../services/notifications";

/**
 * EJEMPLO: Usar el servicio directamente sin contexto
 * (Útil para casos especiales o tests)
 */
async function serviceDirectExample() {
  try {
    // Obtener notificaciones
    const data = await NotificationService.fetchNotifications(1, 10);
    console.log("Notificaciones:", data);

    // Marcar como leída
    const updated =
      await NotificationService.markNotificationAsRead(123);
    console.log("Actualizada:", updated);

    // Marcar todas como leídas
    const count = await NotificationService.markAllNotificationsAsRead();
    console.log("Actualizadas:", count);
  } catch (error) {
    console.error("Error:", error);
  }
}

// ============================================
// 8. CONFIGURACIÓN DE VARIABLES DE ENTORNO
// ============================================

/**
 * En tu archivo .env o .env.local, agrega:
 * 
 * VITE_API_URL=http://localhost:3000/api
 * 
 * O usa el valor por defecto si no está configurado:
 * import.meta.env.VITE_API_URL || "http://localhost:3000/api"
 */

// ============================================
// 9. PATRONES DE USO RECOMENDADOS
// ============================================

/**
 * PATRÓN 1: Componente que consume notificaciones
 */
function ComponentPattern1() {
  const { notifications, markAsRead } = useNotifications();

  return (
    <ul>
      {notifications.map((notif) => (
        <li
          key={notif.id}
          onClick={() => !notif.read && markAsRead(notif.id)}
        >
          {notif.message}
          {notif.read ? " ✓" : " •"}
        </li>
      ))}
    </ul>
  );
}

/**
 * PATRÓN 2: Componente con feedback visual
 */
function ComponentPattern2() {
  const { notifications, unreadCount, isLoading } = useNotifications();

  if (isLoading) return <div>Cargando notificaciones...</div>;

  return (
    <div>
      <header>{unreadCount} nuevas notificaciones</header>
      <main>
        {notifications.length === 0 ? (
          <p>Sin notificaciones</p>
        ) : (
          <NotificationsList />
        )}
      </main>
    </div>
  );
}

/**
 * PATRÓN 3: Componente con efectos secundarios
 */
import { useEffect } from "react";

function ComponentPattern3() {
  const { notifications, markAllAsRead } = useNotifications();

  useEffect(() => {
    // Cuando el componente se monta, marcar todas como leídas
    // (útil para "aceptar" notificaciones)
    if (notifications.length > 0) {
      markAllAsRead();
    }
  }, [notifications, markAllAsRead]);

  return <div>Notificaciones marcadas como leídas</div>;
}
