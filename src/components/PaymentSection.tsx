import React, { useState } from 'react';
import { Shield, Clock, CheckCircle, ExternalLink, Loader2 } from 'lucide-react';
import { CustomerData } from './CustomerForm';
import { Plan } from '../types/Plan';
import { supabase } from '../lib/supabase';

interface PaymentSectionProps {
  customerData: CustomerData;
  selectedFiles: File[];
  selectedPlan: Plan;
  onPaymentSuccess: () => void;
}

const PaymentSection = ({ customerData, selectedFiles, selectedPlan, onPaymentSuccess }: PaymentSectionProps) => {
  const [isCheckingPayment, setIsCheckingPayment] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<'pending' | 'confirmed' | 'failed'>('pending');
  const [statusMessage, setStatusMessage] = useState('');

  // Get order number from URL or generate one
  const getOrderNumber = () => {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('order') || Math.random().toString(36).substr(2, 9).toUpperCase();
  };

  const orderNumber = getOrderNumber();

  const checkPaymentStatus = async () => {
    try {
      const { data, error } = await supabase
        .from('customers')
        .select('payment_status')
        .eq('order_number', orderNumber)
        .single();

      if (error) {
        console.error('Error checking payment status:', error);
        setStatusMessage('Erro ao verificar status do pagamento');
        return 'pending';
      }

      return data?.payment_status || 'pending';
    } catch (error) {
      console.error('Error checking payment status:', error);
      return 'pending';
    }
  };

  const startPaymentPolling = () => {
    setIsCheckingPayment(true);
    setStatusMessage('Verificando confirmação do pagamento...');

    const pollInterval = setInterval(async () => {
      const status = await checkPaymentStatus();
      setPaymentStatus(status);

      if (status === 'confirmed') {
        clearInterval(pollInterval);
        setIsCheckingPayment(false);
        setStatusMessage('Pagamento confirmado! Redirecionando...');
        setTimeout(() => {
          onPaymentSuccess();
        }, 1500);
      } else if (status === 'failed') {
        clearInterval(pollInterval);
        setIsCheckingPayment(false);
        setStatusMessage('Pagamento não foi confirmado. Tente novamente ou entre em contato.');
      }
    }, 3000); // Check every 3 seconds

    // Stop polling after 5 minutes
    setTimeout(() => {
      clearInterval(pollInterval);
      if (isCheckingPayment) {
        setIsCheckingPayment(false);
        setStatusMessage('Tempo limite excedido. Clique em "Verificar Pagamento" para tentar novamente.');
      }
    }, 300000); // 5 minutes
  };

  const handleContinue = () => {
    startPaymentPolling();
  };

  const handleManualCheck = async () => {
    setIsCheckingPayment(true);
    setStatusMessage('Verificando status do pagamento...');
    
    const status = await checkPaymentStatus();
    setPaymentStatus(status);
    
    if (status === 'confirmed') {
      setStatusMessage('Pagamento confirmado! Redirecionando...');
      setTimeout(() => {
        onPaymentSuccess();
      }, 1500);
    } else if (status === 'failed') {
      setStatusMessage('Pagamento não foi confirmado. Verifique se o pagamento foi processado.');
    } else {
      setStatusMessage('Pagamento ainda pendente. Aguarde alguns instantes e tente novamente.');
    }
    
    setIsCheckingPayment(false);
  };

  return (
    <section className="py-20 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Finalizar Pedido
          </h2>
          <p className="text-xl text-gray-600">
            Pagamento seguro e garantido
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          {/* Pagamento */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">
              <ExternalLink className="h-6 w-6 inline mr-2" />
              Pagamento
            </h3>

            <div className="space-y-6">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-blue-800 text-sm">
                  <Shield className="h-4 w-4 inline mr-1" />
                  Após completar o pagamento de R$ {selectedPlan.price},00 para {selectedPlan.images} {selectedPlan.images === 1 ? 'foto' : 'fotos'}, clique no botão abaixo
                </p>
              </div>

              {/* Iframe do Cakto */}
              <div className="border border-gray-300 rounded-lg overflow-hidden">
                <iframe
                  src={selectedPlan.paymentLink}
                  width="100%"
                  height="900"
                  frameBorder="0"
                  title="Pagamento Cakto"
                  className="w-full"
                />
              </div>

              {/* Status Messages */}
              {statusMessage && (
                <div className={`border rounded-lg p-4 ${
                  paymentStatus === 'confirmed' 
                    ? 'bg-green-50 border-green-200' 
                    : paymentStatus === 'failed'
                    ? 'bg-red-50 border-red-200'
                    : 'bg-yellow-50 border-yellow-200'
                }`}>
                  <p className={`text-sm flex items-center ${
                    paymentStatus === 'confirmed' 
                      ? 'text-green-800' 
                      : paymentStatus === 'failed'
                      ? 'text-red-800'
                      : 'text-yellow-800'
                  }`}>
                    {isCheckingPayment && <Loader2 className="h-4 w-4 inline mr-2 animate-spin" />}
                    {paymentStatus === 'confirmed' && <CheckCircle className="h-4 w-4 inline mr-2" />}
                    {!isCheckingPayment && paymentStatus === 'pending' && <Clock className="h-4 w-4 inline mr-2" />}
                    {statusMessage}
                  </p>
                </div>
              )}

              {!statusMessage && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <p className="text-yellow-800 text-sm">
                    <Clock className="h-4 w-4 inline mr-1" />
                    Após completar o pagamento acima, clique no botão abaixo para verificar a confirmação
                  </p>
                </div>
              )}

              <div className="space-y-3">
                <button
                  onClick={handleContinue}
                  disabled={isCheckingPayment || paymentStatus === 'confirmed'}
                  className="w-full bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white font-semibold py-4 rounded-lg transition-colors flex items-center justify-center"
                >
                  {isCheckingPayment ? (
                    <>
                      <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                      Verificando Pagamento...
                    </>
                  ) : paymentStatus === 'confirmed' ? (
                    <>
                      <CheckCircle className="h-5 w-5 mr-2" />
                      Pagamento Confirmado
                    </>
                  ) : (
                    'Já Paguei / Verificar Confirmação'
                  )}
                </button>

                {(statusMessage && paymentStatus !== 'confirmed') && (
                  <button
                    onClick={handleManualCheck}
                    disabled={isCheckingPayment}
                    className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium py-3 rounded-lg transition-colors"
                  >
                    {isCheckingPayment ? 'Verificando...' : 'Verificar Pagamento Novamente'}
                  </button>
                )}
              </div>

              <p className="text-xs text-gray-500 text-center">
                O sistema verificará automaticamente a confirmação do pagamento
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PaymentSection;