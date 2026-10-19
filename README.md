# TaskCampus - Laboratorio React

Proyecto de gestión de tareas académicas desarrollado para el laboratorio de React con Vite y JavaScript. La aplicación permite cargar tareas desde JSONPlaceholder, filtrarlas, buscarlas por título, cambiar su estado, editarlas en línea y eliminarlas mediante un modal de confirmación.

## Requisitos y cómo ejecutar

- Node.js: v24.22.0 (compatible también con v20.19+ y v22.12+)
- npm: 11.19.1

Comandos para instalar, probar y compilar:

```bash
# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev

# Comprobar código con el linter
npm run lint

# Compilar para producción
npm run build

# Previsualizar la compilación
npm run preview
```

Nota: La aplicación requiere conexión a internet para consultar las tareas iniciales desde `https://jsonplaceholder.typicode.com/todos`.

## Estructura del proyecto y vistas

El código fuente se encuentra en la carpeta `src/`:

- `components/`: Componentes de la interfaz (`Header`, `Navigation`, `TaskSummary`, `TaskList`, `TaskForm`, `ConfirmModal`, `Button`, `ActionButton`).
- `hooks/useTareas.js`: Hook personalizado que centraliza el estado de las tareas, la carga inicial y las operaciones (crear, cambiar estado, editar título y borrar).
- `services/tareasService.js`: Funciones con `fetch` para comunicarse con la API de JSONPlaceholder (GET, POST, PATCH, DELETE).
- `App.jsx`: Componente principal que coordina la vista activa, los filtros y la búsqueda.
- `App.css` e `index.css`: Estilos visuales de la aplicación.

### Vistas de la aplicación

El encabezado y los botones de navegación se mantienen visibles en las tres vistas:

1. **Resumen**: Presenta tarjetas con el total de tareas, cuántas están pendientes, cuántas completadas y cuántas coinciden con los filtros actuales de la lista.
2. **Tareas**: Lista principal con botones de filtro (Todas, Pendientes, Completadas), campo de búsqueda por texto, casilla para alternar estado, edición de título en línea (doble clic o botón Editar) y botón para eliminar con confirmación.
3. **Nueva tarea**: Formulario controlado para crear una tarea con validación de título no vacío. Al guardarla con éxito, redirige a la vista de tareas mostrando la nueva tarea al inicio.

## Comparación con la base inicial

- **Base recibida**: Mostraba tres tareas fijas escritas directamente en el JSX de `TaskList`, un número 3 fijo en `TaskSummary` y los botones solo ejecutaban un `alert()` en el navegador. No realizaba peticiones HTTP ni permitía cambiar entre vistas.
- **Nuestro desarrollo**: Eliminamos los datos fijos e integramos la carga real de 10 tareas desde JSONPlaceholder con GET. Implementamos el hook `useTareas` y el servicio `tareasService.js` con las operaciones CRUD completas (POST, PATCH, DELETE). Creamos la navegación entre 3 vistas sin recargar la página, filtros de estado, buscador en tiempo real, validación de formularios, modal de confirmación accesible y deshabilitado de botones mientras una operación está en curso.

## API de JSONPlaceholder y persistencia

JSONPlaceholder es una API de pruebas pensada para desarrollo. Las lecturas con `GET` devuelven datos reales de muestra, pero las escrituras (`POST`, `PATCH`, `DELETE`) son simuladas: la API responde con códigos de éxito (200 o 201), pero no guarda los cambios en su base de datos.

Por este motivo:
- Durante la sesión en el navegador, todas las creaciones, cambios de estado y eliminaciones se conservan en el estado de React y se mantienen al navegar entre las vistas.
- Si se recarga la página (F5), la API vuelve a entregar las 10 tareas originales por diseño.
- Para evitar colisiones con las tareas creadas en la sesión (JSONPlaceholder devuelve `id: 201` para cualquier POST), asignamos a cada tarea un identificador local único para React (`id`) y conservamos el identificador de la API (`remoteId`) para las peticiones HTTP.

## Investigación aplicada

### 1. Navegación entre vistas
- **Explicación**: Para resolver la navegación sin agregar dependencias externas como react-router, creamos un estado `activeView` en `App.jsx` con tres posibles valores: `'summary'`, `'tasks'` y `'new'`. `Navigation.jsx` recibe la vista activa y la función para cambiarla. En `App.jsx` usamos renderizado condicional en JSX para mostrar la vista seleccionada, manteniendo el estado de las tareas y los filtros intacto entre cambios de pestaña.
- **Fuentes consultadas**: Documentación oficial de React sobre renderizado condicional y elevación del estado (*Sharing State Between Components*).
- **Archivos donde se aplicó**: `src/App.jsx`, `src/components/Navigation.jsx`, `src/components/TaskSummary.jsx`.
- **Procedimiento de verificación**: Entrar a la aplicación, filtrar tareas en la vista Tareas, cambiar a Resumen o Nueva tarea y volver a Tareas. Comprobar que los filtros y las tareas de la sesión no se reinician.

### 2. Estado derivado
- **Explicación**: No almacenamos copias duplicadas de las tareas filtradas ni variables de estado redundantes para los contadores. En su lugar, calculamos `visibleTasks` (con `useMemo`), `pendingCount` y `completedCount` directamente a partir de la colección de tareas, el filtro seleccionado y el texto de búsqueda.
- **Fuentes consultadas**: Documentación oficial de React sobre cómo estructurar el estado (*Choosing the State Structure*).
- **Archivos donde se aplicó**: `src/App.jsx`, `src/components/TaskSummary.jsx`.
- **Cómo verificarlo**: Marcar una tarea como completada o escribir en el buscador. Los contadores del resumen y los elementos visibles de la lista se actualizan inmediatamente de forma sincronizada.

