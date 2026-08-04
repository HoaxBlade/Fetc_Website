import React, { useState, useEffect } from 'react';
import { CheckSquare, Plus, Eye, Edit2, Trash2, Loader2, X, Check, Image as ImageIcon, Upload } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getAssetUrl } from '../../apiConfig';
import SafeImage from '../../components/SafeImage';

const DEFAULT_MOCKS = [
  { id: 'm1', title: "SELT (Secure English Language Test)", price: "₹49", status: "Published", content: "Official SELT practice exam with simulated reading, writing, and listening modules.", image_url: "" },
  { id: 'm2', title: "IELTS Academic & General Training", price: "₹49", status: "Published", content: "Full length IELTS mock test covering Academic & GT modules with instant band score feedback.", image_url: "" },
  { id: 'm3', title: "TOEFL iBT Practice", price: "₹49", status: "Published", content: "Complete TOEFL iBT simulator with timed sections and speech recognition checks.", image_url: "" },
  { id: 'm4', title: "PTE Academic Exam Prep", price: "₹49", status: "Published", content: "AI-scored PTE mock exam replicating the Pearson test center interface.", image_url: "" },
  { id: 'm5', title: "SAT Prep Simulators", price: "₹49", status: "Published", content: "Digital SAT practice tests with adaptive Math and Reading/Writing sections.", image_url: "" },
  { id: 'm6', title: "GMAT Focus Edition Mock", price: "₹49", status: "Published", content: "GMAT Focus edition exam prep with Quant, Data Insights, and Verbal evaluation.", image_url: "" },
  { id: 'm7', title: "GRE General Test Simulator", price: "₹49", status: "Published", content: "Full-length GRE simulator with analytical writing and section-level adaptivity.", image_url: "" },
  { id: 'm8', title: "Pearson Versant Test Simulator", price: "₹499", status: "Published", content: "Pearson Versant automated voice & fluency assessment simulator.", image_url: "" }
];

