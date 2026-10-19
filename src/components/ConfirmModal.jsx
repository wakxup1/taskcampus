import { useEffect } from 'react'
import Button from './Button'

function ConfirmModal({ task, isPending, onCancel, onConfirm }) {
  useEffect(() => {
    if (!task) return

    function handleKeyDown(event) {
      if (event.key === 'Escape' && !isPending) {
        onCancel()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [task, isPending, onCancel])

  if (!task) return null

  return (
    <div className="modal-backdrop" onMouseDown={onCancel} role="presentation">
      <section
        className="confirm-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-title"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <h2 id="confirm-title">Eliminar tarea</h2>
        <p>¿Seguro que deseas eliminar &ldquo;{task.title}&rdquo;? Esta acción no se puede deshacer.</p>
        <div className="modal-actions">
          <Button variant="secondary" disabled={isPending} onClick={onCancel}>
            Cancelar
          </Button>
          <Button variant="danger" disabled={isPending} onClick={onConfirm}>
            {isPending ? 'Eliminando…' : 'Sí, eliminar'}
          </Button>
        </div>
      </section>
    </div>
  )
}

export default ConfirmModal
