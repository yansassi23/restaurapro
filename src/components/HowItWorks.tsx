import React from 'react';
import { Upload, Wand2, Download, MessageCircle } from 'lucide-react';

const HowItWorks = () => {
  const steps = [
    {
      icon: Upload,
      title: "1. Envie sua foto",
      description: "Faça upload da sua foto antiga que precisa ser restaurada"
    },
    {
      icon: Wand2,
      title: "2. Restauração profissional",
      description: "Nossa equipe trabalha na restauração com tecnologia avançada"
    },
    {
      icon: Download,
      title: "3. Receba o resultado",
      description: "Sua foto restaurada chega em até 24h por email ou WhatsApp"
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Como Funciona
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Processo simples e rápido para dar nova vida às suas fotos antigas
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <step.icon className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">{step.title}</h3>
              <p className="text-gray-600">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;