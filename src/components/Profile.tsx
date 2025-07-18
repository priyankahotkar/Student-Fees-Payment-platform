import React, { useState, useEffect } from 'react';
import { User, Edit, Save, X, CreditCard, CheckCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const Profile: React.FC = () => {
  const { user, students, updateStudent, loading } = useAuth();
  const navigate = useNavigate();
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  const student = students.find(s => s.id === user?.id);
  const [formData, setFormData] = useState({
    name: student?.name || '',
    email: student?.email || ''
  });

  useEffect(() => {
    setFormData({
      name: student?.name || '',
      email: student?.email || ''
    });
  }, [student]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <svg className="animate-spin h-8 w-8 text-blue-600 mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
          </svg>
          <p className="text-blue-600">Loading your profile...</p>
        </div>
      </div>
    );
  }

  // Only show 'not found' if students are loaded and user is present but no matching student
  if (!loading && user && students.length > 0 && !student) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Student data not found</p>
        </div>
      </div>
    );
  }

  // If still waiting for students to load, don't render anything
  if (!student) {
    return null;
  }

  const handleEdit = () => {
    setEditing(true);
  };

  const handleCancel = () => {
    setFormData({ name: student.name, email: student.email });
    setEditing(false);
  };

  const handleSave = async () => {
    setSaving(true);
    
    // Simulate API delay
    setTimeout(() => {
      updateStudent(student.id, {
        name: formData.name,
        email: formData.email,
      });
      setEditing(false);
      setSaving(false);
    }, 1000);
  };

  const handlePayFees = () => {
    navigate('/payment');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-6">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow rounded-lg">
          {/* Header */}
          <div className="px-6 py-8 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="h-16 w-16 rounded-full bg-blue-100 flex items-center justify-center">
                  <User className="h-8 w-8 text-blue-600" />
                </div>
                <div className="ml-6">
                  <h1 className="text-2xl font-bold text-gray-900">Student Profile</h1>
                  <p className="text-sm text-gray-600">Manage your account information and fee status</p>
                </div>
              </div>
              {!editing && (
                <button
                  onClick={handleEdit}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Profile
                </button>
              )}
            </div>
          </div>

          {/* Profile Information */}
          <div className="px-6 py-6">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                {editing ? (
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm px-3 py-2 border"
                  />
                ) : (
                  <p className="text-gray-900 bg-gray-50 px-3 py-2 rounded-md">{student.name}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                {editing ? (
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm px-3 py-2 border"
                  />
                ) : (
                  <p className="text-gray-900 bg-gray-50 px-3 py-2 rounded-md">{student.email}</p>
                )}
              </div>
            </div>

            {editing && (
              <div className="mt-6 flex space-x-3">
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 transition-colors"
                >
                  <Save className="h-4 w-4 mr-2" />
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
                <button
                  onClick={handleCancel}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                >
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </button>
              </div>
            )}
          </div>

          {/* Fee Status Section */}
          <div className="px-6 py-6 border-t border-gray-200">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Fee Payment Status</h3>
            
            <div className="bg-gray-50 rounded-lg p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className={`h-12 w-12 rounded-full flex items-center justify-center transition-all duration-300 ${
                    student.fees_paid ? 'bg-green-100' : 'bg-red-100'
                  }`}>
                    {student.fees_paid ? (
                      <CheckCircle className="h-6 w-6 text-green-600" />
                    ) : (
                      <CreditCard className="h-6 w-6 text-red-600" />
                    )}
                  </div>
                  <div className="ml-4">
                    <p className="text-lg font-medium text-gray-900">
                      {student.fees_paid ? 'Fees Paid' : 'Fees Pending'}
                    </p>
                    <p className="text-sm text-gray-600">
                      {student.fees_paid 
                        ? 'Your fees have been successfully paid'
                        : 'Your fees are pending payment'
                      }
                    </p>
                  </div>
                </div>

                {!student.fees_paid && (
                  <button
                    onClick={handlePayFees}
                    className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors transform hover:scale-105"
                  >
                    <CreditCard className="h-5 w-5 mr-2" />
                    Pay Fees
                  </button>
                )}
              </div>

              {student.fees_paid && (
                <div className="mt-4 p-4 bg-green-50 rounded-md">
                  <p className="text-sm text-green-800">
                    ✅ Payment completed successfully. Thank you for your payment!
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;