import React, { useState, useEffect, useRef } from 'react';
import { 
  User, Save, Loader2, Camera, Trash2
} from 'lucide-react';
import { getProfileImageUrl } from "../apiConfig";
import SafeImage from "../components/SafeImage";

const defaultProfileDetails = {
  candidateName: "",
  ageOfCandidate: "",
  dob: "",
  studentPhone: "",
  studentEmail: "",
  budget: "",
  subjectInterest: "",
  country: "",
  statePreference: "",
  cityPreference: "",
  testScores: "",
  toeflScore: "",
  toeflMock: "",
  toeflDate: "",
  ieltsScore: "",
  ieltsMock: "",
  ieltsDate: "",
  greScore: "",
  greMock: "",
  greDate: "",
  gmatScore: "",
  gmatMock: "",
  gmatDate: "",
  satScore: "",
  satMock: "",
  satDate: "",
  currentStatus: "",
  passingYear10th: "",
  schoolName10th: "",
  passingYear12th: "",
  stream12th: "",
  schoolName12th: "",
  passingYearDiploma: "",
  diplomaName: "",
  awardingBodyDiploma: "",
  durationDiploma: "",
  passingYearBachelors: "",
  degreeNameBachelors: "",
  collegeNameBachelors: "",
  universityNameBachelors: "",
  durationBachelors: "",
  backlogsBachelors: "",
  passingYearPgDiploma: "",
  pgDiplomaName: "",
  awardingBodyPgDiploma: "",
  durationPgDiploma: "",
  passingYearMasters: "",
  degreeNameMasters: "",
  collegeNameMasters: "",
  universityNameMasters: "",
  durationMasters: "",
  backlogsMasters: ""
};

