# ✅ CHECKLIST: SISTEMA DE NOTIFICACIONES

## 📋 CHECKLIST DE IMPLEMENTACIÓN

### Backend - Configuración Inicial

- [ ] **1. Ejecutar migración SQL**
  ```bash
  # Copiar el contenido de backend/migrations/004_create_notifications.sql
  # Ejecutar en tu base de datos MySQL
  mysql -u root -p appdb < backend/migrations/004_create_notifications.sql
  ```

- [ ] **2. Verificar conexión a BD**
  ```bash
  bun run tests/test-db.ts
  ```

- [ ] **3. Probar endpoints de notificaciones**
  ```bash
  # Obtener token JWT válido primero, luego:
  curl -H "Authorization: Bearer <token>" http://localhost:3000/api/notifications
  ```

### Backend - Integración en Controladores

- [ ] **4. Importar NotificationTrigger en controllers donde se crean paquetes**
  ```typescript
  import { PackageNotificationTrigger } from "../services/packageNotificationTrigger";
  ```

- [ ] **5. Agregar trigger cuando se registra nuevo paquete**
  ```typescript
  await PackageNotificationTrigger.notifyPackageCreated(
    userId,
    packageId,
    recipientName
  );
  ```

- [ ] **6. Agregar trigger cuando se entrega paquete**
  ```typescript
  await PackageNotificationTrigger.notifyPackageDelivered(
    userId,
    packageId,
    senderName
  );
  ```

- [ ] **7. Agregar triggers para reclamos (si aplica)**
  ```typescript
  await PackageNotificationTrigger.notifyClaimOpened(
    userId,
    packageId,
    claimId
  );
  ```

### Frontend - Configuración

- [ ] **8. Verificar variable de entorno VITE_API_URL**
  ```
  # En frontend/.env.local (o .env)
  VITE_API_URL=http://localhost:3000/api
  ```

- [ ] **9. Instalar dependencias (si es necesario)**
  ```bash
  cd frontend
  npm install
  # Ya tiene todo incluido, pero verificar que sonner está instalado
  npm install sonner
  ```

- [ ] **10. NotificationProvider está en main.tsx**
  Verificar que `<NotificationProvider>` envuelve `<App />`

- [ ] **11. NotificationBadge está en Navbar.tsx**
  Verificar que el badge se importa y renderiza

### Frontend - Verificación Visual

- [ ] **12. El badge de notificaciones aparece en el navbar**
  - Debe mostrar número rojo
  - Se oculta si no hay notificaciones sin leer
  - Al hacer click abre el panel

- [ ] **13. El panel de notificaciones se abre/cierra**
  - Click en badge → abre panel
  - Click en ✕ → cierra panel
  - Muestra lista de notificaciones

- [ ] **14. Las notificaciones se marcan como leídas**
  - Click en notificación → se marca como leída
  - Badge disminuye inmediatamente
  - Visual cambia (menos opacidad)

- [ ] **15. Botón "Marcar todas como leídas" funciona**
  - Aparece solo si hay sin leer
  - Al hacer click, todas se marcan como leídas
  - Badge desaparece

### Testing

- [ ] **16. Test: Crear notificación desde backend**
  ```bash
  bun run backend/tests/test-auth.ts
  # Luego con token válido:
  curl -X POST -H "Authorization: Bearer <token>" http://localhost:3000/api/notifications
  ```

- [ ] **17. Test: Obtener notificaciones desde API**
  ```bash
  curl -H "Authorization: Bearer <token>" \
    "http://localhost:3000/api/notifications?page=1&limit=10"
  ```

- [ ] **18. Test: Marcar como leída desde API**
  ```bash
  curl -X PATCH \
    -H "Authorization: Bearer <token>" \
    http://localhost:3000/api/notifications/1/read
  ```

- [ ] **19. Test: Marcar todas como leídas desde API**
  ```bash
  curl -X PATCH \
    -H "Authorization: Bearer <token>" \
    http://localhost:3000/api/notifications/read-all
  ```

- [ ] **20. Test en Frontend: Hook useNotifications**
  En browser console (con React DevTools):
  ```javascript
  // Busca el componente que usa useNotifications
  // Verifica que notifications, unreadCount, etc. existen
  ```

### Flujo Completo

- [ ] **21. Crear usuario/login**
  - Login como usuario
  - Verificar token en localStorage
  - Badge debería estar visible (o no, si no hay notificaciones)

- [ ] **22. Trigger de notificación**
  - Registrar/crear un paquete desde la app
  - Backend debería disparar notificación automáticamente
  - Frontend debería mostrar notificación con badge +1

- [ ] **23. Interactividad**
  - Click en notificación → se marca como leída
  - Badge disminuye
  - Notificación se ve gris/tachada

- [ ] **24. Paginación (si hay múltiples)**
  - Botón "Cargar más" aparece
  - Al hacer click carga siguiente página
  - Sin duplicados

- [ ] **25. Limpieza de BD**
  ```bash
  # Borrar notificaciones antiguas (>30 días)
  bun run script-cleanup-notifications.ts
  ```

### Seguridad - Verificaciones Finales

- [ ] **26. Usuario solo ve sus notificaciones**
  - Login como usuario A
  - Verificar que solo ve sus notificaciones
  - Login como usuario B
  - Verificar que ve notificaciones diferentes

- [ ] **27. No puede marcar notificación de otro usuario**
  - Intentar PATCH /notifications/[id-otro-usuario]/read
  - Debería retornar 403 Prohibido

- [ ] **28. Token JWT requerido**
  - Intentar GET /api/notifications sin token
  - Debería retornar 401 No autorizado

- [ ] **29. Token inválido rechazado**
  - Intentar con token expirado/inválido
  - Debería retornar 401

- [ ] **30. CORS configurado correctamente**
  - Frontend puede hacer requests a backend
  - Sin errores de CORS en browser console

## 🎯 Casos de Uso Especiales

### Notificación Personalizada
```typescript
// En backend controller
await NotificationService.createNotification({
  user_id: 5,
  message: "Tu mensaje personalizado aquí"
});
```

### Notificación para Conserje
```typescript
await PackageNotificationTrigger.notifyConserje(
  conserjeUserId,
  "package_arrived",
  "Nuevo paquete para Dpto 405"
);
```

### Limpieza Automática (Cron)
```typescript
// Agregar a cron job/scheduler
await NotificationService.deleteOldNotifications(30); // >30 días
```

## 📝 Notas de Producción

- [ ] Configurar logs en backend para debugging
- [ ] Implementar reintentos en frontend si falla API
- [ ] Considerar WebSockets para notificaciones en tiempo real
- [ ] Hacer backup de tabla de notificaciones regularmente
- [ ] Monitorear tamaño de tabla (crecer rápido si hay muchos usuarios)
- [ ] Añadir índices adicionales si la BD crece mucho
- [ ] Implementar rate limiting en endpoints de notificaciones

## 🔄 Monitoreo

```bash
# Ver cantidad de notificaciones por usuario
SELECT user_id, COUNT(*) as total FROM notifications GROUP BY user_id;

# Ver notificaciones sin leer
SELECT COUNT(*) FROM notifications WHERE read = FALSE;

# Ver notificaciones más antiguas
SELECT created_at, user_id FROM notifications ORDER BY created_at ASC LIMIT 10;
```

---

**¡Completar todos los checkboxes antes de considerar la implementación como finalizada!**
