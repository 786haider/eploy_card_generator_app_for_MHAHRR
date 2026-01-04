'use client';

import React, { useState, useRef, ChangeEvent } from 'react';
import { Download, RotateCcw, User } from 'lucide-react';

// Renamed to avoid conflict with built-in FormData type
type EmployeeData = {
  name: string;
  designation: string;
  idNo: string;
  email: string;
  phone: string;
  joinDate: string;
  expiryDate: string;
  photo: string | null;
};

export default function EmployeeCardGenerator1() {
  const [formData, setFormData] = useState<EmployeeData>({
    name: '',
    designation: '',
    idNo: '',
    email: '',
    phone: '',
    joinDate: '',
    expiryDate: '',
    photo: null
  });
  
  const [showCard, setShowCard] = useState<boolean>(false);
  const [showBack, setShowBack] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePhotoUpload = (e: ChangeEvent<HTMLInputElement>): void => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, photo: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGenerateCard = (): void => {
    if (formData.name && formData.designation && formData.idNo && 
        formData.email && formData.phone && formData.joinDate && formData.expiryDate) {
      setShowCard(true);
      setShowBack(false);
    } else {
      alert('Please fill all required fields');
    }
  };

  const handleReset = (): void => {
    setFormData({
      name: '',
      designation: '',
      idNo: '',
      email: '',
      phone: '',
      joinDate: '',
      expiryDate: '',
      photo: null
    });
    setShowCard(false);
    setShowBack(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDownload = (): void => {
    const side = showBack ? 'Back' : 'Front';
    alert(`To download the ${side} side:\n\n1. Right-click on the card\n2. Select "Save image as..." or take a screenshot\n3. Or press Ctrl+Shift+S (Windows) or Cmd+Shift+4 (Mac)\n\nTip: Download both Front and Back sides separately!`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-teal-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-green-800 mb-2">MHAHRR Naturals</h1>
          <p className="text-gray-600">Employee ID Card Generator</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Form Section */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-semibold text-green-700 mb-6">Employee Details</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Employee Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="e.g., HAIDER HUSSAIN"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Designation *
                </label>
                <input
                  type="text"
                  name="designation"
                  value={formData.designation}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="e.g., CEO HEAD OFFICE"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  ID Number *
                </label>
                <input
                  type="text"
                  name="idNo"
                  value={formData.idNo}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="e.g., 1234567890"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="e.g., hello@realitygreatestate.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone *
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="e.g., +123-456-7890"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Join Date *
                  </label>
                  <input
                    type="text"
                    name="joinDate"
                    value={formData.joinDate}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="MM/DD/YYYY"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Expiry Date *
                  </label>
                  <input
                    type="text"
                    name="expiryDate"
                    value={formData.expiryDate}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="MM/DD/YYYY"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Employee Photo *
                </label>
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                />
                <p className="text-xs text-gray-500 mt-1">Upload a professional photo</p>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={handleGenerateCard}
                  className="flex-1 bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors font-medium"
                >
                  Generate Card
                </button>
                <button
                  onClick={handleReset}
                  className="flex items-center gap-2 bg-gray-500 text-white py-2 px-4 rounded-md hover:bg-gray-600 transition-colors"
                >
                  <RotateCcw size={16} />
                  Reset
                </button>
              </div>
            </div>
          </div>

          {/* Card Preview Section */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-semibold text-green-700 mb-6">Card Preview</h2>
            
            {showCard ? (
              <div className="space-y-4">
                <div className="flex justify-center gap-4 mb-4">
                  <button
                    onClick={() => setShowBack(false)}
                    className={`px-4 py-2 rounded-md transition-colors ${!showBack ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-700'}`}
                  >
                    Front
                  </button>
                  <button
                    onClick={() => setShowBack(true)}
                    className={`px-4 py-2 rounded-md transition-colors ${showBack ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-700'}`}
                  >
                    Back
                  </button>
                </div>

                <div id="employee-card" className="relative mx-auto" style={{ width: '340px', height: '540px' }}>
                  {!showBack ? (
                    <div className="w-full h-full bg-white rounded-2xl shadow-2xl overflow-hidden relative">
                      <div className="relative h-48" style={{background: 'linear-gradient(135deg, #86efac 0%, #4ade80 50%, #22c55e 100%)'}}>
                        <div className="absolute top-0 right-0" style={{
                          width: 0,
                          height: 0,
                          borderTop: '100px solid #16a34a',
                          borderLeft: '100px solid transparent'
                        }}></div>
                        
                        <div className="absolute  left-3  px-2 py-1 rounded" style={{maxWidth: '140px'}}>
                          <img 
                            src="/logowobg.png"
                            alt="Company Logo" 
                            className="w-full h-auto"
                            style={{display: 'block'}}
                          />
                        </div>

                        <div className="absolute left-1/2 transform -translate-x-1/2 top-20">
                          <div className="w-32 h-32 rounded-full border-4 border-blue-500 overflow-hidden bg-white">
                            {formData.photo ? (
                              <img src={formData.photo} alt="Employee" className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center bg-gray-100">
                                <User size={48} className="text-gray-400" />
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="pt-20 px-6 text-center">
                        <h3 className="text-xl font-bold text-gray-900 mb-1">{formData.name}</h3>
                        <p className="text-sm text-gray-600 mb-6">{formData.designation}</p>

                        <div className="space-y-2 text-left text-sm">
                          <div className="flex">
                            <span className="font-semibold w-20">ID No</span>
                            <span className="text-gray-700">: {formData.idNo}</span>
                          </div>
                          <div className="flex">
                            <span className="font-semibold w-20">E-mail</span>
                            <span className="text-gray-700 break-all">: {formData.email}</span>
                          </div>
                          <div className="flex">
                            <span className="font-semibold w-20">Phone</span>
                            <span className="text-gray-700">: {formData.phone}</span>
                          </div>
                        </div>
                      </div>

                      <div className="absolute bottom-0 left-0 right-0 h-20" style={{background: 'linear-gradient(135deg, #16a34a 0%, #15803d 100%)'}}>
                        <div className="absolute bottom-0 right-0" style={{
                          width: 0,
                          height: 0,
                          borderBottom: '70px solid #14532d',
                          borderLeft: '70px solid transparent'
                        }}></div>
                      </div>
                    </div>
                  ) : (
                    <div className="w-full h-full bg-white rounded-2xl shadow-2xl overflow-hidden relative">
                      <div className="relative h-24" style={{background: 'linear-gradient(135deg, #86efac 0%, #4ade80 50%, #22c55e 100%)'}}>
                        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-32 h-8 bg-white rounded-t-3xl"></div>
                        
                        <div className="absolute top-3 left-1/2 transform -translate-x-1/2 mt-5 px-2 py-1 rounded" style={{maxWidth: '120px'}}>
                          <img 
                            src="/logowobg.png"
                            alt="Company Logo" 
                            className="w-full h-auto"
                            style={{display: 'block'}}
                          />
                        </div>
                      </div>

                      <div className="px-6 py-6">
                        <h4 className="text-center font-bold text-base mb-4">TERMS & CONDITIONS</h4>
                        
                        <ul className="space-y-2 text-xs text-gray-700">
                          <li className="flex gap-2">
                            <span className="font-bold">•</span>
                            <span><strong>Identification:</strong> Carry the ID card at all times during working hours for identification purposes.</span>
                          </li>
                          <li className="flex gap-2">
                            <span className="font-bold">•</span>
                            <span><strong>Authorized Use:</strong> The ID card is solely for official use and should not be shared or used for unauthorized purposes.</span>
                          </li>
                        </ul>

                        <div className="mt-4 pt-3 border-t border-gray-300">
                          <p className="text-xs text-center text-gray-600 leading-relaxed">
                            This card is the property of MHAHRR Naturals. If you found this please contact on <span className="font-semibold">mhahrrnaturals@gmail.com</span>
                          </p>
                        </div>

                        <div className="mt-4 pt-3 space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="font-semibold">Join</span>
                            <span>: {formData.joinDate}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="font-semibold">Expire</span>
                            <span>: {formData.expiryDate}</span>
                          </div>
                        </div>

                        <div className="mt-6 pt-4 border-t border-gray-300">
                          <p className="text-xs font-semibold text-gray-700 mb-2">Authorized Signature</p>
                          <div className="border-b-2 border-gray-400 h-10"></div>
                        </div>
                      </div>

                      <div className="absolute bottom-0 left-0 right-0 h-16" style={{background: 'linear-gradient(135deg, #16a34a 0%, #15803d 100%)'}}>
                        <div className="absolute bottom-0 right-0" style={{
                          width: 0,
                          height: 0,
                          borderBottom: '60px solid #14532d',
                          borderLeft: '60px solid transparent'
                        }}></div>
                      </div>
                    </div>
                  )}
                </div>

                <button
                  onClick={handleDownload}
                  className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 transition-colors mt-4 font-medium"
                >
                  <Download size={20} />
                  Download Card ({showBack ? 'Back' : 'Front'} Side)
                </button>
                
                <div className="text-center text-sm text-gray-600 mt-2">
                  <p>💡 Tip: Download both front and back sides separately</p>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-96 text-gray-400">
                <div className="text-center">
                  <User size={64} className="mx-auto mb-4 opacity-30" />
                  <p>Fill the form and click &quot;Generate Card&quot; to preview</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}