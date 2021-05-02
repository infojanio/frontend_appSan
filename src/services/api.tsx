import axios from 'axios';

const api = axios.create({
    baseURL: "http://localhost:3333" //depois é só mudar para o endereço do site
});
export default api;