import React from 'react';
import { Link } from 'react-router-dom';
import {FiPlus, FiArrowRight} from 'react-icons/fi';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import Leaflet from 'leaflet';

import 'leaflet/dist/leaflet.css';
import mapMarkerImg from '../images/map.svg';


import '../styles/pages/points-map.css';

const mapIcon = Leaflet.icon({
    iconUrl: mapMarkerImg,

    iconSize: [58, 68],
    iconAnchor: [29, 68],
    popupAnchor: [170, 2]

})

function PointsMap() {
    return(
        <div id="page-map">
            <aside>
                <header>
                    <img src={mapMarkerImg} alt=".DPerdas" />

                    <h2>Escolha um ponto de vazamento no mapa</h2>
                    <p>Visualize os detalhes deste ponto</p>
                </header>

                <footer>
                    <strong>Campos Belos</strong>
                    <span>Goiás</span>
                </footer>
            </aside>

        <MapContainer 
        center= {[-13.0354203,-46.7773097]}
        zoom= {15}
        style={{ width: '100%', height: '100%'}}
        >
            <TileLayer url="https://a.tile.openstreetmap.org/{z}/{x}/{y}.png" />

            <Marker 
            icon={mapIcon}
            position= {[-13.0345378,-46.7753647]}
            >

            <Popup closeButton={false} minWidth={240} maxWidth={240} className="map-popup">
            Vazamento cavalete
            <Link to="/points/1">
                <FiArrowRight size={20} color="#fff"/>
                </Link>    

            </Popup>

            </ Marker>

            </MapContainer>

        <Link to="/points/create" className="create-point">
        <FiPlus size={32} color="#FFF" />
        </Link>

        </div>
    );
}

export default PointsMap;