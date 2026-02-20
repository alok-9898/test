import client from './client'

export const getInvestorThesis = async () => {
  const response = await client.get('/investor/thesis')
  return response.data
}

export const updateInvestorThesis = async (data) => {
  const response = await client.patch('/investor/thesis', data)
  return response.data
}

export const getAllInvestors = async () => {
  const response = await client.get('/investor/all')
  return response.data
}
