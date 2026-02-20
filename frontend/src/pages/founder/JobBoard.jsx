import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getMyJobs, createJob, updateJob, deleteJob } from '../../api/founders'
import PageHeader from '../../components/shared/PageHeader'
import EmptyState from '../../components/shared/EmptyState'
import { Briefcase, Plus, Trash2, MapPin, DollarSign, Clock, X, Pencil, Check, Tag } from 'lucide-react'
import { useNotification } from '../../contexts/NotificationContext'

const EMPTY_FORM = {
    title: '',
    description: '',
    requirements: '',
    required_skills: [],
    location: '',
    job_type: 'full-time',
    compensation: '',
}

function JobFormModal({ initial = EMPTY_FORM, onClose, onSubmit, isPending, title }) {
    const [form, setForm] = useState({ ...initial, required_skills: initial.required_skills || [] })
    const [skillInput, setSkillInput] = useState('')

    const addSkill = () => {
        const s = skillInput.trim()
        if (s && !form.required_skills.includes(s)) {
            setForm(f => ({ ...f, required_skills: [...f.required_skills, s] }))
        }
        setSkillInput('')
    }

    const removeSkill = (skill) => setForm(f => ({ ...f, required_skills: f.required_skills.filter(s => s !== skill) }))

    const handleKey = (e) => { if (e.key === 'Enter') { e.preventDefault(); addSkill() } }

    const handleSubmit = (e) => { e.preventDefault(); onSubmit(form) }

    return (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="glass-card w-full max-w-2xl p-8 space-y-6 relative bg-slate-900 max-h-[90vh] overflow-y-auto">
                <button onClick={onClose} className="absolute top-4 right-4 text-slate-500 hover:text-slate-100">
                    <X size={24} />
                </button>

                <h3 className="text-2xl font-bold gradient-text">{title}</h3>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-slate-400 mb-2">Role Title *</label>
                            <input
                                required
                                type="text"
                                value={form.title}
                                onChange={e => setForm({ ...form, title: e.target.value })}
                                placeholder="e.g. Lead Engineer, Growth Lead"
                                className="input-field"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-400 mb-2">Location</label>
                            <input
                                type="text"
                                value={form.location}
                                onChange={e => setForm({ ...form, location: e.target.value })}
                                placeholder="Remote, Kathmandu, etc."
                                className="input-field"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-400 mb-2">Job Type</label>
                            <select
                                value={form.job_type}
                                onChange={e => setForm({ ...form, job_type: e.target.value })}
                                className="input-field"
                            >
                                <option value="full-time">Full-time</option>
                                <option value="part-time">Part-time</option>
                                <option value="contract">Contract</option>
                                <option value="equity-only">Equity Only</option>
                            </select>
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-slate-400 mb-2">Compensation Range</label>
                            <input
                                type="text"
                                value={form.compensation}
                                onChange={e => setForm({ ...form, compensation: e.target.value })}
                                placeholder="e.g. $2k - $4k / month + 1% Equity"
                                className="input-field"
                            />
                        </div>

                        {/* Required Skills */}
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-slate-400 mb-2">Required Skills</label>
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={skillInput}
                                    onChange={e => setSkillInput(e.target.value)}
                                    onKeyDown={handleKey}
                                    placeholder="Type a skill and press Enter..."
                                    className="input-field flex-1"
                                />
                                <button
                                    type="button"
                                    onClick={addSkill}
                                    className="premium-button btn-secondary px-4"
                                >
                                    <Plus size={18} />
                                </button>
                            </div>
                            {form.required_skills.length > 0 && (
                                <div className="flex flex-wrap gap-2 mt-3">
                                    {form.required_skills.map(skill => (
                                        <span
                                            key={skill}
                                            className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 text-xs font-bold border border-amber-500/20"
                                        >
                                            {skill}
                                            <button type="button" onClick={() => removeSkill(skill)} className="hover:text-red-400">
                                                <X size={12} />
                                            </button>
                                        </span>
                                    ))}
                                </div>
                            )}
                            <p className="text-xs text-slate-500 mt-2">These skills will be used to match talent to this role.</p>
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-slate-400 mb-2">Description</label>
                            <textarea
                                rows="4"
                                value={form.description}
                                onChange={e => setForm({ ...form, description: e.target.value })}
                                placeholder="What will they build?"
                                className="input-field"
                            />
                        </div>
                    </div>

                    <div className="flex justify-end gap-4 pt-4">
                        <button type="button" onClick={onClose} className="premium-button btn-secondary px-6">Cancel</button>
                        <button type="submit" disabled={isPending} className="premium-button btn-primary px-8">
                            {isPending ? 'Saving...' : <><Check size={16} className="inline mr-2" />Save Posting</>}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default function JobBoard() {
    const [isAdding, setIsAdding] = useState(false)
    const [editingJob, setEditingJob] = useState(null)

    const queryClient = useQueryClient()
    const { addToast } = useNotification()

    const { data: jobs = [], isLoading } = useQuery({
        queryKey: ['founder', 'jobs'],
        queryFn: getMyJobs
    })

    const createMutation = useMutation({
        mutationFn: createJob,
        onSuccess: () => {
            queryClient.invalidateQueries(['founder', 'jobs'])
            setIsAdding(false)
            addToast('Job posting live!', 'success')
        },
        onError: (err) => addToast(err?.response?.data?.detail || 'Failed to create posting', 'error')
    })

    const updateMutation = useMutation({
        mutationFn: updateJob,
        onSuccess: () => {
            queryClient.invalidateQueries(['founder', 'jobs'])
            setEditingJob(null)
            addToast('Job posting updated!', 'success')
        },
        onError: (err) => addToast(err?.response?.data?.detail || 'Failed to update posting', 'error')
    })

    const deleteMutation = useMutation({
        mutationFn: deleteJob,
        onSuccess: () => {
            queryClient.invalidateQueries(['founder', 'jobs'])
            addToast('Job removed', 'success')
        }
    })

    const handleCreate = (formData) => createMutation.mutate(formData)
    const handleUpdate = (formData) => updateMutation.mutate({ jobId: editingJob.id, ...formData })

    return (
        <div>
            <PageHeader title="Job Postings" subtitle="Enlist top talent to build the future of your venture." />

            <div className="p-8 space-y-8 max-w-7xl mx-auto">
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold text-slate-100">Active Opportunities</h2>
                    <button onClick={() => setIsAdding(true)} className="premium-button btn-primary flex items-center gap-2 py-2 px-6">
                        <Plus size={18} /> Post Reward
                    </button>
                </div>

                {/* Create Modal */}
                {isAdding && (
                    <JobFormModal
                        title="New Job Posting"
                        onClose={() => setIsAdding(false)}
                        onSubmit={handleCreate}
                        isPending={createMutation.isPending}
                    />
                )}

                {/* Edit Modal */}
                {editingJob && (
                    <JobFormModal
                        title="Edit Job Posting"
                        initial={editingJob}
                        onClose={() => setEditingJob(null)}
                        onSubmit={handleUpdate}
                        isPending={updateMutation.isPending}
                    />
                )}

                {isLoading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {[1, 2].map(i => <div key={i} className="glass-card h-56 animate-pulse bg-white/5" />)}
                    </div>
                ) : jobs.length === 0 ? (
                    <EmptyState
                        icon={Briefcase}
                        title="No active roles"
                        message="Broadcast your requirements to our network of high-caliber talent."
                    />
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {jobs.map((job) => (
                            <div key={job.id} className="glass-card p-8 group border-white/5 hover:border-emerald-500/20 transition-all bg-slate-900/40 relative">
                                {/* Action Buttons */}
                                <div className="absolute top-5 right-5 flex gap-2">
                                    <button
                                        onClick={() => setEditingJob(job)}
                                        className="p-2 rounded-lg bg-amber-500/5 text-amber-500/40 hover:text-amber-500 hover:bg-amber-500/10 transition-all"
                                        title="Edit"
                                    >
                                        <Pencil size={15} />
                                    </button>
                                    <button
                                        onClick={() => deleteMutation.mutate(job.id)}
                                        disabled={deleteMutation.isPending}
                                        className="p-2 rounded-lg bg-red-500/5 text-red-500/40 hover:text-red-500 hover:bg-red-500/10 transition-all"
                                        title="Delete"
                                    >
                                        <Trash2 size={15} />
                                    </button>
                                </div>

                                <div className="flex flex-col h-full">
                                    <div className="flex-1 space-y-4 pr-16">
                                        <h3 className="text-xl font-bold text-slate-100 group-hover:text-emerald-500 transition-colors uppercase tracking-tight">
                                            {job.title}
                                        </h3>

                                        <div className="grid grid-cols-2 gap-3">
                                            <div className="flex items-center gap-2 text-slate-400">
                                                <MapPin size={13} className="text-emerald-500" />
                                                <span className="text-xs">{job.location || 'Remote'}</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-slate-400">
                                                <Clock size={13} className="text-emerald-500" />
                                                <span className="text-xs capitalize">{job.job_type}</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-slate-400 col-span-2">
                                                <DollarSign size={13} className="text-emerald-500" />
                                                <span className="text-xs text-slate-200 font-bold">{job.compensation || 'Competitive'}</span>
                                            </div>
                                        </div>

                                        {/* Skill Tags */}
                                        {job.required_skills?.length > 0 && (
                                            <div className="space-y-2">
                                                <div className="flex items-center gap-1.5 text-slate-500 text-[10px] uppercase font-bold">
                                                    <Tag size={10} /> Required Skills
                                                </div>
                                                <div className="flex flex-wrap gap-2">
                                                    {job.required_skills.map(skill => (
                                                        <span
                                                            key={skill}
                                                            className="px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-400 text-[10px] font-bold border border-amber-500/20"
                                                        >
                                                            {skill}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        <p className="text-sm text-slate-400 leading-relaxed line-clamp-2">
                                            {job.description}
                                        </p>
                                    </div>

                                    <div className="pt-6 mt-6 border-t border-white/5 flex items-center justify-between">
                                        <span className="text-[10px] font-bold text-slate-500 uppercase">Status: Published</span>
                                        <button className="text-xs text-emerald-500 font-bold hover:text-emerald-400">
                                            View Applicants
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
