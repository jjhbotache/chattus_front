import ReactDOM from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import router from './router/router'
import { GlobalStyle } from './globalStyle'
import { Provider } from 'react-redux'
import store from './redux/store'
import { Slide, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';
import { hideAll, showAll } from './helpers/visibilityFucntions'



document.addEventListener('visibilitychange', ()=>{
  console.log('Visibility has changed');
  // document.visibilityState === 'visible'
  //   ?showAll()
  //   :hideAll();
});

window.addEventListener('blur', ()=>{
  console.log('Window is now blur');
  // hideAll();
});

window.addEventListener('focus', ()=>{
  console.log('Window is now focus');
  showAll();
});

window.addEventListener('keydown',(event)=>{
  // console.log(event.key);
  if (event.key.includes("Audio")) {
    hideAll();
  }
  
  if (event.key.includes("F")) {
    hideAll();
  }
  
  if (event.key === 'Meta' || event.key === 'Windows') {
      console.log('La tecla Command (Mac) ha sido presionada.');
      hideAll();
  }
});

window.addEventListener('keyup', () => {
  showAll();
});

window.addEventListener('beforeunload', () => {
  hideAll();
})

window.addEventListener('unload', () => {
  hideAll();
})

window.addEventListener('pagehide', () => {
  hideAll();
}) 

window.addEventListener('pageshow', () => {
  showAll();
})

window.addEventListener('click', () => {
  showAll();
})




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