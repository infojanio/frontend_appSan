import React from 'react';
import {FiMapPin} from 'react-icons/fi';
import {Link} from 'react-router-dom';

import logoImg from '../images/gps.png';
import '../styles/pages/landing.css';

const Landing = () => {
return(
    
<div id="page-landing">
<div className="content-wrapper">

  <img src={logoImg} alt=".DPerdas"/>

  <main>
    <h1>Plataforma de combate às perdas de água</h1>
    <p>Local do vazamento!</p>
  </main>

  <div className="location">
    <strong>Campos Belos</strong>
    <span>Goiás</span>
  </div>

  <Link to="/points/create" className="enter-app">
    <span>
    <FiMapPin size={26} color="rgba(0, 0, 0, 0.6)" />
    </span>
    <strong>Enviar</strong>
  </Link>

</div>

</div>
);
}
export default Landing;