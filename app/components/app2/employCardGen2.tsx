'use client'

import React, { useState, useRef, useEffect, ChangeEvent } from 'react';
import { Upload, Download, Users, Settings, Eye } from 'lucide-react';

interface Employee {
  name: string;
  department: string;
  idNumber: string;
  email: string;
  phone: string;
  companyName: string;
  photo: string | null;
  generatedAt: string;
}

const EmployeeIDGenerator = () => {
  const [activeTab, setActiveTab] = useState('form');
  const [companyLogo, setCompanyLogo] = useState<string | null>(null);
  const [employeePhoto, setEmployeePhoto] = useState<string | null>(null);
  const [generatedCard, setGeneratedCard] = useState(false);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [frontCardImage, setFrontCardImage] = useState<string | null>(null);
  const [backCardImage, setBackCardImage] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    department: '',
    idNumber: '',
    email: '',
    phone: '',
    companyName: 'Ginyard International Co.'
  });

  const frontCanvasRef = useRef(null);
  const backCanvasRef = useRef(null);

  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>, type: 'logo' | 'photo') => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        if (type === 'logo') {
          setCompanyLogo(result);
        } else {
          setEmployeePhoto(result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const generateCard = async () => {
    if (!employeePhoto) {
      alert('Please upload employee photo');
      return;
    }
    if (!formData.name) {
      alert('Please enter employee name');
      return;
    }
    if (!formData.department) {
      alert('Please enter department');
      return;
    }
    if (!formData.idNumber) {
      alert('Please enter ID number');
      return;
    }
    if (!formData.email) {
      alert('Please enter email');
      return;
    }
    if (!formData.phone) {
      alert('Please enter phone number');
      return;
    }

    // Generate both cards
    const frontImage = await generateFrontCard();
    const backImage = await generateBackCard();
    
    setFrontCardImage(frontImage as string);
    setBackCardImage(backImage as string);
    
    const newEmployee: Employee = {
      ...formData,
      photo: employeePhoto,
      generatedAt: new Date().toISOString()
    };
    
    setEmployees([...employees, newEmployee]);
    setGeneratedCard(true);
    setActiveTab('preview');
  };

  const generateFrontCard = (): Promise<string> => {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      
      canvas.width = 600;
      canvas.height = 950;

      // Background gradient
      const gradient = ctx.createLinearGradient(0, 0, 600, 950);
      gradient.addColorStop(0, '#6B4FB3');
      gradient.addColorStop(0.5, '#8B66C9');
      gradient.addColorStop(1, '#5B4FB3');
      
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 600, 950);

      // Top purple accent
      ctx.fillStyle = '#5B46A8';
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(150, 80);
      ctx.lineTo(0, 80);
      ctx.closePath();
      ctx.fill();

      // Bottom purple accent
      ctx.fillStyle = '#5B46A8';
      ctx.beginPath();
      ctx.moveTo(600, 950);
      ctx.lineTo(450, 870);
      ctx.lineTo(600, 870);
      ctx.closePath();
      ctx.fill();

      // White card background
      ctx.fillStyle = '#F5F5F5';
      ctx.fillRect(50, 40, 500, 870);

      // Function to continue after logo
      const continueDrawing = () => {
        if (!ctx) return;
        // Company name
        ctx.fillStyle = '#2C3E50';
        ctx.font = 'bold 30px Arial';
        ctx.textAlign = 'center';
        const nameParts = formData.companyName.split(' ');
        if (nameParts.length === 1) {
          ctx.fillText(formData.companyName, 300, 190);
        } else {
          const midPoint = Math.ceil(nameParts.length / 2);
          ctx.fillText(nameParts.slice(0, midPoint).join(' '), 300, 190);
          ctx.fillText(nameParts.slice(midPoint).join(' '), 300, 225);
        }

        // Draw dotted circle border
        ctx.strokeStyle = '#A0A0A0';
        ctx.lineWidth = 2;
        ctx.setLineDash([5, 5]);
        ctx.beginPath();
        ctx.arc(300, 400, 125, 0, Math.PI * 2);
        ctx.stroke();
        ctx.setLineDash([]);

        // Load employee photo
        const photoImg = new Image();
        photoImg.crossOrigin = 'anonymous';
        photoImg.onload = () => {
          if (!ctx) return;
          // Draw photo in circle
          ctx.save();
          ctx.beginPath();
          ctx.arc(300, 400, 110, 0, Math.PI * 2);
          ctx.closePath();
          ctx.clip();
          ctx.drawImage(photoImg, 190, 290, 220, 220);
          ctx.restore();

          // Employee name
          ctx.fillStyle = '#000000';
          ctx.font = 'bold 38px Arial';
          ctx.textAlign = 'center';
          const nameText = formData.name.toUpperCase();
          ctx.fillText(nameText, 300, 590);

          // Department
          ctx.fillStyle = '#000000';
          ctx.font = 'bold 26px Arial';
          const deptText = formData.department.toUpperCase();
          ctx.fillText(deptText, 300, 680);

          // Underline
          ctx.fillStyle = '#000000';
          ctx.fillRect(190, 700, 220, 4);

          // ID Number
          ctx.fillStyle = '#666666';
          ctx.font = '22px Arial';
          const idText = 'ID ' + formData.idNumber;
          ctx.fillText(idText, 300, 750);

          // Barcode
          drawBarcode(ctx, 150, 780, 300, 60);
          
          resolve(canvas.toDataURL('image/png'));
        };
        photoImg.onerror = () => {
          console.error('Failed to load employee photo');
          resolve(canvas.toDataURL('image/png'));
        };
        if (employeePhoto) photoImg.src = employeePhoto;
      };

      // Load and draw company logo
      if (companyLogo) {
        const logoImg = new Image();
        logoImg.crossOrigin = 'anonymous';
        logoImg.onload = () => {
          if (!ctx) return;
          ctx.save();
          ctx.beginPath();
          ctx.arc(300, 110, 45, 0, Math.PI * 2);
          ctx.closePath();
          ctx.clip();
          ctx.drawImage(logoImg, 255, 65, 90, 90);
          ctx.restore();
          continueDrawing();
        };
        logoImg.onerror = () => {
          console.error('Failed to load logo');
          continueDrawing();
        };
        logoImg.src = companyLogo;
      } else {
        if (!ctx) return;
        // Draw default logo
        ctx.fillStyle = '#2C3E50';
        ctx.beginPath();
        ctx.arc(285, 95, 12, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(315, 95, 12, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(285, 125, 12, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(315, 125, 12, 0, Math.PI * 2);
        ctx.fill();
        
        continueDrawing();
      }
    });
  };

  const generateBackCard = (): Promise<string> => {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      
      canvas.width = 600;
      canvas.height = 950;

      // Background gradient
      const gradient = ctx.createLinearGradient(0, 0, 600, 950);
      gradient.addColorStop(0, '#6B4FB3');
      gradient.addColorStop(0.5, '#8B66C9');
      gradient.addColorStop(1, '#5B4FB3');
      
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 600, 950);

      // Top purple accent
      ctx.fillStyle = '#5B46A8';
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(150, 80);
      ctx.lineTo(0, 80);
      ctx.closePath();
      ctx.fill();

      // Bottom purple accent
      ctx.fillStyle = '#5B46A8';
      ctx.beginPath();
      ctx.moveTo(600, 950);
      ctx.lineTo(450, 870);
      ctx.lineTo(600, 870);
      ctx.closePath();
      ctx.fill();

      // White card background
      ctx.fillStyle = '#F5F5F5';
      ctx.fillRect(50, 40, 500, 870);

      // Title
      ctx.fillStyle = '#2C3E50';
      ctx.font = 'bold 40px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('TERMS &', 300, 180);
      ctx.fillText('CONDITION', 300, 230);

      // Terms text
      ctx.fillStyle = '#333333';
      ctx.textAlign = 'left';
      
      ctx.font = 'bold 20px Arial';
      ctx.fillText('Identification:', 90, 300);
      ctx.font = '18px Arial';
      wrapText(ctx, 'Employees must carry their ID card at all times within company premises for security and verification.', 90, 330, 420, 26);

      ctx.font = 'bold 20px Arial';
      ctx.fillText('Usage:', 90, 440);
      ctx.font = '18px Arial';
      wrapText(ctx, 'The ID card is company property, strictly personal, and must not be shared, duplicated, or used for unauthorized purposes.', 90, 470, 420, 26);

      // Contact details
      ctx.font = 'bold 19px Arial';
      ctx.fillText('ID No', 90, 610);
      ctx.fillText('Email', 90, 650);
      ctx.fillText('Phone', 90, 690);

      ctx.font = '19px Arial';
      ctx.fillText(': ' + formData.idNumber, 180, 610);
      ctx.fillText(': ' + formData.email, 180, 650);
      ctx.fillText(': ' + formData.phone, 180, 690);

      // Function to draw company name
      const drawCompanyName = () => {
        if (!ctx) return;
        ctx.fillStyle = '#2C3E50';
        ctx.font = 'bold 24px Arial';
        ctx.textAlign = 'left';
        const nameParts = formData.companyName.split(' ');
        if (nameParts.length === 1) {
          ctx.fillText(formData.companyName, 160, 800);
        } else {
          const midPoint = Math.ceil(nameParts.length / 2);
          ctx.fillText(nameParts.slice(0, midPoint).join(' '), 160, 800);
          ctx.fillText(nameParts.slice(midPoint).join(' '), 160, 828);
        }
        resolve(canvas.toDataURL('image/png'));
      };

      // Company logo at bottom
      if (companyLogo) {
        const logoImg = new Image();
        logoImg.crossOrigin = 'anonymous';
        logoImg.onload = () => {
          if (!ctx) return;
          ctx.save();
          ctx.beginPath();
          ctx.arc(110, 800, 30, 0, Math.PI * 2);
          ctx.closePath();
          ctx.clip();
          ctx.drawImage(logoImg, 80, 770, 60, 60);
          ctx.restore();
          drawCompanyName();
        };
        logoImg.onerror = () => {
          console.error('Failed to load logo on back');
          drawCompanyName();
        };
        logoImg.src = companyLogo;
      } else {
        if (!ctx) return;
        // Draw default logo
        ctx.fillStyle = '#2C3E50';
        ctx.beginPath();
        ctx.arc(95, 795, 10, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(110, 795, 10, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(95, 810, 10, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(110, 810, 10, 0, Math.PI * 2);
        ctx.fill();
        
        drawCompanyName();
      }
    });
  };

  const wrapText = (ctx: CanvasRenderingContext2D, text: string, x: number, y: number, maxWidth: number, lineHeight: number) => {
    const words = text.split(' ');
    let line = '';
    let currentY = y;

    for (let n = 0; n < words.length; n++) {
      const testLine = line + words[n] + ' ';
      const metrics = ctx.measureText(testLine);
      const testWidth = metrics.width;
      
      if (testWidth > maxWidth && n > 0) {
        ctx.fillText(line, x, currentY);
        line = words[n] + ' ';
        currentY += lineHeight;
      } else {
        line = testLine;
      }
    }
    ctx.fillText(line, x, currentY);
  };

  const drawBarcode = (ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number) => {
    const bars = 50;
    const barWidth = width / bars;
    
    ctx.fillStyle = '#000000';
    for (let i = 0; i < bars; i++) {
      if (Math.random() > 0.5) {
        ctx.fillRect(x + i * barWidth, y, barWidth * 0.8, height);
      }
    }
  };

  const downloadCard = (type: 'front' | 'back') => {
    const imageData = type === 'front' ? frontCardImage : backCardImage;
    if (!imageData) return;
    
    const link = document.createElement('a');
    link.download = `${formData.name.replace(/\s+/g, '_')}_ID_${type}.png`;
    link.href = imageData;
    link.click();
  };

  const resetForm = () => {
    setFormData({
      name: '',
      department: '',
      idNumber: '',
      email: '',
      phone: '',
      companyName: 'Ginyard International Co.'
    });
    setEmployeePhoto(null);
    setCompanyLogo(null);
    setGeneratedCard(false);
    setFrontCardImage(null);
    setBackCardImage(null);
    setActiveTab('form');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
            <Users className="text-purple-600" />
            Employee ID Card Generator
          </h1>
          <p className="text-gray-600 mt-2">Create professional employee ID cards instantly</p>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-lg shadow-lg mb-6">
          <div className="flex border-b">
            <button
              onClick={() => setActiveTab('form')}
              className={`flex-1 py-4 px-6 font-semibold transition ${
                activeTab === 'form'
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <Settings className="inline mr-2" size={20} />
              Create Card
            </button>
            <button
              onClick={() => setActiveTab('preview')}
              className={`flex-1 py-4 px-6 font-semibold transition ${
                activeTab === 'preview'
                  ? 'bg-purple-600 text-white'
                  : generatedCard 
                    ? 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    : 'bg-gray-50 text-gray-400 cursor-not-allowed'
              }`}
              disabled={!generatedCard}
            >
              <Eye className="inline mr-2" size={20} />
              Preview Card
            </button>
            <button
              onClick={() => setActiveTab('employees')}
              className={`flex-1 py-4 px-6 font-semibold transition ${
                activeTab === 'employees'
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <Users className="inline mr-2" size={20} />
              Employees ({employees.length})
            </button>
          </div>
        </div>

        {/* Form Tab */}
        {activeTab === 'form' && (
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Employee Information</h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              {/* Left Column */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Company Name *
                  </label>
                  <input
                    type="text"
                    name="companyName"
                    value={formData.companyName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Employee Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="e.g., Richard Sanchez"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Department *
                  </label>
                  <input
                    type="text"
                    name="department"
                    value={formData.department}
                    onChange={handleInputChange}
                    placeholder="e.g., Marketing"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    ID Number *
                  </label>
                  <input
                    type="text"
                    name="idNumber"
                    value={formData.idNumber}
                    onChange={handleInputChange}
                    placeholder="e.g., 1234567890"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="e.g., hello@reallygreatsite.com"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Phone *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="e.g., +123-456-7890"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Company Logo (Optional)
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-purple-600 transition">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageUpload(e, 'logo')}
                      className="hidden"
                      id="logo-upload"
                    />
                    <label htmlFor="logo-upload" className="cursor-pointer">
                      <Upload className="mx-auto text-gray-400 mb-2" size={40} />
                      <p className="text-sm text-gray-600">Click to upload logo</p>
                      {companyLogo && <p className="text-green-600 mt-2 text-sm font-semibold">✓ Logo uploaded</p>}
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Employee Photo *
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-purple-600 transition">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageUpload(e, 'photo')}
                      className="hidden"
                      id="photo-upload"
                    />
                    <label htmlFor="photo-upload" className="cursor-pointer">
                      <Upload className="mx-auto text-gray-400 mb-2" size={40} />
                      <p className="text-sm text-gray-600">Click to upload photo</p>
                      {employeePhoto && <p className="text-green-600 mt-2 text-sm font-semibold">✓ Photo uploaded</p>}
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 flex gap-4">
              <button
                onClick={generateCard}
                className="flex-1 bg-purple-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-purple-700 transition flex items-center justify-center gap-2"
              >
                <Eye size={20} />
                Generate ID Card
              </button>
              <button
                onClick={resetForm}
                className="px-6 py-3 border-2 border-gray-300 rounded-lg font-semibold hover:bg-gray-100 transition"
              >
                Reset
              </button>
            </div>
          </div>
        )}

        {/* Preview Tab */}
        {activeTab === 'preview' && (
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">ID Card Preview</h2>
            
            {generatedCard && frontCardImage && backCardImage ? (
              <>
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-lg font-semibold mb-4 text-center">Front Side</h3>
                    <div className="border-4 border-gray-200 rounded-lg overflow-hidden shadow-lg">
                      <img src={frontCardImage} alt="Front Card" className="w-full h-auto" />
                    </div>
                    <button
                      onClick={() => downloadCard('front')}
                      className="w-full mt-4 bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition flex items-center justify-center gap-2"
                    >
                      <Download size={20} />
                      Download Front
                    </button>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-4 text-center">Back Side</h3>
                    <div className="border-4 border-gray-200 rounded-lg overflow-hidden shadow-lg">
                      <img src={backCardImage} alt="Back Card" className="w-full h-auto" />
                    </div>
                    <button
                      onClick={() => downloadCard('back')}
                      className="w-full mt-4 bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition flex items-center justify-center gap-2"
                    >
                      <Download size={20} />
                      Download Back
                    </button>
                  </div>
                </div>

                <button
                  onClick={resetForm}
                  className="w-full mt-6 bg-green-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-green-700 transition"
                >
                  Create Another Card
                </button>
              </>
            ) : (
              <div className="text-center py-12 text-gray-500">
                <Eye size={64} className="mx-auto mb-4 opacity-50" />
                <p className="text-lg mb-2">No card generated yet</p>
                <p className="text-sm">Please fill the form and generate a card first</p>
                <button
                  onClick={() => setActiveTab('form')}
                  className="mt-4 bg-purple-600 text-white py-2 px-6 rounded-lg font-semibold hover:bg-purple-700 transition"
                >
                  Go to Form
                </button>
              </div>
            )}
          </div>
        )}

        {/* Employees Tab */}
        {activeTab === 'employees' && (
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Generated Employees</h2>
            
            {employees.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <Users size={64} className="mx-auto mb-4 opacity-50" />
                <p className="text-lg mb-2">No employees generated yet</p>
                <p className="text-sm">Create your first employee ID card to see it here</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {employees.map((emp, idx) => (
                  <div key={idx} className="border border-gray-200 rounded-lg p-4 hover:shadow-lg transition">
                    <img src={emp.photo ?? ''} alt={emp.name} className="w-24 h-24 rounded-full mx-auto mb-3 object-cover border-2 border-purple-200" />
                    <h3 className="font-bold text-center text-lg">{emp.name}</h3>
                    <p className="text-center text-gray-600 text-sm">{emp.department}</p>
                    <p className="text-center text-gray-500 text-sm mt-1">ID: {emp.idNumber}</p>
                    <div className="mt-3 pt-3 border-t border-gray-200">
                      <p className="text-center text-gray-400 text-xs">
                        Generated: {new Date(emp.generatedAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default EmployeeIDGenerator;
