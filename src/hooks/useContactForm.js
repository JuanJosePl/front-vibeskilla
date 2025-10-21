import { useState } from 'react';
import { EmailService } from '../services/emailService';

export const useContactForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(null);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Limpiar error cuando el usuario empiece a escribir
    if (error) setError(null);
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      setError('El nombre es requerido');
      return false;
    }
    if (!formData.email.trim()) {
      setError('El email es requerido');
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      setError('El formato del email no es válido');
      return false;
    }
    if (!formData.subject.trim()) {
      setError('El asunto es requerido');
      return false;
    }
    if (!formData.message.trim() || formData.message.length < 10) {
      setError('El mensaje debe tener al menos 10 caracteres');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      // Usar el servicio de tu backend
      await EmailService.sendContactEmail(formData);
      
      // O usar EmailJS (descomenta la línea siguiente y comenta la anterior)
      // await EmailService.sendWithEmailJS(formData);
      
      setSubmitted(true);
      
      // Reset form after 5 seconds
      setTimeout(() => {
        setSubmitted(false);
        setFormData({
          name: "",
          email: "",
          phone: "",
          subject: "",
          message: "",
        });
      }, 5000);
      
    } catch (err) {
      setError(err.message || 'Error al enviar el mensaje. Por favor, intenta nuevamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      phone: "",
      subject: "",
      message: "",
    });
    setError(null);
    setSubmitted(false);
  };

  return {
    formData,
    isSubmitting,
    submitted,
    error,
    handleInputChange,
    handleSubmit,
    resetForm
  };
};