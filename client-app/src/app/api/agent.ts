import axios, { AxiosError, AxiosResponse } from "axios";
import { Activity, ActivityFormValues } from "../models/activity";
import { toast } from "react-toastify";
import { router } from "../router/Routes";
import { store } from "../stores/store";
import { User, UserFormValues } from "../models/user";
import { Photo, Profile, UserActivity } from "../models/profile";
import { PaginatedResult } from "../models/pagination";

const sleep = (delay: number) => {
    return new Promise((resolve) =>{
        setTimeout(resolve, delay)
    })
}

axios.defaults.baseURL = import.meta.env.VITE_API_URL;

axios.interceptors.request.use(config =>{
    const token = store.commonStore.token;
    if(token && config.headers) config.headers.Authorization = `Bearer ${token}`;
    return config;
})

axios.interceptors.response.use(async response =>{
    if(import.meta.env.DEV) await sleep(1000);
    const pagination = response.headers['pagination'];
    if(pagination){
        response.data = new PaginatedResult(response.data, JSON.parse(pagination));
        return response as AxiosResponse<PaginatedResult<any>>
    }

    return response;
}, (error: AxiosError) =>{
    console.log(error);
    const {data, status, config, headers} = error.response as AxiosResponse;
    switch (status) {
        case 400:
            if(config.method === 'get' && Object.prototype.hasOwnProperty.call(data.errors, 'id')){
                router.navigate('/not-found');
            }

            if(data.errors){
                const modelStateErrors = [];
                for(const key in data.errors){
                    if(data.errors[key]){
                        modelStateErrors.push(data.errors[key])
                    }
                }
                throw modelStateErrors.flat();
            }else{
                toast.error(data);
            }
            break;
        case 401:
            if(status === 401 && headers['www-authenticate']?.startsWith('Bearer error="invalid_token"')){
                store.userStore.logout();
                toast.error('Session expired - please login again');
            }else{
                toast.error('unauthorized');
            } 
            break;
        case 403:
            toast.error('forbiddent');
            break;
        case 404:
            router.navigate('/not-found');
            break;
        case 500:
           store.commonStore.setServerError(data);
           router.navigate('/server-error');
            break;
    }
    return Promise.reject(error);
})

const responseBody = <T> (response: AxiosResponse<T>) => response.data;

const request ={
    get: <T> (url: string) => axios.get<T>(url).then(responseBody),
    post: <T> (url: string, body:{}) => axios.post<T>(url, body).then(responseBody),
    put: <T> (url: string, body:{}) => axios.put<T>(url, body).then(responseBody),
    del: <T> (url: string) => axios.delete<T>(url).then(responseBody),
}

const Activities = {
    list: (params:  URLSearchParams) => axios.get<PaginatedResult<Activity[]>>('/activities', {params}).then(responseBody),
    details: (id:string) => request.get<Activity>(`/activities/${id}`),
    create: (activity: ActivityFormValues) => request.post<void>('/activities', activity),
    update: (activity: ActivityFormValues) => request.put<void>(`/activities/${activity.id}`, activity),
    delete: (id:string) => request.del<void>(`/activities/${id}`),
    attend: (id:string) => request.post<void>(`/activities/${id}/attend`, {})
}

const Account ={
    current: () => request.get<User>('/account'),
    login: (user: UserFormValues) => request.post<User>('/account/login', user),
    register: (user: UserFormValues) => request.post<User>('/account/register', user),
    fbLogin: (accessToken: string) => request.post<User>(`/account/fbLogin?accessToken=${accessToken}`, {}),
    refreshToken: () => request.post<User>(`/account/refreshToken`, {}),
    verifyEmail: (token: string, email: string) => request.post<void>(`/account/verifyEmail?token=${token}&email=${email}`, {}),
    resendEmailConfirm: (email: string) => request.get(`/account/resendEmailConfirmationLink?email=${email}`)
}

const Profiles ={
    get: (username: string) => request.get<Profile>(`/profiles/${username}`),
    uploadPhoto: (file: Blob) => {
        let formData = new FormData();
        formData.append('File', file);
        return axios.post<Photo>('photos', formData, {
            headers: { 'Content-Type' : 'multipart/form-data'}
        })
    },
    setMainPhoto: (id: string) => request.post(`/photos/${id}/setMain`, {}),
    deletePhoto: (id: string) => request.del(`/photos/${id}`),
    updateProfile: (profile: Partial<Profile>) => request.put(`/profiles`, profile),
    updateFollowing: (username: string) => request.post(`/follow/${username}`, {}),
    listFollowings: (username: string, predicate: string) => request
        .get<Profile[]>(`/follow/${username}?predicate=${predicate}`),
    listActivities: (username: string, predicate: string) =>
        request.get<UserActivity[]>(`/profiles/${username}/activities?predicate=${predicate}`)
}

const agent = {
    Activities,
    Account,
    Profiles
}

export default agent;