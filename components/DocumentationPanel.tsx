"use client";

import { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';

interface DocumentationPanelProps {
  className?: string;
}

export function DocumentationPanel({ className }: DocumentationPanelProps) {
  const [markdown, setMarkdown] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadMarkdown = async () => {
      try {
        const response = await fetch('/docs/filtrex-guide.md');
        if (response.ok) {
          const text = await response.text();
          setMarkdown(text);
        } else {
          // Fallback a documentación embebida si no se puede cargar
          setMarkdown(FALLBACK_DOCS);
        }
      } catch (error) {
        console.warn('No se pudo cargar la documentación desde archivo, usando fallback:', error);
        setMarkdown(FALLBACK_DOCS);
      } finally {
        setIsLoading(false);
      }
    };

    loadMarkdown();
  }, []);

  if (isLoading) {
    return (
      <div className={`flex items-center justify-center ${className}`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900 mx-auto mb-2"></div>
          <p className="text-sm text-muted-foreground">Cargando documentación...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`prose prose-sm max-w-none dark:prose-invert ${className}`}>
      <ReactMarkdown>{markdown}</ReactMarkdown>
    </div>
  );
}

// Documentación de fallback embebida
const FALLBACK_DOCS = `# Guía de Filtros Filtrex v3

## Introducción

Los filtros Filtrex te permiten crear reglas automáticas para clasificar tus emails entrantes de Postmark. Cuando un email llega a tu webhook \`/api/hook\`, estos filtros se evalúan automáticamente y asignan las etiquetas correspondientes.

## Sintaxis Básica

### Estructura de un Filtro

\`\`\`
campo operador "valor"
función(campo, "valor")
\`\`\`

### Ejemplo Simple

\`\`\`
contains(Subject, "urgente")
\`\`\`

Este filtro asignará la etiqueta a todos los emails cuyo asunto contenga la palabra "urgente" (case insensitive).

## Campos Disponibles

### Información del Remitente

- **\`FromFull.Email\`** - Dirección email del remitente
- **\`FromFull.Name\`** - Nombre del remitente

### Información del Destinatario

- **\`ToFull\`** - Array de destinatarios
- **\`first(ToFull).Email\`** - Email del primer destinatario
- **\`first(ToFull).Name\`** - Nombre del primer destinatario
- **\`OriginalRecipient\`** - Destinatario original

### Contenido del Email

- **\`Subject\`** - Asunto del email
- **\`TextBody\`** - Contenido en texto plano
- **\`HtmlBody\`** - Contenido en HTML
- **\`StrippedTextReply\`** - Respuesta extraída

### Metadatos

- **\`MessageID\`** - ID único del mensaje
- **\`Date\`** - Fecha de recepción (formato ISO)
- **\`Tag\`** - Etiqueta asignada en Postmark

## Funciones de Texto

### \`contains(str, search)\`
Verifica si el campo contiene una cadena de texto (case insensitive).

\`\`\`
contains(Subject, "proyecto")
contains(FromFull.Email, "@empresa.com")
\`\`\`

### \`startsWith(str, prefix)\`
Verifica si el campo empieza con una cadena específica.

\`\`\`
startsWith(Subject, "RE:")
startsWith(FromFull.Email, "admin")
\`\`\`

### \`endsWith(str, suffix)\`
Verifica si el campo termina con una cadena específica.

\`\`\`
endsWith(FromFull.Email, ".com")
\`\`\`

### \`len(item)\`
Obtiene la longitud de un string o array.

\`\`\`
len(Subject) > 50
len(ToFull) > 1
\`\`\`

## Operadores de Comparación

### Igualdad Exacta

\`\`\`
Tag == "importante"
first(ToFull).Email == "user@domain.com"
\`\`\`

### Expresiones Regulares

\`\`\`
Subject ~= "urgent|importante"
FromFull.Email ~= "@empresa\\\\.com$"
\`\`\`

### Listas de Valores

\`\`\`
Tag in ("urgent", "important", "critical")
Tag not in ("spam", "promotional")
\`\`\`

## Operadores Lógicos

### \`and\`
Combina condiciones que TODAS deben ser verdaderas.

\`\`\`
contains(Subject, "proyecto") and FromFull.Email ~= "@cliente.com"
\`\`\`

### \`or\`
Combina condiciones donde AL MENOS UNA debe ser verdadera.

\`\`\`
contains(Subject, "urgente") or contains(Subject, "importante")
\`\`\`

### \`not\`
Niega una condición.

\`\`\`
not contains(Subject, "auto-reply")
\`\`\`

## Funciones Matemáticas

### Funciones Built-in
\`\`\`
abs(len(Subject) - 50) < 10
max(len(Subject), len(TextBody)) > 100
min(len(Subject), len(TextBody)) < 50
random() < 0.1
\`\`\`

### Funciones de Utilidad
\`\`\`
exists(FromFull.Name)
empty(Subject)
\`\`\`

## Ejemplos Prácticos

### Filtros por Dominio

\`\`\`
FromFull.Email ~= "@empresa\\\\.com$"
\`\`\`
*Filtra todos los emails de la empresa*

### Filtros por Proyecto

\`\`\`
contains(Subject, "Proyecto Alpha") and contains(FromFull.Email, "@cliente.com")
\`\`\`
*Emails del proyecto específico de un cliente*

### Filtros de Urgencia

\`\`\`
contains(Subject, "urgente") or contains(Subject, "importante") or Subject ~= "URGENT"
\`\`\`
*Emails que requieren atención inmediata*

### Filtros de Exclusión

\`\`\`
not contains(Subject, "auto-reply") and not contains(FromFull.Email, "noreply")
\`\`\`
*Excluye respuestas automáticas*

### Filtros por Longitud

\`\`\`
len(Subject) > 10 and len(Subject) < 100
\`\`\`
*Emails con asuntos de longitud específica*

### Filtros con Funciones Matemáticas

\`\`\`
max(len(Subject), len(TextBody)) > 200 and random() < 0.1
\`\`\`
*10% de emails largos*

## Consejos y Mejores Prácticas

### 1. Usa Comillas Dobles
Siempre pon los valores de texto entre comillas dobles:
\`\`\`
✅ contains(Subject, "proyecto")
❌ contains(Subject, proyecto)
\`\`\`

### 2. Aprovecha las Funciones
Usa las funciones personalizadas para búsquedas flexibles:
\`\`\`
✅ contains(Subject, "urgente")  // Case insensitive
❌ Subject == "urgente"         // Case sensitive
\`\`\`

### 3. Combina Filtros Gradualmente
Empieza con filtros simples y añade complejidad:
\`\`\`
# Paso 1
contains(Subject, "proyecto")

# Paso 2  
contains(Subject, "proyecto") and FromFull.Email ~= "@cliente.com"

# Paso 3
contains(Subject, "proyecto") and FromFull.Email ~= "@cliente.com" and not contains(Subject, "completado")
\`\`\`

### 4. Usa Expresiones Regulares para Patrones Complejos
\`\`\`
# Múltiples dominios
FromFull.Email ~= "@(empresa1|empresa2|partner)\\\\.com$"

# Números de teléfono
TextBody ~= "\\\\b\\\\d{3}-\\\\d{3}-\\\\d{4}\\\\b"
\`\`\`

### 5. Aprovecha las Funciones Matemáticas
\`\`\`
# Emails cerca de 50 caracteres
abs(len(Subject) - 50) < 10

# Al menos uno es largo
max(len(Subject), len(TextBody)) > 100
\`\`\`

## Validación de Filtros

El editor te mostrará en tiempo real si tu filtro es válido:

- ✅ **Verde**: Filtro válido y funcional
- ❌ **Rojo**: Error de sintaxis
- ⚠️ **Amarillo**: Advertencia o sugerencia de mejora

### Autocompletado
Presiona **Ctrl+Espacio** para ver sugerencias de:
- Campos disponibles
- Funciones built-in y personalizadas
- Operadores
- Patrones comunes de filtros`; 