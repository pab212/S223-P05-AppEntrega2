import db from "./db";
import { verifyToken, type TokenPayload } from "./utils/jwt";
import type { RowDataPacket, ResultSetHeader } from "mysql2";

<<<<<<< Updated upstream
=======
type PackageStatus = "received" | "delivered" | "pending" | "atraso";

const packageStatuses: PackageStatus[] = [
  "received",
  "delivered",
  "pending",
  "atraso",
];

const statusUpdateOptions: PackageStatus[] = [
  "delivered",
  "pending",
  "atraso",
];

const isPackageStatus = (value: unknown): value is PackageStatus => {
  return typeof value === "string" && packageStatuses.includes(value as PackageStatus);
};

const isStatusUpdateOption = (value: unknown): value is PackageStatus => {
  return typeof value === "string" && statusUpdateOptions.includes(value as PackageStatus);
};

const getAuthenticatedUser = (request: Request) => {
  const authHeader = request.headers.get("authorization");

  if (!authHeader) {
    return {
      error: Response.json(
        { error: "Token requerido en header Authorization" },
        { status: 401 }
      ),
    };
  }

  const [scheme, token] = authHeader.split(" ");

  if (scheme !== "Bearer" || !token) {
    return {
      error: Response.json(
        { error: "Formato de token invalido. Use: Authorization: Bearer <token>" },
        { status: 401 }
      ),
    };
  }

  try {
    return { user: verifyToken(token) as TokenPayload };
  } catch {
    return {
      error: Response.json(
        { error: "Token invalido o expirado" },
        { status: 401 }
      ),
    };
  }
};

const requireConserje = (request: Request) => {
  const auth = getAuthenticatedUser(request);

  if (auth.error) {
    return auth;
  }

  if (auth.user.role !== "conserje") {
    return {
      error: Response.json(
        { error: "Solo un conserje puede cambiar el estado de una encomienda" },
        { status: 403 }
      ),
    };
  }

  return auth;
};

/**
 * FUNCIÓN: createTables
 * 
 * Objetivo: Crear la estructura de la tabla 'packages' en MySQL
 * 
 * Lógica:
 * 1. Verifica si la tabla 'packages' ya existe
 * 2. Si existe, la elimina (para garantizar estructura limpia)
 * 3. Crea la tabla con la estructura correcta
 * 
 * Estructura de 'packages':
 * - id: Identificador único (autoincremento)
 * - recipient_name: Nombre del destinatario (requerido)
 * - apartment_number: Número de apartamento (requerido)
 * - description: Descripción del paquete (opcional)
 * - sender: Remitente del paquete (requerido)
 * - delivery_date: Fecha de entrega (opcional)
 * - status: Estado del paquete (received, pending, delivered)
 * - created_at: Fecha de creación automática
 */
