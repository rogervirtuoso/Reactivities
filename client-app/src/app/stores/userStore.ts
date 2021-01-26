import {action, computed, makeObservable, observable, runInAction} from "mobx";
import {IUser, IUserFormValues} from "../models/User";
import agent from "../api/agent";
import {RootStore} from "./rootStore";
import {history} from "../../index";

export default class UserStore {
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
            })
        } catch (error) {
            console.log(error);
        }
    }

    @action logout = async () => {
        this.rootStore.commonStore.setToken(null);
        this.user = null;
        history.push('/')
    }
}