import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Routing from './components/routing'
import './App.css';

// Redux
import { Provider } from 'react-redux'
import store from './store'
import { loadUser } from './actions/auth'
import setAuthToken from './utils/setAuthToken'

const App = () => {

  React.useEffect(() => {
    if (localStorage.token) {
      setAuthToken(localStorage.token)
    }
    store.dispatch(loadUser())

    window.addEventListener('storage', () => {
      if (!localStorage.token) store.dispatch({ type: 'LOGOUT' })
    })
  }, [])

  return (
    <Provider store={store}>
      <React.Fragment>
        <BrowserRouter>
          <Routes>
            <Route path='/*' element={<Routing />} />
          </Routes>
        </BrowserRouter>
      </React.Fragment>
    </Provider>
  )
}

export default App;