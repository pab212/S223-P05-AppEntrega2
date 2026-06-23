/**
 * RUTAS: Notificaciones
 * 
 * Define los endpoints para manejar notificaciones.
 * Todos los endpoints son protegidos con JWT (requieren autenticación).
 */

import { Router } from "express";
import { authMiddleware } from "../middleware/authMiddleware";
import { NotificationController } from "../controllers/notificationController";

const router = Router();

/**
 * ENDPOINT: GET /notifications
 * 
 * Obtiene las notificaciones del usuario autenticado con paginación.
 * Solo retorna notificaciones del usuario autenticado (seguridad).
 * 
 * Solicitud:
 * GET /notifications?page=1&limit=10
 * Headers: Authorization: Bearer <token_jwt>
 * 
 * Query Parameters:
 * - page: Número de página (default: 1)
 * - limit: Cantidad de resultados por página (default: 10, máximo: 100)
 * 
 * Respuesta exitosa (200):
 * {
 *   "message": "Notificaciones obtenidas exitosamente",
 *   "data": {
 *     "notifications": [
 *       {
 *         "id": 1,
 *         "user_id": 5,
 *         "message": "Tu paquete ha sido entregado",
 *         "read": false,
 *         "created_at": "2026-06-23T10:30:00.000Z"
 *       }
 *     ],
 *     "total": 25,
 *     "unread": 5,
 *     "hasMore": true
 *   }
 * }
 * 
 * Errores:
 * - 401: No autenticado
 * - 400: Parámetros inválidos
 * - 500: Error del servidor
 */
router.get("/", authMiddleware, NotificationController.getNotifications);

/**
 * ENDPOINT: PATCH /notifications/:id/read
 * 
 * Marca una notificación específica como leída.
 * 
 * Validaciones de seguridad:
 * - Solo el propietario de la notificación puede marcarla como leída
 * - La notificación debe existir
 * 
 * Solicitud:
 * PATCH /notifications/1/read
 * Headers: Authorization: Bearer <token_jwt>
 * 
 * Respuesta exitosa (200):
 * {
 *   "message": "Notificación marcada como leída",
 *   "data": {
 *     "id": 1,
 *     "user_id": 5,
 *     "message": "Tu paquete ha sido entregado",
 *     "read": true,
 *     "created_at": "2026-06-23T10:30:00.000Z"
 *   }
 * }
 * 
 * Errores:
 * - 401: No autenticado
 * - 403: No tienes permisos (notificación de otro usuario)
 * - 404: Notificación no encontrada
 * - 500: Error del servidor
 */
router.patch(
  "/:id/read",
  authMiddleware,
  NotificationController.markNotificationAsRead
);

/**
 * ENDPOINT: PATCH /notifications/read-all
 * 
 * Marca todas las notificaciones sin leer del usuario como leídas.
 * 
 * Solicitud:
 * PATCH /notifications/read-all
 * Headers: Authorization: Bearer <token_jwt>
 * 
 * Respuesta exitosa (200):
 * {
 *   "message": "Todas las notificaciones han sido marcadas como leídas",
 *   "data": {
 *     "updated": 5
 *   }
 * }
 * 
 * Errores:
 * - 401: No autenticado
 * - 500: Error del servidor
 */
router.patch(
  "/read-all",
  authMiddleware,
  NotificationController.markAllNotificationsAsRead
);

export default router;
