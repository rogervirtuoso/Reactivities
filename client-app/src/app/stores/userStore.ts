import {action, computed, makeObservable, observable, runInAction} from "mobx";
import {IUser, IUserFormValues} from "../models/User";
import agent from "../api/agent";
import {RootStore} from "./rootStore";
import {history} from "../../index";
import {Console} from "inspector";

export default class UserStore {
    refreshTokenTimeout: any;
    rootStore: RootStore;

    constructor(rootStore: RootStore) {
        makeObservable(this);
        this.rootStore = rootStore
    }

    @observable user: IUser | null = null;

    @computed get isLoggedIn() {
        return !!this.user;
    }

    @action login = async (values: IUserFormValues) => {
        try {
            const user = await agent.User.login(values);
            runInAction(() => {
                this.user = user;

            })
            this.rootStore.commonStore.setToken(user.token);
            this.startRefreshTokenTimer(user);
            history.push('/activities')
            this.rootStore.modalStore.closeModal();
        } catch (error) {
            throw error;
        }
    }

    @action register = async (values: IUserFormValues) => {
        try {
            const user = await agent.User.register(values);
            runInAction(() => {
                this.user = user;

            })
            this.rootStore.commonStore.setToken(user.token);
            this.startRefreshTokenTimer(user);
            this.rootStore.modalStore.closeModal();
            history.push('/activities')
        } catch (error) {
            throw error;
        }
    }

    @action getUser = async () => {
        try {
            const user = await agent.User.current();
            runInAction(() => {
                this.user = user;
            });
            this.rootStore.commonStore.setToken(user.token);
            this.startRefreshTokenTimer(user);
        } catch (error) {
            console.log(error);
        }
    }

    @action logout = async () => {
        this.rootStore.commonStore.setToken(null);
        this.user = null;
        history.push('/')
    }

    @action refreshToken = async () => {
        this.stopRefreshTokenTimer();
        try {
            const user = await agent.User.refreshToken();
            runInAction(() => {
               this.user = user;
            });
            this.rootStore.commonStore.setToken(user.token);
            this.startRefreshTokenTimer(user);
        } catch (e) {
            console.log(e);
        }
    }

    private startRefreshTokenTimer(user: IUser){
        const jwtToken = JSON.parse(atob(user.token.split('.')[1]));
        const expires = new Date(jwtToken.exp * 1000);
        const timeout = expires.getTime() - Date.now() - 60;
        this.refreshTokenTimeout = setTimeout(this.refreshToken, timeout);
    }

    private stopRefreshTokenTimer(){
        clearTimeout(this.refreshTokenTimeout);
    }
}