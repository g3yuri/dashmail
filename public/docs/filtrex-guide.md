# Guía de Filtros Filtrex v3

Los filtros Filtrex te permiten crear reglas automáticas para clasificar los emails recibidos de Postmark en labels específicos. Estos filtros se evalúan automáticamente cuando llega un nuevo email al webhook.

## ¿Qué es Filtrex?

Filtrex es un lenguaje de expresiones simple pero poderoso que permite crear filtros basados en los campos del email recibido. Es similar a las fórmulas de Excel pero más específico para filtrado de datos.

## Sintaxis Básica

Un filtro filtrex tiene la siguiente estructura básica:

```
CAMPO OPERADOR VALOR
```

Por ejemplo:
```
Subject == "Urgente"
```

### Estructura de Expresiones Complejas

Puedes combinar múltiples condiciones usando operadores lógicos:

```
CONDICION1 and CONDICION2
CONDICION1 or CONDICION2
not CONDICION1
```

## Campos Disponibles

Los filtros pueden usar los siguientes campos del objeto email de Postmark:

### Información del Mensaje
- **MessageID**: ID único del mensaje de Postmark
- **Date**: Fecha de recepción del email (formato ISO string)
- **Subject**: Asunto del email

### Información del Remitente
- **FromFull.Email**: Dirección email del remitente
- **FromFull.Name**: Nombre del remitente

### Información del Destinatario
- **ToFull**: Array de destinatarios (usar con `first()` para acceder al primero)
- **first(ToFull).Email**: Email del primer destinatario
- **first(ToFull).Name**: Nombre del primer destinatario
- **OriginalRecipient**: Destinatario original del email

### Contenido del Email
- **TextBody**: Contenido del email en texto plano
- **HtmlBody**: Contenido del email en HTML
- **StrippedTextReply**: Respuesta extraída sin formato

### Metadatos
- **Tag**: Etiqueta asignada en Postmark

## Operadores Disponibles

### Operadores de Comparación
- **==**: Igual exacto
  ```
  Tag == "importante"
  ```

- **!=**: No igual
  ```
  Tag != "spam"
  ```

- **>**: Mayor que (útil para fechas y números)
  ```
  Date > "2024-01-01"
  ```

- **<**: Menor que
  ```
  Date < "2024-12-31"
  ```

- **>=**: Mayor o igual que
  ```
  Date >= "2024-01-01T00:00:00Z"
  ```

- **<=**: Menor o igual que
  ```
  Date <= "2024-12-31T23:59:59Z"
  ```

### Operador de Expresiones Regulares
- **~=**: Coincidencia con expresión regular
  ```
  Subject ~= "urgent|importante"
  FromFull.Email ~= "@empresa\\.com$"
  ```

### Operadores de Lista
- **in**: Está en la lista de valores
  ```
  Tag in ("urgente", "importante", "trabajo")
  ```

- **not in**: NO está en la lista de valores
  ```
  Tag not in ("spam", "promocion", "basura")
  ```

### Operadores Lógicos
- **and**: Ambas condiciones deben ser verdaderas
  ```
  contains(Subject, "proyecto") and FromFull.Email ~= "@cliente.com"
  ```

- **or**: Al menos una condición debe ser verdadera
  ```
  contains(Subject, "urgente") or contains(Subject, "importante")
  ```

- **not**: Niega la condición
  ```
  not contains(Subject, "spam")
  ```

### Operador Condicional
- **if...then...else**: Condicional
  ```
  if len(Subject) > 50 then "largo" else "corto"
  ```

### Operadores Aritméticos
- **+**: Suma
  ```
  len(Subject) + len(TextBody)
  ```

- **-**: Resta
  ```
  len(Subject) - 10
  ```

- *****: Multiplicación
  ```
  len(Subject) * 2
  ```

