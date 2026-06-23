-- Migración: Crear tabla de notificaciones
-- Tabla para almacenar notificaciones de usuarios (residentes, conserjes, etc.)
-- Cada notificación es específica de un usuario y puede ser marcada como leída.

CREATE TABLE IF NOT EXISTS notifications (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  message VARCHAR(500) NOT NULL,
  read BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  -- Restricción: El usuario debe existir en la tabla users
  CONSTRAINT fk_notifications_user_id FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  
  -- Índices para optimizar búsquedas comunes
  INDEX idx_notifications_user_id (user_id),
  INDEX idx_notifications_read (read),
  INDEX idx_notifications_created_at (created_at),
  INDEX idx_notifications_user_read (user_id, read)
);
