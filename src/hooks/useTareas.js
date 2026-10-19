import { useCallback, useEffect, useState } from 'react'
import {
  actualizarTarea,
  crearTarea as crearTareaEnApi,
  eliminarTarea as eliminarTareaEnApi,
  obtenerTareas,
} from '../services/tareasService'

function createLocalId() {
  return `local-${globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(36).slice(2)}`}`
}

function useTareas() {
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const [pendingIds, setPendingIds] = useState(() => new Set())
  const [creating, setCreating] = useState(false)

  useEffect(() => {
    const controller = new AbortController()

    obtenerTareas(controller.signal)
      .then((loadedTasks) => {
        setTasks(loadedTasks)
        setError('')
      })
      .catch((loadError) => {
        if (loadError.name !== 'AbortError') {
          setError(`No se pudieron cargar las tareas iniciales. ${loadError.message}`)
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false)
      })

    return () => controller.abort()
  }, [])

  const beginTaskOperation = useCallback((id) => {
    setPendingIds((previous) => new Set(previous).add(id))
  }, [])

  const endTaskOperation = useCallback((id) => {
    setPendingIds((previous) => {
      const next = new Set(previous)
      next.delete(id)
      return next
    })
  }, [])

  const createTask = useCallback(async (title) => {
    setCreating(true)
    setError('')
    setNotice('')

    try {
      const result = await crearTareaEnApi(title)
      if (!result || typeof result.title !== 'string') {
        throw new Error('La API no confirmó la creación de la tarea.')
      }

      const newTask = {
        id: createLocalId(),
        remoteId: typeof result.id === 'number' ? result.id : 201,
        title: result.title,
        completed: Boolean(result.completed),
      }

      setTasks((previous) => [newTask, ...previous])
      setNotice('Tarea creada exitosamente.')
      return true
    } catch (createError) {
      setError(`No se pudo crear la tarea. ${createError.message}`)
      return false
    } finally {
      setCreating(false)
    }
  }, [])

  const toggleTask = useCallback(async (task, completed) => {
    beginTaskOperation(task.id)
    setError('')
    setNotice('')

    try {
      if (task.remoteId !== null) {
        await actualizarTarea(task.remoteId, { completed })
      }
      setTasks((previous) =>
        previous.map((item) =>
          item.id === task.id ? { ...item, completed } : item,
        ),
      )
    } catch (updateError) {
      setError(`No se pudo actualizar el estado de la tarea. ${updateError.message}`)
    } finally {
      endTaskOperation(task.id)
    }
  }, [beginTaskOperation, endTaskOperation])

  const renameTask = useCallback(async (task, title) => {
    beginTaskOperation(task.id)
    setError('')
    setNotice('')

    try {
      if (task.remoteId !== null) {
        await actualizarTarea(task.remoteId, { title })
      }
      setTasks((previous) =>
        previous.map((item) => (item.id === task.id ? { ...item, title } : item)),
      )
    } catch (updateError) {
      setError(`No se pudo actualizar el título de la tarea. ${updateError.message}`)
    } finally {
      endTaskOperation(task.id)
    }
  }, [beginTaskOperation, endTaskOperation])

  const deleteTask = useCallback(async (task) => {
    beginTaskOperation(task.id)
    setError('')
    setNotice('')

    try {
      if (task.remoteId !== null) {
        await eliminarTareaEnApi(task.remoteId)
      }
      setTasks((previous) => previous.filter((item) => item.id !== task.id))
      return true
    } catch (deleteError) {
      setError(`No se pudo eliminar la tarea. ${deleteError.message}`)
      return false
    } finally {
      endTaskOperation(task.id)
    }
  }, [beginTaskOperation, endTaskOperation])

  return {
    tasks,
    loading,
    error,
    notice,
    pendingIds,
    creating,
    createTask,
    toggleTask,
    renameTask,
    deleteTask,
  }
}

export default useTareas
