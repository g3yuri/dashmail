"use client";

import { useRef } from 'react';
import { Editor } from '@monaco-editor/react';
import * as monaco from 'monaco-editor';

interface FilterEditorProps {
  value: string;
  onChange: (value: string) => void;
  height?: string;
  showFullscreenButton?: boolean;
  emails?: Array<{
    id: string;
    subject: string;
    fromEmail: string;
    fromName?: string;
    textBody?: string;
    receivedAt: Date;
    archived: boolean;
  }>;
}

// Campos del objeto email de Postmark para filtrex
const emailFields = [
  { field: 'MessageID', type: 'string', description: 'ID único del mensaje de Postmark' },
  { field: 'Date', type: 'string', description: 'Fecha de recepción del email (ISO string)' },
  { field: 'Subject', type: 'string', description: 'Asunto del email' },
  { field: 'FromFull.Email', type: 'string', description: 'Dirección email del remitente' },
  { field: 'FromFull.Name', type: 'string', description: 'Nombre del remitente' },
  { field: 'ToFull', type: 'array', description: 'Array de destinatarios' },
  { field: 'first(ToFull).Email', type: 'string', description: 'Email del primer destinatario' },
  { field: 'first(ToFull).Name', type: 'string', description: 'Nombre del primer destinatario' },
  { field: 'OriginalRecipient', type: 'string', description: 'Destinatario original del email' },
  { field: 'TextBody', type: 'string', description: 'Contenido del email en texto plano' },
  { field: 'HtmlBody', type: 'string', description: 'Contenido del email en HTML' },
  { field: 'StrippedTextReply', type: 'string', description: 'Respuesta extraída sin formato' },
  { field: 'Tag', type: 'string', description: 'Etiqueta asignada en Postmark' }
];

// Operadores específicos de filtrex v3 con sus descripciones
const filtrexOperators = [
  // Comparaciones básicas
  { op: '==', desc: 'Igual exacto', example: 'Tag == "important"' },
  { op: '!=', desc: 'No igual', example: 'Tag != "spam"' },
  { op: '>', desc: 'Mayor que (fechas/números)', example: 'Date > "2024-01-01"' },
  { op: '<', desc: 'Menor que (fechas/números)', example: 'Date < "2024-12-31"' },
  { op: '>=', desc: 'Mayor o igual que', example: 'Date >= "2024-01-01"' },
  { op: '<=', desc: 'Menor o igual que', example: 'Date <= "2024-12-31"' },
  
  // Operador regex oficial
  { op: '~=', desc: 'Coincidencia con expresión regular', example: 'Subject ~= "urgent|importante"' },
  
  // Operadores de lista
  { op: 'in', desc: 'Está en la lista', example: 'Tag in ("urgent", "important")' },
  { op: 'not in', desc: 'No está en la lista', example: 'Tag not in ("spam", "junk")' },
  
  // Operadores lógicos
  { op: 'and', desc: 'Operador lógico Y', example: 'contains(Subject, "proyecto") and FromFull.Email ~= "@cliente.com"' },
  { op: 'or', desc: 'Operador lógico O', example: 'contains(Subject, "urgente") or contains(Subject, "importante")' },
  { op: 'not', desc: 'Operador lógico NO', example: 'not contains(Subject, "spam")' },
  
  // Operador condicional
  { op: 'if...then...else', desc: 'Condicional', example: 'if len(Subject) > 50 then "long" else "short"' },
  
  // Operadores aritméticos
  { op: '+', desc: 'Suma', example: 'len(Subject) + len(TextBody)' },
  { op: '-', desc: 'Resta', example: 'len(Subject) - 10' },
  { op: '*', desc: 'Multiplicación', example: 'len(Subject) * 2' },
  { op: '/', desc: 'División', example: 'len(Subject) / 2' },
  { op: '^', desc: 'Potencia', example: 'len(Subject) ^ 2' },
  { op: 'mod', desc: 'Módulo', example: 'len(Subject) mod 10' }
];

