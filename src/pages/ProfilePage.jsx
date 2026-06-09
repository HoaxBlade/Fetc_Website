import React, { useState, useEffect, useRef } from 'react';
import { 
  User, Edit2, Save, Loader2, X, Camera, Trash2
} from 'lucide-react';
import { getProfileImageUrl } from "../apiConfig";
import SafeImage from "../components/SafeImage";

const ProfilePage = () => {
  const [userData, setUserData] = useState(() => 
    JSON.parse(localStorage.getItem('user') || '{"name":"User","email":"user@example.com","role":"STUDENT","phone":""}')
  );

  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    name: userData.name,
    phone: userData.phone || userData.phoneNumber || "",
    bio: userData.bio || ""
  });

  useEffect(() => {
    const fetchProfile = async () => {
      const identifier = userData.id || userData.email;
      if (!identifier) return;
      setIsLoading(true);
      try {
        const response = await fetch((window.API_BASE || "") + `/api/users/profile/${identifier}`);
        const data = await response.json();
        if (data.success) {
          const updatedUser = { ...userData, ...data.user };
          setUserData(updatedUser);
          localStorage.setItem('user', JSON.stringify(updatedUser));
          window.dispatchEvent(new Event("user-login"));
          if (!isEditing) {
            setFormData({
              name: data.user.name,
              phone: data.user.phone || "",
              bio: data.user.bio || ""
            });
          }
        } else if (response.status === 404) {
          console.warn("User not found in database. Clearing session.");
          localStorage.removeItem('user');
          localStorage.removeItem('token');
          window.dispatchEvent(new Event("user-logout"));
          window.location.href = '/my-account';
        }
      } catch (err) {
        console.error('Failed to fetch profile:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userData.id, userData.email, isEditing]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    const identifier = userData.id || userData.email;
    if (!identifier) {
      alert("Unable to identify current user session. Please log in again.");
      return;
    }
    setIsSaving(true);
    try {
      const response = await fetch((window.API_BASE || "") + `/api/users/profile/${identifier}`, {
        method: 'PATCH',
        headers: { 
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'true'
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (data.success) {
        const updatedUser = { ...userData, ...data.user };
        setUserData(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));
        window.dispatchEvent(new Event("user-login"));
        setIsEditing(false);
      } else {
        alert(data.message || 'Failed to update profile');
      }
    } catch (err) {
      console.error('Save profile error:', err);
      alert('An error occurred while saving.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert("Image is too large. Max 5MB allowed.");
      return;
    }

    const identifier = userData.id || userData.email;
    if (!identifier) {
      alert("Unable to identify current user session. Please log in again.");
      return;
    }

    setIsUploading(true);
    const uploadData = new FormData();
    uploadData.append('image', file);

    try {
      const uploadRes = await fetch((window.API_BASE||'') + '/api/admin/upload', {
        method: 'POST',
        body: uploadData
      });
      const uploadResult = await uploadRes.json();

      if (uploadResult.success) {
        const profileRes = await fetch((window.API_BASE || "") + `/api/users/profile/${identifier}`, {
          method: 'PATCH',
          headers: { 
            'Content-Type': 'application/json',
            'ngrok-skip-browser-warning': 'true'
          },
          body: JSON.stringify({ profile_image: uploadResult.url })
        });
        const profileResult = await profileRes.json();

        if (profileResult.success) {
          const updatedUser = { ...userData, ...profileResult.user };
          setUserData(updatedUser);
          localStorage.setItem('user', JSON.stringify(updatedUser));
          window.dispatchEvent(new Event("user-login"));
        } else {
          alert(profileResult.message || "Failed to update profile image in database.");
        }
      } else {
        alert("Failed to upload image.");
      }
    } catch (err) {
      console.error('Image upload error:', err);
      alert("Error uploading image.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveImage = async () => {
    const identifier = userData.id || userData.email;
    if (!identifier) {
      alert("Unable to identify current user session. Please log in again.");
      return;
    }

    if (!window.confirm("Are you sure you want to remove your profile picture?")) return;

    setIsUploading(true);
    try {
      const response = await fetch((window.API_BASE || "") + `/api/users/profile/${identifier}`, {
        method: 'PATCH',
        headers: { 
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'true'
        },
        body: JSON.stringify({ profile_image: null })
      });

      const data = await response.json();
      if (data.success) {
        const updatedUser = { ...userData, profile_image: null };
        setUserData(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));
        window.dispatchEvent(new Event("user-login"));
      } else {
        alert(data.message || "Failed to remove profile image.");
      }
    } catch (err) {
      console.error('Remove image error:', err);
      alert("Error removing image.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-6">
      <input 
        type="file"
        ref={fileInputRef}
        onChange={handleImageChange}
        className="hidden"
        accept="image/*"
      />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">My Profile</h1>
          <p className="text-slate-500 text-xs">Manage your account information and preferences.</p>
        </div>
        
        {!isEditing ? (
          <button 
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-1.5 bg-white border border-slate-200 px-4 py-2 rounded-xl font-medium text-slate-700 hover:bg-slate-50 transition-colors text-xs shadow-sm"
          >
            <Edit2 size={14} /> Edit Profile
          </button>
        ) : (
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setIsEditing(false)}
              className="flex items-center gap-1.5 bg-white border border-slate-200 px-4 py-2 rounded-xl font-medium text-slate-500 hover:text-slate-700 transition-colors text-xs"
            >
              <X size={14} /> Cancel
            </button>
            <button 
              onClick={handleSave}
              disabled={isSaving}
              className="flex items-center gap-1.5 bg-slate-900 text-white px-5 py-2 rounded-xl font-medium hover:bg-slate-800 transition-colors text-xs shadow-sm disabled:opacity-50"
            >
              {isSaving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
              {isSaving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
         {/* Left: Profile Details */}
         <div className="lg:col-span-2">
           <div className="bg-white p-6 md:p-8 rounded-2xl border border-slate-200 shadow-sm relative">
             {isLoading && (
               <div className="absolute inset-0 bg-white/60 z-10 flex items-center justify-center rounded-2xl">
                 <Loader2 className="animate-spin text-slate-700" size={24} />
               </div>
             )}

             <div className="mb-6">
               <h3 className="text-base font-bold text-slate-900">Profile Details</h3>
               <p className="text-slate-400 text-[10px] uppercase font-semibold tracking-wider">Personal Information</p>
             </div>

             <div className="space-y-6">
                {/* Full Name */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Full Name</label>
                  {isEditing ? (
                    <input 
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-lg text-slate-800 text-xs focus:outline-none focus:border-slate-500 transition-colors outline-none"
                      placeholder="Your full name"
                    />
                  ) : (
                    <p className="w-full px-4 py-2.5 bg-slate-50 border border-slate-100 rounded-lg text-slate-800 text-xs font-semibold">
                      {userData.name}
                    </p>
                  )}
                </div>

                {/* Email - Always Read Only */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Login Email</label>
                  <p className="w-full px-4 py-2.5 bg-slate-50 border border-slate-100 rounded-lg text-slate-800 text-xs font-semibold">
                    {userData.email}
                  </p>
                </div>

                {/* Phone Number */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Phone Number</label>
                  {isEditing ? (
                    <input 
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-lg text-slate-800 text-xs focus:outline-none focus:border-slate-500 transition-colors outline-none"
                      placeholder="Your phone number"
                    />
                  ) : (
                    <p className="w-full px-4 py-2.5 bg-slate-50 border border-slate-100 rounded-lg text-slate-800 text-xs font-semibold">
                      {userData.phone || "Not provided"}
                    </p>
                  )}
                </div>

                {/* Bio */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Bio</label>
                  {isEditing ? (
                    <textarea 
                      name="bio"
                      value={formData.bio}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-lg text-slate-800 text-xs focus:outline-none focus:border-slate-500 transition-colors h-24 resize-none outline-none"
                      placeholder="Tell us about yourself..."
                    />
                  ) : (
                    <p className={`w-full px-4 py-2.5 bg-slate-50 border border-slate-100 rounded-lg text-slate-800 text-xs font-semibold ${!userData.bio ? 'italic text-slate-400' : ''}`}>
                      {userData.bio || "No bio set yet."}
                    </p>
                  )}
                </div>
             </div>
           </div>
         </div>

         {/* Right: Meta Info */}
         <div>
           {/* Profile Image */}
           <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col items-center">
             <div className="w-full flex justify-between items-center mb-6">
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Identity</p>
                <div className="w-2 h-2 bg-emerald-500 rounded-full" title="Profile Active" />
             </div>
             
             <div className="flex flex-col items-center gap-3">
               <div 
                 onClick={handleImageClick}
                 className="w-28 h-28 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center group relative overflow-hidden cursor-pointer"
               >
                  {isUploading ? (
                    <div className="absolute inset-0 bg-white/60 flex items-center justify-center z-20">
                      <Loader2 size={24} className="animate-spin text-slate-700" />
                    </div>
                  ) : null}

                  {userData.profile_image ? (
                    <SafeImage 
                      src={getProfileImageUrl(userData.profile_image)} 
                      alt={userData.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User size={48} className="text-slate-300" />
                  )}
                  
                  <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                     <Camera size={18} className="text-white" />
                  </div>
               </div>

               {userData.profile_image && (
                 <button 
                  onClick={handleRemoveImage}
                  className="flex items-center gap-1 text-[9px] font-bold uppercase tracking-wider text-slate-400 hover:text-red-500 transition-colors"
                 >
                   <Trash2 size={10} /> Remove Photo
                 </button>
               )}
             </div>

             <p className="mt-4 text-sm font-bold text-slate-800">{userData.name}</p>
             <p className="text-[10px] text-slate-400">
               Member since {userData.created_at ? new Date(userData.created_at).getFullYear() : '2024'}
             </p>
           </div>
         </div>
      </div>
    </div>
  );
};

export default ProfilePage;
