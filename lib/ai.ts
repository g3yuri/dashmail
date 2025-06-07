import { google } from '@ai-sdk/google';  
import { generateText } from 'ai';  
  
export async function generateEmailSummary(emailContent: string, subject: string): Promise<string> {  
  try {  
    if (!emailContent && !subject) {  
      return 'Sin contenido disponible';  
    }  
  
    const prompt = `  
Genera un resumen conciso y útil del siguiente correo electrónico en español.  
El resumen debe:  
- Ser de máximo 150 caracteres  
- Capturar la idea principal del mensaje  
- Ser claro y directo  
- Enfocarse en la acción o información más importante  
  
Asunto: ${subject}  
Contenido: ${emailContent}  
  
Resumen:`;  
  
    const { text } = await generateText({  
      model: google('gemini-1.5-flash'),  
      messages: [  
        {  
          role: 'system',  
          content: 'Eres un asistente especializado en crear resúmenes concisos de correos electrónicos en español. Siempre respondes en español y mantienes los resúmenes bajo 150 caracteres.'  
        },  
        {  
          role: 'user',  
          content: prompt  
        }  
      ],  
      maxTokens: 100,  
      temperature: 0.3,  
    });  
  
    const summary = text?.trim();  
      
    if (!summary) {  
      return 'No se pudo generar resumen';  
    }  
  
    // Asegurar que el resumen no exceda 150 caracteres  
    return summary.length > 150 ? summary.substring(0, 147) + '...' : summary;  
  
  } catch (error) {  
    console.error('Error generando resumen con IA:', error);  
      
    // Fallback: generar resumen básico  
    const fallbackText = emailContent || subject || '';  
    if (fallbackText.length <= 150) {  
      return fallbackText;  
    }  
      
    const truncated = fallbackText.substring(0, 147);  
    const lastSpace = truncated.lastIndexOf(' ');  
      
    if (lastSpace > 120) {  
      return truncated.substring(0, lastSpace) + '...';  
    }  
      
    return truncated + '...';  
  }  
}