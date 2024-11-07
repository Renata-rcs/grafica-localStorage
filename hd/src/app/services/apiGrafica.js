const { default: axios } = require("axios");

const apiGrafica = axios.create({
    baseURL: 'http://localhost:3333/'
})

export default apiGrafica