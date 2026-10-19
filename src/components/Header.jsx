function Header({ title, description }) {
  return (
    <header className="header">
      <div className="brand-mark" aria-hidden="true">TC</div>
      <div>
        <h1 className="header-title">{title}</h1>
        <p className="header-description">{description}</p>
      </div>
    </header>
  )
}

export default Header