import { MOCK_STARTUP_PROFILE } from '../mockData'

export const getStartupProfile = async () => {
  // Return mock data
  return MOCK_STARTUP_PROFILE
}

export const updateStartupProfile = async (data) => {
  // Mock update - just return success
  return { message: 'Profile updated', completeness_score: 85.0 }
}
