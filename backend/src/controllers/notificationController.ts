/**
 * CONTROLLER: NotificationController
 * 
 * Maneja las peticiones HTTP para notificaciones.
 * Valida entrada, llama al servicio y formatea respuestas.
 */

import type { Response } from "express";
import type { AuthRequest } from "../middleware/authMiddleware";
import { NotificationService } from "../services/notificationService";

/**
 * CLASE: NotificationController
 * Proporciona métodos para manejar endpoints de notificaciones
 */
export class NotificationController {
  /**
   * ENDPOINT: GET /notifications
   * Obtiene las notificaciones del usuario autenticado
   *
   * Query parameters:
   * - page: Número de página (default: 1)
   * - limit: Cantidad de resultados por página (default: 10)
   *
   * Respuesta exitosa (200):
   * {
   *   "message": "Notificaciones obtenidas exitosamente",
   *   "data": {
   *     "notifications": [...],
   *     "total": 25,
   *     "unread": 5,
   *     "hasMore": true
   *   }
   * }
   *
   * Errores:
   * - 401: No autenticado
   * - 500: Error del servidor
   */
  static async getNotifications(req: AuthRequest, res: Response) {
    try {
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({
          error: "No autorizado",
          message: "Usuario no encontrado en token",
        });
      }

      // Obtener parámetros de paginación de la query string
      const page = Math.max(1, parseInt(req.query.page as string) || 1);
      const limit = Math.max(1, parseInt(req.query.limit as string) || 10);

      // Validar que limit no sea excesivamente grande
      if (limit > 100) {
        return res.status(400).json({
          error: "Validación fallida",
          message: "El límite máximo es 100",
        });
      }

      const result = await NotificationService.getNotificationsByUserId(
        userId,
        page,
        limit
      );

      return res.status(200).json({
        message: "Notificaciones obtenidas exitosamente",
        data: result,
      });
    } catch (error) {
      console.error("Error en getNotifications:", error);
      return res.status(500).json({
        error: "Error obteniendo notificaciones",
        message: error instanceof Error ? error.message : "Error desconocido",
      });
    }
  }

  /**
   * ENDPOINT: PATCH /notifications/:id/read
   * Marca una notificación como leída
   *
   * Validaciones:
   * - La notificación debe existir
   * - La notificación debe pertenecer al usuario autenticado (seguridad)
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
   * - 404: Notificación no encontrada o no pertenece al usuario
   * - 500: Error del servidor
   */
  static async markNotificationAsRead(req: AuthRequest, res: Response) {
    try {
      const userId = req.user?.id;
      const notificationId = parseInt(req.params.id);

      // Validar usuario autenticado
      if (!userId) {
        return res.status(401).json({
          error: "No autorizado",
          message: "Usuario no encontrado en token",
        });
      }

      // Validar que el ID de la notificación es un número válido
      if (isNaN(notificationId) || notificationId <= 0) {
        return res.status(400).json({
          error: "Validación fallida",
          message: "ID de notificación inválido",
        });
      }

      // Obtener la notificación para verificar que pertenece al usuario
      const notification =
        await NotificationService.getNotificationById(notificationId);

      if (!notification) {
        return res.status(404).json({
          error: "No encontrado",
          message: "Notificación no encontrada",
        });
      }

      // VALIDACIÓN DE SEGURIDAD: Verificar que la notificación pertenece al usuario
      if (notification.user_id !== userId) {
        return res.status(403).json({
          error: "Prohibido",
          message: "No tienes permisos para actualizar esta notificación",
        });
      }

      // Marcar como leída
      const updatedNotification =
        await NotificationService.markNotificationAsRead(notificationId);

      if (!updatedNotification) {
        return res.status(500).json({
          error: "Error actualizando notificación",
          message: "No se pudo marcar la notificación como leída",
        });
      }

      return res.status(200).json({
        message: "Notificación marcada como leída",
        data: updatedNotification,
      });
    } catch (error) {
      console.error("Error en markNotificationAsRead:", error);
      return res.status(500).json({
        error: "Error marcando notificación como leída",
        message: error instanceof Error ? error.message : "Error desconocido",
      });
    }
  }

  /**
   * ENDPOINT: PATCH /notifications/read-all
   * Marca todas las notificaciones del usuario como leídas
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
  static async markAllNotificationsAsRead(req: AuthRequest, res: Response) {
    try {
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({
          error: "No autorizado",
          message: "Usuario no encontrado en token",
        });
      }

      const updated =
        await NotificationService.markAllNotificationsAsRead(userId);

      return res.status(200).json({
        message: "Todas las notificaciones han sido marcadas como leídas",
        data: { updated },
      });
    } catch (error) {
      console.error("Error en markAllNotificationsAsRead:", error);
      return res.status(500).json({
        error: "Error marcando notificaciones como leídas",
        message: error instanceof Error ? error.message : "Error desconocido",
      });
    }
  }
}
