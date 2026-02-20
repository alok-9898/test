import { MOCK_INVESTOR_PROFILE } from '../mockData'

export const getInvestorThesis = async () => {
  return MOCK_INVESTOR_PROFILE
}

export const updateInvestorThesis = async (data) => {
  return { message: 'Thesis updated', completeness_score: 88.0 }
}
