/**
 * Utilidades para filtros filtrex
 * 
 * Este archivo muestra cómo integrar los filtros creados en el FilterEditor
 * con la librería filtrex para filtrar emails de Postmark automáticamente.
 */

// Instalación requerida: npm install filtrex
import { compileExpression } from 'filtrex';

// Tipo del objeto email de Postmark recibido en /api/hook
export interface PostmarkEmail {
  MessageID: string;
  Date: string;
  Subject: string;
  FromFull: {
    Email: string;
    Name: string;
  };
  ToFull: Array<{
    Email: string;
    Name: string;
  }>;
  CcFull?: Array<{
    Email: string;
    Name: string;
  }>;
  BccFull?: Array<{
    Email: string;
    Name: string;
  }>;
  OriginalRecipient: string;
  TextBody: string;
  HtmlBody: string;
  StrippedTextReply: string;
  Tag: string;
  Headers: Array<{
    Name: string;
    Value: string;
  }>;
  Attachments: Array<{
    Name: string;
    Content: string;
    ContentType: string;
    ContentLength: number;
    ContentID?: string;
  }>;
}

// Funciones personalizadas para Filtrex usando la sintaxis oficial v3
const customFunctions = {
  // Función para verificar si un string contiene otro (case insensitive)
  contains: (str: string, search: string): boolean => {
    return str?.toLowerCase?.()?.includes?.(search?.toLowerCase?.()) || false;
  },
  
  // Función para verificar si un string empieza con otro
  startsWith: (str: string, prefix: string): boolean => {
    return str?.toLowerCase?.()?.startsWith?.(prefix?.toLowerCase?.()) || false;
  },
  
  // Función para verificar si un string termina con otro
  endsWith: (str: string, suffix: string): boolean => {
    return str?.toLowerCase?.()?.endsWith?.(suffix?.toLowerCase?.()) || false;
  },
  
  // Función para obtener el primer elemento de un array
  first: (arr: unknown[]): unknown => {
    return Array.isArray(arr) && arr.length > 0 ? arr[0] : null;
  },
  
  // Función para obtener la longitud de un string o array
  len: (item: string | unknown[]): number => {
    return item?.length || 0;
  },
  
  // Función para convertir a minúsculas
  lower: (str: string): string => {
    return str?.toLowerCase?.() || '';
  },
  
  // Función para convertir a mayúsculas
  upper: (str: string): string => {
    return str?.toUpperCase?.() || '';
  }
};

// Opciones de Filtrex con funciones personalizadas
const filtrexOptions = {
  extraFunctions: customFunctions
};

/**
 * Aplica un filtro filtrex a un email de Postmark
 * 
 * @param email - Email de Postmark
 * @param filterExpression - Expresión filtrex (ej: 'contains(Subject, "urgente")')
 * @returns true si el email coincide con el filtro
 * 
 * Ejemplos de uso:
 * ```typescript
 * const email = { // objeto de Postmark... };
 * const filter = 'contains(FromFull.Email, "@empresa.com") and contains(Subject, "proyecto")';
 * const matches = applyFiltrexFilter(email, filter);
 * ```
 */
export function applyFiltrexFilter(email: PostmarkEmail, filterExpression: string): boolean {
  if (!filterExpression.trim()) {
    return false;
  }

  try {
    // Usar filtrex real con funciones personalizadas usando sintaxis v3
    const compiledFilter = compileExpression(filterExpression, filtrexOptions);
    return !!compiledFilter(email);
  } catch {
    return false;
  }
}

/**
 * Valida una expresión filtrex usando la librería real
 */
export function validateFiltrexExpression(expression: string): boolean {
  if (!expression?.trim()) return false;
  
  try {
    // Intentar compilar la expresión con filtrex usando sintaxis v3
    compileExpression(expression.trim(), filtrexOptions);
    return true;
  } catch (error) {
    console.error('Error al validar expresión filtrex:', error);
    return false;
  }
}

/**
 * Ejemplos de filtros filtrex válidos para el objeto email de Postmark
 * Actualizados para usar la sintaxis oficial de Filtrex v3
 */
export const FILTREX_EXAMPLES = {  
    // Filtros simples por campo usando funciones personalizadas
    bySubject: 'contains(Subject, "urgente")',  
    bySender: 'FromFull.Email ~= "@empresa.com"',  
    byRecipient: 'first(ToFull).Email == "user@domain.com"',
    byContent: 'contains(TextBody, "factura")',  
    byTag: 'Tag == "important"',  
      
    // Filtros por fecha
    byDateRange: 'Date >= "2024-01-01" and Date <= "2024-12-31"',  
    recentEmails: 'Date > "2024-06-01"',  
      
    // Filtros combinados usando sintaxis oficial
    workEmails: 'FromFull.Email ~= "@empresa.com" and contains(Subject, "proyecto")',  
    urgentEmails: 'contains(Subject, "urgente") or contains(Subject, "importante")',  
    notSpam: 'not contains(Subject, "spam") and not contains(FromFull.Email, "noreply")',  
      
    // Filtros con listas usando sintaxis oficial
    priorityTags: 'Tag in ("urgent", "important", "critical")',  
    excludeTags: 'Tag not in ("spam", "newsletter", "promotional")',  
      
    // Filtros complejos con funciones matemáticas
    businessHours: 'contains(FromFull.Email, "@empresa.com") and not contains(Subject, "auto-reply")',  
    clientEmails: '(FromFull.Email ~= "@cliente1.com" or FromFull.Email ~= "@cliente2.com") and contains(Subject, "proyecto")',
    
    // Ejemplos usando funciones built-in de Filtrex
    longSubjects: 'len(Subject) > 50',
    shortMessages: 'len(TextBody) < 100',
    upperCaseSubjects: 'Subject == upper(Subject)',
    
    // Filtros usando expresiones regulares
    phoneNumbers: 'TextBody ~= "\\d{3}-\\d{3}-\\d{4}"',
    emailAddresses: 'TextBody ~= "\\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Z|a-z]{2,}\\b"',
    
    // Filtros usando funciones matemáticas built-in
    randomSample: 'random() < 0.1', // 10% de los emails
    absoluteValues: 'abs(len(Subject) - 50) < 10', // Sujetos cerca de 50 caracteres
    maxValues: 'max(len(Subject), len(TextBody)) > 100'
  };

/**
 * Función para ser usada en /api/hook para aplicar filtros automáticamente
 * 
 * @param email - Email recibido de Postmark
 * @param labels - Array de labels con sus filtros
 * @returns Array de IDs de labels que coinciden
 */
export function getMatchingLabels(email: PostmarkEmail, labels: Array<{id: string, filter?: string}>): string[] {
  const matchingLabels: string[] = [];
  
  for (const label of labels) {
    if (label.filter && applyFiltrexFilter(email, label.filter)) {
      matchingLabels.push(label.id);
    }
  }
  
  return matchingLabels;
} 