import ReactDOM from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import router from './router/router'
import { GlobalStyle } from './globalStyle'
import { Provider } from 'react-redux'
import store from './redux/store'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <>
    <Provider store={store}>
      <GlobalStyle/>
      <RouterProvider router={router}/>
    </Provider>
  </>
)