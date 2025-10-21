import { API_CONFIG, API_ENDPOINTS, getHeaders } from '../config/api';

export class EmailService {
  static async sendContactEmail(formData) {
    try {
      const response = await fetch(
        `${API_CONFIG.BASE_URL}${API_ENDPOINTS.CONTACT.SEND}`,
        {
          method: 'POST',
          headers: getHeaders(),
          body: JSON.stringify(formData)
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Error ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error sending email:', error);
      throw new Error(error.message || 'No se pudo enviar el mensaje. Por favor, intenta nuevamente.');
    }
  }

}