import React, { useState } from 'react';
import { Check, Star, ArrowRight } from 'lucide-react';
import { Plan, PLANS } from '../types/Plan';

interface PlanSelectionProps {
  onSelectPlan: (plan: Plan) => void;
}

const PlanSelection = ({ onSelectPlan }: PlanSelectionProps) => {
  const handlePlanSelect = (plan: Plan) => {
    onSelectPlan(plan);
  };

  return (
    <section className="py-20 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Star className="h-4 w-4" />
            <span>Escolha seu Plano</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Selecione quantas fotos
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent block">
              deseja restaurar
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Quanto mais fotos, maior a economia. Todos os planos incluem qualidade profissional e entrega em 24h.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {PLANS.map((plan) => (
            <div
              key={plan.id}
              className={`relative bg-white rounded-2xl shadow-lg transition-all duration-300 cursor-pointer transform hover:-translate-y-2 hover:shadow-xl ${
                plan.popular ? 'border-2 border-blue-500' : 'border border-gray-200'
              }`}
              onClick={() => handlePlanSelect(plan)}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-2 rounded-full text-sm font-bold shadow-lg">
                    MAIS POPULAR
                  </div>
                </div>
              )}

              <div className="p-8">
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                  <div className="flex items-center justify-center space-x-2">
                    <span className="text-4xl font-bold text-gray-900">R$ {plan.price}</span>
                    {plan.originalPrice && (
                      <span className="text-lg text-gray-500 line-through">R$ {plan.originalPrice}</span>
                    )}
                  </div>
                  <p className="text-gray-600 mt-2">
                    {plan.images} {plan.images === 1 ? 'foto' : 'fotos'} • R$ {(plan.price / plan.images).toFixed(2)} por foto
                  </p>
                </div>

                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-center space-x-3">
                      <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>

                <div className="w-full py-3 px-4 rounded-lg font-semibold text-center transition-colors bg-blue-600 text-white hover:bg-blue-700">
                  Escolher {plan.name}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PlanSelection;