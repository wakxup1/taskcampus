import { useMemo, useState } from 'react'
import './App.css'
import Header from './components/Header'
import Navigation from './components/Navigation'
import TaskSummary from './components/TaskSummary'
import TaskList from './components/TaskList'
import TaskForm from './components/TaskForm'
import ConfirmModal from './components/ConfirmModal'
import Button from './components/Button'
import useTareas from './hooks/useTareas'

const FILTERS = [
  { value: 'all', label: 'Todas' },
  { value: 'pending', label: 'Pendientes' },
  { value: 'completed', label: 'Completadas' },
]

function App() {
  const [activeView, setActiveView] = useState('summary')
  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')
  const [taskToDelete, setTaskToDelete] = useState(null)
  const {
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
  } = useTareas()

  const visibleTasks = useMemo(() => {
    const normalizedSearch = search.trim().toLocaleLowerCase()

    return tasks.filter((task) => {
      const matchesFilter =
        filter === 'all' ||
        (filter === 'completed' ? task.completed : !task.completed)
      const matchesSearch = task.title
        .toLocaleLowerCase()
        .includes(normalizedSearch)

      return matchesFilter && matchesSearch
    })
  }, [tasks, filter, search])

  const pendingCount = tasks.filter((task) => !task.completed).length
  const completedCount = tasks.length - pendingCount

  async function handleDelete() {
    if (!taskToDelete) return
    const succeeded = await deleteTask(taskToDelete)
    if (succeeded) setTaskToDelete(null)
  }

  async function handleCreate(title) {
    const succeeded = await createTask(title)
    if (succeeded) setActiveView('tasks')
    return succeeded
  }

  return (
    <main className="app-container">
      <Header
        title="TaskCampus"
        description="Organiza tus tareas académicas"
      />
      <Navigation activeView={activeView} onChange={setActiveView} />

      {(loading || error || notice) && (
        <p className={`app-message ${error ? 'app-message-error' : 'app-message-info'}`} role={error ? 'alert' : 'status'}>
          {error || notice || 'Cargando tareas…'}
        </p>
      )}

      {activeView === 'summary' && loading && (
        <section className="card">
          <h2 className="section-title">Resumen</h2>
          <p className="empty-state" role="status">Cargando tareas…</p>
        </section>
      )}
      {activeView === 'summary' && !loading && tasks.length === 0 && error && (
        <section className="card">
          <h2 className="section-title">Resumen</h2>
          <p className="empty-state">No se pudieron cargar las tareas debido a un error de conexión.</p>
        </section>
      )}
      {activeView === 'summary' && !loading && (tasks.length > 0 || !error) && (
        <TaskSummary
          total={tasks.length}
          pending={pendingCount}
          completed={completedCount}
          shown={visibleTasks.length}
          onNavigate={setActiveView}
        />
      )}

      {activeView === 'tasks' && (
        <section className="card">
          <div className="section-heading">
            <div>
              <h2 className="section-title">Tus tareas</h2>
              <p className="muted-text">Filtra y busca en tus tareas académicas.</p>
            </div>
            <Button onClick={() => setActiveView('new')}>Añadir tarea</Button>
          </div>

          <div className="task-toolbar">
            <div className="filter-group" aria-label="Filtrar tareas">
              {FILTERS.map((option) => (
                <Button
                  key={option.value}
                  variant={filter === option.value ? 'selected' : 'secondary'}
                  aria-pressed={filter === option.value}
                  onClick={() => setFilter(option.value)}
                >
                  {option.label}
                </Button>
              ))}
            </div>
            <label className="search-field">
              <span>Buscar por título</span>
              <input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Ej. React"
              />
            </label>
          </div>

          {loading ? (
            <p className="empty-state" role="status">Cargando tareas…</p>
          ) : error && tasks.length === 0 ? (
            <p className="empty-state">No se pudieron mostrar las tareas. Revisa el mensaje de error e inténtalo de nuevo más tarde.</p>
          ) : (
            <TaskList
              tasks={visibleTasks}
              pendingIds={pendingIds}
              onToggle={toggleTask}
              onRename={renameTask}
              onDelete={setTaskToDelete}
            />
          )}
        </section>
      )}

      {activeView === 'new' && (
        <TaskForm onSubmit={handleCreate} isSubmitting={creating} />
      )}

      <footer className="app-footer">
        <span>{tasks.length} {tasks.length === 1 ? 'tarea' : 'tareas'} en esta sesión</span>
        <Button variant="secondary" onClick={() => setActiveView('summary')}>
          Volver al resumen
        </Button>
      </footer>

      <ConfirmModal
        task={taskToDelete}
        isPending={Boolean(taskToDelete && pendingIds.has(taskToDelete.id))}
        onCancel={() => setTaskToDelete(null)}
        onConfirm={handleDelete}
      />
    </main>
  )
}

export default App
