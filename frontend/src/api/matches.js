import client from './client'

export const getTalentMatches = async () => {
  const response = await client.get('/matches/talent')
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

export const requestConnection = async (targetId, message) => {
  const response = await client.post('/matches/connections/request', { target_id: targetId, message })
  return response.data
}

export const getConnections = async () => {
  const response = await client.get('/matches/connections')
  return response.data
}
