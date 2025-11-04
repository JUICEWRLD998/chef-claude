// create the root of the React app and mount a placeholder for now.
// App was removed per your request; render null so you can mount your app later.
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

const root = createRoot(document.getElementById('root'))
root.render(
  <>

  <App />
  

  </>
)
