# DashMail - Intelligent Email Management Dashboard

This is a submission for the [Postmark Challenge: Inbox Innovators](https://dev.to/challenges/postmark).

## What I Built

**DashMail** is an innovative email management platform that transforms traditional email workflows into an intelligent, productive system. Built specifically to leverage Postmark's powerful email infrastructure, DashMail combines AI-powered email processing, smart labeling, Kanban-style task management, and advanced filtering to create a unified productivity hub.

### Key Features:
- **🤖 AI-Powered Email Summaries**: Automatic content analysis using Google's Gemini AI to generate concise summaries
- **📂 Smart Auto-Labeling**: Advanced filtering system using Filtrex expressions to automatically categorize incoming emails
- **📋 Kanban Task Management**: Transform emails into actionable tasks with visual workflow management
- **🔍 Advanced Filtering**: Create custom filters using logical expressions for precise email organization
- **📊 Real-time Dashboard**: Comprehensive overview with email counts, status tracking, and label management
- **🔒 Secure Authentication**: Integrated with Clerk for robust user management
- **⚡ Real-time Processing**: Instant email processing via Postmark webhooks

## Demo

🔗 **Live Demo**: [https://dashmail-app.vercel.app](https://dashmail-app.vercel.app)

### Screenshots:

**Landing Page**
![Landing Page with modern dark theme and professional design]

**Dashboard Overview**
![Main dashboard showing email management with labels and filters]

**Kanban View**
![Email workflow management in Kanban board format]

**AI-Powered Email Details**
![Email detail view with AI-generated summaries]

### Test Instructions:
1. Visit the demo link above
2. Sign up using the demo credentials or create a new account
3. Send email to 787760bde5487e75f0f9d78984bf79ea@inbound.postmarkapp.com, the dashboard will be populated with sample emails to demonstrate features
4. Test the filtering system by creating custom labels with Filtrex expressions
5. Switch between List and Kanban views to see different workflow perspectives

## Code Repository

🏗️ **GitHub Repository**: [https://github.com/yourusername/dashmail](https://github.com/yourusername/dashmail)

The codebase demonstrates modern full-stack development practices with:
- **Frontend**: Next.js 15 with React 19, TypeScript, and Tailwind CSS
- **Backend**: API routes with Postmark webhook integration
- **Database**: SQLite with Drizzle ORM for efficient data management
- **AI Integration**: Google Gemini for intelligent email processing
- **Authentication**: Clerk for secure user management

## How I Built It

### Development Process

**🎯 Problem Identification**: Email management tools often lack intelligence and automation, forcing users to manually organize thousands of messages. I wanted to create a solution that learns from email patterns and automates the organization process.

**🏗️ Architecture Design**: 
- Built on Next.js 15 for optimal performance and developer experience
- Implemented real-time webhook processing for immediate email handling
- Designed a flexible labeling system that supports both manual and automated organization
- Created a dual-view system (List/Kanban) for different workflow preferences

**⚙️ Tech Stack Implementation**:

1. **Postmark Integration**: 
   - Configured inbound email processing via webhooks (`/api/hook`)  
   - Real-time email reception and parsing
   - Automatic attachment handling and content extraction

2. **AI-Powered Processing**:
   - Integrated Google Gemini AI for intelligent email summarization
   - Contextual analysis of email content and subject lines
   - Automatic generation of actionable insights

3. **Smart Filtering System**:
   - Implemented Filtrex for advanced logical expressions
   - Custom functions for email field matching (`contains`, `startsWith`, etc.)
   - Real-time filter application to incoming emails

4. **Database Design**:
   - Efficient schema with proper indexing for fast queries
   - Support for email attachments and metadata
   - Optimized label-email relationships for complex filtering

5. **User Experience**:
   - Modern, responsive design with dark/light theme support
   - Drag-and-drop Kanban interface for task management
   - Real-time updates and optimistic UI patterns

### Postmark Experience

Working with Postmark was exceptionally smooth. The webhook system is robust and reliable, providing comprehensive email data that made building advanced features straightforward. The documentation is excellent, and the API consistency allowed for rapid development and testing.

**Key Postmark Features Utilized**:
- Inbound email processing with complete message parsing
- Attachment handling with base64 encoding
- Header analysis for advanced filtering capabilities  
- Reliable webhook delivery for real-time processing

### Challenges Overcome

1. **Real-time Processing**: Ensuring webhooks process emails instantly while maintaining data consistency
2. **AI Integration**: Balancing AI processing speed with quality to provide real-time summaries
3. **Complex Filtering**: Creating an intuitive interface for advanced logical expressions
4. **Performance Optimization**: Handling large email volumes efficiently with proper caching strategies

---

# DashMail - Dashboard Inteligente de Gestión de Correos

Esta es una propuesta para el [Desafío Postmark: Innovadores de Bandeja de Entrada](https://dev.to/challenges/postmark).

## Lo que Construí

**DashMail** es una plataforma innovadora de gestión de correos electrónicos que transforma los flujos de trabajo tradicionales de email en un sistema inteligente y productivo. Construido específicamente para aprovechar la poderosa infraestructura de email de Postmark, DashMail combina procesamiento de emails con IA, etiquetado inteligente, gestión de tareas estilo Kanban y filtrado avanzado para crear un centro de productividad unificado.

### Características Principales:
- **🤖 Resúmenes de Email con IA**: Análisis automático de contenido usando Gemini AI de Google para generar resúmenes concisos
- **📂 Auto-Etiquetado Inteligente**: Sistema de filtrado avanzado usando expresiones Filtrex para categorizar automáticamente emails entrantes
- **📋 Gestión de Tareas Kanban**: Transforma emails en tareas accionables con gestión visual de flujo de trabajo
- **🔍 Filtrado Avanzado**: Crea filtros personalizados usando expresiones lógicas para organización precisa de emails
- **📊 Dashboard en Tiempo Real**: Vista general completa con conteos de emails, seguimiento de estado y gestión de etiquetas
- **🔒 Autenticación Segura**: Integrado con Clerk para gestión robusta de usuarios
- **⚡ Procesamiento en Tiempo Real**: Procesamiento instantáneo de emails vía webhooks de Postmark

## Demo

🔗 **Demo en Vivo**: [https://dashmail.neural.pe/](https://dashmail.neural.pe/)

### Capturas de Pantalla:

**Página de Inicio**
![Página de inicio con tema oscuro moderno y diseño profesional]

**Vista General del Dashboard**
![Dashboard principal mostrando gestión de emails con etiquetas y filtros]

**Vista Kanban**
![Gestión de flujo de trabajo de emails en formato de tablero Kanban]

**Detalles de Email con IA**
![Vista de detalle de email con resúmenes generados por IA]

### Instrucciones de Prueba:
1. Visita el enlace de demo arriba
2. Regístrate usando las credenciales de demo o crea una nueva cuenta
3. Envia correos a 787760bde5487e75f0f9d78984bf79ea@inbound.postmarkapp.com y el dashboard se poblará con emails de muestra para demostrar las funcionalidades
4. Prueba el sistema de filtrado creando etiquetas personalizadas con expresiones Filtrex
5. Alterna entre las vistas de Lista y Kanban para ver diferentes perspectivas de flujo de trabajo

## Repositorio de Código

🏗️ **Repositorio GitHub**: [https://github.com/g3yuri/dashmail](https://github.com/g3yuri/dashmail)

El código base demuestra prácticas modernas de desarrollo full-stack con:
- **Frontend**: Next.js 15 con React 19, TypeScript, y Tailwind CSS
- **Backend**: Rutas API con integración de webhooks de Postmark
- **Base de Datos**: SQLite con Drizzle ORM para gestión eficiente de datos
- **Integración IA**: Google Gemini para procesamiento inteligente de emails
- **Autenticación**: Clerk para gestión segura de usuarios

## Cómo lo Construí

### Proceso de Desarrollo

**🎯 Identificación del Problema**: Las herramientas de gestión de email a menudo carecen de inteligencia y automatización, forzando a los usuarios a organizar manualmente miles de mensajes. Quería crear una solución que aprenda de los patrones de email y automatice el proceso de organización.

**🏗️ Diseño de Arquitectura**: 
- Construido en Next.js 15 para rendimiento óptimo y experiencia de desarrollador
- Implementé procesamiento de webhooks en tiempo real para manejo inmediato de emails
- Diseñé un sistema flexible de etiquetado que soporta organización manual y automatizada
- Creé un sistema de vista dual (Lista/Kanban) para diferentes preferencias de flujo de trabajo

**⚙️ Implementación del Stack Tecnológico**:

1. **Integración con Postmark**: 
   - Configuré procesamiento de emails entrantes vía webhooks (`/api/hook`)
   - Recepción y análisis de emails en tiempo real
   - Manejo automático de adjuntos y extracción de contenido

2. **Procesamiento con IA**:
   - Integré Google Gemini AI para resumenes inteligentes de emails
   - Análisis contextual de contenido y líneas de asunto de emails
   - Generación automática de insights accionables

3. **Sistema de Filtrado Inteligente**:
   - Implementé Filtrex para expresiones lógicas avanzadas
   - Funciones personalizadas para coincidencia de campos de email (`contains`, `startsWith`, etc.)
   - Aplicación de filtros en tiempo real a emails entrantes

4. **Diseño de Base de Datos**:
   - Schema eficiente con indexación adecuada para consultas rápidas
   - Soporte para adjuntos de email y metadatos
   - Relaciones etiqueta-email optimizadas para filtrado complejo

5. **Experiencia de Usuario**:
   - Diseño moderno y responsivo con soporte para tema oscuro/claro
   - Interfaz Kanban de arrastrar y soltar para gestión de tareas
   - Actualizaciones en tiempo real y patrones de UI optimistas

### Experiencia con Postmark

Trabajar con Postmark fue excepcionalmente fluido. El sistema de webhooks es robusto y confiable, proporcionando datos completos de email que hicieron que construir funcionalidades avanzadas fuera directo. La documentación es excelente, y la consistencia de la API permitió desarrollo y pruebas rápidas.

**Características Clave de Postmark Utilizadas**:
- Procesamiento de emails entrantes con análisis completo de mensajes
- Manejo de adjuntos con codificación base64
- Análisis de headers para capacidades de filtrado avanzadas
- Entrega confiable de webhooks para procesamiento en tiempo real

### Desafíos Superados

1. **Procesamiento en Tiempo Real**: Asegurar que los webhooks procesen emails instantáneamente mientras mantienen la consistencia de datos
2. **Integración IA**: Balancear la velocidad de procesamiento de IA con la calidad para proporcionar resúmenes en tiempo real
3. **Filtrado Complejo**: Crear una interfaz intuitiva para expresiones lógicas avanzadas
4. **Optimización de Rendimiento**: Manejar grandes volúmenes de email eficientemente con estrategias de caché apropiadas
