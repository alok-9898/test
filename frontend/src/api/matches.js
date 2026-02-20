import client from './client'

export const getTalentMatches = async (jobId = null) => {
  const url = jobId ? `/matches/talent?job_id=${jobId}` : '/matches/talent'
  const response = await client.get(url)
  return response.data
}

export const getInvestorMatches = async () => {
  const response = await client.get('/matches/investors')
  return response.data
}

export const getStartupMatches = async () => {
  const response = await client.get('/matches/startups')
  return response.data
}

export const getJobMatches = async () => {
  const response = await client.get('/matches/jobs')
  return response.data
}

export const requestConnection = async (targetId, message, jobId = null) => {
  const response = await client.post('/matches/connections/request', {
    target_id: targetId,
    message,
    job_id: jobId
  })
  return response.data
}

export const getJobApplicants = async (jobId) => {
  const response = await client.get(`/matches/jobs/${jobId}/applicants`)
  return response.data
}

export const getConnections = async () => {
  const response = await client.get('/matches/connections')
  return response.data
}
