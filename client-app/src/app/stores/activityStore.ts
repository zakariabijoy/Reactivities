import { makeAutoObservable} from "mobx"

export default class ActivityStore{
    title= 'Hello From Mobx!!!'

    constructor() {

        makeAutoObservable(this)
    }

    setTitle = () => {
        this.title = this.title + '!';    
    }
}