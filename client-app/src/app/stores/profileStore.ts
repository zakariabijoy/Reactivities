import { makeAutoObservable, runInAction } from "mobx";
import { Photo, Profile } from "../models/profile";
import agent from "../api/agent";
import { store } from "./store";

export default class ProfileStore{
    profile: Profile | null = null;
    loadingProfile = false;
    uploading = false;
    loading = false;
    followings: Profile[] =[];

    constructor(){
        makeAutoObservable(this);
    }

    get isCurrentUser(){
        if(store.userStore.user && this.profile){
            return store.userStore.user.username === this.profile.username;
        }

        return false;
    }

    loadProfile = async (username: string) => {
        this.loadingProfile = true;
        try {
            const profile = await agent.Profiles.get(username);
            runInAction(() =>{
                this.profile = profile;
            });
        } catch (error) {
            console.log(error);
        }finally{
            runInAction(() =>{
                this.loadingProfile = false;
            });   
        }
    }

    uploadPhoto = async (file: Blob) =>{
        this.uploading = true;
        try {
            const response = await agent.Profiles.uploadPhoto(file);
            const photo  = response.data;
            runInAction(() =>{
                if(this.profile){
                    this.profile.photos?.push(photo);
                    if(photo.isMain && store.userStore.user){
                        store.userStore.setImage(photo.url);
                        this.profile.image = photo.url;
                    }
                }
            });
        } catch (error) {
            console.log(error);
        }finally{
            runInAction(() =>{
                this.uploading = false;
            }); 
        }
    }

    setMainPhoto = async (photo: Photo) =>{
        this.loading = true;

        try {
            await agent.Profiles.setMainPhoto(photo.id);
            store.userStore.setImage(photo.url);
            runInAction(() =>{
                if(this.profile && this.profile.photos){
                    this.profile.photos.find(p => p.isMain)!.isMain = false;
                    this.profile.photos.find(p => p.id === photo.id)!.isMain = true;
                    this.profile.image = photo.url;
                }
            }); 
        } catch (error) {
            console.log(error);
        }finally{
            runInAction(() =>{
                this.loading = false;
            }); 
        }
    }

    deletePhoto = async (photo: Photo) =>{
        this.loading = true;

        try {
            await agent.Profiles.deletePhoto(photo.id);
            runInAction(() =>{
                if(this.profile){
                    this.profile.photos = this.profile.photos?.filter(p => p.id !== photo.id);
                }
            }); 
        } catch (error) {
            console.log(error);
        }finally{
            runInAction(() =>{
                this.loading = false;
            }); 
        }
    }

    updateProfile = async (profile: Partial<Profile>) => {
        this.loading = true;
        try {
            await agent.Profiles.updateProfile(profile);
            runInAction(() => {
                if (profile.displayName && profile.displayName !==
                    store.userStore.user?.displayName) {
                    store.userStore.setDisplayName(profile.displayName);
                }
                this.profile = { ...this.profile, ...profile as Profile };
                this.loading = false;
            })
        } catch (error) {
            console.log(error);
            runInAction(() => this.loading = false);
        }
    }

    updateFollowing = async (username: string, following: boolean) => {
        this.loading = true;
        try {
            await agent.Profiles.updateFollowing(username);
            store.activityStore.updateAttendeeFollowing(username);
            runInAction(() => {
                if(this.profile && this.profile.username !== store.userStore.user?.username){
                    following ? this.profile.followersCount++ : this.profile.followersCount--;
                    this.profile.following = !this.profile.following;
                }
                this.followings.forEach(profile =>{
                    if(profile.username == username){
                        profile.following ? profile.followersCount-- : profile.followersCount++
                        profile.following = !profile.following;
                    }
                })
                this.loading = false;
            });
        } catch (error) {
            console.log(error);
            runInAction(() => this.loading = false);
        }
    }
}