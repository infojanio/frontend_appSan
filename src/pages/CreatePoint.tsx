
import React, { useEffect, useState, ChangeEvent, MapHTMLAttributes, Attributes, FormEvent } from 'react';
import { FiArrowLeft, FiHome, FiArrowRight } from 'react-icons/fi';
import { MapContainer, TileLayer, Marker, Popup, MapContainerProps, MapConsumerProps, useMapEvents } from 'react-leaflet';
import { Link } from 'react-router-dom';

import axios from 'axios';

import L, { LeafletMouseEvent } from "leaflet";


import mapMarkerImg from '../icons/ferramenta.svg';
import logoImg from '../icons/water.svg';


import '../styles/pages/create-point.css';
import api from '../services/api';


interface Type {
    id: number;
    title: string;
    image: string;
  }

interface IBGEUFResponse {
  sigla: string;
}

interface IBGECityResponse {
  nome: string;
}
 
const mapIcon = L.icon({
    iconUrl: mapMarkerImg,

    iconSize: [58, 68],
    iconAnchor: [29, 68],
    popupAnchor: [170, 2],
    
})


const CreatePoint = () => {

  //Estados
    const [types, setTypes] = useState<Type[]>([]);
    const [ufs, setUfs] = useState<string[]>([]);
    const [cities, setCities] = useState<string[]>([]);
    
    const [initialPosition, setInitialPosition] = useState<[number, number]>([0, 0]);

    const [formData, setFormData] = useState({
      date: '',
      meter: '',
      whatsapp: '',

    })

    const [selectedUf, setSelectedUf] = useState('GO');
    const [selectedCity, setSelectedCity] = useState('Monte Alegre de Goiás');
    const [selectedItems, setSelectedItems] = useState<number[]>([]);

    const [selectedPosition, setSelectedPosition] = useState<[number, number]>([0, 0]);

//Atenção: Não consegui encontrar solução para colocar evento onclick no mapcontainer

    //Efeitos
    useEffect(()=> {
      navigator.geolocation.getCurrentPosition(position => {
        console.log(position)
        const { latitude, longitude} = position.coords;
        setInitialPosition([latitude, longitude]);
      });
    }, []);

    useEffect(()=> {
        api.get('types').then(response => {
            setTypes(response.data);
        }); 
    }, []);

    useEffect(()=> {
      axios.get<IBGEUFResponse[]>('https://servicodados.ibge.gov.br/api/v1/localidades/estados').then(response => {
          const ufInitials = response.data.map(uf => uf.sigla);
          setUfs(ufInitials);
      }); 
  }, []);

  useEffect(()=> {
    //seleciona as cidades sempre que a a uf mudar
    if(selectedUf === '0') {
      return;
    }
    axios.get<IBGECityResponse[]>(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedUf}/municipios`).then(response => {
      const cityNames = response.data.map(city => city.nome);
      setCities(cityNames);
  }); 

  }, [selectedUf]);

  function handleSelectUf(event: ChangeEvent<HTMLSelectElement>) {
    const uf = event.target.value;
    setSelectedUf(uf);
  }

  function handleSelectCity(event: ChangeEvent<HTMLSelectElement>) {
    const city = event.target.value;
    setSelectedCity(city);
  }

  function handleMapClick(event: LeafletMouseEvent) {
    const { lat: latidude, lng: longitude } = event.latlng;
    setSelectedPosition([latidude, longitude]);
  }
  

  function MyLocation() {    
    const map = useMapEvents({
      click: () => {
        map.locate()
      },
      locationfound: (location) => {
        const { lat: latidude, lng: longitude } = location.latlng;
        setSelectedPosition([latidude, longitude]);
    //    L.marker([latidude, longitude], { icon }).addTo(map.target);
        console.log('location found:', location)
      },
    })
    return null
  }

// 
function handleInputChange(event: ChangeEvent<HTMLInputElement>) {
const { name, value} = event.target;
setFormData({ ...formData, [name]: value})
}

function handleSelectItem (id: number) {
  console.log('clicado', id)
  //setSelectedItems([id]); //seleciona apenas 1 item

  const alreadySelected = selectedItems.findIndex(item => item ===id); //pega items selecionados
  
  if(alreadySelected >= 0) { //se já existir item selecionado, vê se os id são diferentes
    const filteredItems = selectedItems.filter(item => item !== id);
    setSelectedItems(filteredItems); 
  }
  else {
    setSelectedItems([...selectedItems, id ]) //seleciona mais de 1 tipo de vazamento
  }    
  }
  
  async function handleSubmit(event: FormEvent) { //salva os dados na API
    event.preventDefault();

    const { date, meter, whatsapp } = formData;
    const uf = selectedUf;
    const city = selectedCity;
    const [latitude, longitude] = selectedPosition;
    const items = selectedItems;

    const data = {
      date, 
      meter,
      whatsapp,
      uf,
      city,
      latitude,
      longitude,
      items
    }
    console.log(data);
    await api.post('points', data);
    alert("Ponto de perda cadastrado!")
  }



  return (
      <div id="page-create-point">
          <header>
              <img src={logoImg} alt=".DPerdas" className="img" />
              <p>.DPerdas</p>

              <Link to="/" >
              <FiHome />
              Página Inicial  
              <FiArrowLeft /> 
              </Link>
          </header>

          <form onSubmit={handleSubmit}>
              <h1>Cadastro de ocorrência</h1>
          

            <fieldset>
                <legend>
                    <h2>Dados</h2>
                </legend>

                <div className="field">
                <label htmlFor="data">Data</label>
                <input 
                type="date"
                name="date"
                id="date"
                onChange={handleInputChange}
                />
                </div>

                <div className="field-group">
                    
                <div className="field">
                <label htmlFor="meter">N. Hidrômetro</label>
                <input 
                type="text"
                name="meter"
                id="meter"
                onChange={handleInputChange}
                />
                </div>

                
                <div className="field">
                <label htmlFor="whatsapp">Whatsapp </label>
                <input 
                type="text"
                name="whatsapp"
                id="whatsapp"
                onChange={handleInputChange}
                />
                </div>
                </div>
 
            </fieldset>

            <fieldset>
                <legend>
                    <h2>Endereço</h2>
                    <span>Selecione o endereço no mapa</span>
                </legend>

                <MapContainer 
                center={ [-13.2549304, -46.8944970]} 
                zoom={14.8} 

                >
                  
                    <TileLayer                                
                    attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />

            <Marker 
            icon={mapIcon}
            position= {[-13.2548342, -46.8945686]} //{selectedPosition} pega a posição do click
            >

            <Popup closeButton={false} minWidth={240} maxWidth={240} className="map-popup">
            Localização Atual
            <Link to="/points/1">
                <FiArrowRight size={20} color="#fff"/>
                </Link>    

            </Popup>

            </Marker>

        <MyLocation />
            
                </MapContainer>

                <div className="field-group">
                    <div className="field">
                        <label htmlFor="uf">Estado (UF)</label>
                        <select 
                        name="uf" 
                        id="uf" 
                        value={selectedUf} onChange={handleSelectUf}>

                        <option value="0">Selecione a UF</option>
                        {ufs.map(uf => (
                          <option key={uf} value={uf}>{uf}</option>
                        ))}
                        </select>                        
                    </div>

                    <div className="field">
                        <label htmlFor="city">Cidade</label>
                        <select 
                        name="city" 
                        id="city"
                          value={selectedCity} onChange={handleSelectCity}>

                        <option value="0">Selecione a cidade</option>
                        {cities.map(city => (
                          <option key={city} value={city}>{city}</option>
                        ))}

                        </select>                        
                    </div>

                </div>
            </fieldset>

            <fieldset>
                <legend>
                    <h2>Tipos de perdas de água</h2>
                    <span>Selecione o tipo</span>
                </legend>

            <ul className="items-grid">
                
                {types.map(type => (
                    <li 
                    key= {type.id} 
                    onClick= {()=> handleSelectItem(type.id)} 
                    className={selectedItems.includes(type.id) ? 'selected': ''}
                    >

                <img src={`http://localhost:3333/uploads/${type.image}`} alt={type.title}/>
                <span>{type.title}</span>
                </li>

                ) )}
                
            </ul>

            </fieldset>

            <button type="submit">
            Cadastrar ponto de vazamento
            </button>
            </form>

            <footer>
            <img src={logoImg} alt=".DPerdas" className="img" />
            </footer>
      </div>
      
  )
                }

