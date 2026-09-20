import React, { useState, useRef } from 'react';
import {
  User,
  Camera,
  Upload,
  Check,
  X,
  Trash2,
  Sparkles,
  ShieldCheck,
  Building,
  MapPin,
  Phone,
  Mail,
  RefreshCw,
  Image as ImageIcon,
} from 'lucide-react';
import { AuthUser, UserLocationDetails } from '../types';

interface UserProfileModalProps {
  user: AuthUser;
  location: UserLocationDetails;
  onUpdateUser: (updatedUser: AuthUser) => void;
  onClose: () => void;
  theme: 'dark' | 'light';
}

const PRESET_AVATARS = [
  {
    name: 'Municipal Commissioner',
    url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
  },
  {
    name: 'Senior Traffic Engineer',
    url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
  },
  {
    name: 'Field Operations Commander',
    url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
  },
  {
    name: 'GIS & AI Analyst',
    url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
  },
  {
    name: 'Transit Fleet Pilot',
    url: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=400&q=80',
  },
  {
    name: 'Active Citizen Reporter',
    url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80',
  },
];

export const UserProfileModal: React.FC<UserProfileModalProps> = ({
  user,
  location,
  onUpdateUser,
  onClose,
  theme,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form states
  const [name, setName] = useState<string>(user.name || 'Officer Thirivikram');
  const [email, setEmail] = useState<string>(user.usernameOrEmail || 'thirivikram1102@gmail.com');
  const [role, setRole] = useState<string>(user.role || 'Senior Municipal Operations Officer');
  const [department, setDepartment] = useState<string>(
    user.department || 'Tiruchirappalli City Corporation - Urban Mobility Cell'
  );
  const [phone, setPhone] = useState<string>(user.phone || '+91 98401 23456');
  const [bio, setBio] = useState<string>(
    user.bio || 'Managing urban transit dispatch, road defect response, and commuter safety.'
  );

  // Photo states
  const [avatarUrl, setAvatarUrl] = useState<string>(user.avatarUrl);
  const [pendingPreview, setPendingPreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadSuccessMessage, setUploadSuccessMessage] = useState<string | null>(null);

  const isDark = theme === 'dark';

  // Handle local file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please select a valid image file (PNG, JPG, WEBP).');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert('File size exceeds 5MB. Please choose a smaller image.');
      return;
    }

    setIsUploading(true);
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      setPendingPreview(result);
      setIsUploading(false);
    };
    reader.onerror = () => {
      setIsUploading(false);
      alert('Error reading image file.');
    };
    reader.readAsDataURL(file);
  };

  // Confirm pending photo
  const handleApplyPendingPhoto = () => {
    if (pendingPreview) {
      setAvatarUrl(pendingPreview);
      setPendingPreview(null);
      setUploadSuccessMessage('Profile photo updated successfully!');
      setTimeout(() => setUploadSuccessMessage(null), 3000);
    }
  };

  // Pick preset avatar
  const handleSelectPreset = (url: string) => {
    setPendingPreview(url);
  };

  // Reset to default
  const handleRemovePhoto = () => {
    const defaultAvatar =
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80';
    setAvatarUrl(defaultAvatar);
    setPendingPreview(null);
    setUploadSuccessMessage('Profile photo reset to default.');
    setTimeout(() => setUploadSuccessMessage(null), 3000);
  };

  // Save changes to profile
  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();

    const finalPhoto = pendingPreview || avatarUrl;

    const updatedUser: AuthUser = {
      ...user,
      name,
      usernameOrEmail: email,
      role,
      department,
      phone,
      bio,
      avatarUrl: finalPhoto,
      profilePhotoUploadedAt: new Date().toLocaleTimeString(),
    };

    // Save to localStorage
    try {
      localStorage.setItem('urban_ai_user_profile', JSON.stringify(updatedUser));
    } catch {
      // Ignore storage errors
    }

    onUpdateUser(updatedUser);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className={`w-full max-w-2xl rounded-2xl shadow-2xl border overflow-hidden flex flex-col max-h-[92vh] transition-colors ${
          isDark
            ? 'bg-slate-900 border-slate-800 text-slate-100'
            : 'bg-white border-slate-200 text-slate-900'
        }`}
      >
        {/* Modal Header */}
        <div
          className={`px-6 py-4 border-b flex items-center justify-between ${
            isDark ? 'bg-slate-950/80 border-slate-800' : 'bg-slate-50 border-slate-200'
          }`}
        >
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-cyan-100 border border-cyan-200 flex items-center justify-center text-cyan-700">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base tracking-tight text-slate-900">
                User Profile & Identity Settings
              </h3>
              <p className="text-xs text-slate-500">
                Upload photo, preview, and update your smart city credentials
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/50 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content Scrollable Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Success Banner if uploaded */}
          {uploadSuccessMessage && (
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
              <Check className="w-4 h-4 text-emerald-600" />
              <span>{uploadSuccessMessage}</span>
            </div>
          )}

          {/* Photo Management Section */}
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
            <div className="flex flex-col sm:flex-row items-center gap-5">
              {/* Profile Photo Display with Live Preview */}
              <div className="relative group flex-shrink-0">
                <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden border-2 border-cyan-500 shadow-md relative bg-white">
                  <img
                    src={pendingPreview || avatarUrl}
                    alt={name}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  {pendingPreview && (
                    <div className="absolute inset-0 bg-cyan-900/40 flex items-center justify-center text-white text-[11px] font-bold">
                      Preview
                    </div>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute -bottom-2 -right-2 p-2 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white shadow-md transition active:scale-95"
                  title="Upload image file"
                >
                  <Camera className="w-4 h-4" />
                </button>
              </div>

              {/* Photo Actions & Instructions */}
              <div className="flex-1 text-center sm:text-left space-y-2">
                <div>
                  <h4 className="text-sm font-bold text-slate-900">
                    {pendingPreview ? 'Photo Selected (Pending Confirmation)' : 'Current Profile Photo'}
                  </h4>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Upload your official picture, or choose from city officer presets. JPG, PNG or WEBP up to 5MB.
                  </p>
                </div>

                {/* Hidden File Input */}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />

                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploading}
                    className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white text-xs font-semibold shadow-sm transition active:scale-95"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>{isUploading ? 'Loading Image...' : 'Upload New Photo'}</span>
                  </button>

                  {pendingPreview ? (
                    <button
                      type="button"
                      onClick={handleApplyPendingPhoto}
                      className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-sm transition active:scale-95"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Confirm & Apply Photo</span>
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={handleRemovePhoto}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-medium transition"
                    >
                      <Trash2 className="w-3.5 h-3.5 text-slate-500" />
                      <span>Reset</span>
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Quick Avatar Gallery Presets */}
            <div className="pt-3 border-t border-slate-200">
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block mb-2">
                Or Select From Official Role Avatars:
              </span>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                {PRESET_AVATARS.map((p, idx) => (
                  <button
                    type="button"
                    key={idx}
                    onClick={() => handleSelectPreset(p.url)}
                    className="flex flex-col items-center p-1.5 rounded-xl border border-slate-200 hover:border-cyan-500 hover:bg-cyan-50 transition group"
                  >
                    <div className="w-11 h-11 rounded-lg overflow-hidden border border-slate-300 group-hover:border-cyan-500">
                      <img
                        src={p.url}
                        alt={p.name}
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <span className="text-[10px] text-slate-600 text-center font-medium mt-1 truncate max-w-[80px]">
                      {p.name.split(' ')[0]}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* User Details Form */}
          <form id="profile-form" onSubmit={handleSaveProfile} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Full Name */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Full Name:
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 bg-white text-slate-900 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </div>

              {/* Email / Officer ID */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Email Address / Officer ID:
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 bg-white text-slate-900 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </div>

              {/* Role */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Role / Designation:
                </label>
                <input
                  type="text"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 bg-white text-slate-900 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </div>

              {/* Contact Phone */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Contact Phone:
                </label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 bg-white text-slate-900 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </div>
            </div>

            {/* Department / Municipal Body */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Department / Municipal Corporation:
              </label>
              <input
                type="text"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 bg-white text-slate-900 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
            </div>

            {/* Current Detected Location Badge */}
            <div className="p-3.5 rounded-xl bg-cyan-50/70 border border-cyan-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-cyan-600" />
                <div>
                  <p className="text-[11px] font-bold text-cyan-900">
                    Stationed Jurisdiction & Node:
                  </p>
                  <p className="text-xs text-cyan-800 font-mono font-bold">
                    District: {location.district} | Town: {location.town}
                  </p>
                </div>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded font-mono font-bold bg-cyan-200 text-cyan-800">
                GPS Verified
              </span>
            </div>

            {/* Bio / Mission statement */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Operational Bio / Responsibility:
              </label>
              <textarea
                rows={2}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 bg-white text-slate-900 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
            </div>
          </form>
        </div>

        {/* Modal Footer */}
        <div
          className={`px-6 py-4 border-t flex items-center justify-between ${
            isDark ? 'bg-slate-950/80 border-slate-800' : 'bg-slate-50 border-slate-200'
          }`}
        >
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-slate-600 hover:text-slate-900 text-xs font-semibold transition"
          >
            Cancel
          </button>

          <button
            type="submit"
            form="profile-form"
            className="px-5 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white font-bold text-xs shadow-md transition active:scale-95"
          >
            Save Profile Changes
          </button>
        </div>
      </div>
    </div>
  );
};
