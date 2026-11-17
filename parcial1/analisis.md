Nombre completo: Efrain Chiri Nina

# P1.1 — Analizar

Tomo `n` como la cantidad de datos. En JavaScript los índices empiezan en 0, así que escribo los recorridos como `0` hasta `n-1`; el costo no cambia.

## A. Análisis de los cuatro fragmentos

### F1 — Suma de los datos

```js
function f1(dato, n) {
  let total = 0;
  for (let i = 0; i < n; i += 1) {
    total += dato[i];
  }
  return total;
}
```

- **Peor caso:** `O(n)`.
- **Justificación:** recorre los `n` datos una vez y hace una suma por dato: `O(n)`.
- **En sencillo:** se suma cada dato una sola vez; con el doble de datos, hay más o menos el doble de trabajo.

### F2 — Comparación de pares

```js
function f2(dato, n) {
  let cuenta = 0;
  for (let i = 0; i < n; i += 1) {
    for (let j = i + 1; j < n; j += 1) {
      if (dato[i] === dato[j]) {
        cuenta += 1;
      }
    }
  }
  return cuenta;
}
```

- **Peor caso:** `O(n²)`.
- **Justificación:** se comparan `n(n−1)/2` pares; ese número crece como `n²`, así que es `O(n²)`.
- **En sencillo:** no compara el dato consigo mismo ni repite pares, pero igual revisa una cantidad cuadrática de pares.

### F3 — División repetida entre dos

```js
function f3(n) {
  let k = n;
  let paso = 0;
  while (k > 1) {
    k = Math.floor(k / 2);
    paso += 1;
  }
  return paso;
}
```

- **Peor caso:** `O(log n)`.
- **Justificación:** `k` se divide entre dos cada vez, por eso hay cerca de `log₂(n)` iteraciones: `O(log n)`.
- **En sencillo:** que `k` empiece valiendo `n` no significa que el ciclo se repita `n` veces; el valor baja a la mitad en cada vuelta.

### F4 — Bucle logarítmico reiniciado `n` veces

```js
function f4(n) {
  for (let i = 1; i <= n; i += 1) {
    let k = 1;
    while (k < n) {
      k *= 2;
    }
  }
}
```

- **Peor caso:** `O(n log n)`.
- **Justificación:** el ciclo externo da `n` vueltas y el interno tarda `O(log n)` en cada una; en total es `O(n log n)`.
- **En sencillo:** `k` vuelve a empezar en 1 en cada vuelta exterior, así que hay `n` recorridos logarítmicos.

## B. Recurrencias con el teorema maestro

Uso `T(n) = aT(n/b) + Θ(n^d)`: identifico `a`, `b` y `d`, calculo `b^d` y comparo ese valor con `a`.

### 1. `T(n) = 3T(n/2) + n`

- `a = 3`, `b = 2`, `d = 1`.
- `b^d = 2^1 = 2`.
- Comparación: `a = 3 > 2 = b^d`.
- **Caso:** caso 1 del teorema maestro; el trabajo recursivo domina.
- **Resultado:** `T(n) = Θ(n^(log₂ 3))`, aproximadamente `Θ(n^1.585)`.

La parte recursiva crece como `n^(log₂ 3)`, con exponente aproximado `1,585`, que es mayor que el exponente 1 del término `n`. Por eso queda `Θ(n^1,585)`.

### 2. `T(n) = T(n/2) + n²`

- `a = 1`, `b = 2`, `d = 2`.
- `b^d = 2^2 = 4`.
- Comparación: `a = 1 < 4 = b^d`.
- **Caso:** caso 3 del teorema maestro; domina el trabajo fuera de la recursión.
- Condición de regularidad: `a(n/b)^d = (n/2)^2 = n²/4 ≤ c n²`, por ejemplo con `c = 1/4 < 1`.
- **Resultado:** `T(n) = Θ(n²)`.

La condición de regularidad se cumple y confirma el resultado cuadrático: `Θ(n²)`.
