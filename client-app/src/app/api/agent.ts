import axios, {AxiosResponse} from 'axios';
import {IActivitiesEnvelope, IActivity} from "../models/activity";
import {history} from "../../index";
import {toast} from "react-toastify";
import {IUser, IUserFormValues} from "../models/User";
import {IPhoto, IProfile, IProfileFormValues} from "../models/Profile";

axios.defaults.baseURL = process.env.REACT_APP_API_URL;

const axiosConfig = {
    headers: {
        'Content-Type': 'application/json; charset=UTF-8',
        "Access-Control-Allow-Origin": "*"
    }
};

axios.interceptors.request.use((config) => {
    const token = window.localStorage.getItem('jwt');
    if (token) config.headers.Authorization = `Bearer ${token}`;

    return config;
}, error => {
    return Promise.reject(error);
})

axios.interceptors.response.use(undefined, error => {
    if (error.message === 'Network Error' && !error.response) {
        toast.error('Network Error - Please, make sure API is running!')
    }
    const {status, data, config, headers} = error.response;
    if (status === 404) {
        history.push('/notFound');
    }
    if (status === 401 && headers['www-authenticate'].includes('Bearer error="invalid_token", error_description="The token expired')){
        window.localStorage.removeItem('jwt');
        history.push('/');
        toast.info('Your session has expired, please login again');
    }
    if (status === 400 && config.method === 'get' && data.errors.hasOwnProperty('id')) {
        history.push('/notFound')
    }
    if (status === 500) {
        toast.error('Server error - Please, check the terminal for more info!');
    }
    throw error.response;
})

const responseBody = (response: AxiosResponse) => response ? response.data : [];

const sleep = (ms: number) => (response: AxiosResponse) => new Promise<AxiosResponse>(resolve => setTimeout(() => resolve(response), ms));

const request = {
    get: (url: string) => axios.get(url, axiosConfig).then(responseBody),
    post: (url: string, body: {}) => axios.post(url, body, axiosConfig).then(responseBody),
    put: (url: string, body: {}) => axios.put(url, body, axiosConfig).then(responseBody),
    del: (url: string) => axios.delete(url, axiosConfig).then(responseBody),
    postForm: (url: string, file: Blob) => {
        let formData = new FormData();
        formData.append('File', file);
        return axios.post(url, formData, {
            headers: {'Content-type': 'multipart/form-data'}
        }).then(responseBody);
    }

}

const Activities = {
    list: (params: URLSearchParams): Promise<IActivitiesEnvelope> => axios.get('/activities', {params: params}).then(responseBody),
    details: (id: string) => request.get('/activities/' + id),
    create: (activity: IActivity) => request.post('/activities/', activity),
    update: (activity: IActivity) => request.put('/activities/' + activity.id, activity),
    delete: (id: string) => request.del(`/activities/${id}`),
    attendee: (id: string) => request.post(`/activities/${id}/attend`, {}),
    unattend: (id: string) => request.del(`/activities/${id}/attend`),

}

const User = {
    current: (): Promise<IUser> => request.get('user/'),
    login: (user: IUserFormValues): Promise<IUser> => request.post(`/user/login`, user),
    register: (user: IUserFormValues): Promise<IUser> => request.post(`/user/register`, user)
}

const Profiles = {
    get: (username: string): Promise<IProfile> => request.get(`/profiles/${username}`),
    uploadPhoto: (photo: Blob): Promise<IPhoto> => request.postForm(`/photos`, photo),
    setMainPhoto: (id: string) => request.post(`/photos/${id}/setMain`, {}),
    deletePhoto: (id: string) => request.del(`/photos/${id}`),
    updateProfile: (profile: IProfileFormValues): Promise<IProfile> => request.put(`/profiles`, profile),
    follow: (username: string) => request.post(`/profiles/${username}/follow`, {}),
    unfollow: (username: string) => request.del(`/profiles/${username}/follow`),
    listFollowings: (username: string, predicate: string) => request.get(`/profiles/${username}/follow?predicate=${predicate}`),
    listActivities: (username: string, predicate: string) => request.get(`/profiles/${username}/activities?predicate=${predicate}`),

}


export default {
    Activities,
    User,
    Profiles
};