import axios, {type AxiosResponse, type InternalAxiosRequestConfig} from 'axios';
import {camelizeKeys, decamelizeKeys} from 'humps';

const api = axios.create({
    baseURL: 'http://localhost:8080'
});

api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
    const newConfig = { ...config };
    newConfig.url = `api/${config.url}`;

    if (newConfig.headers['Content-Type'] === 'multipart/form-data')
        return newConfig;

    if (config.params) {
        newConfig.params = decamelizeKeys(config.params);
    }

    if (config.data) {
        newConfig.data = decamelizeKeys(config.data);
    }

    return newConfig;
});

api.interceptors.response.use((response: AxiosResponse) => {
    if (
        response.data &&
        response.headers['content-type'] === 'application/json'
    ) {
        response.data = camelizeKeys(response.data);
    }

    return response;
});

export default api;