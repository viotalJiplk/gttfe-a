import {Route, Routes} from 'react-router-dom';
import Home from './pages/Home/Home';
import Game from './pages/Game/Game';
import PageUpdate from './pages/Game/PageUpdate/PageUpdate';
import Update from './pages/Game/Update/Update';
import Role from './pages/Role/Role';
import AddToUser from './pages/Role/AddToUser/AddToUser';
import './App.scss';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/game" element={<Game />} />
      <Route path="/game/page-update" element={<PageUpdate />} />
      <Route path="/game/update" element={<Update />} />
      <Route path="/role" element={<Role />} />
      <Route path="/role/add-to-user" element={<AddToUser />} />
    </Routes>
  )
}

export default App;
