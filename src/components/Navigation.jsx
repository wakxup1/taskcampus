const VIEWS = [
  { id: 'summary', label: 'Resumen' },
  { id: 'tasks', label: 'Tareas' },
  { id: 'new', label: 'Nueva tarea' },
]

function Navigation({ activeView, onChange }) {
  return (
    <nav className="navigation" aria-label="Navegación principal">
      {VIEWS.map((view) => (
        <button
          key={view.id}
          className={`navigation-link ${activeView === view.id ? 'navigation-link-active' : ''}`}
          type="button"
          aria-current={activeView === view.id ? 'page' : undefined}
          onClick={() => onChange(view.id)}
        >
          {view.label}
        </button>
      ))}
    </nav>
  )
}

export default Navigation
