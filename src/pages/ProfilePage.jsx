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

  const formatDateForInput = (dateStr) => {
    if (!dateStr) return '';
    if (typeof dateStr === 'string' && dateStr.includes('T')) {
      return dateStr.split('T')[0];
    }
    return dateStr;
  };

  const getProfileDetails = (userObj = userData, currentFormData = {}) => {
    try {
      let details = {};
      if (userObj.profile_details) {
        details = typeof userObj.profile_details === 'string'
          ? JSON.parse(userObj.profile_details)
          : userObj.profile_details;
      }
      return {
        ...defaultProfileDetails,
        ...details,
        candidateName: details.candidateName || currentFormData.name || userObj.name || "",
        studentPhone: details.studentPhone || currentFormData.phone || userObj.phone || userObj.phoneNumber || "",
        studentEmail: details.studentEmail || userObj.email || "",
        dob: formatDateForInput(details.dob || userObj.dob || "")
      };
    } catch (e) {
      return {
        ...defaultProfileDetails,
        candidateName: currentFormData.name || userObj.name || "",
        studentPhone: currentFormData.phone || userObj.phone || userObj.phoneNumber || "",
        studentEmail: userObj.email || ""
      };
    }
  };

  const [formData, setFormData] = useState({
    name: userData.name,
    phone: userData.phone || userData.phoneNumber || "",
    bio: userData.bio || "",
    profile_details: getProfileDetails(userData)
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
          
          const details = getProfileDetails(data.user, { name: data.user.name, phone: data.user.phone });
          setFormData({
            name: data.user.name,
            phone: data.user.phone || "",
            bio: data.user.bio || "",
            profile_details: details
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
    setFormData(prev => {
      const updated = { ...prev, [name]: value };
      const pd = prev.profile_details || {};
      let updatedDetails = { ...pd };
      if (name === 'name' && (!pd.candidateName || pd.candidateName === prev.name)) {
        updatedDetails.candidateName = value;
      }
      if (name === 'phone' && (!pd.studentPhone || pd.studentPhone === prev.phone)) {
        updatedDetails.studentPhone = value;
      }
      return {
        ...updated,
        profile_details: updatedDetails
      };
    });
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
      // 1. Save user profile details
      const response = await fetch((window.API_BASE || "") + `/api/users/profile/${identifier}`, {
        method: 'PATCH',
        headers: { 
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'true'
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      // 2. Direct sync to student_profiles table endpoint
      try {
        const pd = formData.profile_details || {};
        const studentProfilePayload = {
          candidate_name: pd.candidateName || formData.name || userData.name || '',
          candidate_age: pd.ageOfCandidate || '',
          dob: pd.dob || '',
          student_phone: pd.studentPhone || formData.phone || userData.phone || '',
          student_email: pd.studentEmail || userData.email || '',
          study_budget: pd.budget || '',
          subject_interest: pd.subjectInterest || '',
          target_country: pd.country || '',
          state_preference: pd.statePreference || '',
          city_preference: pd.cityPreference || '',
          current_status: pd.currentStatus || '',

          toefl_score: pd.toeflScore || '',
          toefl_mock_score: pd.toeflMock || '',
          toefl_test_date: pd.toeflDate || '',

          ielts_score: pd.ieltsScore || '',
          ielts_mock_score: pd.ieltsMock || '',
          ielts_test_date: pd.ieltsDate || '',

          gre_score: pd.greScore || '',
          gre_mock_score: pd.greMock || '',
          gre_test_date: pd.greDate || '',

          gmat_score: pd.gmatScore || '',
          gmat_mock_score: pd.gmatMock || '',
          gmat_test_date: pd.gmatDate || '',

          sat_score: pd.satScore || '',
          sat_mock_score: pd.satMock || '',
          sat_test_date: pd.satDate || '',

          tenth_score: pd.passingYear10th || '',
          tenth_passing_year: pd.passingYear10thYear || '',
          tenth_school: pd.schoolName10th || '',

          twelfth_score: pd.passingYear12th || '',
          twelfth_passing_year: pd.passingYear12thYear || '',
          twelfth_stream: pd.stream12th || '',
          twelfth_school: pd.schoolName12th || '',

          diploma_score: pd.passingYearDiploma || '',
          diploma_passing_year: pd.passingYearDiplomaYear || '',
          diploma_name: pd.diplomaName || '',
          diploma_awarding_body: pd.awardingBodyDiploma || '',
          diploma_duration: pd.durationDiploma || '',

          bachelors_score: pd.passingYearBachelors || '',
          bachelors_passing_year: pd.passingYearBachelorsYear || '',
          bachelors_degree: pd.degreeNameBachelors || '',
          bachelors_college: pd.collegeNameBachelors || '',
          bachelors_university: pd.universityNameBachelors || '',
          bachelors_duration: pd.durationBachelors || '',
          bachelors_backlogs: pd.backlogsBachelors || '',

          pg_diploma_score: pd.passingYearPgDiploma || '',
          pg_diploma_passing_year: pd.passingYearPgDiplomaYear || '',
          pg_diploma_name: pd.pgDiplomaName || '',
          pg_diploma_awarding_body: pd.awardingBodyPgDiploma || '',
          pg_diploma_duration: pd.durationPgDiploma || '',

          masters_score: pd.passingYearMasters || '',
          masters_passing_year: pd.passingYearMastersYear || '',
          masters_degree: pd.degreeNameMasters || '',
          masters_college: pd.collegeNameMasters || '',
          masters_university: pd.universityNameMasters || '',
          masters_duration: pd.durationMasters || '',
          masters_backlogs: pd.backlogsMasters || ''
        };

        await fetch((window.API_BASE || "") + `/api/users/${identifier}/student-profile`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'ngrok-skip-browser-warning': 'true'
          },
          body: JSON.stringify(studentProfilePayload)
        });
      } catch (syncErr) {
        console.error("Error saving student profile sync:", syncErr);
      }

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

  const renderInputBlock = (label, name, placeholder = "-", type = "text") => {
    const rawVal = formData.profile_details?.[name] || "";
    const value = type === "date" ? formatDateForInput(rawVal) : rawVal;
    return (
      <div key={name} className="space-y-1">
        <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{label}</label>
        <input
          type={type}
          name={name}
          value={value}
          onChange={handleDetailChange}
          placeholder={placeholder}
          className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-lg text-slate-800 text-xs focus:outline-none focus:border-slate-500 transition-colors outline-none cursor-pointer"
        />
      </div>
    );
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

      {/* Dynamic Profile Sections */}
      <div className="mt-8 space-y-8">
        {/* Upper Row: General Details & Test Scores side by side */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {/* General Details Card */}
          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 md:p-8">
            <div className="mb-6">
              <h3 className="text-base font-bold text-slate-900">General Details</h3>
              <p className="text-slate-400 text-[10px] uppercase font-semibold tracking-wider">Candidate info & preferences</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {renderInputBlock("Candidate Name", "candidateName")}
              {renderInputBlock("Age of Candidate", "ageOfCandidate")}
              {renderInputBlock("Date of Birth", "dob", "", "date")}
              {renderInputBlock("Student Phone", "studentPhone")}
              {renderInputBlock("Student Email", "studentEmail")}
              {renderInputBlock("Any Budget for Studying Abroad", "budget")}
              {renderInputBlock("Choose Subject and Interest", "subjectInterest")}
              {renderInputBlock("Choose Country", "country")}
              {renderInputBlock("Any State Preference", "statePreference")}
              {renderInputBlock("Any City Preference", "cityPreference")}
            </div>

            {/* Current Status */}
            <div className="mt-6 pt-6 border-t border-slate-100">
              <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Current Status</label>
              <input
                type="text"
                name="currentStatus"
                value={formData.profile_details?.currentStatus || ""}
                onChange={handleDetailChange}
                placeholder="Enter current status..."
                className="w-full mt-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 text-xs font-semibold focus:outline-none focus:bg-white focus:border-slate-500 transition-colors outline-none"
              />
            </div>
          </div>

          {/* Test Scores Card */}
          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 md:p-8">
            <div className="mb-6">
              <h3 className="text-base font-bold text-slate-900">Test Scores</h3>
              <p className="text-slate-400 text-[10px] uppercase font-semibold tracking-wider">Standardized exam results</p>
            </div>

            <div className="space-y-6">
              {/* TOEFL */}
              <div>
                <h4 className="text-xs font-bold text-slate-800 mb-3 uppercase tracking-wider pb-1 border-b border-slate-100">TOEFL</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {renderInputBlock("TOEFL Score", "toeflScore")}
                  {renderInputBlock("Mock Score", "toeflMock")}
                  {renderInputBlock("Test Date", "toeflDate", "", "date")}
                </div>
              </div>

              {/* IELTS */}
              <div className="pt-4 border-t border-slate-100">
                <h4 className="text-xs font-bold text-slate-800 mb-3 uppercase tracking-wider pb-1 border-b border-slate-100">IELTS</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {renderInputBlock("IELTS Score", "ieltsScore")}
                  {renderInputBlock("Mock Score", "ieltsMock")}
                  {renderInputBlock("IELTS Date", "ieltsDate", "", "date")}
                </div>
              </div>

              {/* GRE */}
              <div className="pt-4 border-t border-slate-100">
                <h4 className="text-xs font-bold text-slate-800 mb-3 uppercase tracking-wider pb-1 border-b border-slate-100">GRE</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {renderInputBlock("GRE Score", "greScore")}
                  {renderInputBlock("Mock Score", "greMock")}
                  {renderInputBlock("GRE Date", "greDate", "", "date")}
                </div>
              </div>

              {/* GMAT */}
              <div className="pt-4 border-t border-slate-100">
                <h4 className="text-xs font-bold text-slate-800 mb-3 uppercase tracking-wider pb-1 border-b border-slate-100">GMAT</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {renderInputBlock("GMAT Score", "gmatScore")}
                  {renderInputBlock("Mock Score", "gmatMock")}
                  {renderInputBlock("GMAT Date", "gmatDate", "", "date")}
                </div>
              </div>

              {/* SAT */}
              <div className="pt-4 border-t border-slate-100">
                <h4 className="text-xs font-bold text-slate-800 mb-3 uppercase tracking-wider pb-1 border-b border-slate-100">SAT</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {renderInputBlock("SAT Score", "satScore")}
                  {renderInputBlock("Mock Score", "satMock")}
                  {renderInputBlock("SAT Date", "satDate", "", "date")}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Lower Row: Academics below them */}
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 md:p-8">
          <div className="mb-6">
            <h3 className="text-base font-bold text-slate-900">Academics</h3>
            <p className="text-slate-400 text-[10px] uppercase font-semibold tracking-wider">Educational history</p>
          </div>

          <div className="space-y-6">
            {/* 10th */}
            <div>
              <h4 className="text-xs font-bold text-slate-800 mb-3 uppercase tracking-wider pb-1 border-b border-slate-100">10th Standard</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {renderInputBlock("10th Score", "passingYear10th")}
                {renderInputBlock("Passing Year", "passingYear10thYear")}
                {renderInputBlock("School Name", "schoolName10th")}
              </div>
            </div>

            {/* 12th */}
            <div className="pt-4 border-t border-slate-100">
              <h4 className="text-xs font-bold text-slate-800 mb-3 uppercase tracking-wider pb-1 border-b border-slate-100">12th Standard</h4>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {renderInputBlock("12th Score", "passingYear12th")}
                {renderInputBlock("Passing Year", "passingYear12thYear")}
                {renderInputBlock("Stream", "stream12th")}
                {renderInputBlock("School Name", "schoolName12th")}
              </div>
            </div>

            {/* Diploma */}
            <div className="pt-4 border-t border-slate-100">
              <h4 className="text-xs font-bold text-slate-800 mb-3 uppercase tracking-wider pb-1 border-b border-slate-100">Diploma</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {renderInputBlock("Diploma Score", "passingYearDiploma")}
                {renderInputBlock("Passing Year", "passingYearDiplomaYear")}
                {renderInputBlock("Diploma Name", "diplomaName")}
                {renderInputBlock("Awarding Body", "awardingBodyDiploma")}
                {renderInputBlock("Duration", "durationDiploma")}
              </div>
            </div>

            {/* Bachelors */}
            <div className="pt-4 border-t border-slate-100">
              <h4 className="text-xs font-bold text-slate-800 mb-3 uppercase tracking-wider pb-1 border-b border-slate-100">Bachelors</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {renderInputBlock("Bachelors Score", "passingYearBachelors")}
                {renderInputBlock("Passing Year", "passingYearBachelorsYear")}
                {renderInputBlock("Degree Name", "degreeNameBachelors")}
                {renderInputBlock("College Name", "collegeNameBachelors")}
                {renderInputBlock("University Name", "universityNameBachelors")}
                {renderInputBlock("Duration of Course", "durationBachelors")}
                <div className="md:col-span-3">
                  {renderInputBlock("Backlogs (If any)", "backlogsBachelors")}
                </div>
              </div>
            </div>

            {/* PG Diploma */}
            <div className="pt-4 border-t border-slate-100">
              <h4 className="text-xs font-bold text-slate-800 mb-3 uppercase tracking-wider pb-1 border-b border-slate-100">PG Diploma</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {renderInputBlock("PG Diploma Score", "passingYearPgDiploma")}
                {renderInputBlock("Passing Year", "passingYearPgDiplomaYear")}
                {renderInputBlock("PG Diploma Name", "pgDiplomaName")}
                {renderInputBlock("Awarding Body", "awardingBodyPgDiploma")}
                {renderInputBlock("Duration of Course", "durationPgDiploma")}
              </div>
            </div>

            {/* Masters */}
            <div className="pt-4 border-t border-slate-100">
              <h4 className="text-xs font-bold text-slate-800 mb-3 uppercase tracking-wider pb-1 border-b border-slate-100">Masters</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {renderInputBlock("Masters Score", "passingYearMasters")}
                {renderInputBlock("Passing Year", "passingYearMastersYear")}
                {renderInputBlock("Degree Name", "degreeNameMasters")}
                {renderInputBlock("College Name", "collegeNameMasters")}
                {renderInputBlock("University Name", "universityNameMasters")}
                {renderInputBlock("Duration of Course", "durationMasters")}
                <div className="md:col-span-3">
                  {renderInputBlock("Backlogs (If any)", "backlogsMasters")}
                </div>
              </div>
            </div>
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
