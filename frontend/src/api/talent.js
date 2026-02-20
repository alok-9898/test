import { MOCK_TALENT_PROFILE } from '../mockData'

export const getTalentProfile = async () => {
  return MOCK_TALENT_PROFILE
}

export const updateTalentProfile = async (data) => {
  return { message: 'Profile updated', completeness_score: 90.0 }
}
