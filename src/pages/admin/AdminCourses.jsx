import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Plus, Search, Filter, Download, Edit2, Trash2, Loader2, X, Check } from 'lucide-react';
import { getApiUrl } from '../../apiConfig';

const AdminCourses = () => {
  const [courses, setCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    courseId: '',
    title: '',
    description: '',
    category: 'Language Exam',
    price: '',
    duration: '4 Weeks',
    level: 'Intermediate',
    status: 'ACTIVE'
  });

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(getApiUrl('/api/v1/course/all'));
      const data = await res.json();
      if (data.success) {
        setCourses(data.courses || []);
      }
    } catch (err) {
      console.error('Error fetching courses:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenAddModal = () => {
    setEditingCourse(null);
    setFormData({
      courseId: '',
      title: '',
      description: '',
      category: 'Language Exam',
      price: '',
      duration: '4 Weeks',
      level: 'Intermediate',
      status: 'ACTIVE'
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (course) => {
    setEditingCourse(course);
    setFormData({
      courseId: course.courseId || '',
      title: course.title || '',
      description: course.description || '',
      category: course.category || 'General',
      price: course.price || '',
      duration: course.duration || '4 Weeks',
      level: course.level || 'Intermediate',
      status: course.status || 'ACTIVE'
    });
    setIsModalOpen(true);
  };

  const handleDeleteCourse = async (id) => {
    if (!window.confirm('Are you sure you want to delete this course?')) return;
    try {
      const res = await fetch(getApiUrl(`/api/v1/course/${id}`), { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        fetchCourses();
      } else {
        alert(data.message || 'Failed to delete course');
      }
    } catch (err) {
      console.error('Error deleting course:', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      alert('Course title is required');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch(getApiUrl('/api/v1/course/create'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (data.success) {
        setIsModalOpen(false);
        fetchCourses();
      } else {
        alert(data.message || 'Failed to save course');
      }
    } catch (err) {
      console.error('Error saving course:', err);
      alert('Failed to connect to backend.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredCourses = courses.filter((c) => {
    const query = searchQuery.toLowerCase();
    return (
      c.title.toLowerCase().includes(query) ||
      (c.category && c.category.toLowerCase().includes(query)) ||
      (c.courseId && c.courseId.toLowerCase().includes(query))
    );
  });

  const totalActiveStudents = courses.reduce((sum, c) => sum + (c.studentsCount || 0), 0);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-[1600px] mx-auto"
    >
      <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-semibold text-slate-900 tracking-tight mb-2">Courses Management</h1>
          <p className="text-slate-500 font-medium text-sm italic">Manage your curriculum and student enrollments.</p>
        </div>
        <button 
          onClick={handleOpenAddModal}
          className="flex items-center gap-2 bg-brand-600 text-white px-6 py-3 rounded-2xl font-medium text-sm hover:bg-brand-700 transition-all shadow-lg shadow-brand-200"
        >
          <Plus size={18} /> Add New Course
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
          <p className="text-slate-400 text-xs font-medium uppercase mb-1">Total Courses</p>
          <h3 className="text-2xl font-semibold text-slate-800">{isLoading ? '...' : courses.length}</h3>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
          <p className="text-slate-400 text-xs font-medium uppercase mb-1">Active Students</p>
          <h3 className="text-2xl font-semibold text-slate-800">{isLoading ? '...' : totalActiveStudents}</h3>
        </div>
      </div>

      <div className="glass-card rounded-2xl border-slate-200/60 shadow-[0_12px_24px_rgba(0,0,0,0.03)] overflow-hidden">
        <div className="p-8 border-b border-slate-50 flex flex-wrap items-center justify-between gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input 
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-6 py-3 bg-slate-50/50 border border-slate-100 rounded-xl text-xs focus:outline-none focus:ring-4 focus:ring-brand-600/5 focus:border-brand-300 transition-all font-medium" 
              placeholder="Search courses..." 
            />
          </div>
          <div className="flex gap-2">
            <button className="p-3 bg-slate-50 text-slate-400 hover:text-slate-600 rounded-xl transition-all">
              <Filter size={18} />
            </button>
            <button className="p-3 bg-slate-50 text-slate-400 hover:text-slate-600 rounded-xl transition-all">
              <Download size={18} />
            </button>
          </div>
        </div>

        {isLoading ? (
          <div className="p-16 flex justify-center text-slate-400">
            <Loader2 className="w-8 h-8 animate-spin text-brand-600" />
          </div>
        ) : filteredCourses.length === 0 ? (
          <div className="p-16 text-center">
            <div className="w-16 h-16 bg-brand-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <BookOpen className="text-brand-600" size={24} />
            </div>
            <h3 className="text-lg font-semibold text-slate-800 mb-1">No courses found</h3>
            <p className="text-slate-400 text-sm italic">Start by adding your first course to the curriculum.</p>
          </div>
        ) : (
          <div className="overflow-x-auto p-4">
            <table className="w-full text-left border-separate border-spacing-y-2">
              <thead>
                <tr className="text-slate-400 text-[10px] font-semibold uppercase tracking-widest px-4">
                  <th className="px-6 pb-2">Course Title</th>
                  <th className="px-6 pb-2">Category</th>
                  <th className="px-6 pb-2">Duration</th>
                  <th className="px-6 pb-2">Price</th>
                  <th className="px-6 pb-2">Status</th>
                  <th className="px-6 pb-2 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredCourses.map((course) => (
                  <tr key={course.id || course.courseId} className="bg-slate-50/70 rounded-xl hover:bg-slate-100/80 transition-all">
                    <td className="px-6 py-4 font-semibold text-xs text-slate-800 rounded-l-xl">
                      <div>
                        <span className="font-bold">{course.title}</span>
                        {course.description && (
                          <p className="text-[11px] text-slate-400 font-normal line-clamp-1">{course.description}</p>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-xs text-slate-600 font-medium">
                      <span className="px-2.5 py-1 bg-brand-50 text-brand-700 font-bold text-[10px] rounded-lg">
                        {course.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-xs text-slate-600 font-medium">
                      {course.duration || '4 Weeks'}
                    </td>
                    <td className="px-6 py-4 text-xs text-slate-800 font-bold">
                      ₹{Number(course.price || 0).toLocaleString('en-IN')}
                    </td>
                    <td className="px-6 py-4 text-xs font-semibold">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] uppercase font-bold tracking-wider ${
                        course.status === 'ACTIVE' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-500'
                      }`}>
                        {course.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right rounded-r-xl">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => handleOpenEditModal(course)}
                          className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-all"
                          title="Edit Course"
                        >
                          <Edit2 size={14} />
                        </button>
                        <button 
                          onClick={() => handleDeleteCourse(course.id)}
                          className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-all"
                          title="Delete Course"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add / Edit Course Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-100 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-lg font-bold text-slate-900">
                {editingCourse ? 'Edit Course' : 'Add New Course'}
              </h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Course Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. IELTS Academic Masterclass"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-brand-500 font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-brand-500 font-medium bg-white"
                  >
                    <option value="Language Exam">Language Exam</option>
                    <option value="Graduate Exam">Graduate Exam</option>
                    <option value="Undergrad Exam">Undergrad Exam</option>
                    <option value="General">General</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Price (₹)</label>
                  <input
                    type="number"
                    placeholder="14999"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-brand-500 font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Duration</label>
                  <input
                    type="text"
                    placeholder="e.g. 8 Weeks"
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-brand-500 font-medium"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-brand-500 font-medium bg-white"
                  >
                    <option value="ACTIVE">ACTIVE</option>
                    <option value="DRAFT">DRAFT</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Description</label>
                <textarea
                  rows="3"
                  placeholder="Brief course overview..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-brand-500 font-medium resize-none"
                ></textarea>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-slate-600 font-bold hover:bg-slate-100 rounded-xl transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 bg-brand-600 text-white font-bold rounded-xl hover:bg-brand-700 transition-all flex items-center gap-1.5 shadow-sm disabled:opacity-50"
                >
                  {isSubmitting ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />}
                  Save Course
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default AdminCourses;
