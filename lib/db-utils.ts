/**
 * Utilidades para manejo de base de datos con retry automático
 */

/**
 * Reintenta una función asíncrona con backoff exponencial
 */
export async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  baseDelay: number = 1000
): Promise<T> {
  let attempt = 0;
  
  while (attempt < maxRetries) {
    try {
      return await fn();
    } catch (error) {
      attempt++;
      
      // Si es el último intento, lanzar el error
      if (attempt >= maxRetries) {
        throw error;
      }
      
      // Verificar si es un error de conectividad que vale la pena reintentar
      if (error instanceof Error) {
        const isRetryableError = 
          error.message.includes('Connect Timeout') ||
          error.message.includes('fetch failed') ||
          error.message.includes('ECONNRESET') ||
          error.message.includes('ENOTFOUND') ||
          error.message.includes('ETIMEDOUT');
        
        if (!isRetryableError) {
          throw error; // No reintentar errores que no sean de conectividad
        }
      }
      
      // Calcular delay con backoff exponencial
      const delay = baseDelay * Math.pow(2, attempt - 1);
      
      console.warn(`Intento ${attempt} falló, reintentando en ${delay}ms...`, {
        error: error instanceof Error ? error.message : error,
        attempt,
        maxRetries
      });
      
      // Esperar antes del siguiente intento
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  
  throw new Error('Máximo número de reintentos alcanzado');
}

/**
 * Verifica si la base de datos está disponible
 */
export async function checkDatabaseHealth(): Promise<boolean> {
  try {
    const { db } = await import('@/src/db/index');
    // Consulta simple para verificar conectividad usando sql
    await db.run('SELECT 1');
    return true;
  } catch (error) {
    console.error('Error verificando salud de la base de datos:', error);
    return false;
  }
} 