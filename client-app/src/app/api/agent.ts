import axios, { AxiosError, AxiosResponse } from "axios";
import { Activity } from "../models/activity";
import { toast } from "react-toastify";
import { router } from "../router/Routes";
import { store } from "../stores/store";

const sleep = (delay: number) => {
    return new Promise((resolve) =>{
        setTimeout(resolve, delay)
    })
}

axios.defaults.baseURL = 'http://localhost:5010/api';

axios.interceptors.response.use(async response =>{
    await sleep(1000);
    return response;
}, (error: AxiosError) =>{
    const {data, status, config} = error.response as AxiosResponse;
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
            toast.error('unauthorized');
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
    list: () => request.get<Activity[]>('/activities'),
    details: (id:string) => request.get<Activity>(`/activities/${id}`),
    create: (activity: Activity) => request.post<void>('/activities', activity),
    update: (activity: Activity) => request.put<void>(`/activities/${activity.id}`, activity),
    delete: (id: string) => request.del<void>(`/activities/${id}`)
}

const agent = {
    Activities
}

export default agent;