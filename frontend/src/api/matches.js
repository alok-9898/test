import { MOCK_TALENT_MATCHES, MOCK_INVESTOR_MATCHES, MOCK_STARTUP_MATCHES } from '../mockData'

export const getTalentMatches = async () => {
  return MOCK_TALENT_MATCHES
}

export const getInvestorMatches = async () => {
  return MOCK_INVESTOR_MATCHES
}

export const getStartupMatches = async () => {
  return MOCK_STARTUP_MATCHES
}

export const requestConnection = async (targetId, message) => {
  return { message: 'Connection request sent', match_id: `match-${Date.now()}` }
}

export const getConnections = async () => {
  return { sent: [], received: [] }
}
