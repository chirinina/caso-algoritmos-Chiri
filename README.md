# MANOSCerca
- Estudiante:Efrain Chiri Nina

Proyecto de Análisis de Algoritmos sobre la búsqueda de servicios técnicos por especialidad y ubicación en Bolivia.

## Entrega H1

- [Proceso a optimizar](h1/proceso-a-optimizar.md): descripción del problema y estimación inicial del tiempo.
- [Muestra de datos](h1/datos_profesionales.csv): 20 registros públicos con ubicación.

El proyecto considera los nueve departamentos. Los 20 registros son una muestra, no un conteo nacional, y no he confirmado que todos los servicios sigan activos. La disponibilidad y las calificaciones quedan vacías cuando la fuente no las informa.

Estimo que una búsqueda manual puede tomar entre 10 y 30 minutos; todavía no lo he medido, así que es una hipótesis por comprobar.

## Búsqueda y ordenamiento

Ya están implementadas la búsqueda lineal, la búsqueda binaria, Merge Sort y Quick Sort en [busqueda_ordenamiento.js](practicas/c3/busqueda_ordenamiento.js). Se puede ver el ejemplo ejecutando `node practicas/c3/busqueda_ordenamiento.js`.

- **Búsqueda lineal:** revisa los elementos uno por uno; sirve aunque los datos no estén ordenados y tarda hasta **n pasos** (**O(n)**).
- **Búsqueda binaria:** revisa el medio y descarta la mitad que no corresponde. En la lista ordenada `[3, 8, 12, 19, 25, 31, 40, 47]`, encuentra el 31 en **2 pasos** y confirma que el 5 no está en **3 pasos**. Para 1.000 datos necesita como máximo **10 pasos** y para 1.000.000, **20** (**O(log n)**). **La lista debe estar ordenada antes de buscar.**
- **Merge Sort:** divide los datos, ordena cada parte y luego las combina; tarda **O(n log n)**.
- **Quick Sort:** ordena separando los datos alrededor de un pivote; suele tardar **O(n log n)**, aunque en el peor caso puede tardar **O(n²)**.

La resolución manual de la búsqueda binaria está en [mediciones de búsqueda](practicas/mediciones.md#busqueda-binaria-a-mano).
La comparación medida de Clase 4 está en [comparacion.md](practicas/c4/comparacion.md); se puede repetir con `node practicas/c4/comparacion_busquedas.js`.

El torneo de ordenamientos de Clase 5, con inserción, Merge Sort y Quick Sort, está en [informe.md](practicas/c5/informe.md) y se puede repetir con `node practicas/c5/torneo_ordenamientos.js`.

## Análisis

Como siguientes etapas, ampliaré las mediciones con otros tamaños de datos y estudiaré filtros por ubicación y distancia Haversine.
