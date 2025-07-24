import React from 'react';
import { CheckCircle, Clock, Mail, MessageCircle } from 'lucide-react';
import { CustomerData } from './CustomerForm';
import { Plan } from '../types/Plan';

interface SuccessProps {
  customerData: CustomerData;
  selectedPlan: Plan;
  orderNumber: string;
}

const Success = ({ customerData, selectedPlan, orderNumber }: SuccessProps) => {
  return (
    <section className="py-20 bg-gradient-to-br from-green-50 to-blue-50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="mb-6">
            <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
              Pedido Recebido!
            </h2>
            <p className="text-xl text-gray-600">
              Aguardando confirmação do pagamento
            </p>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
            <p className="text-green-800 font-semibold mb-2">
              Número do pedido: #{orderNumber}
            </p>
            <p className="text-blue-800 font-medium mb-2">
              Plano: {selectedPlan.name} • {selectedPlan.images} {selectedPlan.images === 1 ? 'foto' : 'fotos'} • R$ {selectedPlan.price},00
            </p>
            <p className="text-green-700 font-medium">
              ✅ Pagamento confirmado com sucesso!
            </p>
            <p className="text-blue-700 mt-2">
              Guarde este número para acompanhar seu pedido. Nossa equipe iniciará a restauração em breve.
            </p>
            {customerData.imageUrl && (
              <div className="mt-4">
                <p className="text-blue-800 font-medium mb-2">Sua foto foi salva com sucesso:</p>
                {customerData.imageUrls && customerData.imageUrls.length > 0 && (
                  <div className="flex flex-wrap justify-center gap-2">
                    {customerData.imageUrls.map((url, index) => (
                      <img 
                        key={index}
                        src={url} 
                        alt={`Foto enviada ${index + 1}`} 
                        className="w-20 h-20 object-cover rounded-lg border"
                      />
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="text-left">
              <h3 className="font-semibold text-gray-900 mb-3">Seus dados:</h3>
              <p className="text-gray-600">{customerData.name}</p>
              <p className="text-gray-600">{customerData.email}</p>
              <p className="text-gray-600">{customerData.phone}</p>
            </div>
            
            <div className="text-left">
              <h3 className="font-semibold text-gray-900 mb-3">Entrega:</h3>
              <div className="space-y-2">
                {customerData.deliveryMethod.includes('email') && (
                  <div className="flex items-center space-x-2 text-gray-600">
                    <Mail className="h-4 w-4" />
                    <span>Por Email</span>
                  </div>
                )}
                {customerData.deliveryMethod.includes('whatsapp') && (
                  <div className="flex items-center space-x-2 text-gray-600">
                    <MessageCircle className="h-4 w-4" />
                    <span>Por WhatsApp</span>
                  </div>
                )}
              </div>
              <div className="flex items-center space-x-2 text-gray-600 mt-1">
                <Clock className="h-4 w-4" />
                <span>Em até 24 horas</span>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h3 className="font-semibold text-blue-900 mb-2">Próximos passos:</h3>
            <ul className="text-blue-800 text-left space-y-2">
              <li>• ✅ Pagamento confirmado com sucesso</li>
              <li>• Nossa equipe iniciará a restauração das suas {selectedPlan.images} {selectedPlan.images === 1 ? 'foto' : 'fotos'}</li>
              <li>• {selectedPlan.images === 1 ? 'A foto restaurada' : 'As fotos restauradas'} {selectedPlan.images === 1 ? 'será enviada' : 'serão enviadas'} em até 24h</li>
              <li>• Em caso de dúvidas, entre em contato conosco</li>
            </ul>
          </div>

          <div className="mt-8">
            <button
              onClick={() => window.location.reload()}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3 rounded-lg transition-colors"
            >
              Fazer Novo Pedido
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Success;