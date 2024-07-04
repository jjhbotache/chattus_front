import { createBrowserRouter } from 'react-router-dom';
import Main from '../pages/Main';
import CreateRoom from '../pages/CreateRoom';
import JoinRoom from '../pages/JoinRoom';
import ShareYourCode from '../pages/ShareYourCode';
import Chat from '../pages/Chat';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Main />,
  },
  {
    path: '/create-room',
    element: <CreateRoom />,
  },
  {
    path: '/join-room',
    element: <JoinRoom />,
  },
  {
    path: '/share-code',
    element: <ShareYourCode />,
  },
  {
    path: '/chat',
    element: <Chat/>,
  },
]);
export default router;