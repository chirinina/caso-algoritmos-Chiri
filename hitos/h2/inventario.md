# H2 — Inventario de operaciones

## Caso y datos

MANOSCerca organiza servicios técnicos para que una persona encuentre opciones por especialidad y ubicación en Bolivia. Cada registro de la muestra tiene identificador, nombre comercial, departamento, provincia, municipio, ciudad, zona, especialidad, coordenadas, disponibilidad, calificación y fecha de actualización.

El archivo de H1 contiene **20 registros públicos**; es una muestra, no un censo. No he confirmado que todos los servicios sigan activos y algunos campos están vacíos porque la fuente no los informa. Todavía no hay una aplicación en funcionamiento ni registros de uso, así que no conozco cuántas consultas o cambios habría por semana o mes.

Para comprobar cómo escala el proceso, H2 usa conjuntos de **100, 200, 400 y 800** registros. Solo los primeros 20 provienen de la muestra; el resto son datos sintéticos creados repitiendo sus especialidades y municipios con identificadores distintos. Estos tamaños sirven para el experimento, no son una proyección del total de prestadores.

## Operaciones del caso

La clave ordenada para el índice es `(especialidad, municipio, id)`. El rango de búsqueda principal usa el prefijo `(especialidad, municipio)` y devuelve todos los prestadores coincidentes.

| Operación | Uso en MANOSCerca | Frecuencia estimada (no hay registros de uso) |
|---|---|---|
| Buscar por clave exacta | Consultar un registro conocido por especialidad, municipio e identificador. | Menos frecuente que el filtro principal. |
| Buscar un rango | Encontrar todos los prestadores de una especialidad en un municipio; es el flujo principal de quien busca un servicio. | Frecuente; es la consulta que se mide en H2. |
| Insertar | Incorporar o actualizar un prestador cuando se mantiene el catálogo. | Ocasional, tarea de administración. |
| Borrar | Retirar un registro que ya no debe aparecer, después de verificarlo. | Ocasional y menos frecuente que consultar. |
| Obtener el menor | Mostrar el primer registro según el orden de especialidad, municipio e identificador. | Ocasional; útil para iniciar una lista ordenada. |
| Obtener el siguiente | Avanzar al registro posterior en ese orden. | Ocasional, al recorrer resultados. |
| Recorrer en orden | Mostrar o exportar el catálogo ordenado. | Ocasional; no se necesita para cada búsqueda. |

El orden de frecuencia es una **estimación según el uso previsto**, no un conteo. Para saber cuántas veces ocurre cada operación, primero tendría que estar funcionando la aplicación y guardar ese registro.
