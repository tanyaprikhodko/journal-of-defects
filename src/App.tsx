import AuthorizeContainer from './containers/AuthorizeContainer'
import './App.css'

function App() {
  return (
    <>
     <h1>Journal of Defects</h1>
      <div style={{ height: '100vh',width: '100vw', display: 'flex', flexDirection: 'column', backgroundColor: 'red' }}>
        <AuthorizeContainer />
      </div>
    </>
  )
}
export default App
