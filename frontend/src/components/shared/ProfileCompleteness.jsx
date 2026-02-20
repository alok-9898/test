export default function ProfileCompleteness({ score, missingFields = [] }) {
  return (
    <div className="bg-white rounded-lg p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Profile Completeness</h3>
        <span className="text-2xl font-bold text-accent">{Math.round(score)}%</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
        <div
          className="bg-accent h-3 rounded-full transition-all duration-500"
          style={{ width: `${score}%` }}
        />
      </div>
      {missingFields.length > 0 && (
        <div>
          <p className="text-sm text-gray-600 mb-2">Missing fields:</p>
          <ul className="list-disc list-inside text-sm text-gray-500">
            {missingFields.map((field, idx) => (
              <li key={idx}>{field}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
