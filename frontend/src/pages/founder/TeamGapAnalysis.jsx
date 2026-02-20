import { useQuery } from '@tanstack/react-query'
import { getTeamGapAnalysis } from '../../api/ai'
import PageHeader from '../../components/shared/PageHeader'
import { Link } from 'react-router-dom'
import { Target, AlertCircle } from 'lucide-react'

export default function TeamGapAnalysis() {
  const { data: analysis, isLoading } = useQuery({
    queryKey: ['teamGapAnalysis'],
    queryFn: getTeamGapAnalysis,
  })

  if (isLoading) {
    return (
      <div>
        <PageHeader title="Team Gap Analysis" />
        <div className="p-6">Loading...</div>
      </div>
    )
  }

  return (
    <div>
      <PageHeader title="Team Gap Analysis" subtitle="Identify critical roles missing from your team" />
      
      <div className="p-6 space-y-6">
        {analysis?.investor_readiness_score && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold">Investor Readiness Score</h3>
                <p className="text-sm text-gray-600">Based on team composition</p>
              </div>
              <div className="text-4xl font-bold text-accent">{analysis.investor_readiness_score}/100</div>
            </div>
          </div>
        )}

        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold mb-4">Critical Gaps</h3>
          {analysis?.gaps && analysis.gaps.length > 0 ? (
            <div className="space-y-4">
              {analysis.gaps.map((gap, idx) => (
                <div key={idx} className="border rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="text-red-500 mt-1" size={20} />
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold">{gap.role}</h4>
                        <span className={`px-2 py-1 rounded text-xs ${
                          gap.impact === 'Critical' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {gap.impact} Impact
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{gap.reason}</p>
                      <Link
                        to="/dashboard/founder/roles"
                        className="text-sm text-accent hover:underline"
                      >
                        {gap.recommended_action}
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">No critical gaps identified</p>
          )}
        </div>

        {analysis?.recommendations && analysis.recommendations.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold mb-4">Recommendations</h3>
            <ul className="list-disc list-inside space-y-2 text-gray-600">
              {analysis.recommendations.map((rec, idx) => (
                <li key={idx}>{rec}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  )
}
