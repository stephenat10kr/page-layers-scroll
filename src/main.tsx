
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

console.log("Main.tsx executing - mounting App");
createRoot(document.getElementById("root")!).render(<App />);
