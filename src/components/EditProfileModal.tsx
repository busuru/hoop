import React, { useState, ChangeEvent } from 'react';
import { UserProfile } from '../types';
import { X, Eye, Trash2 } from 'lucide-react';

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (profile: UserProfile) => void;
  initialProfile: UserProfile;
}

const socialFields = [
  { name: 'twitter', label: 'Twitter', placeholder: '@yourhandle' },
  { name: 'instagram', label: 'Instagram', placeholder: '@yourhandle' },
  { name: 'facebook', label: 'Facebook', placeholder: 'Profile URL' },
];

const getProfileCompleteness = (profile: UserProfile) => {
  let filled = 0;
  let total = 6 + socialFields.length;
  if (profile.avatarUrl) filled++;
  if (profile.name) filled++;
  if (profile.email) filled++;
  if (profile.bio) filled++;
  if (profile.location) filled++;
  if (profile.birthday) filled++;
  socialFields.forEach(f => { if ((profile as any)[f.name]) filled++; });
  return Math.round((filled / total) * 100);
};

const EditProfileModal: React.FC<EditProfileModalProps> = ({ isOpen, onClose, onSave, initialProfile }) => {
  const [profile, setProfile] = useState<UserProfile>({ ...initialProfile });
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string>(initialProfile.avatarUrl || '');
  const [error, setError] = useState('');
  const [avatarError, setAvatarError] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
  };

  const handleAvatarChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setAvatarError('File must be an image');
        return;
      }
      if (file.size > 2 * 1024 * 1024) {
        setAvatarError('Image must be less than 2MB');
        return;
      }
      setAvatarError('');
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onload = (ev) => {
        setAvatarPreview(ev.target?.result as string);
        setProfile(prev => ({ ...prev, avatarUrl: ev.target?.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAvatarUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAvatarPreview(e.target.value);
    setProfile(prev => ({ ...prev, avatarUrl: e.target.value }));
    setAvatarError('');
  };

  const handleRemoveAvatar = () => {
    setAvatarFile(null);
    setAvatarPreview('');
    setProfile(prev => ({ ...prev, avatarUrl: '' }));
    setAvatarError('');
  };

  const handleSave = () => {
    if (!profile.name.trim()) {
      setError('Name is required');
      return;
    }
    if (profile.email && !/^\S+@\S+\.\S+$/.test(profile.email)) {
      setError('Invalid email format');
      return;
    }
    setError('');
    onSave(profile);
    onClose();
  };

  const completeness = getProfileCompleteness(profile);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto shadow-lg">
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-800">Edit Profile</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X className="w-6 h-6" /></button>
        </div>
        <div className="p-6 space-y-6">
          <div className="flex flex-col items-center gap-2 relative">
            {/* Progress ring */}
            <div className="relative w-20 h-20 mb-2">
              <svg className="absolute top-0 left-0 w-full h-full" viewBox="0 0 80 80">
                <circle cx="40" cy="40" r="36" fill="none" stroke="#e0e7ef" strokeWidth="6" />
                <circle
                  cx="40" cy="40" r="36"
                  fill="none"
                  stroke="#2563eb"
                  strokeWidth="6"
                  strokeDasharray={2 * Math.PI * 36}
                  strokeDashoffset={2 * Math.PI * 36 * (1 - completeness / 100)}
                  strokeLinecap="round"
                  style={{ transition: 'stroke-dashoffset 0.5s' }}
                />
              </svg>
              <div className="w-20 h-20 rounded-full bg-blue-200 flex items-center justify-center text-3xl font-bold text-blue-800 shadow border-2 border-blue-300 overflow-hidden">
                {avatarPreview ? (
                  <img src={avatarPreview} alt={profile.name} className="w-full h-full object-cover" />
                ) : (
                  <span>{profile.name.split(' ').map(n => n[0]).join('').toUpperCase()}</span>
                )}
                {avatarPreview && (
                  <button
                    type="button"
                    className="absolute top-1 right-1 bg-white bg-opacity-80 rounded-full p-1 border border-gray-300 shadow hover:bg-red-100"
                    onClick={handleRemoveAvatar}
                    title="Remove avatar"
                  >
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </button>
                )}
              </div>
              <span className="absolute bottom-0 left-1/2 -translate-x-1/2 text-xs font-semibold text-blue-700 bg-white bg-opacity-80 px-2 py-0.5 rounded shadow border border-blue-100">{completeness}% complete</span>
            </div>
            <label className="block text-sm font-medium text-gray-700">Avatar Image</label>
            <input type="file" accept="image/*" onChange={handleAvatarChange} className="mb-2" />
            <label className="block text-xs text-gray-500">or paste image URL:</label>
            <input type="text" value={profile.avatarUrl || ''} onChange={handleAvatarUrlChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" placeholder="https://..." />
            {avatarError && <div className="text-red-600 text-xs font-medium mt-1">{avatarError}</div>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
            <input
              type="text"
              name="name"
              value={profile.name}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={profile.email || ''}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
            <input
              type="text"
              name="location"
              value={profile.location || ''}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
              placeholder="City, Country"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Birthday</label>
            <input
              type="date"
              name="birthday"
              value={profile.birthday || ''}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
            <textarea
              name="bio"
              value={profile.bio || ''}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
              rows={2}
              maxLength={120}
              placeholder="Tell us a bit about yourself..."
            />
          </div>
          <div className="space-y-2">
            {socialFields.map(field => (
              <div key={field.name}>
                <label className="block text-sm font-medium text-gray-700 mb-1">{field.label}</label>
                <input
                  type="text"
                  name={field.name}
                  value={(profile as any)[field.name] || ''}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  placeholder={field.placeholder}
                />
              </div>
            ))}
          </div>
          {error && <div className="text-red-600 text-sm font-medium">{error}</div>}
          <div className="flex justify-between gap-2 mt-4">
            <button onClick={onClose} className="px-4 py-2 text-gray-600 hover:text-gray-800">Cancel</button>
            <button
              className="px-4 py-2 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg font-medium flex items-center gap-2"
              type="button"
              title="View profile (coming soon)"
              disabled
            >
              <Eye className="w-4 h-4" /> View Profile
            </button>
            <button onClick={handleSave} className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors">Save</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditProfileModal; 