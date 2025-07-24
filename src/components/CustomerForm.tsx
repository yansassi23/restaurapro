import React, { useState } from 'react';
import { User, Mail, Phone, MessageCircle } from 'lucide-react';
import { Plan } from '../types/Plan';

interface CustomerFormProps {
  onSubmit: (data: CustomerData) => void;
  selectedPlan: Plan;
}

export interface CustomerData {
  name: string;
  email: string;
  phone: string;
  deliveryMethod: string[];
  imageUrls?: string[];
  id?: string;
}

const CustomerForm = ({ onSubmit, selectedPlan }: CustomerFormProps) => {
  const [formData, setFormData] = useState<CustomerData>({
    name: '',
    email: '',
    phone: '',
    deliveryMethod: []
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.deliveryMethod.length === 0) {
      alert('Por favor, selecione pelo menos um método de entrega.');
      return;
    }
    onSubmit(formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    
    if (type === 'checkbox' && name === 'deliveryMethod') {
      setFormData(prev => ({
        ...prev,
        deliveryMethod: checked 
          ? [...prev.deliveryMethod, value]
          : prev.deliveryMethod.filter(method => method !== value)
      }));
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Seus Dados
          </h2>
          <p className="text-xl text-gray-600">
            Para enviarmos sua foto restaurada
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <User className="h-4 w-4 inline mr-2" />
                Nome completo
              </label>
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleTextChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Digite seu nome completo"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Mail className="h-4 w-4 inline mr-2" />
                Email
              </label>
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleTextChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="seu@email.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Phone className="h-4 w-4 inline mr-2" />
                WhatsApp
              </label>
              <input
                type="tel"
                name="phone"
                required
                value={formData.phone}
                onChange={handleTextChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="(11) 99999-9999"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-4">
                Como prefere receber sua foto restaurada? (Pode escolher ambos)
              </label>
              <div className="grid grid-cols-2 gap-4">
                <label className={`border-2 rounded-lg p-4 cursor-pointer transition-colors ${
                  formData.deliveryMethod.includes('email')
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}>
                  <input
                    type="checkbox"
                    name="deliveryMethod"
                    value="email"
                    checked={formData.deliveryMethod.includes('email')}
                    onChange={handleChange}
                    className="sr-only"
                  />
                  <div className="text-center">
                    <Mail className="h-8 w-8 mx-auto mb-2 text-blue-600" />
                    <span className="font-medium">Por Email</span>
                  </div>
                </label>

                <label className={`border-2 rounded-lg p-4 cursor-pointer transition-colors ${
                  formData.deliveryMethod.includes('whatsapp')
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}>
                  <input
                    type="checkbox"
                    name="deliveryMethod"
                    value="whatsapp"
                    checked={formData.deliveryMethod.includes('whatsapp')}
                    onChange={handleChange}
                    className="sr-only"
                  />
                  <div className="text-center">
                    <MessageCircle className="h-8 w-8 mx-auto mb-2 text-green-600" />
                    <span className="font-medium">Por WhatsApp</span>
                  </div>
                </label>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 rounded-lg transition-colors"
            >
              Continuar para Pagamento • R$ {selectedPlan.price},00
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default CustomerForm;