import React, { useRef, useState } from 'react';
import {
  User,
  Camera,
  Upload,
  Check,
  MapPin,
  Mail,
  Phone,
  Shield,
  ShieldCheck,
  Building,
  Calendar,
  Award,
  Activity,
  Trash2,
  Sparkles,
  SlidersHorizontal,
  Compass,
} from 'lucide-react';
import { AuthUser, UserLocationDetails } from '../types';

interface UserProfileTabProps {
  user: AuthUser;
  location: UserLocationDetails;
  onUpdateUser: (updatedUser: AuthUser) => void;
  onOpenLocationSelector: () => void;
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

export const UserProfileTab: React.FC<UserProfileTabProps> = ({
  user,
  location,
  onUpdateUser,
  onOpenLocationSelector,
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
  const [saveMessage, setSaveMessage] = useState<string | null>(null);

  const isDark = theme === 'dark';

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file (PNG, JPG, WEBP).');
      return;
    }

    setIsUploading(true);
    const reader = new FileReader();
    reader.onload = () => {
      const res = reader.result as string;
      setPendingPreview(res);
      setIsUploading(false);
    };
    reader.onerror = () => {
      setIsUploading(false);
      alert('Error reading image.');
    };
    reader.readAsDataURL(file);
  };

  const handleConfirmPhoto = () => {
    if (pendingPreview) {
      setAvatarUrl(pendingPreview);
      setPendingPreview(null);
      setSaveMessage('Profile photo applied. Remember to click "Save Profile Details".');
      setTimeout(() => setSaveMessage(null), 4000);
    }
  };

  const handleSelectPreset = (url: string) => {
    setPendingPreview(url);
  };

  const handleResetPhoto = () => {
    const defaultAvatar =
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80';
    setAvatarUrl(defaultAvatar);
    setPendingPreview(null);
    setSaveMessage('Profile photo reset to default avatar.');
    setTimeout(() => setSaveMessage(null), 4000);
  };

