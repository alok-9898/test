export default function EmptyState({ icon: Icon, title, message, action }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4">
      {Icon && <Icon size={64} className="text-gray-400 mb-4" />}
      <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 mb-6 text-center max-w-md">{message}</p>
      {action && action}
    </div>
  )
}
