const { default: axios } = require("axios");

const apiViaCep = axios.create({
    baseURL: 'https://viacep.com.br/ws/'
});

export default apiViaCep;
