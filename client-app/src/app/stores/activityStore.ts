import { makeObservable, observable } from "mobx"

export default class ActivityStore{
    title= 'Hello From Mobx!'

    constructor() {

        makeObservable(this, {
            title: observable
        })
    }
}