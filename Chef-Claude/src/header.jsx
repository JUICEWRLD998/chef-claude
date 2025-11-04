//here we created the header component for our app
export default function Header() {
  return (
    <header className="header">
        <img src="/chef.png" alt="Chef Logo" className="logo" />
      <h1>Chef Claude</h1>
      <nav>
        <ul>
          <li>Home</li>
          <li>About</li>
          <li>Contact</li>
        </ul>
      </nav>
    </header>
  )
}