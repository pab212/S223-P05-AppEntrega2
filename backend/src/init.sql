-- Crear tabla de paquetes
CREATE TABLE IF NOT EXISTS packages (
  id INT AUTO_INCREMENT PRIMARY KEY,
  recipient_name VARCHAR(255) NOT NULL,
  apartment_number VARCHAR(50) NOT NULL,
  description TEXT,
  sender VARCHAR(255) NOT NULL,
  delivery_date TIMESTAMP NULL,
  status ENUM('received', 'delivered', 'pending', 'atraso') DEFAULT 'received',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Agregar más tablas según necesites
