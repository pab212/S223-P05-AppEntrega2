/**
 * TIPOS Y INTERFACES PARA NOTIFICACIONES
 * 
 * Define la estructura de datos para notificaciones en la API.
 * Todos los tipos están fuertemente tipificados con TypeScript.
 */

/**
 * INTERFAZ: Notification
 * Representa una notificación individual en la base de datos
 */
export interface Notification {
  id: number;
  user_id: number;
  message: string;
  read: boolean;
  created_at: Date;
}

/**
 * INTERFAZ: CreateNotificationDto
 * Datos requeridos para crear una nueva notificación
 */
export interface CreateNotificationDto {
  user_id: number;
  message: string;
}

/**
 * INTERFAZ: UpdateNotificationDto
 * Datos opcionales para actualizar una notificación
 */
export interface UpdateNotificationDto {
  read?: boolean;
}

/**
 * INTERFAZ: NotificationResponse
 * Respuesta estándar cuando se retorna una notificación
 */
export interface NotificationResponse extends Notification {
  created_at: string; // ISO 8601 string
}

/**
 * INTERFAZ: PaginatedNotificationsResponse
 * Respuesta para listados de notificaciones con paginación
 */
export interface PaginatedNotificationsResponse {
  notifications: NotificationResponse[];
  total: number;
  unread: number;
  hasMore: boolean;
}
