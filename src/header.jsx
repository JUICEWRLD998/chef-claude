//here we created the header component for our app
export default function Header() {
  return (
    <header className="header">
        <img src="/chef.png" alt="Chef Logo" className="logo" />
      <h1>Chef Claude</h1>
      <nav>
        <ul>
          <li className="active" aria-current="page">Generate</li>
          <li>Cook</li>
          <li>Discover</li>
        </ul>
      </nav>
    </header>
  )
}