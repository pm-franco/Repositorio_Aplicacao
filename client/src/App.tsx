import React, {useState} from 'react';
import './App.css';
import {Route, BrowserRouter as Router, Routes} from 'react-router-dom';
import Home from "./Home/Home";
import NavBar from "./Home/NavBar";
import SignUp from "./User/SignUp";
import SignIn from "./User/SignIn";
import Profile from "./User/Profile";
import ArtworkGallery from "./Artworks/ArtworkGallery";
import InsertArtwork from "./Artworks/InsertArtwork";
import InsertPoint from "./Points/InsertPoint";
import ArtworkPage from "./Artworks/ArtworkPage";
import InsertEquipment from "./Points/InsertEquipment";
import InsertExtraInfo from "./Artworks/InsertExtraInfo";
import PointPage from "./Points/PointPage";
import EditProfile from "./User/EditProfile";
import EditArtwork from "./Artworks/EditArtwork";
import EditPoint from "./Points/EditPoint";
import LayerNamePage from "./Extra/LayerNamePage";
import SignUpSpecial from "./User/SignUpSpecial";
import UpdateUserRole from "./User/UpdateUserRole";
import PointWithPoints from "./Points/PointWithPoints";
import SecretsPage from "./Extra/SecretsPage";
import EditEquipment from "./Points/EditEquipment";
import InsertImageLayer from "./Artworks/InsertImageLayer";
import ImageLayerGallery from "./Artworks/ImageLayerGallery";
import EditImageLayer from "./Artworks/EditImageLayer";
import ArtworkPagePoints from "./Artworks/ArtworkPagePoints";
import ArtworkPageExtraInfos from "./Artworks/ArtworkPageExtraInfos";

function App() {

    const [role, setRole] = useState(localStorage.getItem("role"))
    const [email, setEmail] = useState(localStorage.getItem("email"))
    const [name, setName] = useState(localStorage.getItem("name"))

    const handleData = (role:string, email:string, name:string) => {
        setRole(role);
        setEmail(email);
        setName(name);
        localStorage.setItem("role", role)
        localStorage.setItem("name", name)
        localStorage.setItem("email", email)
    };

  return (
      <Router>
          <NavBar handleData={handleData} role={role} email={email} name={name} />
          <Routes>
              <Route path='/login' element={<SignIn handleData={handleData}/>}/>
              <Route path='/register' element={<SignUp/>} />
              <Route path='/person/:email' element={<Profile/>}/>
              <Route path='/edit_person/:email' element={<EditProfile/>}/>
              <Route path='/artworks' element={<ArtworkGallery/>}/>
              <Route path='/artwork/:id' element={<ArtworkPage/>}/>
              <Route path='/artwork_points/:id' element={<ArtworkPagePoints/>}/>
              <Route path='/artwork_extra/:id' element={<ArtworkPageExtraInfos/>}/>
              <Route path='/insert_point/:id' element={<InsertPoint/>}/>
              <Route path='/insert_equipment/:id' element={<InsertEquipment/>}/>
              <Route path='/insert_extra_info/:id' element={<InsertExtraInfo/>}/>
              <Route path='/point_zoom/:id' element={<PointPage/>}/>
              <Route path='/insert_artwork' element={<InsertArtwork/>}/>
              <Route path='/edit_artwork/:id' element={<EditArtwork/>}/>
              <Route path='/edit_point/:id' element={<EditPoint/>}/>
              <Route path='/layer_name/' element={<LayerNamePage/>}/>
              <Route path='/update_role/' element={<UpdateUserRole/>}/>
              <Route path="/secret/register" element={<SignUpSpecial/>}/>
              <Route path="/point/:id" element={<PointWithPoints/>}/>
              <Route path="/secrets" element={<SecretsPage/>}/>
              <Route path="/edit_equipment/:id" element={<EditEquipment/>}/>
              <Route path="/insert_image_layer/:id" element={<InsertImageLayer/>}/>
              <Route path="/images_layer/:artId" element={<ImageLayerGallery/>}/>
              <Route path="/edit_layer/:id" element={<EditImageLayer/>}/>
              <Route path='/' element={<Home/>} />
          </Routes>
      </Router>
  );
}

export default App;
