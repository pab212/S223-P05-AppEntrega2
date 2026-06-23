/**
 * SERVICIO: PackageNotificationTrigger
 * 
 * Contiene funciones para disparar notificaciones automáticas
 * cuando ocurren eventos relacionados con paquetes.
 * 
 * Este servicio es llamado desde los controladores de paquetes
 * para crear notificaciones de forma automática.
 */

import { NotificationService } from "./notificationService";
import type { CreateNotificationDto } from "../types/notification";

/**
 * CLASE: PackageNotificationTrigger
 * Proporciona métodos estáticos para disparar notificaciones de paquetes
 */
export class PackageNotificationTrigger {
  /**
   * MÉTODO: notifyPackageCreated
   * Dispara una notificación cuando se registra un nuevo paquete
   *
   * @param userId - ID del usuario residente propietario del paquete
   * @param packageId - ID del paquete registrado
   * @param recipientName - Nombre del destinatario del paquete
   * @returns Promise de la notificación creada
   */
  static async notifyPackageCreated(
    userId: number,
    packageId: number,
    recipientName: string
  ): Promise<void> {
    try {
      const message = `📦 Nuevo paquete registrado para ${recipientName} (ID: ${packageId})`;
      const notificationData: CreateNotificationDto = {
        user_id: userId,
        message,
      };

      await NotificationService.createNotification(notificationData);
      console.log(`✓ Notificación creada para usuario ${userId}: ${message}`);
    } catch (error) {
      console.error(
        "Error disparando notificación de paquete registrado:",
        error
      );
      // No lanzamos el error para no interrumpir el flujo de creación del paquete
    }
  }

  /**
   * MÉTODO: notifyPackageDelivered
   * Dispara una notificación cuando un paquete es entregado
   *
   * @param userId - ID del usuario residente que recibe el paquete
   * @param packageId - ID del paquete entregado
   * @param senderName - Nombre de quien envía el paquete
   * @returns Promise void
   */
  static async notifyPackageDelivered(
    userId: number,
    packageId: number,
    senderName: string
  ): Promise<void> {
    try {
      const message = `✅ Tu paquete de ${senderName} ha sido entregado (ID: ${packageId})`;
      const notificationData: CreateNotificationDto = {
        user_id: userId,
        message,
      };

      await NotificationService.createNotification(notificationData);
      console.log(
        `✓ Notificación entrega enviada para usuario ${userId}: ${message}`
      );
    } catch (error) {
      console.error("Error disparando notificación de paquete entregado:", error);
    }
  }

  /**
   * MÉTODO: notifyPackagePending
   * Dispara una notificación cuando hay un paquete pendiente de retiro
   *
   * @param userId - ID del usuario residente
   * @param packageId - ID del paquete pendiente
   * @param daysWaiting - Cantidad de días que lleva esperando
   * @returns Promise void
   */
  static async notifyPackagePending(
    userId: number,
    packageId: number,
    daysWaiting: number
  ): Promise<void> {
    try {
      const message =
        daysWaiting > 3
          ? `⏰ ¡Atención! Tu paquete lleva ${daysWaiting} días esperando (ID: ${packageId}). Por favor retíralo pronto.`
          : `📬 Tienes un paquete pendiente de retiro (ID: ${packageId})`;

      const notificationData: CreateNotificationDto = {
        user_id: userId,
        message,
      };

      await NotificationService.createNotification(notificationData);
      console.log(
        `✓ Notificación pendiente enviada para usuario ${userId}: ${message}`
      );
    } catch (error) {
      console.error("Error disparando notificación de paquete pendiente:", error);
    }
  }

  /**
   * MÉTODO: notifyClaimOpened
   * Dispara una notificación cuando se abre un reclamo sobre un paquete
   *
   * @param userId - ID del usuario residente que abrió el reclamo
   * @param packageId - ID del paquete reclamado
   * @param claimId - ID del reclamo
   * @returns Promise void
   */
  static async notifyClaimOpened(
    userId: number,
    packageId: number,
    claimId: number
  ): Promise<void> {
    try {
      const message = `🔴 Reclamo abierto para tu paquete (ID: ${packageId}). Reclamo #${claimId}. El conserje lo revisará pronto.`;
      const notificationData: CreateNotificationDto = {
        user_id: userId,
        message,
      };

      await NotificationService.createNotification(notificationData);
      console.log(
        `✓ Notificación reclamo enviada para usuario ${userId}: ${message}`
      );
    } catch (error) {
      console.error("Error disparando notificación de reclamo:", error);
    }
  }

  /**
   * MÉTODO: notifyClaimResolved
   * Dispara una notificación cuando se resuelve un reclamo
   *
   * @param userId - ID del usuario residente
   * @param claimId - ID del reclamo
   * @param resolution - Descripción breve de la resolución
   * @returns Promise void
   */
  static async notifyClaimResolved(
    userId: number,
    claimId: number,
    resolution: string
  ): Promise<void> {
    try {
      const message = `✅ Tu reclamo #${claimId} ha sido resuelto: ${resolution}`;
      const notificationData: CreateNotificationDto = {
        user_id: userId,
        message,
      };

      await NotificationService.createNotification(notificationData);
      console.log(
        `✓ Notificación resolución enviada para usuario ${userId}: ${message}`
      );
    } catch (error) {
      console.error(
        "Error disparando notificación de reclamo resuelto:",
        error
      );
    }
  }

  /**
   * MÉTODO: notifyConserje
   * Dispara una notificación para el conserje/administrador
   *
   * @param conserjeUserId - ID del usuario conserje
   * @param eventType - Tipo de evento (package_arrived, claim_opened, etc.)
   * @param details - Detalles del evento
   * @returns Promise void
   */
  static async notifyConserje(
    conserjeUserId: number,
    eventType: string,
    details: string
  ): Promise<void> {
    try {
      let message = "";

      switch (eventType) {
        case "package_arrived":
          message = `📦 Nuevo paquete en recepción. ${details}`;
          break;
        case "claim_opened":
          message = `🔴 Nuevo reclamo abierto. ${details}`;
          break;
        case "resident_complaint":
          message = `⚠️ Nueva queja de residente. ${details}`;
          break;
        default:
          message = `ℹ️ Evento: ${eventType}. ${details}`;
      }

      const notificationData: CreateNotificationDto = {
        user_id: conserjeUserId,
        message,
      };

      await NotificationService.createNotification(notificationData);
      console.log(
        `✓ Notificación conserje enviada para usuario ${conserjeUserId}: ${message}`
      );
    } catch (error) {
      console.error("Error disparando notificación para conserje:", error);
    }
  }
}

/**
 * EJEMPLO DE USO:
 * 
 * En algún controlador donde se crea un paquete:
 * 
 * ```typescript
 * // Cuando se crea un nuevo paquete
 * await PackageNotificationTrigger.notifyPackageCreated(
 *   residentUserId,
 *   newPackageId,
 *   "Juan Pérez"
 * );
 * ```
 */
