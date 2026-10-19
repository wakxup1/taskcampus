import { useState } from 'react'
import Button from './Button'

function TaskRow({ task, isPending, onToggle, onRename, onDelete }) {
  const [isEditing, setIsEditing] = useState(false)
  const [title, setTitle] = useState(task.title)
  const [validationError, setValidationError] = useState('')

  function saveTitle() {
    if (!isEditing) return
    const trimmedTitle = title.trim()
    setIsEditing(false)
    setValidationError('')

    if (!trimmedTitle) {
      setTitle(task.title)
      setValidationError('El título no puede estar vacío.')
      return
    }

    if (trimmedTitle !== task.title) onRename(task, trimmedTitle)
  }

  function cancelEdit() {
    setTitle(task.title)
    setValidationError('')
    setIsEditing(false)
  }

  return (
    <li className={`task-item ${task.completed ? 'task-item-completed' : ''}`}>
      <label className="task-check">
        <input
          type="checkbox"
          checked={task.completed}
          disabled={isPending}
          onChange={(event) => onToggle(task, event.target.checked)}
          aria-label={`Marcar "${task.title}" como ${task.completed ? 'pendiente' : 'completada'}`}
        />
      </label>
      <div className="task-content">
        {isEditing ? (
          <input
            className="edit-input"
            aria-label="Editar título de la tarea"
            value={title}
            autoFocus
            disabled={isPending}
            onChange={(event) => setTitle(event.target.value)}
            onBlur={saveTitle}
            onKeyDown={(event) => {
              if (event.key === 'Enter') event.currentTarget.blur()
              if (event.key === 'Escape') cancelEdit()
            }}
          />
        ) : (
          <button
            className="task-title"
            type="button"
            onDoubleClick={() => setIsEditing(true)}
            onClick={() => setIsEditing(true)}
            disabled={isPending}
            title="Haz doble clic o pulsa para editar"
          >
            {task.title}
          </button>
        )}
        <span className={`task-status ${task.completed ? 'status-completed' : 'status-pending'}`}>
          {task.completed ? 'Completada' : 'Pendiente'}
        </span>
        {validationError && <span className="field-error">{validationError}</span>}
      </div>
      <div className="task-actions">
        {!isEditing && (
          <Button
            variant="secondary"
            disabled={isPending}
            onClick={() => {
              setTitle(task.title)
              setIsEditing(true)
            }}
          >
            Editar
          </Button>
        )}
        <Button
          variant="danger"
          disabled={isPending}
          onClick={() => onDelete(task)}
        >
          {isPending ? 'Procesando…' : 'Eliminar'}
        </Button>
      </div>
    </li>
  )
}

function TaskList({ tasks, pendingIds, onToggle, onRename, onDelete }) {
  if (tasks.length === 0) {
    return <p className="empty-state">No hay tareas que coincidan con los filtros.</p>
  }

  return (
    <ul className="task-list">
      {tasks.map((task) => (
        <TaskRow
          key={task.id}
          task={task}
          isPending={pendingIds.has(task.id)}
          onToggle={onToggle}
          onRename={onRename}
          onDelete={onDelete}
        />
      ))}
    </ul>
  )
}

export default TaskList