  const handleSaveAll = (e: React.FormEvent) => {
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

    try {
      localStorage.setItem('urban_ai_user_profile', JSON.stringify(updatedUser));
    } catch {
      // Ignore
    }

    onUpdateUser(updatedUser);
    setSaveMessage('Profile and photo saved successfully!');
    setTimeout(() => setSaveMessage(null), 4000);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            User Profile & Identity
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Manage your personal profile photo, municipal credentials, and active smart city jurisdiction.
          </p>
        </div>

        {/* Current Location Badge */}
        <button
          onClick={onOpenLocationSelector}
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-cyan-50 hover:bg-cyan-100 text-cyan-800 border border-cyan-200 text-xs font-semibold transition active:scale-95 shadow-sm"
        >
          <MapPin className="w-4 h-4 text-cyan-600" />
          <span>
            District: <strong>{location.district}</strong> | Town: <strong>{location.town}</strong>
          </span>
          <SlidersHorizontal className="w-3.5 h-3.5 text-cyan-600 ml-1" />
        </button>
      </div>

      {saveMessage && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2 shadow-sm animate-in fade-in">
          <Check className="w-4 h-4 text-emerald-600" />
          <span>{saveMessage}</span>
        </div>
      )}

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Photo Card & Quick Info */}
        <div className="space-y-6">
          {/* Photo Management Card */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm text-center">
            {/* Avatar Preview */}
            <div className="relative inline-block mx-auto mb-4">
              <div className="w-32 h-32 sm:w-36 sm:h-36 rounded-2xl overflow-hidden border-4 border-cyan-500 shadow-lg bg-slate-100 relative">
                <img
                  src={pendingPreview || avatarUrl}
                  alt={name}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                {pendingPreview && (
                  <div className="absolute inset-0 bg-cyan-900/60 flex flex-col items-center justify-center text-white text-xs font-bold p-2">
                    <Sparkles className="w-4 h-4 mb-1 text-cyan-300" />
                    <span>Pending Preview</span>
                  </div>
                )}
              </div>

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="absolute bottom-1 right-1 p-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white shadow-md transition active:scale-95"
                title="Upload Photo from Device"
              >
                <Camera className="w-4 h-4" />
              </button>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />

            <h3 className="text-lg font-bold text-slate-900">{name}</h3>
            <p className="text-xs font-medium text-cyan-700 font-mono mt-0.5">{role}</p>
            <p className="text-xs text-slate-500 mt-1">{department}</p>

            {/* Photo Action Buttons */}
            <div className="mt-5 space-y-2">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white text-xs font-semibold shadow-sm transition active:scale-95"
              >
                <Upload className="w-4 h-4" />
                <span>{isUploading ? 'Loading...' : 'Upload Profile Photo'}</span>
              </button>

              {pendingPreview ? (
                <button
                  type="button"
                  onClick={handleConfirmPhoto}
                  className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-sm transition active:scale-95"
                >
                  <Check className="w-4 h-4" />
                  <span>Confirm Photo</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleResetPhoto}
                  className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium transition"
                >
                  <Trash2 className="w-3.5 h-3.5 text-slate-500" />
                  <span>Reset to Default</span>
                </button>
              )}
            </div>

            {/* Presets Grid */}
            <div className="mt-5 pt-4 border-t border-slate-100 text-left">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-2">
                Preset Avatars
              </span>
              <div className="grid grid-cols-3 gap-2">
                {PRESET_AVATARS.map((p, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSelectPreset(p.url)}
                    className="p-1.5 rounded-xl border border-slate-200 hover:border-cyan-500 hover:bg-cyan-50 transition group flex flex-col items-center"
                  >
                    <img
                      src={p.url}
                      alt={p.name}
                      className="w-10 h-10 rounded-lg object-cover"
                      referrerPolicy="no-referrer"
                    />
                    <span className="text-[9px] text-slate-600 truncate max-w-[65px] mt-1">
                      {p.name.split(' ')[0]}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Stats Card */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-3">
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Smart City Verification
            </h4>
            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500 flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  ID Verification:
                </span>
                <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                  Active Officer
                </span>
              </div>

              <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-cyan-600" />
                  Assigned District:
                </span>
                <span className="font-bold text-slate-800">{location.district}</span>
              </div>

              <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500 flex items-center gap-1.5">
                  <Building className="w-3.5 h-3.5 text-indigo-600" />
                  Local Town Node:
                </span>
                <span className="font-bold text-slate-800">{location.town}</span>
              </div>

              <div className="flex items-center justify-between py-1.5">
                <span className="text-slate-500 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  Session Login:
                </span>
                <span className="text-slate-600 font-mono">
                  {user.sessionStartedAt || 'Today'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Editable Profile Details */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <h3 className="text-base font-bold text-slate-900 mb-1">
              Personal & Municipal Information
            </h3>
            <p className="text-xs text-slate-500 mb-5">
              Update your contact info and administrative credentials. Changes will reflect in dispatches and reports.
            </p>

            <form onSubmit={handleSaveAll} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Full Name:
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Official Email / ID:
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Role & Title:
                  </label>
                  <input
                    type="text"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Contact Phone:
                  </label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Department / Organization:
                </label>
                <input
                  type="text"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </div>

              {/* Stationed Jurisdiction Callout */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-cyan-600" />
                    Stationed Jurisdiction & Town
                  </p>
                  <p className="text-xs text-slate-600 font-mono font-bold mt-0.5">
                    District: {location.district} | Town: {location.town}
                  </p>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    {location.formattedAddress || 'Reverse Geocoded Location'}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={onOpenLocationSelector}
                  className="px-3 py-1.5 rounded-lg bg-white border border-slate-300 text-slate-800 text-xs font-semibold hover:bg-slate-100 transition shadow-sm"
                >
                  Change Location
                </button>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Officer Bio & Responsibilities:
                </label>
                <textarea
                  rows={3}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white font-bold text-xs shadow-md transition active:scale-95"
                >
                  Save Profile Details
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
