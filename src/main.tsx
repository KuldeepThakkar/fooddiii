import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// #region agent log
fetch('http://127.0.0.1:7842/ingest/41b987d8-ba2a-4128-b946-11e5f4a4f935',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'cb284e'},body:JSON.stringify({sessionId:'cb284e',location:'main.tsx:boot',message:'main.tsx executing',data:{hasRoot:!!document.getElementById('root')},timestamp:Date.now(),hypothesisId:'H1',runId:'pre-fix'})}).catch(()=>{});
// #endregion

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <App />
    </React.StrictMode>,
)

// #region agent log
fetch('http://127.0.0.1:7842/ingest/41b987d8-ba2a-4128-b946-11e5f4a4f935',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'cb284e'},body:JSON.stringify({sessionId:'cb284e',location:'main.tsx:rendered',message:'ReactDOM.render called',data:{},timestamp:Date.now(),hypothesisId:'H1',runId:'pre-fix'})}).catch(()=>{});
// #endregion
