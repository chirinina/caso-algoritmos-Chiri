Nombre completo: Efrain Chiri Nina

# P1.3 — Elegir: historias clínicas del hospital

Voy a comparar los costos como cantidad aproximada de operaciones, no como tiempo en segundos.

## Datos y supuestos

- `n = 300.000` historias clínicas y `q = 5.000` consultas.
- El listado inicial está desordenado.
- Cada búsqueda consulta un identificador y, para estimar el peor caso, se considera que la búsqueda lineal revisa todos los registros.
- Se supone un arreglo accesible por índice, comparaciones de identificadores de costo constante y una ordenación por comparaciones.
- Para la estimación usamos `log₂(300.000) ≈ 18,195`; la búsqueda binaria requiere como máximo `ceil(log₂(n + 1)) = 19` comparaciones.
- Como la memoria no permite duplicar el listado, la ordenación eficiente debe hacerse en el mismo arreglo. Heap Sort puede ordenar en `O(n log n)` con espacio auxiliar `O(1)`; una ordenación cuadrática como Selection Sort también puede operar en el mismo arreglo con `O(1)` espacio auxiliar.

Son cuentas aproximadas: en la práctica, el costo de comparar y mover registros puede cambiar el tiempo real.

## Opción 1: búsqueda lineal en cada consulta

Cada consulta puede examinar `n` historias:

- Por consulta: `n = 300.000` comparaciones.
- Para `q` consultas: `q × n = 5.000 × 300.000`.
- **Costo total aproximado:** `1.500.000.000` comparaciones.
- **Complejidad:** `O(qn)`; para `q` fijado en relación con `n`, cada consulta es `O(n)`.

No hace falta ordenar ni copiar el listado, pero cada consulta vuelve a recorrerlo desde el principio.

## Opción 2: ordenar una vez y usar búsqueda binaria

Se ordena el arreglo una vez con Heap Sort y luego se busca cada identificador por búsqueda binaria:

- Ordenamiento aproximado: `n log₂(n) = 300.000 × 18,195 ≈ 5.458.381` operaciones.
- Búsquedas: `q × 19 = 5.000 × 19 = 95.000` comparaciones.
- **Costo total aproximado:** `5.458.381 + 95.000 = 5.553.381` operaciones.
- **Complejidad:** `O(n log n + q log n)`.

Se paga el ordenamiento una vez y se aprovecha para las consultas del día. Heap Sort puede ordenar el mismo arreglo, sin guardar una segunda copia completa.

## Opción 3: ordenamiento cuadrático y búsqueda binaria

Como modelo explícito de ordenamiento cuadrático se toma Selection Sort, cuyo número de comparaciones es `n(n−1)/2`:

- Ordenamiento: `300.000 × 299.999 / 2 = 44.999.850.000` comparaciones.
- Búsquedas: `q × 19 = 95.000` comparaciones.
- **Costo total aproximado:** `44.999.850.000 + 95.000 = 44.999.945.000` operaciones.
- **Complejidad:** `O(n² + q log n)`.

Aunque también puede ordenar en el mismo arreglo, el costo de ordenar es desproporcionado para `n = 300.000`.

## Comparación y decisión

| Opción | Costo aproximado para los datos dados | Memoria adicional |
|---|---:|---|
| Búsqueda lineal por consulta | 1.500.000.000 comparaciones | `O(1)` |
| Heap Sort una vez + búsqueda binaria | 5.553.381 operaciones aproximadas | `O(1)` auxiliar |
| Selection Sort una vez + búsqueda binaria | 44.999.945.000 comparaciones | `O(1)` auxiliar |

**Mi elección:** ordenar una vez con Heap Sort en el mismo arreglo y después hacer búsquedas binarias. Con estas cuentas sale mucho mejor que revisar el listado completo en cada consulta y no hace falta duplicarlo. Selection Sort no conviene para una lista tan grande.

### Punto de equilibrio aproximado

Se compara `q × n` (búsqueda lineal) con `n log₂(n) + 19q` (ordenar y buscar). Ordenar conviene cuando:

`q × (n − 19) > n log₂(n)`.

Al sustituir `n = 300.000`:

`q > (300.000 × 18,195) / (300.000 − 19) ≈ 18,2`.

Con este cálculo, desde **unas 19 consultas** ya conviene ordenar primero. Es un punto aproximado; los costos reales de comparar y mover los datos pueden cambiarlo.

En P1.2 vi que la función por pares crece mucho más rápido que la que usa `Set`. Eso sirve para entender los crecimientos, pero no es una medición de Heap Sort ni del sistema del hospital.
