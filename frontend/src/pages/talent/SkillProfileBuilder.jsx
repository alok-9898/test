import { useState, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getTalentProfile, updateTalentProfile } from '../../api/talent'
import ProfileCompleteness from '../../components/shared/ProfileCompleteness'
import PageHeader from '../../components/shared/PageHeader'
import { useNotification } from '../../contexts/NotificationContext'
import { useAuth } from '../../hooks/useAuth'
import { FileText, Mail } from 'lucide-react'
import client from '../../api/client'

export default function SkillProfileBuilder() {
  const { currentUser } = useAuth()
  const { data: profile } = useQuery({
    queryKey: ['talent', 'profile'],
    queryFn: getTalentProfile,
  })
  const queryClient = useQueryClient()
  const { addToast } = useNotification()

  const [formData, setFormData] = useState({
    name: '',
    headline: '',
    location: '',
    bio: '',
    experience_level: '',
  })

  const [skills, setSkills] = useState([])
  const [cvFile, setCvFile] = useState(null)
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    if (profile) {
      setFormData({
        name: profile.name || '',
        headline: profile.headline || '',
        location: profile.location || '',
        bio: profile.bio || '',
        experience_level: profile.experience_level || '',
      })
      setSkills(profile.skills || [])
    }
  }, [profile])

  const updateMutation = useMutation({
    mutationFn: updateTalentProfile,
    onSuccess: () => {
      queryClient.invalidateQueries(['talent', 'profile'])
      addToast('Profile updated successfully', 'success')
    },
    onError: () => {
      addToast('Failed to update profile', 'error')
    },
  })

  const handleCvUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    setUploading(true)
    const formData = new FormData()
    formData.append('file', file)

    try {
      await client.post('/talent/upload-cv', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      addToast('CV uploaded successfully', 'success')
      queryClient.invalidateQueries(['talent', 'profile'])
    } catch (error) {
      addToast('Upload failed', 'error')
    } finally {
      setUploading(false)
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    updateMutation.mutate({
      ...formData,
      skills
    })
  }

  const addSkill = (name, proficiency = 'Intermediate') => {
    if (name && !skills.find(s => s.name.toLowerCase() === name.toLowerCase())) {
      setSkills([...skills, { name, proficiency }])
    }
  }

  const removeSkill = (index) => {
    setSkills(skills.filter((_, i) => i !== index))
  }

  return (
    <div>
      <PageHeader title="Talent Profile" subtitle="Build your high-fidelity professional profile" />

      <div className="p-8 space-y-8 max-w-7xl mx-auto">
        {profile && (
          <div className="glass-card bg-amber-500/5 border-amber-500/20 p-6">
            <ProfileCompleteness
              score={profile.completeness_score || 0}
              missingFields={[]}
            />
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Form */}
          <div className="lg:col-span-2 space-y-8">
            <form onSubmit={handleSubmit} className="glass-card p-8 space-y-8">
              <section>
                <h3 className="text-xl font-semibold mb-6 gradient-text">Professional Identity</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-400 mb-2">Full Name</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="input-field"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-400 mb-2">Email Address</label>
                    <div className="relative">
                      <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                      <input
                        type="email"
                        value={currentUser?.email || ''}
                        readOnly
                        className="input-field pl-9 text-slate-500 cursor-not-allowed bg-white/[0.02]"
                        title="Email cannot be changed"
                      />
                    </div>
                    <p className="text-[10px] text-slate-600 mt-1">Account email — cannot be changed</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-400 mb-2">Headline</label>
                    <input
                      type="text"
                      value={formData.headline}
                      onChange={(e) => setFormData({ ...formData, headline: e.target.value })}
                      placeholder="e.g., Full-stack Developer"
                      className="input-field"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-400 mb-2">Location</label>
                    <input
                      type="text"
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      className="input-field"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-400 mb-2">Experience Level</label>
                    <select
                      value={formData.experience_level}
                      onChange={(e) => setFormData({ ...formData, experience_level: e.target.value })}
                      className="input-field"
                    >
                      <option value="">Select level</option>
                      <option value="student">Student</option>
                      <option value="junior">Junior (1-2y)</option>
                      <option value="mid">Mid-level (3-5y)</option>
                      <option value="senior">Senior (5y+)</option>
                    </select>
                  </div>
                </div>
                <div className="mt-6">
                  <label className="block text-sm font-medium text-slate-400 mb-2">Professional Bio</label>
                  <textarea
                    value={formData.bio}
                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                    rows="4"
                    className="input-field"
                  />
                </div>
              </section>

              <div className="flex justify-end pt-4">
                <button
                  type="submit"
                  disabled={updateMutation.isPending}
                  className="premium-button btn-primary"
                >
                  {updateMutation.isPending ? 'Syncing...' : 'Save Changes'}
                </button>
              </div>
            </form>

            <section className="glass-card p-8">
              <h3 className="text-xl font-semibold mb-6 gradient-text">Documents & Assets</h3>
              <div className="flex flex-col md:flex-row gap-6 items-center border-2 border-dashed border-white/5 rounded-2xl p-8 bg-white/[0.02]">
                <div className="w-16 h-16 bg-amber-500/10 rounded-2xl flex items-center justify-center text-amber-500">
                  <FileText size={32} />
                </div>
                <div className="flex-1 text-center md:text-left">
                  <h4 className="font-bold text-slate-100">Upload Professional CV</h4>
                  <p className="text-sm text-slate-400 mt-1">PDF, DOCX up to 5MB. This helps founders find you.</p>
                  {profile?.cv_path && (
                    <p className="text-xs text-emerald-500 mt-2 font-medium">✓ Currently: {profile.cv_path.split('/').pop()}</p>
                  )}
                </div>
                <label className="cursor-pointer">
                  <input type="file" className="hidden" onChange={handleCvUpload} accept=".pdf,.doc,.docx" disabled={uploading} />
                  <div className="premium-button btn-secondary">
                    {uploading ? 'Uploading...' : 'Choose File'}
                  </div>
                </label>
              </div>
            </section>
          </div>

          {/* Right Column: Skills UI */}
          <div className="space-y-8">
            <section className="glass-card p-8">
              <h3 className="text-xl font-semibold mb-6 gradient-text">Core Skills</h3>
              <div className="space-y-4">
                <div className="flex gap-2">
                  <input
                    type="text"
                    id="skillInput"
                    placeholder="Add skill (e.g. React)"
                    className="input-field py-2"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addSkill(e.target.value);
                        e.target.value = '';
                      }
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const input = document.getElementById('skillInput');
                      addSkill(input.value);
                      input.value = '';
                    }}
                    className="premium-button btn-primary px-4"
                  >
                    Add
                  </button>
                </div>

                <div className="flex flex-wrap gap-2 pt-4">
                  {skills.length > 0 ? skills.map((skill, idx) => (
                    <div key={idx} className="group flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 hover:border-amber-500/50 transition-all">
                      <span className="text-sm font-medium text-slate-200">{skill.name}</span>
                      <button
                        type="button"
                        onClick={() => removeSkill(idx)}
                        className="w-4 h-4 flex items-center justify-center rounded-full bg-slate-800 text-slate-400 hover:bg-red-500 hover:text-white transition-colors text-[10px]"
                      >
                        ✕
                      </button>
                    </div>
                  )) : (
                    <p className="text-sm text-slate-500 italic py-4">No skills added yet. Add your core expertise.</p>
                  )}
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-white/5">
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">Quick Add</h4>
                <div className="flex flex-wrap gap-2">
                  {['Product Design', 'React', 'Python', 'Sales', 'Marketing', 'SQL'].map(s => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => addSkill(s)}
                      className="text-[10px] font-bold px-2 py-1 rounded bg-slate-800 text-slate-400 hover:bg-slate-700 transition-colors uppercase"
                    >
                      + {s}
                    </button>
                  ))}
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}
