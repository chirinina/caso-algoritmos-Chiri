# H2 — Estructura elegida

## Elección

Elijo un **arreglo ordenado** por `(especialidad, municipio, id)`. El flujo más importante es consultar y devolver los servicios de una especialidad en un municipio; ordenar por esos campos permite localizar el comienzo del rango con búsqueda binaria y luego recorrer solo sus coincidencias. También deja el catálogo listo para mostrarse en orden.

Esta decisión favorece las consultas sobre los cambios: en el uso previsto se busca más de lo que se inserta o borra. Mantener el arreglo ordenado hace que insertar o borrar cueste `O(n)` por los desplazamientos. Para los 20 registros actuales, la búsqueda lineal puede ser suficiente; la estructura ordenada se evalúa como alternativa si el catálogo crece y se reutiliza para muchas consultas. No tengo mediciones de uso real para afirmar que ya sea más rápida en producción.

## Costos

`n` es la cantidad de registros y `k` la cantidad devuelta por un rango. Para el análisis del curso supongo que las claves tienen longitud acotada, así que compararlas cuesta `O(1)`.

| Operación | Costo | Motivo |
|---|---:|---|
| Buscar la clave exacta `(especialidad, municipio, id)` | `O(log n)` | La búsqueda binaria descarta aproximadamente la mitad del intervalo en cada comparación. |
| Buscar un rango por `(especialidad, municipio)` | `O(log n + k)` | Se encuentra el inicio con búsqueda binaria y se recorren las `k` coincidencias contiguas. |
| Insertar | `O(n)` | Se localiza la posición en `O(log n)`, pero `splice` puede desplazar hasta `n` registros. |
| Borrar por clave | `O(n)` | Se encuentra la posición en `O(log n)` y se desplazan los registros posteriores para cerrar el espacio. |
| Obtener el menor | `O(1)` | Es el primer elemento del arreglo. |
| Obtener el siguiente a una clave | `O(log n)` | Se encuentra la posición con búsqueda binaria y se consulta el elemento contiguo. |
| Recorrer en orden | `O(n)` | Se visita cada elemento una vez; el arreglo ya está ordenado. |
| Preparar el índice inicial | `O(n log n)` | Se ordenan los registros una vez antes de las consultas. |

La medición de H2 cronometra la consulta por rango, no la preparación del índice. Por eso representa consultas repetidas sobre un catálogo ya ordenado; no incluye el tiempo de construirlo ni el costo de mantenerlo con inserciones y borrados.