export default CreatePoint;



/*

import React, { useEffect, useState, ChangeEvent, FormEvent } from "react";
import logo from "../../assets/logo.svg";
import { Link, useHistory } from "react-router-dom";
import "./styles.css";
import { FiArrowLeft } from "react-icons/fi";
import { Map, TileLayer, Marker } from "react-leaflet";
//import api from "../../services/api";
import { LeafletMouseEvent } from "leaflet";
//import Dropzone from "../../components/Dropzone";
//import axios from "axios";

interface Item {
  id: number;
  title: string;
  image_url: string;
}

interface IBGEUFResponse {
  sigla: string;
}

interface IBGECityResponse {
  nome: string;
}

const CreatePoint: React.FC = () => {
  const history = useHistory();

  const [selectedFile, setSelectedFile] = useState<File>();
  const [items, setItems] = useState<Item[]>([]);
  const [ufs, setUfs] = useState<string[]>([]);
  const [cities, setCities] = useState<string[]>([]);
  const [selectedUf, setSelectedUf] = useState("0");
  const [selectedCity, setSelectedCity] = useState("0");
  const [selectedPosition, setSelectedPosition] = useState<[number, number]>([
    0,
    0,
  ]);
  const [initialPosition, setInitionPosition] = useState<[number, number]>([
    0,
    0,
  ]);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    whatsapp: "",
  });
  const [selectedItems, setSelectedItems] = useState<number[]>([]);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition((position) => {
      const { latitude, longitude } = position.coords;
      setInitionPosition([latitude, longitude]);
    });
  });

  useEffect(() => {
    api.get("/items").then((response) => {
      console.log(response.data);
      setItems(response.data);
    });
  }, []);

  useEffect(() => {
    axios
      .get<IBGEUFResponse[]>(
        "https://servicodados.ibge.gov.br/api/v1/localidades/estados"
      )
      .then((response) => {
        const ufInitials = response.data.map((uf) => uf.sigla);
        setUfs(ufInitials);
      });
  }, []);

  useEffect(() => {
    if (selectedUf === "0") return;

    axios
      .get<IBGECityResponse[]>(
        `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedUf}/municipios`
      )
      .then((response) => {
        const cityNames = response.data.map((city) => city.nome);
        setCities(cityNames);
      });
  }, [selectedUf]);

  function handleSelectUf(event: ChangeEvent<HTMLSelectElement>) {
    setSelectedUf(event.target.value);
  }

  function handleSelectCity(event: ChangeEvent<HTMLSelectElement>) {
    setSelectedCity(event.target.value);
  }

  function handleMapClick(event: LeafletMouseEvent) {
    const { lat: latidude, lng: longitude } = event.latlng;
    setSelectedPosition([latidude, longitude]);
  }

  function handleInputChange(event: ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  }

  function handleSelectItem(id: number) {
    const alreadySelected = selectedItems.includes(id);
    if (alreadySelected) {
      setSelectedItems([
        ...selectedItems.filter((idFiltered) => idFiltered !== id),
      ]);
    } else {
      setSelectedItems([...selectedItems, id]);
    }
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();

    const { name, email, whatsapp } = formData;
    const uf = selectedUf;
    const city = selectedCity;
    const [latitude, longitude] = selectedPosition;
    const items = selectedItems;

    const data = new FormData();

    data.append("name", name);
    data.append("email", email);
    data.append("whatsapp", whatsapp);
    data.append("city", city);
    data.append("uf", uf);
    data.append("latitude", String(latitude));
    data.append("longitude", String(longitude));
    data.append("items", items.join(","));

    if (selectedFile) {
      data.append("image", selectedFile);
    }

    // Old away to send data for the server, now I need do send a Multipart Data not a json
    // const data = {
    //   name,
    //   email,
    //   whatsapp,
    //   city,
    //   uf,
    //   latitude,
    //   longitude,
    //   items,
    // };

    console.log(data);

    await api.post("/points", data);

    history.push("/");
  }

  return (
    <div id="page-create-point">
      <header>
        <img src={logo} alt="Ecoleta" />
        <Link to="/">
          <FiArrowLeft />
          Voltar para home
        </Link>
      </header>

      <form onSubmit={handleSubmit}>
        <h1>
          Cadastro do <br /> ponto de coleta
        </h1>

        <Dropzone onFileUploaded={setSelectedFile} />

        <fieldset>
          <legend>
            <h2>Dados</h2>
          </legend>

          <div className="field">
            <label htmlFor="name">Nome da entidade</label>
            <input
              type="text"
              name="name"
              id="name"
              onChange={handleInputChange}
            />
          </div>

          <div className="field-group">
            <div className="field">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                name="email"
                id="email"
                onChange={handleInputChange}
              />
            </div>

            <div className="field">
              <label htmlFor="whatsapp">Whatsapp</label>
              <input
                type="number"
                name="whatsapp"
                id="whatsapp"
                onChange={handleInputChange}
              />
            </div>
          </div>
        </fieldset>

        <fieldset>
          <legend>
            <h2>Endereço</h2>
            <span>Selecione o endereço no mapa</span>
          </legend>

          <Map center={initialPosition} zoom={15} onClick={handleMapClick}>
            <TileLayer
              attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            <Marker position={selectedPosition} />
          </Map>

          <div className="field-group">
            <div className="field">
              <label htmlFor="uf">Estado (UF)</label>
              <select
                name="uf"
                id="uf"
                value={selectedUf}
                onChange={handleSelectUf}
              >
                <option value="0">Selecione uma UF</option>
                {ufs.map((uf) => (
                  <option key={uf} value={uf}>
                    {uf}
                  </option>
                ))}
              </select>
            </div>

            <div className="field">
              <label htmlFor="city">Cidade</label>
              <select
                name="city"
                id="city"
                value={selectedCity}
                onChange={handleSelectCity}
              >
                <option value="0">Selecione uma Cidade</option>
                {cities.map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </fieldset>

        <fieldset>
          <legend>
            <h2>Ítens de Coleta</h2>
            <span>Selecione um ou mais ítens abaixo</span>
          </legend>

          <ul className="items-grid">
            {items.map((item: Item) => (
              <li
                key={item.id}
                onClick={() => handleSelectItem(item.id)}
                className={selectedItems.includes(item.id) ? "selected" : ""}
              >
                <img src={item.image_url} alt={item.title} />
                <span>{item.title}</span>
              </li>
            ))}
          </ul>
        </fieldset>

        <button type="submit">Cadastrar ponto de coleta</button>
      </form>
    </div>
  );
};

export default CreatePoint;

*/