const ProfilePage = () => {
  const [userData, setUserData] = useState(() => 
    JSON.parse(localStorage.getItem('user') || '{"name":"User","email":"user@example.com","role":"STUDENT","phone":""}')
  );

  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);

  const getProfileDetails = () => {
    try {
      if (!userData.profile_details) return defaultProfileDetails;
      if (typeof userData.profile_details === 'string') {
        return { ...defaultProfileDetails, ...JSON.parse(userData.profile_details) };
      }
      return { ...defaultProfileDetails, ...userData.profile_details };
    } catch (e) {
      return defaultProfileDetails;
    }
  };

  const [formData, setFormData] = useState({
    name: userData.name,
    phone: userData.phone || userData.phoneNumber || "",
    bio: userData.bio || "",
    profile_details: getProfileDetails()
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
          
          let parsedDetails = {};
          if (data.user.profile_details) {
            parsedDetails = typeof data.user.profile_details === 'string'
              ? JSON.parse(data.user.profile_details)
              : data.user.profile_details;
          }
          setFormData({
            name: data.user.name,
            phone: data.user.phone || "",
            bio: data.user.bio || "",
            profile_details: { ...defaultProfileDetails, ...parsedDetails }
          });
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
  }, [userData.id, userData.email]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleDetailChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      profile_details: {
        ...prev.profile_details,
        [name]: value
      }
    }));
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
        alert('Profile saved successfully!');
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

  const renderRow = (label, name) => {
    const value = formData.profile_details?.[name] || "";
    return (
      <tr key={name} className="border border-slate-400">
        <td className="w-1/2 border border-slate-400 bg-white p-2 text-xs font-bold text-slate-800">
          {label}
        </td>
        <td className="w-1/2 border border-slate-400 bg-white p-2 text-xs text-slate-800">
          <input
            type="text"
            name={name}
            value={value}
            onChange={handleDetailChange}
            placeholder="-"
            className="w-full px-2 py-1 border border-slate-200 rounded text-xs bg-slate-50 focus:bg-white focus:border-brand-500 focus:outline-none transition-colors"
          />
        </td>
      </tr>
    );
  };

  const renderSeparator = () => (
    <tr className="bg-[#ffff00] h-6 border border-slate-400">
      <td colSpan="2" className="border border-slate-400"></td>
    </tr>
  );

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
        
        <button 
          onClick={handleSave}
          disabled={isSaving}
          className="flex items-center gap-1.5 bg-slate-900 text-white px-5 py-2 rounded-xl font-medium hover:bg-slate-800 transition-colors text-xs shadow-sm disabled:opacity-50"
        >
          {isSaving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
          {isSaving ? "Saving..." : "Save Changes"}
        </button>
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
                  <input 
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-lg text-slate-800 text-xs focus:outline-none focus:border-slate-500 transition-colors outline-none"
                    placeholder="Your full name"
                  />
                </div>

                {/* Email - Always Read Only */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Login Email</label>
                  <p className="w-full px-4 py-2.5 bg-slate-50 border border-slate-100 rounded-lg text-slate-800/60 text-xs font-semibold">
                    {userData.email}
                  </p>
                </div>

                {/* Phone Number */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Phone Number</label>
                  <input 
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-lg text-slate-800 text-xs focus:outline-none focus:border-slate-500 transition-colors outline-none"
                    placeholder="Your phone number"
                  />
                </div>

                {/* Bio */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Bio</label>
                  <textarea 
                    name="bio"
                    value={formData.bio}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-lg text-slate-800 text-xs focus:outline-none focus:border-slate-500 transition-colors h-24 resize-none outline-none"
                    placeholder="Tell us about yourself..."
                  />
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

      {/* Dynamic Profile Tables */}
      <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Side: General Details & Test Scores */}
        <div className="space-y-6">
          <div className="overflow-x-auto bg-white border border-slate-200 rounded-2xl shadow-sm p-4 md:p-6">
            <table className="border-collapse border border-slate-400 w-full">
              <thead>
                <tr className="bg-[#ffff00] border border-slate-400">
                  <th colSpan="2" className="border border-slate-400 p-2.5 text-xs font-bold text-slate-900 text-center uppercase tracking-wide">
                    General Details
                  </th>
                </tr>
              </thead>
              <tbody>
                {renderRow("Candidate Name", "candidateName")}
                {renderRow("Age of Candidate", "ageOfCandidate")}
                {renderRow("Date of Birth", "dob")}
                {renderRow("Student Phone", "studentPhone")}
                {renderRow("Student Email", "studentEmail")}
                {renderRow("Any Budget for Studying Abroad", "budget")}
                {renderRow("Choose Subject and Interest", "subjectInterest")}
                {renderRow("Choose Country", "country")}
                {renderRow("Any State Preference", "statePreference")}
                {renderRow("Any City Preference", "cityPreference")}
              </tbody>
            </table>
          </div>

          <div className="overflow-x-auto bg-white border border-slate-200 rounded-2xl shadow-sm p-4 md:p-6">
            <table className="border-collapse border border-slate-400 w-full">
              <tbody>
                {renderRow("Test Scores", "testScores")}
                {renderRow("TOEFL Score", "toeflScore")}
                {renderRow("Toefl mock score", "toeflMock")}
                {renderRow("Toefl test date", "toeflDate")}
                
                {renderSeparator()}
                
                {renderRow("IELTS Score", "ieltsScore")}
                {renderRow("IELTS mock score", "ieltsMock")}
                {renderRow("IELTS Date", "ieltsDate")}
                
                {renderSeparator()}
                
                {renderRow("GRE Score", "greScore")}
                {renderRow("GRE Mock score", "greMock")}
                {renderRow("GRE Date", "greDate")}
                
                {renderSeparator()}
                
                {renderRow("GMAT Score", "gmatScore")}
                {renderRow("GMAT mock score", "gmatMock")}
                {renderRow("GMAT Date", "gmatDate")}
                
                {renderSeparator()}
                
                {renderRow("SAT Score", "satScore")}
                {renderRow("SAT mock score", "satMock")}
                {renderRow("SAT date", "satDate")}
              </tbody>
            </table>

            {/* Current Status Section */}
            <table className="border-collapse border border-slate-400 w-full mt-4">
              <tbody>
                <tr className="border border-slate-400">
                  <td className="w-1/2 border border-slate-400 bg-white p-2 text-xs font-bold text-slate-800 text-center">
                    Current Status -
                  </td>
                  <td className="w-1/2 border border-slate-400 bg-[#ffff00] p-2 text-xs text-black font-bold">
                    <input
                      type="text"
                      name="currentStatus"
                      value={formData.profile_details?.currentStatus || ""}
                      onChange={handleDetailChange}
                      placeholder="-"
                      className="w-full px-2 py-1 border border-slate-300 rounded text-xs bg-[#ffff00] text-black font-bold focus:bg-white focus:text-slate-900 focus:outline-none"
                    />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Side: Academics */}
        <div className="space-y-6">
          <div className="overflow-x-auto bg-white border border-slate-200 rounded-2xl shadow-sm p-4 md:p-6">
            <table className="border-collapse border border-slate-400 w-full">
              <thead>
                <tr className="bg-[#ffff00] border border-slate-400">
                  <th colSpan="2" className="border border-slate-400 p-2.5 text-xs font-bold text-slate-900 text-center uppercase tracking-wide">
                    Academics
                  </th>
                </tr>
              </thead>
              <tbody>
                {renderRow("10th", "passingYear10th")}
                {renderRow("Passing Year for 10th", "passingYear10thYear")}
                {renderRow("School name", "schoolName10th")}

                {renderSeparator()}

                {renderRow("12th", "passingYear12th")}
                {renderRow("Passing Year for 12th", "passingYear12thYear")}
                {renderRow("Stream (Science/Comm/Arts)", "stream12th")}
                {renderRow("School name", "schoolName12th")}

                {renderSeparator()}

                {renderRow("Diploma", "passingYearDiploma")}
                {renderRow("Passing Year for Diploma", "passingYearDiplomaYear")}
                {renderRow("Diploma Name", "diplomaName")}
                {renderRow("Awarding Body of Diploma", "awardingBodyDiploma")}
                {renderRow("Duration of Diploma", "durationDiploma")}

                {renderSeparator()}

                {renderRow("Bachelors", "passingYearBachelors")}
                {renderRow("Passing Year for Bachelors", "passingYearBachelorsYear")}
                {renderRow("Degree Name", "degreeNameBachelors")}
                {renderRow("College Name", "collegeNameBachelors")}
                {renderRow("University Name", "universityNameBachelors")}
                {renderRow("Duration of Course", "durationBachelors")}
                {renderRow("Backlogs of Subjects - Provide Subject names (If any)", "backlogsBachelors")}

                {renderSeparator()}

                {renderRow("PG Diploma", "passingYearPgDiploma")}
                {renderRow("Passing Year for PG Diploma", "passingYearPgDiplomaYear")}
                {renderRow("PG Diploma Name", "pgDiplomaName")}
                {renderRow("Awarding Body of PG Diploma", "awardingBodyPgDiploma")}
                {renderRow("Duration of Diploma", "durationPgDiploma")}

                {renderSeparator()}

                {renderRow("Masters", "passingYearMasters")}
                {renderRow("Passing Year for Masters", "passingYearMastersYear")}
                {renderRow("Degree Name", "degreeNameMasters")}
                {renderRow("College Name", "collegeNameMasters")}
                {renderRow("University Name", "universityNameMasters")}
                {renderRow("Duration of Course", "durationMasters")}
                {renderRow("Backlogs of Subjects - Provide Subject names (If any)", "backlogsMasters")}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="mt-8 flex justify-end">
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="flex items-center gap-2 bg-slate-900 text-white px-6 py-3 rounded-xl font-bold hover:bg-slate-800 transition-colors text-xs shadow-md disabled:opacity-50"
        >
          {isSaving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
          {isSaving ? "Saving..." : "Save Profile Details"}
        </button>
      </div>
    </div>
  );
};

export default ProfilePage;
