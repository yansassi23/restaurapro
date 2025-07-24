import React, { useState } from 'react';
import { supabase } from './lib/supabase';
import Header from './components/Header';
import Hero from './components/Hero';
import HowItWorks from './components/HowItWorks';
import Testimonials from './components/Testimonials';
import UploadSection from './components/UploadSection';
import CustomerForm, { CustomerData } from './components/CustomerForm';
import PaymentSection from './components/PaymentSection';
import Success from './components/Success';
import Footer from './components/Footer';

type Step = 'landing' | 'upload' | 'form' | 'payment' | 'success';

function App() {
  const [currentStep, setCurrentStep] = useState<Step>('landing');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [customerData, setCustomerData] = useState<CustomerData | null>(null);
  const [orderNumber] = useState(() => {
    // Try to get order number from URL first, then generate new one
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('order') || Math.random().toString(36).substr(2, 9).toUpperCase();
  });

  const handleStartClick = () => {
    setCurrentStep('upload');
    // Scroll to upload section
    setTimeout(() => {
      document.getElementById('upload')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handleFileSelect = (file: File) => {
    setSelectedFile(file);
  };

  const handleUploadNext = () => {
    if (selectedFile) {
      setCurrentStep('form');
    }
  };

  const handleFormSubmit = (data: CustomerData) => {
    handleSupabaseSubmit(data);
  };

  const handleSupabaseSubmit = async (data: CustomerData) => {
    if (!selectedFile) return;

    try {
      // 1. Insert customer data first
      const { data: customerRecord, error: insertError } = await supabase
        .from('customers')
        .insert({
          name: data.name,
          email: data.email,
          phone: data.phone,
          delivery_method: data.deliveryMethod,
          order_number: orderNumber
        })
        .select()
        .single();

      if (insertError) {
        console.error('Error inserting customer:', insertError);
        alert('Erro ao salvar dados. Tente novamente.');
        return;
      }

      // 2. Upload image to Supabase Storage
      const fileExt = selectedFile.name.split('.').pop();
      const fileName = `${customerRecord.id}/original.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('photos')
        .upload(fileName, selectedFile);

      if (uploadError) {
        console.error('Error uploading image:', uploadError);
        alert('Erro ao fazer upload da imagem. Tente novamente.');
        return;
      }

      // 3. Get public URL for the uploaded image
      const { data: urlData } = supabase.storage
        .from('photos')
        .getPublicUrl(fileName);

      // 4. Update customer record with image URL
      const { error: updateError } = await supabase
        .from('customers')
        .update({ image_url: urlData.publicUrl })
        .eq('id', customerRecord.id);

      if (updateError) {
        console.error('Error updating image URL:', updateError);
        // Continue anyway since the main data is saved
      }

      // 5. Set customer data with image URL and proceed
      const customerDataWithImage: CustomerData = {
        ...data,
        imageUrl: urlData.publicUrl,
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
      case 'upload':
        return (
          <UploadSection
            onFileSelect={handleFileSelect}
            selectedFile={selectedFile}
            onNext={handleUploadNext}
          />
        );
      case 'form':
        return <CustomerForm onSubmit={handleFormSubmit} />;
      case 'payment':
        return (
          <PaymentSection
            customerData={customerData!}
            selectedFile={selectedFile!}
            onPaymentSuccess={handlePaymentSuccess}
          />
        );
      case 'success':
        return (
          <Success
            customerData={customerData!}
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