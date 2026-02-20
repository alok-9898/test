import { useState } from 'react'
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
    name: profile?.name || '',
    headline: profile?.headline || '',
    location: profile?.location || '',
    bio: profile?.bio || '',
    experience_level: profile?.experience_level || '',
    engagement_preferences: (profile?.engagement_preferences || []).join(', '),
    compensation_min: profile?.compensation_min || '',
    compensation_max: profile?.compensation_max || '',
  })

  const [skills, setSkills] = useState(
    profile?.skills || []
  )

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
      
      <div className="p-6">
        {profile && (
          <div className="mb-6">
            <ProfileCompleteness
              score={profile.completeness_score || 0}
              missingFields={[]}
            />
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm p-6 space-y-6">
          <section>
            <h3 className="text-lg font-semibold mb-4">Personal</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Headline</label>
                <input
                  type="text"
                  value={formData.headline}
                  onChange={(e) => setFormData({ ...formData, headline: e.target.value })}
                  placeholder="e.g., Full-stack Developer"
                  className="w-full px-4 py-2 border rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Location</label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Experience Level</label>
                <select
                  value={formData.experience_level}
                  onChange={(e) => setFormData({ ...formData, experience_level: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg"
                >
                  <option value="">Select level</option>
                  <option value="student">Student</option>
                  <option value="junior">Junior</option>
                  <option value="mid">Mid-level</option>
                  <option value="senior">Senior</option>
                </select>
              </div>
            </div>
            <div className="mt-4">
              <label className="block text-sm font-medium mb-1">Bio</label>
              <textarea
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                rows="4"
                className="w-full px-4 py-2 border rounded-lg"
              />
            </div>
          </section>

          <section>
            <h3 className="text-lg font-semibold mb-4">Skills</h3>
            <div className="space-y-2 mb-4">
              {skills.map((skill, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <span className="font-medium">{skill.name}</span>
                    <span className="ml-2 text-sm text-gray-600">({skill.proficiency})</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeSkill(idx)}
                    className="text-red-500 hover:text-red-700"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={addSkill}
              className="px-4 py-2 border border-dashed rounded-lg text-gray-600 hover:border-accent hover:text-accent"
            >
              + Add Skill
            </button>
          </section>

          <section>
            <h3 className="text-lg font-semibold mb-4">Engagement</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Preferred Engagement (comma-separated)</label>
                <input
                  type="text"
                  value={formData.engagement_preferences}
                  onChange={(e) => setFormData({ ...formData, engagement_preferences: e.target.value })}
                  placeholder="full-time, part-time, equity-only"
                  className="w-full px-4 py-2 border rounded-lg"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Compensation Min ($)</label>
                  <input
                    type="number"
                    value={formData.compensation_min}
                    onChange={(e) => setFormData({ ...formData, compensation_min: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Compensation Max ($)</label>
                  <input
                    type="number"
                    value={formData.compensation_max}
                    onChange={(e) => setFormData({ ...formData, compensation_max: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg"
                  />
                </div>
              </div>
            </div>
          </section>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={updateMutation.isPending}
              className="px-6 py-2 bg-accent text-primary font-semibold rounded-lg hover:bg-accent-light transition-colors disabled:opacity-50"
            >
              {updateMutation.isPending ? 'Saving...' : 'Save Profile'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
