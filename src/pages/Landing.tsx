import React from 'react';
import {FiArrowRight} from 'react-icons/fi';
import {Link} from 'react-router-dom';

import logoImg from '../images/gps.png';
import '../styles/pages/landing.css';



function Landing() {
return(
    
<div id="page-landing">
<div className="content-wrapper">

  <img src={logoImg} alt=".DPerdas"/>

  <main>
    <h1>Ajude a combater perdas de água parei 16min</h1>
    <p>Envie a localização do vazamento!</p>
  </main>

  <div className="location">
    <strong>Campos Belos</strong>
    <span>Goiás</span>
  </div>

  <Link to="/point" className="enter-app">
    <FiArrowRight size={26} color="rgba(0, 0, 0, 0.6)" />
  </Link>

</div>

</div>
);
}
export default Landing;