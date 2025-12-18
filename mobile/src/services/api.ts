import axios from "axios";

const api = axios.create({
  // Use 10.0.2.2 para o emulador Android acessar o localhost da máquina host
  // Para dispositivo físico, use o IP da sua máquina (ex: 192.168.x.x)
  baseURL: "http://192.168.100.7:5000/api",
  // baseURL: "http://192.168.100.7:3004/api",
  timeout: 60000,
});

export default api;