- **/**: División
  ```
  len(Subject) / 2
  ```

- **^**: Potencia
  ```
  len(Subject) ^ 2
  ```

- **mod**: Módulo
  ```
  len(Subject) mod 10
  ```

## Funciones Disponibles

### Funciones Matemáticas Built-in
- **abs(x)**: Valor absoluto
  ```
  abs(len(Subject) - 50) < 10
  ```

- **ceil(x)**: Redondeo hacia arriba
  ```
  ceil(len(Subject) / 10) == 5
  ```

- **floor(x)**: Redondeo hacia abajo
  ```
  floor(len(Subject) / 10) >= 3
  ```

- **round(x)**: Redondeo al entero más cercano
  ```
  round(len(Subject) / 10) == 5
  ```

- **sqrt(x)**: Raíz cuadrada
  ```
  sqrt(len(Subject)) < 10
  ```

- **log(x)**: Logaritmo natural
  ```
  log(len(Subject)) > 2
  ```

- **log2(x)**: Logaritmo base 2
  ```
  log2(len(Subject)) < 6
  ```

- **log10(x)**: Logaritmo base 10
  ```
  log10(len(Subject)) > 1
  ```

- **max(a, b, c...)**: Valor máximo
  ```
  max(len(Subject), len(TextBody)) > 100
  ```

- **min(a, b, c...)**: Valor mínimo
  ```
  min(len(Subject), len(TextBody)) < 50
  ```

- **random()**: Número aleatorio entre 0.0 y 1.0
  ```
  random() < 0.1
  ```

### Funciones de Utilidad Built-in
- **exists(x)**: Verdadero si x no es null/undefined
  ```
  exists(FromFull.Name)
  ```

- **empty(x)**: Verdadero si x está vacío
  ```
  empty(Subject)
  ```

### Funciones Personalizadas para Strings
- **contains(str, search)**: Verifica si un string contiene otro (case insensitive)
  ```
  contains(Subject, "urgente")
  ```

- **startsWith(str, prefix)**: Verifica si un string empieza con un prefijo
  ```
  startsWith(Subject, "RE:")
  ```

- **endsWith(str, suffix)**: Verifica si un string termina con un sufijo
  ```
  endsWith(FromFull.Email, ".com")
  ```

- **len(item)**: Longitud de un string o array
  ```
  len(Subject) > 50
  ```

- **lower(str)**: Convierte a minúsculas
  ```
  lower(Subject) == "urgente"
  ```

- **upper(str)**: Convierte a mayúsculas
  ```
  upper(Subject) == "URGENTE"
  ```

### Funciones para Arrays
- **first(array)**: Obtiene el primer elemento de un array
  ```
  first(ToFull).Email == "user@domain.com"
  ```

## Ejemplos Prácticos

### Filtrar por Dominio del Remitente
```
FromFull.Email ~= "@empresa\\.com$"
```
Filtra todos los emails que vienen del dominio "empresa.com"

### Filtrar por Palabra Clave en Asunto
```
contains(Subject, "factura")
```
Filtra emails que tengan "factura" en el asunto (case insensitive)

### Filtrar Emails Urgentes
```
contains(Subject, "urgente") or contains(Subject, "importante") or Subject ~= "URGENT"
```
Filtra emails con palabras que indican urgencia

### Filtrar por Cliente Específico
```
FromFull.Email == "cliente@empresa.com" or contains(TextBody, "Proyecto ABC")
```
Filtra emails de un cliente específico o que mencionen un proyecto

### Filtrar por Rango de Fechas
```
Date >= "2024-01-01" and Date <= "2024-03-31"
```
Filtra emails recibidos en el primer trimestre de 2024

### Excluir Emails No Deseados
```
not contains(Subject, "spam") and not contains(Subject, "promocion") and not contains(FromFull.Email, "noreply")
```
Excluye emails que probablemente sean spam o promocionales

### Filtrar Emails de Soporte
```
(contains(first(ToFull).Email, "soporte") or contains(first(ToFull).Email, "help")) and not contains(Subject, "automatico")
```
Filtra emails dirigidos a soporte que no sean automáticos

### Filtrar por Múltiples Dominios
```
FromFull.Email ~= "@(cliente1|cliente2|partner)\\.com$"
```
Filtra emails de múltiples dominios importantes usando regex

### Filtrar por Longitud de Contenido
```
len(Subject) > 10 and len(Subject) < 100 and len(TextBody) > 50
```
Filtra emails con asunto y cuerpo de longitud específica

### Filtrar con Funciones Matemáticas
```
max(len(Subject), len(TextBody)) > 200 and abs(len(Subject) - 50) < 20
```
Filtra usando funciones matemáticas avanzadas

### Filtrar Muestra Aleatoria
```
random() < 0.05
```
Selecciona aleatoriamente ~5% de los emails

### Filtrar con Expresiones Regulares Complejas
```
TextBody ~= "\\b\\d{3}-\\d{3}-\\d{4}\\b"
```
Busca números de teléfono en el formato XXX-XXX-XXXX

### Filtrar Usando Condicionales
```
if len(Subject) > 50 then contains(Subject, "importante") else contains(Subject, "urgente")
```
Aplica diferentes criterios según la longitud del asunto

## Tipos de Datos

Filtrex v3 maneja los siguientes tipos:

### Números
```
42, -1.234, 3.14159
```

### Strings
```
"Hola mundo", "usuario@ejemplo.com"
```
**Nota**: Los strings deben estar entre comillas dobles

### Booleanos
```
true, false
```

### Arrays
```
("valor1", "valor2", "valor3")
```

### Objetos
Accede a propiedades usando la sintaxis de punto:
```
FromFull.Email, first(ToFull).Name
```

## Consejos y Mejores Prácticas

### 1. Usa Comillas Dobles para Strings
Siempre pon los valores de texto entre comillas dobles:
```
✅ contains(Subject, "proyecto")
❌ contains(Subject, proyecto)
```

### 2. Usa Funciones para Comparaciones de Texto
Para búsquedas flexibles, usa las funciones personalizadas:
```
✅ contains(Subject, "urgente")  // Case insensitive
❌ Subject == "urgente"         // Case sensitive
```

### 3. Combina Expresiones Regulares con Funciones
```
✅ FromFull.Email ~= "@empresa\\.com$" and contains(Subject, "proyecto")
```

### 4. Usa Paréntesis para Claridad
```
✅ (contains(Subject, "A") or contains(Subject, "B")) and Date > "2024-01-01"
❌ contains(Subject, "A") or contains(Subject, "B") and Date > "2024-01-01"
```

### 5. Aprovecha las Funciones Matemáticas
```
✅ abs(len(Subject) - 50) < 10  // Sujetos cerca de 50 caracteres
✅ max(len(Subject), len(TextBody)) > 100  // Al menos uno es largo
```

### 6. Escapa Caracteres Especiales en Regex
```
✅ FromFull.Email ~= "@empresa\\.com$"  // Escapa el punto
❌ FromFull.Email ~= "@empresa.com$"   // El punto coincide con cualquier carácter
```

### 7. Usa Arrays para Múltiples Valores
```
✅ Tag in ("urgent", "important", "critical")
❌ Tag == "urgent" or Tag == "important" or Tag == "critical"
```

## Validación y Errores

El editor validará automáticamente tu expresión mientras escribes. Los errores comunes incluyen:

- **Sintaxis incorrecta**: Paréntesis no balanceados, operadores mal formados
- **Funciones desconocidas**: Usar funciones que no existen
- **Tipos incompatibles**: Intentar operaciones matemáticas en strings
- **Propiedades inexistentes**: Acceder a campos que no existen en el objeto email

Para obtener ayuda en tiempo real, usa **Ctrl+Espacio** para ver las sugerencias de autocompletado. 