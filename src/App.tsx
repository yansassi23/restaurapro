import React, { useState } from 'react';
import { supabase } from './lib/supabase';
import { Plan } from './types/Plan';
import Header from './components/Header';
import Hero from './components/Hero';
import HowItWorks from './components/HowItWorks';
import Testimonials from './components/Testimonials';
import PlanSelection from './components/PlanSelection';
import UploadSection from './components/UploadSection';
import CustomerForm, { CustomerData } from './components/CustomerForm';
import PaymentSection from './components/PaymentSection';
import Success from './components/Success';
import Footer from './components/Footer';

type Step = 'landing' | 'planSelection' | 'upload' | 'form' | 'payment' | 'success';

function App() {
  const [currentStep, setCurrentStep] = useState<Step>('landing');
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [customerData, setCustomerData] = useState<CustomerData | null>(null);
  const [orderNumber] = useState(() => {
    // Try to get order number from URL first, then generate new one
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('order') || Math.random().toString(36).substr(2, 9).toUpperCase();
  });

  const handleStartClick = () => {
    setCurrentStep('planSelection');
  };

  const handlePlanSelect = (plan: Plan) => {
    setSelectedPlan(plan);
    setSelectedFiles([]); // Reset files when plan changes
    setCurrentStep('upload');
    // Scroll to upload section
    setTimeout(() => {
      document.getElementById('upload')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handleFilesSelect = (files: File[]) => {
    setSelectedFiles(files);
  };

  const handleUploadNext = () => {
    if (selectedFiles.length === selectedPlan?.images) {
      setCurrentStep('form');
    }
  };

  const handleFormSubmit = (data: CustomerData) => {
    handleSupabaseSubmit(data);
  };

  const handleSupabaseSubmit = async (data: CustomerData) => {
    if (!selectedFiles.length || !selectedPlan || selectedFiles.length !== selectedPlan.images) return;

    try {
      // 1. Insert customer data first
      const { data: customerRecord, error: insertError } = await supabase
        .from('customers')
        .insert({
          name: data.name,
          email: data.email,
          phone: data.phone,
          delivery_method: data.deliveryMethod,
          order_number: orderNumber,
          plan_id: selectedPlan.id,
          plan_name: selectedPlan.name,
          plan_price: selectedPlan.price,
          plan_images: selectedPlan.images,
          image_count: selectedFiles.length
        })
        .select()
        .single();

      if (insertError) {
        console.error('Error inserting customer:', insertError);
        alert('Erro ao salvar dados. Tente novamente.');
        return;
      }

      // 2. Upload all images to Supabase Storage
      const imageUrls: string[] = [];
      
      for (let i = 0; i < selectedFiles.length; i++) {
        const file = selectedFiles[i];
        const fileExt = file.name.split('.').pop();
        const fileName = `${customerRecord.id}/image_${i + 1}.${fileExt}`;
        
        const { error: uploadError } = await supabase.storage
          .from('photos')
          .upload(fileName, file);

        if (uploadError) {
          console.error(`Error uploading image ${i + 1}:`, uploadError);
          alert(`Erro ao fazer upload da imagem ${i + 1}. Tente novamente.`);
          return;
        }

        // Get public URL for the uploaded image
        const { data: urlData } = supabase.storage
          .from('photos')
          .getPublicUrl(fileName);

        imageUrls.push(urlData.publicUrl);
      }

      // 3. Update customer record with image URLs
      const { error: updateError } = await supabase
        .from('customers')
        .update({ image_url: imageUrls })
        .eq('id', customerRecord.id);

      if (updateError) {
        console.error('Error updating image URLs:', updateError);
        // Continue anyway since the main data is saved
      }

      // 4. Set customer data with image URLs and proceed
      const customerDataWithImage: CustomerData = {
        ...data,
        imageUrls: imageUrls,
        id: customerRecord.id
      };

      setCustomerData(customerDataWithImage);
      setCurrentStep('payment');

    } catch (error) {
      console.error('Unexpected error:', error);
      alert('Erro inesperado. Tente novamente.');
    }
  };

  const handlePaymentSuccess = () => {
    setCurrentStep('success');
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 'planSelection':
        return <PlanSelection onSelectPlan={handlePlanSelect} />;
      case 'upload':
        return (
          <UploadSection
            onFilesSelect={handleFilesSelect}
            selectedFiles={selectedFiles}
            maxFiles={selectedPlan?.images || 1}
            onNext={handleUploadNext}
          />
        );
      case 'form':
        return <CustomerForm onSubmit={handleFormSubmit} selectedPlan={selectedPlan!} />;
      case 'payment':
        return (
          <PaymentSection
            customerData={customerData!}
            selectedFiles={selectedFiles}
            selectedPlan={selectedPlan!}
            onPaymentSuccess={handlePaymentSuccess}
          />
        );
      case 'success':
        return (
          <Success
            customerData={customerData!}
            selectedPlan={selectedPlan!}
            orderNumber={orderNumber}
          />
        );
      default:
        return (
          <>
            <Hero onStartClick={handleStartClick} />
            <HowItWorks />
            <Testimonials />
          </>
        );
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />
      {renderCurrentStep()}
      {currentStep !== 'success' && <Footer />}
    </div>
  );
}

export default App;