>>>>>>> Stashed changes
async function createTables() {
  try {
    await db.query(`
      CREATE TABLE IF NOT EXISTS packages (
        id INT AUTO_INCREMENT PRIMARY KEY,
        recipient_name VARCHAR(255) NOT NULL,
        apartment_number VARCHAR(50) NOT NULL,
        description TEXT,
        sender VARCHAR(255) NOT NULL,
        delivery_date TIMESTAMP NULL,
<<<<<<< Updated upstream
        status ENUM('received', 'delivered', 'pending') DEFAULT 'received',
=======
        -- Fecha y hora de entrega (puede ser null si no se ha entregado)
        
        status ENUM('received', 'delivered', 'pending', 'atraso') DEFAULT 'received',
        -- Estado del paquete (solo 3 valores válidos)
        -- 'received': Paquete recibido en conserje
        -- 'pending': Esperando ser entregado al destinatario
        -- 'delivered': Entregado al destinatario
        
>>>>>>> Stashed changes
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log("Tabla 'packages' creada o ya existe.");
  } catch (error) {
    console.error("Error creando tabla:", error);
  }
}

await createTables();

Bun.serve({
  port: 3001,
  async fetch(request: Request) {
    const url = new URL(request.url);

    if (request.method === "GET" && url.pathname === "/") {
      try {
        const [rows] = await db.query<RowDataPacket[]>("SELECT 1 AS test");

        return Response.json({
          message: "Conexión a MySQL exitosa",
          result: rows,
        });
      } catch (error) {
        return Response.json(
          {
            message: "Error al conectar con MySQL",
            error: String(error),
          },
          { status: 500 }
        );
      }
    }

    if (request.method === "GET" && url.pathname === "/api/packages") {
      try {
        const [rows] = await db.query<RowDataPacket[]>(
          "SELECT * FROM packages ORDER BY created_at DESC"
        );

        return Response.json({
          packages: rows,
        });
      } catch (error) {
        return Response.json(
          {
            message: "Error obteniendo paquetes",
            error: String(error),
          },
          { status: 500 }
        );
      }
    }

    if (request.method === "POST" && url.pathname === "/api/packages") {
      try {
        const body = (await request.json()) as Record<string, unknown>;
        const { recipient_name, apartment_number, description, sender, delivery_date, status = "received" } = body;

        if (!recipient_name) {
          return Response.json(
            { error: "recipient_name es requerido" },
            { status: 400 }
          );
        }

        if (!apartment_number) {
          return Response.json(
            { error: "apartment_number es requerido" },
            { status: 400 }
          );
        }

        if (!sender) {
          return Response.json(
            { error: "sender es requerido" },
            { status: 400 }
          );
        }

<<<<<<< Updated upstream
=======
        if (!isPackageStatus(status)) {
          return Response.json(
            { error: "status debe ser received, pending, delivered o atraso" },
            { status: 400 }
          );
        }

        // Insertar el nuevo paquete en la BD
        // Usa prepared statements (?) para prevenir SQL injection
>>>>>>> Stashed changes
        const [result] = await db.query<ResultSetHeader>(
          "INSERT INTO packages (recipient_name, apartment_number, description, sender, delivery_date, status) VALUES (?, ?, ?, ?, ?, ?)",
          [recipient_name, apartment_number, description, sender, delivery_date || null, status]
        );

        return Response.json({
          message: "Paquete insertado exitosamente",
          id: result.insertId,
        });
      } catch (error) {
        return Response.json(
          {
            message: "Error insertando paquete",
            error: String(error),
          },
          { status: 500 }
        );
      }
    }

<<<<<<< Updated upstream
=======
    /**
     * ENDPOINT: PUT /api/packages/:id/status
     *
     * Actualiza solo el estado de una encomienda.
     * Acceso: solo usuarios con rol conserje.
     */
    if (
      request.method === "PUT" &&
      /^\/api\/packages\/\d+\/status$/.test(url.pathname)
    ) {
      try {
        const auth = requireConserje(request);

        if (auth.error) {
          return auth.error;
        }

        const id = url.pathname.split("/")[3];
        const body = (await request.json()) as Record<string, unknown>;
        const { status } = body;

        if (!isStatusUpdateOption(status)) {
          return Response.json(
            { error: "status debe ser pending, delivered o atraso" },
            { status: 400 }
          );
        }

        const [result] = await db.query<ResultSetHeader>(
          "UPDATE packages SET status = ? WHERE id = ?",
          [status, id]
        );

        if (result.affectedRows === 0) {
          return Response.json(
            { error: "Paquete no encontrado" },
            { status: 404 }
          );
        }

        const [rows] = await db.query<RowDataPacket[]>(
          "SELECT * FROM packages WHERE id = ?",
          [id]
        );

        return Response.json({
          message: "Estado actualizado exitosamente",
          id: Number(id),
          package: rows[0],
          updatedBy: auth.user.email,
        });
      } catch (error) {
        return Response.json(
          {
            message: "Error actualizando estado",
            error: String(error),
          },
          { status: 500 }
        );
      }
    }

    /**
     * ENDPOINT: GET /api/packages/:id
     * 
     * Propósito: Obtener los detalles de un paquete específico por su ID
     * 
     * Parámetro:
     * - id: Identificador numérico del paquete (en la URL)
     * 
     * Ejemplo de petición:
     * GET /api/packages/1
     * 
     * Respuesta exitosa:
     * {
     *   "package": {
     *     "id": 1,
     *     "recipient_name": "Juan García",
     *     "apartment_number": "101",
     *     "description": "Paquete electrónico",
     *     "sender": "Amazon",
     *     "delivery_date": null,
     *     "status": "received",
     *     "created_at": "2026-04-18 02:40:55"
     *   }
     * }
     * 
     * Códigos de respuesta:
     * - 200: Paquete encontrado
     * - 404: Paquete no existe
     * - 500: Error en la base de datos
     */
>>>>>>> Stashed changes
    if (request.method === "GET" && url.pathname.startsWith("/api/packages/")) {
      try {
        const id = url.pathname.split("/").pop();

        const [rows] = await db.query<RowDataPacket[]>(
          "SELECT * FROM packages WHERE id = ?",
          [id]
        );

        if (rows.length === 0) {
          return Response.json(
            { error: "Paquete no encontrado" },
            { status: 404 }
          );
        }

        return Response.json({
          package: rows[0],
        });
      } catch (error) {
        return Response.json(
          {
            message: "Error obteniendo paquete",
            error: String(error),
          },
          { status: 500 }
        );
      }
    }

    if (request.method === "PUT" && url.pathname.startsWith("/api/packages/")) {
      try {
        const id = url.pathname.split("/").pop();
        const body = (await request.json()) as Record<string, unknown>;
        const { recipient_name, apartment_number, description, sender, delivery_date, status } = body;

        // Validar que al menos un campo sea proporcionado
        if (!recipient_name && !apartment_number && !description && !sender && !delivery_date && !status) {
          return Response.json(
            { error: "Al menos un campo debe ser proporcionado" },
            { status: 400 }
          );
        }

<<<<<<< Updated upstream
        // Construir query dinámicamente
=======
        if (status) {
          const auth = requireConserje(request);

          if (auth.error) {
            return auth.error;
          }

          if (!isPackageStatus(status)) {
            return Response.json(
              { error: "status debe ser received, pending, delivered o atraso" },
              { status: 400 }
            );
          }
        }

        // Construir la consulta UPDATE dinámicamente
        // Solo incluye los campos que fueron proporcionados en el cuerpo
>>>>>>> Stashed changes
        const updates: string[] = [];
        const values: unknown[] = [];

        if (recipient_name) {
          updates.push("recipient_name = ?");
          values.push(recipient_name);
        }
        if (apartment_number) {
          updates.push("apartment_number = ?");
          values.push(apartment_number);
        }
        if (description) {
          updates.push("description = ?");
          values.push(description);
        }
        if (sender) {
          updates.push("sender = ?");
          values.push(sender);
        }
        if (delivery_date) {
          updates.push("delivery_date = ?");
          values.push(delivery_date);
        }
        if (status) {
          updates.push("status = ?");
          values.push(status);
        }

        values.push(id);

        const [result] = await db.query<ResultSetHeader>(
          `UPDATE packages SET ${updates.join(", ")} WHERE id = ?`,
          values
        );

        if (result.affectedRows === 0) {
          return Response.json(
            { error: "Paquete no encontrado" },
            { status: 404 }
          );
        }

        const [rows] = await db.query<RowDataPacket[]>(
          "SELECT * FROM packages WHERE id = ?",
          [id]
        );

        return Response.json({
          message: "Paquete actualizado exitosamente",
          id: Number(id),
          package: rows[0],
        });
      } catch (error) {
        return Response.json(
          {
            message: "Error actualizando paquete",
            error: String(error),
          },
          { status: 500 }
        );
      }
    }

    if (request.method === "DELETE" && url.pathname.startsWith("/api/packages/")) {
      try {
        const id = url.pathname.split("/").pop();

        const [result] = await db.query<ResultSetHeader>(
          "DELETE FROM packages WHERE id = ?",
          [id]
        );

        if (result.affectedRows === 0) {
          return Response.json(
            { error: "Paquete no encontrado" },
            { status: 404 }
          );
        }

        return Response.json({
          message: "Paquete eliminado exitosamente",
          id: id,
        });
      } catch (error) {
        return Response.json(
          {
            message: "Error eliminando paquete",
            error: String(error),
          },
          { status: 500 }
        );
      }
    }

    return Response.json({ error: "Ruta no encontrada" }, { status: 404 });
  },
});

<<<<<<< Updated upstream
console.log("Backend corriendo en http://localhost:3001");
=======
// ========================================
// INICIO DEL SERVIDOR
// ========================================
console.log("🚀 Backend corriendo en http://localhost:3001");
console.log("📊 Endpoints disponibles:");
console.log("   GET  /                      → Prueba de conexión");
console.log("   GET  /api/packages          → Obtener todos los paquetes");
console.log("   POST /api/packages          → Crear nuevo paquete");
console.log("   GET  /api/packages/:id      → Obtener paquete específico");
console.log("   PUT  /api/packages/:id      → Actualizar paquete");
console.log("   DELETE /api/packages/:id    → Eliminar paquete");
>>>>>>> Stashed changes
