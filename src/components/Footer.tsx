import React from 'react';
import { Camera } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <Camera className="h-8 w-8 text-blue-400" />
              <span className="text-2xl font-bold">Restaure PRO</span>
            </div>
            <p className="text-gray-400">
              Especializados em restauração de fotos antigas com tecnologia avançada e cuidado artesanal.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Serviços</h3>
            <ul className="space-y-2 text-gray-400">
              <li>Restauração de fotos</li>
              <li>Colorização</li>
              <li>Remoção de riscos</li>
              <li>Melhoria de qualidade</li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Garantias</h3>
            <ul className="space-y-2 text-gray-400">
              <li>✓ Satisfação garantida</li>
              <li>✓ Entrega em 24h</li>
              <li>✓ Pagamento seguro</li>
              <li>✓ Suporte completo</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2025 Restaure PRO. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;