const AdminMockTest = () => {
  const [mockTests, setMockTests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingTest, setEditingTest] = useState(null);

  // Form states for Add / Edit
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('₹49');
  const [status, setStatus] = useState('Published');
  const [content, setContent] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  const fetchMockTests = async () => {
    try {
      setIsLoading(true);
      const res = await fetch((window.API_BASE || '') + '/api/admin/mock-tests', {
        headers: { 'ngrok-skip-browser-warning': 'true' }
      });
      const data = await res.json();
      if (data.success && data.mockTests && data.mockTests.length > 0) {
        setMockTests(data.mockTests);
      } else {
        setMockTests(DEFAULT_MOCKS);
      }
    } catch (err) {
      console.error('Failed to fetch mock tests:', err);
      setMockTests(DEFAULT_MOCKS);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMockTests();
  }, []);

  const handleOpenAdd = () => {
    setTitle('');
    setPrice('₹49');
    setStatus('Published');
    setContent('');
    setImageUrl('');
    setShowAddModal(true);
  };

  const handleOpenEdit = (test) => {
    setEditingTest(test);
    setTitle(test.title || '');
    setPrice(test.price || '₹49');
    setStatus(test.status || 'Published');
    setContent(test.content || '');
    setImageUrl(test.image_url || test.imageUrl || '');
  };

  const handleFileUpload = async (file) => {
    if (!file) return;
    setIsUploading(true);
    const formData = new FormData();
    formData.append('image', file);

    try {
      const res = await fetch((window.API_BASE || '') + '/api/admin/upload', {
        method: 'POST',
        headers: { 'ngrok-skip-browser-warning': 'true' },
        body: formData,
      });
      const data = await res.json();
      if (data.success && data.url) {
        setImageUrl(data.url);
      } else {
        alert(data.message || 'Failed to upload image. Please try again.');
      }
    } catch (err) {
      console.error('Image upload error:', err);
      alert('Failed to upload image. Please check your network or try a smaller image file.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!title) return;
    try {
      const payload = { title, price, status, content, image_url: imageUrl };
      const res = await fetch((window.API_BASE || '') + '/api/admin/mock-tests', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'true'
        },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (data.success) {
        setMockTests([data.mockTest, ...mockTests]);
      } else {
        const newMock = { id: 'm-' + Date.now(), ...payload };
        setMockTests([newMock, ...mockTests]);
      }
    } catch (err) {
      console.error('Failed to create mock test:', err);
      const newMock = { id: 'm-' + Date.now(), title, price, status, content, image_url: imageUrl };
      setMockTests([newMock, ...mockTests]);
    } finally {
      setShowAddModal(false);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!editingTest || !title) return;

    try {
      const payload = { title, price, status, content, image_url: imageUrl };
      const res = await fetch((window.API_BASE || '') + `/api/admin/mock-tests/${editingTest.id}`, {
        method: 'PATCH',
        headers: { 
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'true'
        },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (data.success) {
        setMockTests(mockTests.map((t) => (t.id === editingTest.id ? data.mockTest : t)));
      } else {
        setMockTests(mockTests.map((t) => (t.id === editingTest.id ? { ...t, ...payload } : t)));
      }
    } catch (err) {
      console.error('Failed to update mock test:', err);
      setMockTests(mockTests.map((t) => (t.id === editingTest.id ? { ...t, title, price, status, content, image_url: imageUrl } : t)));
    } finally {
      setEditingTest(null);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this mock test?')) return;
    try {
      await fetch((window.API_BASE || '') + `/api/admin/mock-tests/${id}`, {
        method: 'DELETE',
        headers: { 'ngrok-skip-browser-warning': 'true' }
      });
      setMockTests(mockTests.filter((t) => t.id !== id));
    } catch (err) {
      console.error('Failed to delete mock test:', err);
      setMockTests(mockTests.filter((t) => t.id !== id));
    }
  };

  return (
    <div className="max-w-[1600px] mx-auto">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center text-slate-700">
            <CheckSquare size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">All Mock Tests</h1>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Link
            to="/mock"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 bg-white border border-slate-200 text-slate-700 px-4 py-2.5 rounded-xl font-medium text-xs hover:bg-slate-50 transition-all shadow-sm"
          >
            <Eye size={14} /> View Page
          </Link>
          <button
            onClick={handleOpenAdd}
            className="flex items-center gap-1.5 bg-slate-900 text-white px-4 py-2.5 rounded-xl font-medium text-xs hover:bg-slate-800 transition-all shadow-sm"
          >
            <Plus size={14} /> Create Mock Test
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="p-12 text-center text-slate-400 flex items-center justify-center gap-2">
            <Loader2 className="animate-spin" size={20} /> Loading mock tests...
          </div>
        ) : (
          <div className="overflow-x-auto p-4">
            <table className="w-full text-left border-separate border-spacing-y-2">
              <thead>
                <tr className="text-slate-400 text-[10px] font-semibold uppercase tracking-widest px-4">
                  <th className="px-6 pb-2">Test Info</th>
                  <th className="px-6 pb-2">Description / Content</th>
                  <th className="px-6 pb-2">Price</th>
                  <th className="px-6 pb-2">Status</th>
                  <th className="px-6 pb-2 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {mockTests.map((test) => {
                  const testImg = test.image_url || test.imageUrl;
                  return (
                    <tr key={test.id} className="bg-slate-50 rounded-xl hover:bg-slate-100/80 transition-colors">
                      <td className="px-6 py-4 font-semibold text-xs text-slate-700 rounded-l-xl">
                        <div className="flex items-center gap-3">
                          {testImg ? (
                            <SafeImage
                              src={getAssetUrl(testImg)}
                              alt={test.title}
                              className="w-10 h-10 rounded-lg object-cover border border-slate-200 shrink-0"
                            />
                          ) : (
                            <div className="w-10 h-10 rounded-lg bg-slate-200 flex items-center justify-center text-slate-400 shrink-0">
                              <ImageIcon size={18} />
                            </div>
                          )}
                          <span className="font-bold text-slate-900">{test.title}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-xs text-slate-600 font-medium max-w-xs truncate">
                        {test.content || test.description || <span className="text-slate-400 italic">No content added</span>}
                      </td>
                      <td className="px-6 py-4 text-xs text-slate-600 font-medium font-mono">
                        {test.price}
                      </td>
                      <td className="px-6 py-4 text-xs">
                        <span className={`px-2.5 py-1 text-[10px] font-semibold rounded-lg border ${
                          test.status === 'Draft' 
                            ? 'bg-amber-50 text-amber-600 border-amber-100' 
                            : 'bg-emerald-50 text-emerald-600 border-emerald-100'
                        }`}>
                          {test.status || 'Published'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right rounded-r-xl">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleOpenEdit(test)}
                            title="Edit Mock Test"
                            className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-all"
                          >
                            <Edit2 size={14} />
                          </button>
                          <button
                            onClick={() => handleDelete(test.id)}
                            title="Delete Mock Test"
                            className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-all"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        <div className="p-6 text-center border-t border-slate-50 text-slate-400 text-xs italic">
          List of all mock tests ({mockTests.length} items)
        </div>
      </div>

      {/* CREATE MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-white rounded-2xl p-6 w-full max-w-lg shadow-2xl border border-slate-100 my-8 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-slate-900">Create New Mock Test</h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Title</label>
                <input
                  required
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-slate-900"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Duolingo English Test Practice"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Price</label>
                  <input
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-slate-900"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="e.g. ₹49"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Status</label>
                  <select
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-slate-900"
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                  >
                    <option value="Published">Published</option>
                    <option value="Draft">Draft</option>
                  </select>
                </div>
              </div>

              {/* Cover Image Upload & URL */}
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Cover Image</label>
                <div className="flex items-center gap-3">
                  {imageUrl ? (
                    <div className="relative w-16 h-16 rounded-xl overflow-hidden border border-slate-200 shrink-0">
                      <SafeImage src={getAssetUrl(imageUrl)} alt="Preview" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => setImageUrl('')}
                        className="absolute top-1 right-1 p-0.5 bg-red-500 text-white rounded-full hover:bg-red-600"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  ) : null}
                  <div className="flex-1 space-y-2">
                    <input
                      type="text"
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-slate-900"
                      value={imageUrl}
                      onChange={(e) => setImageUrl(e.target.value)}
                      placeholder="Paste Image URL or upload below..."
                    />
                    <label className="inline-flex items-center gap-2 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold cursor-pointer transition-colors">
                      {isUploading ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} />}
                      {isUploading ? 'Uploading...' : 'Upload Image'}
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleFileUpload(e.target.files?.[0])}
                      />
                    </label>
                  </div>
                </div>
              </div>

              {/* Content / Description Field */}
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Content / Description</label>
                <textarea
                  rows={4}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-slate-900 resize-y"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Enter detailed content, test format, syllabus, or instructions..."
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-slate-900 text-white rounded-xl font-semibold text-xs hover:bg-slate-800 transition-all flex items-center justify-center gap-2"
              >
                <Check size={16} /> Save Mock Test
              </button>
            </form>
          </div>
        </div>
      )}

      {/* EDIT MODAL */}
      {editingTest && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-white rounded-2xl p-6 w-full max-w-lg shadow-2xl border border-slate-100 my-8 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-slate-900">Edit Mock Test</h3>
              <button onClick={() => setEditingTest(null)} className="text-slate-400 hover:text-slate-600">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleUpdate} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Title</label>
                <input
                  required
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-slate-900"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Price</label>
                  <input
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-slate-900"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Status</label>
                  <select
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-slate-900"
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                  >
                    <option value="Published">Published</option>
                    <option value="Draft">Draft</option>
                  </select>
                </div>
              </div>

              {/* Cover Image Upload & URL */}
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Cover Image</label>
                <div className="flex items-center gap-3">
                  {imageUrl ? (
                    <div className="relative w-16 h-16 rounded-xl overflow-hidden border border-slate-200 shrink-0">
                      <SafeImage src={getAssetUrl(imageUrl)} alt="Preview" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => setImageUrl('')}
                        className="absolute top-1 right-1 p-0.5 bg-red-500 text-white rounded-full hover:bg-red-600"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  ) : null}
                  <div className="flex-1 space-y-2">
                    <input
                      type="text"
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-slate-900"
                      value={imageUrl}
                      onChange={(e) => setImageUrl(e.target.value)}
                      placeholder="Paste Image URL or upload below..."
                    />
                    <label className="inline-flex items-center gap-2 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold cursor-pointer transition-colors">
                      {isUploading ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} />}
                      {isUploading ? 'Uploading...' : 'Upload Image'}
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleFileUpload(e.target.files?.[0])}
                      />
                    </label>
                  </div>
                </div>
              </div>

              {/* Content / Description Field */}
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Content / Description</label>
                <textarea
                  rows={4}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-slate-900 resize-y"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Enter detailed content, test format, syllabus, or instructions..."
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-slate-900 text-white rounded-xl font-semibold text-xs hover:bg-slate-800 transition-all flex items-center justify-center gap-2"
              >
                <Check size={16} /> Save Changes
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminMockTest;
