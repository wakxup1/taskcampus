const API_URL = 'https://jsonplaceholder.typicode.com/todos'

async function request(url, options = {}) {
  const response = await fetch(url, {
    ...options,
    headers: {
      Accept: 'application/json',
      ...(options.body ? { 'Content-Type': 'application/json' } : {}),
      ...options.headers,
    },
  })

  if (!response.ok) {
    throw new Error(`La API respondió con el estado ${response.status}.`)
  }

  if (response.status === 204) return null

  try {
    return await response.json()
  } catch {
    throw new Error('La API devolvió una respuesta JSON inválida.')
  }
}

export async function obtenerTareas(signal) {
  const data = await request(`${API_URL}?_limit=10`, { signal })

  if (!Array.isArray(data)) {
    throw new Error('La respuesta de tareas no tiene el formato esperado.')
  }

  return data.map((task) => {
    if (typeof task.id !== 'number' || typeof task.title !== 'string') {
      throw new Error('La API devolvió una tarea con datos inválidos.')
    }

    return {
      id: `remote-${task.id}`,
      remoteId: task.id,
      title: task.title,
      completed: Boolean(task.completed),
    }
  })
}

export async function crearTarea(title) {
  return request(API_URL, {
    method: 'POST',
    body: JSON.stringify({ title, completed: false, userId: 1 }),
  })
}

export async function actualizarTarea(remoteId, changes) {
  return request(`${API_URL}/${remoteId}`, {
    method: 'PATCH',
    body: JSON.stringify(changes),
  })
}

export async function eliminarTarea(remoteId) {
  return request(`${API_URL}/${remoteId}`, { method: 'DELETE' })
}
