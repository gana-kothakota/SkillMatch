import React, { useState, useEffect } from 'react';
import { FileText, Upload, Trash2, Download, Sparkles, Plus, X } from 'lucide-react';
import api from '../../services/api';
import toast from 'react-hot-toast';

const ResumeManager = () => {
  const [resume, setResume] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [newSkillInput, setNewSkillInput] = useState('');
  const [updatingSkills, setUpdatingSkills] = useState(false);

  const fetchResume = async () => {
    setLoading(true);
    try {
      const res = await api.get('/resumes/me/');
      setResume(res.data);
    } catch (err) {
      setResume(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResume();
  }, []);

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith('.pdf')) {
      toast.error('Please upload a valid PDF file.');
      return;
    }

    const formData = new FormData();
    formData.append('resume_pdf', file);

    setUploading(true);
    try {
      const res = await api.post('/resumes/upload/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setResume(res.data);
      toast.success('Resume uploaded & parsed successfully!');
    } catch (err) {
      toast.error('Failed to upload resume PDF.');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Delete active resume PDF?')) return;
    try {
      await api.delete('/resumes/me/');
      setResume(null);
      toast.success('Resume removed');
    } catch (err) {
      toast.error('Failed to delete resume');
    }
  };

  const updateSkillsOnServer = async (updatedSkills) => {
    setUpdatingSkills(true);
    try {
      const res = await api.patch('/resumes/me/', { extracted_skills: updatedSkills });
      setResume(res.data);
      toast.success('Skills list updated successfully!');
    } catch (err) {
      toast.error('Failed to update skills list.');
    } finally {
      setUpdatingSkills(false);
    }
  };

  const handleAddSkill = async (e) => {
    e.preventDefault();
    const skillName = newSkillInput.trim();
    if (!skillName) return;

    const currentSkills = resume?.extracted_skills || [];
    if (currentSkills.some((s) => s.toLowerCase() === skillName.toLowerCase())) {
      toast.error('Skill already present in your list.');
      setNewSkillInput('');
      return;
    }

    const updated = [...currentSkills, skillName];
    setNewSkillInput('');
    await updateSkillsOnServer(updated);
  };

  const handleRemoveSkill = async (skillToRemove) => {
    const currentSkills = resume?.extracted_skills || [];
    const updated = currentSkills.filter((s) => s !== skillToRemove);
    await updateSkillsOnServer(updated);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">AI Resume Manager</h1>
        <p className="text-slate-600 dark:text-slate-400 text-sm mt-1">
          Upload your latest PDF resume. SkillMatch AI will extract your technical competencies for instant job matching.
        </p>
      </div>

      {loading ? (
        <div className="h-64 rounded-3xl bg-slate-200 dark:bg-slate-800 animate-pulse" />
      ) : resume ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Resume Overview & Extracted Skills */}
          <div className="lg:col-span-2 space-y-6">
            <div className="glass-card rounded-3xl p-8 space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-rose-500/10 text-rose-500 flex items-center justify-center">
                    <FileText className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 dark:text-white text-base">{resume.file_name}</h3>
                    <span className="text-xs text-slate-400">Uploaded {new Date(resume.uploaded_at).toLocaleDateString()}</span>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <a
                    href={resume.pdf_url}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-indigo-600"
                    title="Download PDF"
                  >
                    <Download className="w-4 h-4" />
                  </a>
                  <button
                    onClick={handleDelete}
                    className="p-2 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 hover:bg-rose-100"
                    title="Delete Resume"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Extracted Technical Skills */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-sky-400 flex items-center">
                    <Sparkles className="w-4 h-4 mr-1.5" /> Technical Competencies ({resume.extracted_skills?.length || 0})
                  </h4>
                  {updatingSkills && (
                    <span className="text-xs text-indigo-500 animate-pulse font-medium">Saving skills...</span>
                  )}
                </div>

                {/* Skills Tag Cloud */}
                {resume.extracted_skills && resume.extracted_skills.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {resume.extracted_skills.map((skill) => (
                      <span
                        key={skill}
                        className="inline-flex items-center px-3 py-1 rounded-xl bg-indigo-50 text-indigo-700 dark:bg-slate-800 dark:text-sky-300 text-xs font-semibold border border-indigo-100 dark:border-slate-700 group transition-all"
                      >
                        {skill}
                        <button
                          type="button"
                          onClick={() => handleRemoveSkill(skill)}
                          className="ml-1.5 p-0.5 rounded-md hover:bg-rose-200 dark:hover:bg-rose-900/60 text-slate-400 hover:text-rose-600 transition-colors"
                          title={`Remove ${skill}`}
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-amber-600 dark:text-amber-400 font-medium bg-amber-50 dark:bg-amber-950/40 p-3 rounded-xl border border-amber-200 dark:border-amber-800/50">
                    No skills automatically detected from this PDF. Type skills below to manually add them to your profile.
                  </p>
                )}

                {/* Add Manual Skill Form */}
                <form onSubmit={handleAddSkill} className="flex items-center gap-2 pt-2">
                  <input
                    type="text"
                    value={newSkillInput}
                    onChange={(e) => setNewSkillInput(e.target.value)}
                    placeholder="Add a technical skill (e.g. Python, Docker, React)..."
                    className="flex-1 px-4 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    disabled={updatingSkills}
                  />
                  <button
                    type="submit"
                    disabled={updatingSkills || !newSkillInput.trim()}
                    className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-semibold text-xs flex items-center shadow-sm shadow-indigo-600/20"
                  >
                    <Plus className="w-3.5 h-3.5 mr-1" /> Add Skill
                  </button>
                </form>
              </div>

              {/* Raw Parsed Text Snippet */}
              <div className="space-y-2 pt-4 border-t border-slate-100 dark:border-slate-800">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Extracted Raw Text</h4>
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 text-xs text-slate-600 dark:text-slate-400 max-h-48 overflow-y-auto font-mono leading-relaxed">
                  {resume.raw_text || 'No raw text extracted'}
                </div>
              </div>
            </div>
          </div>

          {/* Replace Resume Card */}
          <div className="lg:col-span-1">
            <div className="glass-card rounded-3xl p-6 text-center space-y-4">
              <Upload className="w-10 h-10 text-indigo-500 mx-auto" />
              <h3 className="font-bold text-slate-900 dark:text-white text-base">Replace Active Resume</h3>
              <p className="text-xs text-slate-500">Uploading a new PDF file will re-run technical skill parsing instantly.</p>
              
              <label className="block w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs cursor-pointer shadow-md shadow-indigo-600/20">
                {uploading ? 'Processing PDF...' : 'Select PDF File'}
                <input type="file" accept=".pdf" onChange={handleFileUpload} className="hidden" />
              </label>
            </div>
          </div>
        </div>
      ) : (
        /* Empty Upload Dropzone */
        <div className="glass-card rounded-3xl p-12 text-center border-2 border-dashed border-slate-300 dark:border-slate-700 space-y-4">
          <Upload className="w-12 h-12 text-indigo-500 mx-auto" />
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">Upload Your Resume PDF</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Drop your PDF file here or click below to start automated skill matching.
          </p>

          <label className="inline-block px-6 py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 to-sky-500 text-white font-bold text-sm cursor-pointer shadow-lg shadow-indigo-500/25 hover:scale-105 transition-all">
            {uploading ? 'Parsing PDF File...' : 'Choose PDF File'}
            <input type="file" accept=".pdf" onChange={handleFileUpload} className="hidden" />
          </label>
        </div>
      )}
    </div>
  );
};

export default ResumeManager;
