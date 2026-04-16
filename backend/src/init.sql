-- Crear tabla de paquetes
CREATE TABLE IF NOT EXISTS packages (
  id INT AUTO_INCREMENT PRIMARY KEY,
  recipient_name VARCHAR(255) NOT NULL,
  description TEXT,
  status ENUM('received', 'delivered', 'pending') DEFAULT 'received',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Agregar más tablas según necesites
