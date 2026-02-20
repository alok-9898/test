import { useState, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getTalentProfile, updateTalentProfile } from '../../api/talent'
import ProfileCompleteness from '../../components/shared/ProfileCompleteness'
import PageHeader from '../../components/shared/PageHeader'
import { useNotification } from '../../contexts/NotificationContext'

export default function SkillProfileBuilder() {
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
    engagement_preferences: '',
    compensation_min: '',
    compensation_max: '',
  })

  const [skills, setSkills] = useState([])

  useEffect(() => {
    if (profile) {
      setFormData({
        name: profile.name || '',
        headline: profile.headline || '',
        location: profile.location || '',
        bio: profile.bio || '',
        experience_level: profile.experience_level || '',
        engagement_preferences: (profile.engagement_preferences || []).join(', '),
        compensation_min: profile.compensation_min || '',
        compensation_max: profile.compensation_max || '',
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

  const handleSubmit = (e) => {
    e.preventDefault()
    const submitData = {
      ...formData,
      skills,
      engagement_preferences: formData.engagement_preferences
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean),
      compensation_min: formData.compensation_min ? parseInt(formData.compensation_min) : null,
      compensation_max: formData.compensation_max ? parseInt(formData.compensation_max) : null,
    }
    updateMutation.mutate(submitData)
  }

  const addSkill = () => {
    const name = prompt('Skill name:')
    const proficiency = prompt('Proficiency (Beginner/Intermediate/Expert):')
    if (name && proficiency) {
      setSkills([...skills, { name, proficiency }])
    }
  }

  const removeSkill = (index) => {
    setSkills(skills.filter((_, i) => i !== index))
  }

  return (
    <div>
      <PageHeader title="Talent Profile" subtitle="Build your professional profile" />

      <div className="p-8 space-y-8 max-w-7xl mx-auto">
        {profile && (
          <div className="glass-card bg-amber-500/5 border-amber-500/20 p-6">
            <ProfileCompleteness
              score={profile.completeness_score || 0}
              missingFields={[]}
            />
          </div>
        )}

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
                <label className="block text-sm font-medium text-slate-400 mb-2">Professional Headline</label>
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
                  placeholder="Kathmandu, Nepal"
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
                  <option value="junior">Junior (1-2 years)</option>
                  <option value="mid">Mid-level (3-5 years)</option>
                  <option value="senior">Senior (5+ years)</option>
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
                placeholder="Tell your story..."
              />
            </div>
          </section>

          <section>
            <h3 className="text-xl font-semibold mb-6 gradient-text">Core Skills</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
              {skills.map((skill, idx) => (
                <div key={idx} className="p-4 rounded-xl bg-white/5 border border-white/5 flex items-center justify-between group transition-all hover:bg-white/10">
                  <div>
                    <span className="font-semibold text-slate-100">{skill.name}</span>
                    <span className="ml-2 py-0.5 px-2 rounded-full bg-amber-500/10 text-amber-500 text-[10px] uppercase font-bold">
                      {skill.proficiency}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeSkill(idx)}
                    className="text-slate-500 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={addSkill}
              className="premium-button btn-secondary w-full border-dashed"
            >
              + Add New Skill
            </button>
          </section>

          <section>
            <h3 className="text-xl font-semibold mb-6 gradient-text">Engagement & Career</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">Preferred Engagement (comma-separated)</label>
                <input
                  type="text"
                  value={formData.engagement_preferences}
                  onChange={(e) => setFormData({ ...formData, engagement_preferences: e.target.value })}
                  placeholder="full-time, part-time, equity-only"
                  className="input-field"
                />
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-2">Compensation Min ($)</label>
                  <input
                    type="number"
                    value={formData.compensation_min}
                    onChange={(e) => setFormData({ ...formData, compensation_min: e.target.value })}
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-2">Compensation Max ($)</label>
                  <input
                    type="number"
                    value={formData.compensation_max}
                    onChange={(e) => setFormData({ ...formData, compensation_max: e.target.value })}
                    className="input-field"
                  />
                </div>
              </div>
            </div>
          </section>

          <div className="flex justify-end pt-4">
            <button
              type="submit"
              disabled={updateMutation.isPending}
              className="premium-button btn-primary"
            >
              {updateMutation.isPending ? 'Syncing...' : 'Save Profile'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
