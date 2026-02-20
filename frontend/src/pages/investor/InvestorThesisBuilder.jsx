import { useState, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getInvestorThesis, updateInvestorThesis } from '../../api/investors'
import ProfileCompleteness from '../../components/shared/ProfileCompleteness'
import PageHeader from '../../components/shared/PageHeader'
import { useNotification } from '../../contexts/NotificationContext'

export default function InvestorThesisBuilder() {
  const { data: profile } = useQuery({
    queryKey: ['investor', 'thesis'],
    queryFn: getInvestorThesis,
  })
  const queryClient = useQueryClient()
  const { addToast } = useNotification()

  const [formData, setFormData] = useState({
    name: '',
    fund: '',
    type: '',
    thesis_text: '',
    preferred_sectors: '',
    investment_stage: '',
    check_size_min: '',
    check_size_max: '',
    geography_focus: '',
    key_signals: '',
  })

  useEffect(() => {
    if (profile) {
      setFormData({
        name: profile.name || '',
        fund: profile.fund || '',
        type: profile.type || '',
        thesis_text: profile.thesis_text || '',
        preferred_sectors: (profile.preferred_sectors || []).join(', '),
        investment_stage: (profile.investment_stage || []).join(', '),
        check_size_min: profile.check_size_min || '',
        check_size_max: profile.check_size_max || '',
        geography_focus: profile.geography_focus || '',
        key_signals: (profile.key_signals || []).join(', '),
      })
    }
  }, [profile])

  const updateMutation = useMutation({
    mutationFn: updateInvestorThesis,
    onSuccess: () => {
      queryClient.invalidateQueries(['investor', 'thesis'])
      addToast('Thesis updated successfully', 'success')
    },
    onError: () => {
      addToast('Failed to update thesis', 'error')
    },
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    const submitData = {
      ...formData,
      preferred_sectors: formData.preferred_sectors.split(',').map((s) => s.trim()).filter(Boolean),
      investment_stage: formData.investment_stage.split(',').map((s) => s.trim()).filter(Boolean),
      key_signals: formData.key_signals.split(',').map((s) => s.trim()).filter(Boolean),
      check_size_min: formData.check_size_min ? parseFloat(formData.check_size_min) : null,
      check_size_max: formData.check_size_max ? parseFloat(formData.check_size_max) : null,
    }
    updateMutation.mutate(submitData)
  }

  return (
    <div>
      <PageHeader title="Investment Thesis" subtitle="Define your investment criteria" />

      <div className="p-6">
        {profile && (
          <div className="mb-6">
            <ProfileCompleteness
              score={profile.completeness_score || 0}
              missingFields={[]}
            />
          </div>
        )}

        <form onSubmit={handleSubmit} className="glass-card p-8 space-y-8">
          <section>
            <h3 className="text-xl font-semibold mb-6 gradient-text">Investor Info</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">Fund/Organization</label>
                <input
                  type="text"
                  value={formData.fund}
                  onChange={(e) => setFormData({ ...formData, fund: e.target.value })}
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">Type</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className="input-field"
                >
                  <option value="">Select type</option>
                  <option value="angel">Angel Investor</option>
                  <option value="vc">VC</option>
                  <option value="diaspora">Diaspora Investor</option>
                </select>
              </div>
            </div>
          </section>

          <section>
            <h3 className="text-xl font-semibold mb-6 gradient-text">Investment Criteria</h3>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">Preferred Sectors (comma-separated)</label>
                <input
                  type="text"
                  value={formData.preferred_sectors}
                  onChange={(e) => setFormData({ ...formData, preferred_sectors: e.target.value })}
                  placeholder="SaaS, Fintech, EdTech"
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">Investment Stages (comma-separated)</label>
                <input
                  type="text"
                  value={formData.investment_stage}
                  onChange={(e) => setFormData({ ...formData, investment_stage: e.target.value })}
                  placeholder="pre-seed, seed, series-a"
                  className="input-field"
                />
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-2">Check Size Min ($)</label>
                  <input
                    type="number"
                    value={formData.check_size_min}
                    onChange={(e) => setFormData({ ...formData, check_size_min: e.target.value })}
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-2">Check Size Max ($)</label>
                  <input
                    type="number"
                    value={formData.check_size_max}
                    onChange={(e) => setFormData({ ...formData, check_size_max: e.target.value })}
                    className="input-field"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">Geography Focus</label>
                <select
                  value={formData.geography_focus}
                  onChange={(e) => setFormData({ ...formData, geography_focus: e.target.value })}
                  className="input-field"
                >
                  <option value="">Select geography</option>
                  <option value="Nepal-only">Nepal Only</option>
                  <option value="Nepal + South Asia">Nepal + South Asia</option>
                  <option value="Global">Global</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">Key Signals (comma-separated)</label>
                <input
                  type="text"
                  value={formData.key_signals}
                  onChange={(e) => setFormData({ ...formData, key_signals: e.target.value })}
                  placeholder="strong team, B2B SaaS, social impact"
                  className="input-field"
                />
              </div>
            </div>
          </section>

          <section>
            <h3 className="text-xl font-semibold mb-6 gradient-text">Thesis Statement</h3>
            <textarea
              value={formData.thesis_text}
              onChange={(e) => setFormData({ ...formData, thesis_text: e.target.value })}
              rows="8"
              placeholder="Describe your investment thesis..."
              className="input-field"
            />
          </section>

          <div className="flex justify-end pt-4">
            <button
              type="submit"
              disabled={updateMutation.isPending}
              className="premium-button btn-primary"
            >
              {updateMutation.isPending ? 'Saving...' : 'Save Thesis'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