### 3. Actualización funcional del estado
- **Explicación**: En las operaciones de `useTareas.js` usamos la forma funcional del setter (`setTasks(prev => ...)`). Esto garantiza que la actualización se realice sobre el valor más reciente del estado sin depender de cierres desactualizados. Además, creamos siempre arrays y objetos nuevos mediante `map`, `filter` y el operador spread (`...`), cumpliendo con la inmutabilidad de React.
- **Fuentes consultadas**: Documentación oficial de React sobre actualización de arrays en el estado (*Updating Arrays in State*).
- **Archivos donde se aplicó**: `src/hooks/useTareas.js`.
- **Cómo verificarlo**: Crear o modificar varias tareas de forma consecutiva y rápida. Las tareas creadas y editadas se mantienen sin sobrescribir ni perder elementos previos.

### 4. Identificadores y API simulada
- **Explicación**: Al crear tareas mediante `POST`, JSONPlaceholder siempre devuelve `id: 201`. Si usáramos ese ID directamente como clave (`key`) en React, al crear dos tareas tendríamos claves duplicadas y al intentar editar o borrar una tarea se afectaría a la otra. Lo resolvimos asignando a cada tarea un identificador local único (`id`), mientras que `remoteId` se guarda por separado para enviar las solicitudes PATCH o DELETE a la API.
- **Fuentes consultadas**: Guía de uso de JSONPlaceholder y documentación de React sobre listas y claves (*Rendering Lists with Keys*).
- **Archivos donde se aplicó**: `src/hooks/useTareas.js`, `src/services/tareasService.js`, `src/components/TaskList.jsx`.
- **Cómo verificarlo**: Crear dos tareas consecutivas en la aplicación. Verificar en la consola que no existen advertencias de claves duplicadas y comprobar que al modificar o eliminar una de ellas, la otra tarea no se altera.

## Tabla de pruebas y evidencias

| Caso probado | Pasos realizados | Resultado esperado | Resultado obtenido | Archivo o componente asociado |
|---|---|---|---|---|
| Carga inicial de tareas | Iniciar la app con conexión a internet. | Mensaje de carga y posterior aparición de 10 tareas obtenidas de la API. | Se cargan 10 tareas mediante GET sin errores. | `src/services/tareasService.js`, `src/hooks/useTareas.js` |
| Resumen de métricas | Revisar la vista Resumen tras la carga. | Contadores calculados correctamente (total 10, suma de pendientes y completadas igual a 10). | Métricas coherentes calculadas en vivo a partir de las tareas. | `src/components/TaskSummary.jsx`, `src/App.jsx` |
| Creación con validación | Ir a Nueva tarea, probar con campo vacío y luego enviar un título válido. | El campo vacío muestra error de validación; el título válido envía POST y agrega la tarea. | Validación activa ante campo vacío; con título válido envía POST y redirige a la lista. | `src/components/TaskForm.jsx`, `src/hooks/useTareas.js` |
| Cambio de estado | En la lista de tareas, marcar el checkbox de una tarea. | Deshabilita el control temporalmente, envía PATCH y cambia entre pendiente y completada. | Tarea actualizada en la interfaz y en el resumen tras respuesta HTTP 200. | `src/components/TaskList.jsx`, `src/hooks/useTareas.js` |
| Edición en línea | Hacer doble clic en el título (o pulsar Editar), modificar el texto y presionar Enter o Escape. | Enter guarda el nuevo título con PATCH; Escape cancela; título vacío no se guarda. | Título actualizado en la lista con validación y atajos de teclado funcionales. | `src/components/TaskList.jsx` |
| Eliminación con confirmación | Pulsar Eliminar en una tarea, probar Cancelar en el modal y luego Confirmar. | Cancelar no modifica la lista; confirmar envía DELETE y retira la tarea. | Cancelación comprobada; eliminación exitosa tras confirmar en el modal. | `src/components/ConfirmModal.jsx`, `src/hooks/useTareas.js` |
| Filtros de estado | Seleccionar filtros Pendientes, Completadas y Todas. | Muestra solo las tareas que corresponden al filtro elegido. | Lista filtrada de manera reactiva e inmediata según el botón activo. | `src/App.jsx`, `src/components/TaskList.jsx` |
| Búsqueda por texto | Escribir un texto en el buscador combinándolo con un filtro de estado. | Filtro insensible a mayúsculas/minúsculas. Si no hay coincidencias muestra mensaje de lista vacía. | Búsqueda combinada funcional con mensaje informativo cuando no hay resultados. | `src/App.jsx`, `src/components/TaskList.jsx` |
| Navegación y estado | Aplicar filtros o crear una tarea y cambiar entre Resumen, Tareas y Nueva tarea. | Navegación sin recargar la página y conservación del estado y filtros de la sesión. | Vistas cambian fluidamente manteniendo las tareas y filtros intactos. | `src/components/Navigation.jsx`, `src/App.jsx` |
| Manejo de errores | Desconectar internet e intentar actualizar o crear una tarea. | Muestra mensaje de error y no presenta la acción como exitosa. | Error capturado y mostrado al usuario; el estado de la tarea no cambia erróneamente. | `src/hooks/useTareas.js`, `src/services/tareasService.js` |
