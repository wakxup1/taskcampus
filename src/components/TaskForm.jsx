import { useState } from 'react'
import Button from './Button'

function TaskForm({ onSubmit, isSubmitting }) {
  const [title, setTitle] = useState('')
  const [validationError, setValidationError] = useState('')

  async function handleSubmit(event) {
    event.preventDefault()
    const trimmedTitle = title.trim()

    if (!trimmedTitle) {
      setValidationError('Escribe un título para la tarea.')
      return
    }

    setValidationError('')
    if (await onSubmit(trimmedTitle)) setTitle('')
  }

  return (
    <section className="card form-card">
      <h2 className="section-title">Crear una tarea</h2>
      <p className="muted-text">Agrega una nueva tarea a tu lista académica.</p>
      <form className="task-form" onSubmit={handleSubmit} noValidate>
        <label className="form-field" htmlFor="task-title">
          <span>Título</span>
          <input
            id="task-title"
            name="title"
            type="text"
            value={title}
            maxLength={160}
            onChange={(event) => {
              setTitle(event.target.value)
              if (validationError) setValidationError('')
            }}
            aria-invalid={Boolean(validationError)}
            aria-describedby={validationError ? 'task-title-error' : undefined}
            placeholder="Ej. Preparar el informe de laboratorio"
            disabled={isSubmitting}
          />
        </label>
        {validationError && (
          <p className="field-error" id="task-title-error" role="alert">{validationError}</p>
        )}
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Creando…' : 'Crear tarea'}
        </Button>
      </form>
    </section>
  )
}

export default TaskForm
