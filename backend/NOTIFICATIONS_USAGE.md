/**
 * GUÍA DE USO: NOTIFICACIONES (BACKEND)
 * 
 * Cómo integrar el sistema de notificaciones en tus controladores
 * y cómo usar el trigger automático cuando se registran paquetes.
 */

// ============================================
// 1. DISPARAR NOTIFICACIÓN CUANDO SE CREA UN PAQUETE
// ============================================

import { PackageNotificationTrigger } from "../services/packageNotificationTrigger";

/**
 * EJEMPLO: En el controlador de paquetes (packages.controller.ts)
 * Cuando se registra un nuevo paquete:
 */
async function createPackageExample(req: AuthRequest, res: Response) {
  try {
    // ... lógica para crear el paquete en BD ...
    
    const packageId = 123;
    const residentId = req.user.id;
    const recipientName = "Juan Pérez";

    // DISPARAR NOTIFICACIÓN AUTOMÁTICAMENTE
    await PackageNotificationTrigger.notifyPackageCreated(
      residentId,
      packageId,
      recipientName
    );

    // Responder al cliente
    return res.status(201).json({
      message: "Paquete creado exitosamente",
      data: { id: packageId, /* ... */ },
    });
  } catch (error) {
    return res.status(500).json({
      error: "Error creando paquete",
      message: error instanceof Error ? error.message : "Error desconocido",
    });
  }
}

// ============================================
// 2. DISPARAR NOTIFICACIÓN CUANDO SE ENTREGA UN PAQUETE
// ============================================

/**
 * EJEMPLO: En el controlador de paquetes
 * Cuando el conserje marca un paquete como entregado:
 */
async function markPackageDeliveredExample(req: AuthRequest, res: Response) {
  try {
    const packageId = req.params.id;
    
    // ... lógica para actualizar el paquete en BD ...
    
    const residentUserId = 5;
    const senderName = "Amazon";

    // DISPARAR NOTIFICACIÓN DE ENTREGA
    await PackageNotificationTrigger.notifyPackageDelivered(
      residentUserId,
      packageId,
      senderName
    );

    return res.status(200).json({
      message: "Paquete marcado como entregado",
    });
  } catch (error) {
    return res.status(500).json({
      error: "Error marcando paquete como entregado",
    });
  }
}

// ============================================
// 3. DISPARAR NOTIFICACIÓN CUANDO HAY RECLAMO
// ============================================

/**
 * EJEMPLO: En el controlador de reclamos
 * Cuando se abre un nuevo reclamo:
 */
async function createClaimExample(req: AuthRequest, res: Response) {
  try {
    const packageId = req.body.package_id;
    const residentUserId = req.user.id;
    
    // ... lógica para crear el reclamo en BD ...
    
    const claimId = 456;

    // DISPARAR NOTIFICACIÓN DE RECLAMO PARA RESIDENTE
    await PackageNotificationTrigger.notifyClaimOpened(
      residentUserId,
      packageId,
      claimId
    );

    // NOTIFICAR AL CONSERJE
    const conserjeUserId = 2; // ID del conserje
    await PackageNotificationTrigger.notifyConserje(
      conserjeUserId,
      "claim_opened",
      `Nuevo reclamo #${claimId} para paquete #${packageId}`
    );

    return res.status(201).json({
      message: "Reclamo abierto exitosamente",
      data: { id: claimId },
    });
  } catch (error) {
    return res.status(500).json({
      error: "Error creando reclamo",
    });
  }
}

// ============================================
// 4. USAR DIRECTAMENTE EL SERVICIO
// ============================================

import { NotificationService } from "../services/notificationService";

/**
 * EJEMPLO: Crear una notificación de forma directa
 * Útil para eventos personalizados:
 */
async function customNotificationExample() {
  try {
    const notification = await NotificationService.createNotification({
      user_id: 5,
      message: "🎉 ¡Hola! Este es un mensaje personalizado",
    });

    console.log("Notificación creada:", notification);
  } catch (error) {
    console.error("Error:", error);
  }
}

/**
 * EJEMPLO: Obtener notificaciones de un usuario
 */
async function getUserNotificationsExample() {
  try {
    const result = await NotificationService.getNotificationsByUserId(
      5, // userId
      1, // page
      10 // limit
    );

    console.log("Notificaciones:", result);
    console.log("Sin leer:", result.unread);
    console.log("Hay más:", result.hasMore);
  } catch (error) {
    console.error("Error:", error);
  }
}

/**
 * EJEMPLO: Marcar notificación como leída programáticamente
 */
async function markAsReadExample() {
  try {
    const notification = await NotificationService.markNotificationAsRead(123);
    console.log("Notificación marcada como leída:", notification);
  } catch (error) {
    console.error("Error:", error);
  }
}

/**
 * EJEMPLO: Limpiar notificaciones antiguas (tarea programada)
 * Útil para ejecutar con cron jobs
 */
async function cleanOldNotificationsExample() {
  try {
    const deleted = await NotificationService.deleteOldNotifications(30); // Eliminar con >30 días
    console.log(`Se eliminaron ${deleted} notificaciones antiguas`);
  } catch (error) {
    console.error("Error limpiando notificaciones:", error);
  }
}

// ============================================
// 5. ENDPOINTS DISPONIBLES
// ============================================

/**
 * GET /api/notifications
 * Obtiene las notificaciones del usuario autenticado
 * 
 * Query params: page=1&limit=10
 * Headers: Authorization: Bearer <token>
 * 
 * Respuesta:
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
 */

/**
 * PATCH /api/notifications/:id/read
 * Marca una notificación como leída
 * 
 * Headers: Authorization: Bearer <token>
 * 
 * Respuesta:
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
 */

/**
 * PATCH /api/notifications/read-all
 * Marca todas las notificaciones como leídas
 * 
 * Headers: Authorization: Bearer <token>
 * 
 * Respuesta:
 * {
 *   "message": "Todas las notificaciones han sido marcadas como leídas",
 *   "data": {
 *     "updated": 5
 *   }
 * }
 */