// Funciones built-in y personalizadas disponibles en Filtrex
const filtrexFunctions = [
  // Funciones matemáticas built-in
  { func: 'abs(x)', desc: 'Valor absoluto', example: 'abs(len(Subject) - 50)' },
  { func: 'ceil(x)', desc: 'Redondeo hacia arriba', example: 'ceil(len(Subject) / 10)' },
  { func: 'floor(x)', desc: 'Redondeo hacia abajo', example: 'floor(len(Subject) / 10)' },
  { func: 'round(x)', desc: 'Redondeo al entero más cercano', example: 'round(len(Subject) / 10)' },
  { func: 'sqrt(x)', desc: 'Raíz cuadrada', example: 'sqrt(len(Subject))' },
  { func: 'log(x)', desc: 'Logaritmo natural', example: 'log(len(Subject))' },
  { func: 'log2(x)', desc: 'Logaritmo base 2', example: 'log2(len(Subject))' },
  { func: 'log10(x)', desc: 'Logaritmo base 10', example: 'log10(len(Subject))' },
  { func: 'max(a,b,c...)', desc: 'Valor máximo', example: 'max(len(Subject), len(TextBody))' },
  { func: 'min(a,b,c...)', desc: 'Valor mínimo', example: 'min(len(Subject), len(TextBody))' },
  { func: 'random()', desc: 'Número aleatorio 0.0-1.0', example: 'random() < 0.1' },
  
  // Funciones de utilidad built-in
  { func: 'exists(x)', desc: 'Verdadero si x no es null/undefined', example: 'exists(FromFull.Name)' },
  { func: 'empty(x)', desc: 'Verdadero si x está vacío', example: 'empty(Subject)' },
  
  // Funciones personalizadas que agregamos
  { func: 'contains(str, search)', desc: 'String contiene substring (case insensitive)', example: 'contains(Subject, "urgente")' },
  { func: 'startsWith(str, prefix)', desc: 'String empieza con prefijo', example: 'startsWith(Subject, "RE:")' },
  { func: 'endsWith(str, suffix)', desc: 'String termina con sufijo', example: 'endsWith(FromFull.Email, ".com")' },
  { func: 'first(array)', desc: 'Primer elemento de un array', example: 'first(ToFull).Email' },
  { func: 'len(item)', desc: 'Longitud de string o array', example: 'len(Subject) > 50' },
  { func: 'lower(str)', desc: 'Convertir a minúsculas', example: 'lower(Subject)' },
  { func: 'upper(str)', desc: 'Convertir a mayúsculas', example: 'upper(Subject)' }
];

/**
 * FilterEditor - Editor Monaco específico para sintaxis filtrex v3
 * 
 * Editor especializado para crear filtros filtrex que se aplicarán automáticamente
 * a los emails recibidos de Postmark para clasificarlos en labels.
 * 
 * Sintaxis filtrex v3 válida:
 * - FromFull.Email ~= "@empresa.com"
 * - contains(Subject, "urgente") and not contains(Subject, "spam")
 * - contains(TextBody, "factura") or contains(TextBody, "invoice")
 * - first(ToFull).Email == "user@domain.com"
 * - Date > "2024-01-01" and Tag in ("important", "urgent")
 * - len(Subject) > 50 and random() < 0.1
 */
