import axios, {AxiosResponse} from 'axios';
import {IActivity} from "../model/activity";
import {history} from "../../index";
import {toast} from "react-toastify";

axios.defaults.baseURL = 'http://localhost:5000/api';

const axiosConfig = {
    headers: {
        'Content-Type': 'application/json; charset=UTF-8',
        "Access-Control-Allow-Origin": "*"
    }
};

axios.interceptors.response.use(undefined, error => {
    if (error.message === 'Network Error' && !error.response) {
        toast.error('Network Error - Please, make sure API is running!')
    }
    const {status, data, config} = error.response;
    if (status === 404) {
        history.push('/notFound');
    }
    if (status === 400 && config.method === 'get' && data.errors.hasOwnProperty('id')) {
        history.push('/notFound')
    }
    if (status === 500) {
        toast.error('Server error - Please, check the terminal for more info!');
    }
})

const responseBody = (response: AxiosResponse) => response ? response.data : [];

const sleep = (ms: number) => (response: AxiosResponse) => new Promise<AxiosResponse>(resolve => setTimeout(() => resolve(response), ms));

const request = {
    get: (url: string) => axios.get(url, axiosConfig).then(sleep(1000)).then(responseBody),
    post: (url: string, body: {}) => axios.post(url, body, axiosConfig).then(sleep(1000)).then(responseBody),
    put: (url: string, body: {}) => axios.put(url, body, axiosConfig).then(sleep(1000)).then(responseBody),
    del: (url: string) => axios.delete(url, axiosConfig).then(sleep(1000)).then(responseBody),

}

const Activities = {
    list: (): Promise<IActivity[]> => request.get('/activities/'),
    details: (id: string) => request.get('/activities/' + id),
    create: (activity: IActivity) => request.post('/activities/', activity),
    update: (activity: IActivity) => request.put('/activities/' + activity.id, activity),
    delete: (id: string) => request.del(`/activities/${id}`),
}

export default {
    Activities
};