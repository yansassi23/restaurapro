export interface Plan {
  id: string;
  name: string;
  images: number;
  price: number;
  originalPrice?: number;
  popular?: boolean;
  paymentLink: string;
  features: string[];
}

export const PLANS: Plan[] = [
  {
    id: 'basic',
    name: 'Básico',
    images: 1,
    price: 7,
    paymentLink: 'https://pay.cakto.com.br/n2typzf_493515',
    features: [
      '1 foto restaurada',
      'Entrega em 24h',
      'Qualidade profissional'
    ]
  },
  {
    id: 'popular',
    name: 'Popular',
    images: 2,
    price: 10,
    originalPrice: 14,
    popular: true,
    paymentLink: 'https://pay.cakto.com.br/grgkdny_493628',
    features: [
      '2 fotos restauradas',
      'Entrega em 24h',
      'Qualidade profissional',
      'Economia de R$ 4'
    ]
  },
  {
    id: 'premium',
    name: 'Premium',
    images: 5,
    price: 20,
    originalPrice: 35,
    paymentLink: 'https://pay.cakto.com.br/3agd883_493630',
    features: [
      '5 fotos restauradas',
      'Entrega em 24h',
      'Qualidade profissional',
      'Economia de R$ 15',
      'Melhor custo-benefício'
    ]
  }
];