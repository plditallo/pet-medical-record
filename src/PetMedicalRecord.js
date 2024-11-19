
import React, { useEffect, useState } from 'react';
import { Camera } from 'lucide-react';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "./components/ui/card"

//import {
//  Card,
//  CardContent,
//  CardHeader,
//  CardTitle,
//} from "@/components/ui/card"

const PetMedicalRecord = () => {
  const [petInfo, setPetInfo] = useState({
    name: '',
    age: '',
    allergies: '',
    favoriteFood: '',
    personalityTraits: '',
    picture: null
  });

  const [visits, setVisits] = useState([]);
  const [currentVisit, setCurrentVisit] = useState({
    reasons: '',
    date: new Date().toISOString().split('T')[0],
    symptoms: '',
    behaviorChanges: ''
  });

  // Load saved data when component mounts
  useEffect(() => {
    const savedPetInfo = localStorage.getItem('petInfo');
    const savedVisits = localStorage.getItem('visits');
    
    if (savedPetInfo) {
      setPetInfo(JSON.parse(savedPetInfo));
    }
    if (savedVisits) {
      setVisits(JSON.parse(savedVisits));
    }
  }, []);

  const handlePetInfoChange = (e) => {
    const { name, value } = e.target;
    setPetInfo(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleVisitChange = (e) => {
    const { name, value } = e.target;
    setCurrentVisit(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPetInfo(prev => ({
          ...prev,
          picture: reader.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const savePetInfo = () => {
    try {
      localStorage.setItem('petInfo', JSON.stringify(petInfo));
      alert('Pet information saved successfully!');
    } catch (error) {
      alert('Error saving pet information. Please try again.');
      console.error('Error saving pet info:', error);
    }
  };

  const saveVisit = () => {
    try {
      const newVisits = [...visits, currentVisit].sort((a, b) => 
        new Date(b.date) - new Date(a.date)
      );
      setVisits(newVisits);
      localStorage.setItem('visits', JSON.stringify(newVisits));
      
      // Reset the form
      setCurrentVisit({
        reasons: '',
        date: new Date().toISOString().split('T')[0],
        symptoms: '',
        behaviorChanges: ''
      });
      
      alert('Visit information saved successfully!');
    } catch (error) {
      alert('Error saving visit information. Please try again.');
      console.error('Error saving visit:', error);
    }
  };

  const exportToExcel = () => {
    try {
      // Create sections for the CSV file
      const petSection = [
        ['Pet Information'],
        ['Name', petInfo.name],
        ['Age', petInfo.age],
        ['Allergies', petInfo.allergies],
        ['Favorite Food', petInfo.favoriteFood],
        ['Personality Traits', petInfo.personalityTraits],
        [''], // Empty row for spacing
      ];

      const visitHeaders = [
        'Visit Information',
        ['Date', 'Reasons for Visit', 'Symptoms', 'Behavior Changes']
      ];

      const visitRows = visits.map(visit => [
        visit.date,
        visit.reasons.replace(/"/g, '""'),
        visit.symptoms.replace(/"/g, '""'),
        visit.behaviorChanges.replace(/"/g, '""')
      ]);

      // Combine all sections
      const allRows = [
        ...petSection,
        ...visitHeaders,
        ...visitRows
      ].map(row => {
        // Properly escape and quote fields
        return row.map(field => {
          if (field === undefined || field === null) return '""';
          const stringField = String(field);
          if (stringField.includes(',') || stringField.includes('\n') || stringField.includes('"')) {
            return `"${stringField.replace(/"/g, '""')}"`;
          }
          return stringField;
        }).join(',');
      }).join('\n');

      // Create and trigger download
      const blob = new Blob(['\ufeff' + allRows], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const date = new Date().toISOString().split('T')[0];
      link.download = `${petInfo.name || 'pet'}_medical_records_${date}.csv`;
      link.href = URL.createObjectURL(blob);
      link.click();
      
      alert('File exported successfully!');
    } catch (error) {
      alert('Error exporting data. Please try again.');
      console.error('Error exporting:', error);
    }
  };

  const clearAllData = () => {
    if (window.confirm('Are you sure you want to clear all saved data? This cannot be undone.')) {
      try {
        localStorage.removeItem('petInfo');
        localStorage.removeItem('visits');
        setPetInfo({
          name: '',
          age: '',
          allergies: '',
          favoriteFood: '',
          personalityTraits: '',
          picture: null
        });
        setVisits([]);
        alert('All data cleared successfully!');
      } catch (error) {
        alert('Error clearing data. Please try again.');
        console.error('Error clearing data:', error);
      }
    }
  };

  return (
    <div className="space-y-8 p-4 max-w-4xl mx-auto">
      {/* Pet Information Section */}
      <Card>
        <CardHeader>
          <CardTitle>My Pet</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Pet's Name</label>
                <input
                  type="text"
                  name="name"
                  value={petInfo.name}
                  onChange={handlePetInfoChange}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Pet's Age</label>
                <input
                  type="text"
                  name="age"
                  value={petInfo.age}
                  onChange={handlePetInfoChange}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Pet's Allergies</label>
                <input
                  type="text"
                  name="allergies"
                  value={petInfo.allergies}
                  onChange={handlePetInfoChange}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Favorite Pet Food</label>
                <input
                  type="text"
                  name="favoriteFood"
                  value={petInfo.favoriteFood}
                  onChange={handlePetInfoChange}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Pet's Personality Traits</label>
                <textarea
                  name="personalityTraits"
                  value={petInfo.personalityTraits}
                  onChange={handlePetInfoChange}
                  className="w-full p-2 border rounded"
                  rows="3"
                />
              </div>
            </div>
            <div className="space-y-4">
              <div className="text-center">
                {petInfo.picture ? (
                  <img
                    src={petInfo.picture}
                    alt="Pet"
                    className="w-48 h-48 object-cover mx-auto rounded"
                  />
                ) : (
                  <div className="w-48 h-48 bg-gray-100 flex items-center justify-center mx-auto rounded">
                    <Camera className="w-12 h-12 text-gray-400" />
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="mt-4"
                />
              </div>
              <button
                onClick={savePetInfo}
                className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
              >
                Save Pet Information
              </button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Medical Visit Section */}
      <Card>
        <CardHeader>
          <CardTitle>Medical Visit</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Reason(s) for Visit</label>
              <textarea
                name="reasons"
                value={currentVisit.reasons}
                onChange={handleVisitChange}
                className="w-full p-2 border rounded"
                rows="2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Date</label>
              <input
                type="date"
                name="date"
                value={currentVisit.date}
                onChange={handleVisitChange}
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Symptom(s)</label>
              <textarea
                name="symptoms"
                value={currentVisit.symptoms}
                onChange={handleVisitChange}
                className="w-full p-2 border rounded"
                rows="2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Behavior Changes</label>
              <textarea
                name="behaviorChanges"
                value={currentVisit.behaviorChanges}
                onChange={handleVisitChange}
                className="w-full p-2 border rounded"
                rows="2"
              />
            </div>
            <button
              onClick={saveVisit}
              className="w-full bg-green-500 text-white p-2 rounded hover:bg-green-600"
            >
              Save Visit Information
            </button>
          </div>
        </CardContent>
      </Card>

      {/* Visit History Section */}
      <Card>
        <CardHeader>
          <CardTitle>Visit History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Symptoms
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {visits.map((visit, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(visit.date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {visit.symptoms}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Export and Clear Data Section */}
      <Card>
        <CardContent className="pt-6 space-y-4">
          <button
            onClick={exportToExcel}
            className="w-full bg-purple-500 text-white p-2 rounded hover:bg-purple-600"
          >
            Export to File
          </button>
          <button
            onClick={clearAllData}
            className="w-full bg-red-500 text-white p-2 rounded hover:bg-red-600"
          >
            Clear All Data
          </button>
        </CardContent>
      </Card>
    </div>
  );
};
export default PetMedicalRecord;