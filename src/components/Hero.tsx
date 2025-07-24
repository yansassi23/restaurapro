import React from 'react';
import { Shield, Clock, Award, ArrowRight, Sparkles } from 'lucide-react';
import ImageComparisonSlider from './ImageComparisonSlider';

interface HeroProps {
  onStartClick: () => void;
}

const Hero = ({ onStartClick }: HeroProps) => {
  return (
    <section className="relative bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] -z-10"></div>
      <div className="absolute top-0 right-0 -translate-y-12 translate-x-12">
        <div className="w-72 h-72 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-3xl"></div>
      </div>
      <div className="absolute bottom-0 left-0 translate-y-12 -translate-x-12">
        <div className="w-72 h-72 bg-gradient-to-br from-indigo-400/20 to-cyan-400/20 rounded-full blur-3xl"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
        {/* Interactive Before/After Comparison - First Thing Visible */}
        <div className="relative mb-20">
          <div className="text-center mb-12">
            <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Sparkles className="h-4 w-4" />
              <span>Veja a Transformação</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Resultados <span className="text-blue-600">Reais</span> de Nossos Clientes
            </h2>
            <p className="text-lg text-gray-600">
              Arraste para ver o resultado • Exemplo real de cliente
            </p>
          </div>
          
          <ImageComparisonSlider
            beforeImage="/fotoantiga.jpg"
            afterImage="/restaurada.jpg"
            beforeLabel="ANTES"
            afterLabel="DEPOIS"
          />
        </div>

        {/* Main content */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 px-4 py-2 rounded-full text-sm font-medium mb-8">
            <Award className="h-4 w-4" />
            <span>Satisfação Garantida • Entrega 24h</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-8 leading-tight">
            Reviva suas
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent block">
              Memórias
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-4xl mx-auto leading-relaxed">
            Transforme suas fotos antigas e desbotadas em lembranças vibrantes com nossa 
            tecnologia avançada de restauração e o cuidado de especialistas.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
            <div className="flex items-center space-x-3 bg-white/80 backdrop-blur-sm px-6 py-3 rounded-full shadow-sm">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <Shield className="h-5 w-5 text-green-600" />
              <span className="font-medium text-gray-700">100% Seguro</span>
            </div>
            <div className="flex items-center space-x-3 bg-white/80 backdrop-blur-sm px-6 py-3 rounded-full shadow-sm">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
              <Clock className="h-5 w-5 text-blue-600" />
              <span className="font-medium text-gray-700">Entrega em 24h</span>
            </div>
            <div className="flex items-center space-x-3 bg-white/80 backdrop-blur-sm px-6 py-3 rounded-full shadow-sm">
              <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
              <Award className="h-5 w-5 text-purple-600" />
              <span className="font-medium text-gray-700">Satisfação Garantida</span>
            </div>
          </div>

          <button
            onClick={onStartClick}
            className="group relative inline-flex items-center space-x-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white text-xl font-semibold px-10 py-5 rounded-2xl transition-all duration-300 shadow-lg hover:shadow-2xl transform hover:-translate-y-1"
          >
            <span>Restaurar Minha Foto</span>
            <div className="flex items-center space-x-2">
              <span className="text-lg">•</span>
              <span className="bg-white/20 px-3 py-1 rounded-full text-sm">R$ 5,00</span>
            </div>
            <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </button>
          
          <p className="text-sm text-gray-500 mt-6">
            Pagamento seguro • Sem mensalidades • Garantia de satisfação
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-20 max-w-4xl mx-auto">
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">2.847+</div>
            <div className="text-gray-600">Fotos Restauradas</div>
          </div>
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">4.9★</div>
            <div className="text-gray-600">Avaliação Média</div>
          </div>
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">24h</div>
            <div className="text-gray-600">Tempo de Entrega</div>
          </div>
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">100%</div>
            <div className="text-gray-600">Satisfação</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;