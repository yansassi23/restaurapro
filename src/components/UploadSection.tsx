import React, { useState, useRef } from 'react';
import { Upload, X, Check, Image } from 'lucide-react';

interface UploadSectionProps {
  onFilesSelect: (files: File[]) => void;
  selectedFiles: File[];
  maxFiles: number;
  onNext: () => void;
}

const UploadSection = ({ onFilesSelect, selectedFiles, maxFiles, onNext }: UploadSectionProps) => {
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files) {
      const files = Array.from(e.dataTransfer.files);
      const imageFiles = files.filter(file => file.type.startsWith('image/'));
      const newFiles = [...selectedFiles, ...imageFiles].slice(0, maxFiles);
      onFilesSelect(newFiles);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files) {
      const files = Array.from(e.target.files);
      const imageFiles = files.filter(file => file.type.startsWith('image/'));
      const newFiles = [...selectedFiles, ...imageFiles].slice(0, maxFiles);
      onFilesSelect(newFiles);
    }
  };

  const removeFile = (index: number) => {
    const newFiles = selectedFiles.filter((_, i) => i !== index);
    onFilesSelect(newFiles);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const addMoreFiles = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const canAddMore = selectedFiles.length < maxFiles;
  const isComplete = selectedFiles.length === maxFiles;

  return (
    <section className="py-20 bg-white" id="upload">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Envie suas {maxFiles} {maxFiles === 1 ? 'Foto' : 'Fotos'} {maxFiles === 1 ? 'Antiga' : 'Antigas'}
          </h2>
          <p className="text-xl text-gray-600">
            Aceitos: JPG, PNG, GIF • Máximo 10MB por foto
          </p>
          <div className="mt-4">
            <div className="inline-flex items-center space-x-2 bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium">
              <Image className="h-4 w-4" />
              <span>{selectedFiles.length} de {maxFiles} {maxFiles === 1 ? 'foto enviada' : 'fotos enviadas'}</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8">
          {/* Upload Area */}
          {canAddMore && (
            <div
              className={`border-2 border-dashed rounded-lg p-12 text-center transition-colors mb-6 ${
                dragActive 
                  ? 'border-blue-500 bg-blue-50' 
                  : 'border-gray-300 hover:border-blue-400'
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <Upload className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {selectedFiles.length === 0 
                  ? `Arraste suas ${maxFiles} ${maxFiles === 1 ? 'foto' : 'fotos'} aqui`
                  : `Adicione mais ${maxFiles - selectedFiles.length} ${maxFiles - selectedFiles.length === 1 ? 'foto' : 'fotos'}`
                }
              </h3>
              <p className="text-gray-500 mb-6">ou clique para selecionar</p>
              
              <button
                onClick={addMoreFiles}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg transition-colors"
              >
                {selectedFiles.length === 0 ? 'Selecionar Arquivos' : 'Adicionar Mais Fotos'}
              </button>
              
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                onChange={handleChange}
                className="hidden"
              />
            </div>
          )}

          {/* Selected Files List */}
          {selectedFiles.length > 0 && (
            <div className="space-y-4 mb-6">
              <h3 className="text-lg font-semibold text-gray-900">
                {selectedFiles.length === 1 ? 'Foto Selecionada' : 'Fotos Selecionadas'}:
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {selectedFiles.map((file, index) => (
                  <div key={index} className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-1" />
                        <div>
                          <p className="font-semibold text-green-800 text-sm">{file.name}</p>
                          <p className="text-xs text-green-600">
                            {(file.size / 1024 / 1024).toFixed(2)} MB
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => removeFile(index)}
                        className="text-gray-400 hover:text-gray-600 p-1"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                    
                    <div className="text-center">
                      <img
                        src={URL.createObjectURL(file)}
                        alt={`Preview ${index + 1}`}
                        className="max-w-full max-h-32 mx-auto rounded-lg shadow-sm object-cover"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Status and Continue Button */}
          {selectedFiles.length > 0 && (
            <div className="text-center">
              {!isComplete && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                  <p className="text-yellow-800 text-sm">
                    Você precisa enviar {maxFiles - selectedFiles.length} {maxFiles - selectedFiles.length === 1 ? 'foto a mais' : 'fotos a mais'} para continuar
                  </p>
                </div>
              )}
              
              {isComplete && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                  <p className="text-green-800 text-sm font-medium">
                    ✅ Perfeito! Todas as {maxFiles} {maxFiles === 1 ? 'foto foi enviada' : 'fotos foram enviadas'}
                  </p>
                </div>
              )}

              <button
                onClick={onNext}
                disabled={!isComplete}
                className={`font-semibold px-8 py-3 rounded-lg transition-colors ${
                  isComplete
                    ? 'bg-blue-600 hover:bg-blue-700 text-white'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                {isComplete 
                  ? `Continuar com ${selectedFiles.length === 1 ? 'esta Foto' : 'estas Fotos'}`
                  : `Envie ${maxFiles - selectedFiles.length} ${maxFiles - selectedFiles.length === 1 ? 'foto a mais' : 'fotos a mais'}`
                }
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default UploadSection;