export function FilterEditor({ 
  value, 
  onChange, 
  height = '120px'
}: FilterEditorProps) {
  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);

  const handleEditorBeforeMount = (monaco: typeof import('monaco-editor')) => {
    // Registrar lenguaje personalizado para filtrex
    monaco.languages.register({ id: 'filtrex' });
  
    // Configurar tokenización para filtrex v3
    monaco.languages.setMonarchTokensProvider('filtrex', {
        tokenizer: {
          root: [
            [/"[^"]*"/, 'string'],
            [/'[^']*'/, 'string'],
            [/\b(and|or|not|if|then|else|in|not in|mod)\b/, 'keyword'],
            [/\b(contains|startsWith|endsWith|first|len|lower|upper|exists|empty)\b/, 'function.custom'],
            [/\b(abs|ceil|floor|round|sqrt|log|log2|log10|max|min|random)\b/, 'function.builtin'],
            [/[~!<>=]+/, 'operator'],
            [/[+\-*/^]/, 'operator.arithmetic'],
            [/[a-zA-Z_]\w*(\.[a-zA-Z_]\w*)*/, 'variable'],
            [/\d+(\.\d+)?/, 'number'],
            [/[(),]/, 'delimiter'],
            [/\s+/, 'white']
          ]
        }
      });

    // Configurar tema para filtrex v3
    monaco.editor.defineTheme('filtrex-theme', {
        base: 'vs-dark',
        inherit: true,
        rules: [
          { token: 'keyword', foreground: 'ff6b6b' },
          { token: 'operator', foreground: '4ecdc4' },
          { token: 'operator.arithmetic', foreground: 'ffa726' },
          { token: 'function.builtin', foreground: 'ab47bc' },
          { token: 'function.custom', foreground: '5c6bc0' },
          { token: 'variable', foreground: 'ffe66d' },
          { token: 'string', foreground: '95e1d3' },
          { token: 'number', foreground: 'a8e6cf' }
        ],
        colors: {}
      });

    // Configurar autocompletado específico para filtrex v3
    monaco.languages.registerCompletionItemProvider('filtrex', {
        provideCompletionItems: (model, position) => {
          const word = model.getWordUntilPosition(position);
          const range = {
            startLineNumber: position.lineNumber,
            endLineNumber: position.lineNumber,
            startColumn: word.startColumn,
            endColumn: word.endColumn
          };
  
          const suggestions: monaco.languages.CompletionItem[] = [];
  
          // Sugerencias para campos del email de Postmark
          emailFields.forEach(field => {
            suggestions.push({
              label: field.field,
              kind: monaco.languages.CompletionItemKind.Field,
              insertText: field.field,
              range: range,
              documentation: `${field.description} (${field.type})`
            });
          });
  
          // Sugerencias para operadores de filtrex v3
          filtrexOperators.forEach(operator => {
            suggestions.push({
              label: operator.op,
              kind: monaco.languages.CompletionItemKind.Operator,
              insertText: operator.op,
              range: range,
              documentation: `${operator.desc}\nEjemplo: ${operator.example}`
            });
          });

          // Sugerencias para funciones de filtrex v3
          filtrexFunctions.forEach(func => {
            suggestions.push({
              label: func.func,
              kind: monaco.languages.CompletionItemKind.Function,
              insertText: func.func,
              range: range,
              documentation: `${func.desc}\nEjemplo: ${func.example}`
            });
          });
  
          // Patrones de filtros comunes específicos para filtrex v3
          const filtrexPatterns = [
            {
              label: 'Filtro por dominio del remitente',
              insertText: 'FromFull.Email ~= "@empresa.com"',
              documentation: 'Filtra emails de un dominio específico usando regex'
            },
            {
              label: 'Filtro por palabra clave en asunto',
              insertText: 'contains(Subject, "urgente")',
              documentation: 'Filtra por palabras clave en el asunto (case insensitive)'
            },
            {
              label: 'Filtro por contenido del email',
              insertText: 'contains(TextBody, "factura")',
              documentation: 'Filtra por contenido en el cuerpo del email'
            },
            {
              label: 'Filtro por destinatario específico',
              insertText: 'first(ToFull).Email == "user@domain.com"',
              documentation: 'Filtra por destinatario exacto usando first()'
            },
            {
              label: 'Filtro combinado con AND',
              insertText: 'contains(Subject, "proyecto") and FromFull.Email ~= "@cliente.com"',
              documentation: 'Combina múltiples condiciones con AND'
            },
            {
              label: 'Filtro con OR',
              insertText: 'contains(Subject, "urgente") or contains(Subject, "importante")',
              documentation: 'Filtra con múltiples opciones usando OR'
            },
            {
              label: 'Filtro por rango de fechas',
              insertText: 'Date >= "2024-01-01" and Date <= "2024-12-31"',
              documentation: 'Filtra emails en un rango de fechas'
            },
            {
              label: 'Filtro con lista de valores',
              insertText: 'Tag in ("urgent", "important", "work")',
              documentation: 'Filtra usando una lista de valores posibles'
            },
            {
              label: 'Filtro de exclusión',
              insertText: 'not contains(Subject, "spam") and not contains(FromFull.Email, "noreply")',
              documentation: 'Excluye emails que coincidan con ciertos criterios'
            },
            {
              label: 'Filtro por longitud de asunto',
              insertText: 'len(Subject) > 50 and len(Subject) < 100',
              documentation: 'Filtra por longitud del asunto'
            },
            {
              label: 'Filtro con expresión regular',
              insertText: 'TextBody ~= "\\\\d{3}-\\\\d{3}-\\\\d{4}"',
              documentation: 'Busca patrones usando expresiones regulares'
            },
            {
              label: 'Filtro con funciones matemáticas',
              insertText: 'max(len(Subject), len(TextBody)) > 100',
              documentation: 'Usa funciones matemáticas built-in'
            }
          ];
  
          filtrexPatterns.forEach(pattern => {
            suggestions.push({
              label: pattern.label,
              kind: monaco.languages.CompletionItemKind.Snippet,
              insertText: pattern.insertText,
              range: range,
              documentation: pattern.documentation
            });
          });
  
          return { suggestions };
        }
      });
  
      // Configurar validación específica para filtrex v3
      monaco.languages.setLanguageConfiguration('filtrex', {
        brackets: [
          ['"', '"'],
          ["'", "'"],
          ['(', ')']
        ],
        autoClosingPairs: [
          { open: '"', close: '"' },
          { open: "'", close: "'" },
          { open: '(', close: ')' }
        ],
        surroundingPairs: [
          { open: '"', close: '"' },
          { open: "'", close: "'" },
          { open: '(', close: ')' }
        ]
      });
  };

  const handleEditorDidMount = (editor: monaco.editor.IStandaloneCodeEditor) => {
    editorRef.current = editor;
  };

  const handleEditorChange = (newValue: string | undefined) => {
    onChange(newValue || '');
  };

  return (
    <div className="border rounded-md overflow-hidden">
      <Editor
        height={height}
        defaultLanguage="filtrex"
        value={value}
        onChange={handleEditorChange}
        onMount={handleEditorDidMount}
        beforeMount={handleEditorBeforeMount}
        options={{
          minimap: { enabled: false },
          scrollBeyondLastLine: false,
          fontSize: 13,
          lineNumbers: 'off',
          glyphMargin: false,
          folding: false,
          lineDecorationsWidth: 0,
          lineNumbersMinChars: 0,
          wordWrap: 'on',
          wrappingIndent: 'indent',
          automaticLayout: true,
          suggestOnTriggerCharacters: true,
          acceptSuggestionOnEnter: 'on',
          tabCompletion: 'on',
          quickSuggestions: {
            other: true,
            comments: false,
            strings: true
          },
          suggest: {
            showFields: true,
            showFunctions: true,
            showKeywords: true,
            showSnippets: true,
            showOperators: true
          }
        }}
        theme="filtrex-theme"
      />
    </div>
  );
} 