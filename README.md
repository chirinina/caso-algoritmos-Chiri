# MANOSCerca
- Estudiante:Efrain Chiri Nina

Proyecto de Análisis de Algoritmos sobre la búsqueda de servicios técnicos por especialidad y ubicación en Bolivia.

## Entrega H1

- [Proceso a optimizar](h1/proceso-a-optimizar.md): descripción del problema y estimación inicial del tiempo.
- [Muestra de datos](h1/datos_profesionales.csv): 20 registros públicos con ubicación.

El proyecto considera los nueve departamentos. Los 20 registros son una muestra, no un conteo nacional, y no he confirmado que todos los servicios sigan activos. La disponibilidad y las calificaciones quedan vacías cuando la fuente no las informa.

Estimo que una búsqueda manual puede tomar entre 10 y 30 minutos; todavía no lo he medido, así que es una hipótesis por comprobar.

## Análisis

Estudiaré búsqueda lineal y binaria, Merge Sort, Quick Sort, filtros por ubicación y distancia Haversine. Compararé operaciones y tiempos con conjuntos de 20, 100, 1.000 y 5.000 registros; los tamaños mayores serán sintéticos.
