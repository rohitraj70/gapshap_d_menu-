const EmptyState = ({ icon: Icon, title, description, action }) => (
  <div className="flex flex-col items-center justify-center text-center py-16 px-6">
    {Icon && (
      <div className="w-16 h-16 rounded-full bg-cream-dark flex items-center justify-center mb-4 text-brown-light">
        <Icon size={28} />
      </div>
    )}
    <h3 className="font-display text-lg font-semibold text-brown-dark">{title}</h3>
    {description && <p className="text-sm text-brown-light mt-1 max-w-xs">{description}</p>}
    {action && <div className="mt-4">{action}</div>}
  </div>
);

export default EmptyState;
