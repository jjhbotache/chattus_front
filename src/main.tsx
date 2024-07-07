import ReactDOM from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import router from './router/router'
import { GlobalStyle } from './globalStyle'
import { Provider } from 'react-redux'
import store from './redux/store'
import { Slide, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';
import { hideAll, showAll } from './helpers/visibilityFucntions'



ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <>
    <ToastContainer
      position="top-right"
      autoClose={5000}
      hideProgressBar={false}
      newestOnTop
      closeOnClick
      rtl={false}
      pauseOnFocusLoss={false}
      draggable
      pauseOnHover={false}
      theme="dark"
      transition={Slide}
    />
    <Provider store={store}>
      <GlobalStyle/>
      <RouterProvider router={router}/>
    </Provider>
  </>
)