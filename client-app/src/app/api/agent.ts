import axios, { AxiosResponse } from "axios";
import {IActivity} from "../models/activity";

axios.defaults.baseURL = "https://localhost:5001/api";

const responseBody = (response : AxiosResponse) => response.data;

const requests ={
    get: (url:string) => axios.get(url).then(responseBody),
    post: (url:string, body: {}) => axios.post(url, body).then(responseBody),
    put: (url:string, body: {}) => axios.put(url, body).then(responseBody),
    del: (url:string) => axios.delete(url).then(responseBody)
}
const activities ={
    list: () => requests.get('/activities'),
    details: (id:string) => requests.get(`/activities/${id}`),
    create: (activity: IActivity) => requests.post('/activities', activity),
    update: (activity: IActivity) => requests.put(`/activities/${activity.id}`, activity),
    delete: (id: string) => requests.del(`/activities/${id}`)
}
export default {
    activities
}