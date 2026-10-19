import Button from './Button'

function TaskSummary({ total, pending, completed, shown, onNavigate }) {
  const metrics = [
    { label: 'Total de tareas', value: total },
    { label: 'Pendientes', value: pending },
    { label: 'Completadas', value: completed },
    { label: 'Coinciden con los filtros', value: shown },
  ]

  return (
    <section className="card summary-card" aria-labelledby="summary-title">
      <div className="section-heading">
        <div>
          <h2 id="summary-title" className="section-title">Resumen de tareas</h2>
          <p className="muted-text">Métricas calculadas en tiempo real desde el estado de la sesión.</p>
        </div>
        {onNavigate && (
          <div className="summary-actions">
            <Button variant="primary" onClick={() => onNavigate('tasks')}>
              Ver tareas
            </Button>
            <Button variant="secondary" onClick={() => onNavigate('new')}>
              Añadir tarea
            </Button>
          </div>
        )}
      </div>
      <dl className="summary-grid">
        {metrics.map(({ label, value }) => (
          <div className="summary-metric" key={label}>
            <dt>{label}</dt>
            <dd>{value}</dd>
          </div>
        ))}
      </dl>
    </section>
  )
}

export default TaskSummary
