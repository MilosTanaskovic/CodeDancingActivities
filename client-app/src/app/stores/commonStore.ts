import { makeAutoObservable } from "mobx";
import { ServerError } from "../models/serverError";

export default class CommonStore {
    // var
    error: ServerError | null = null;

    // binding
    constructor() {
        makeAutoObservable(this);
    }

    // action
    setServerError = (error: ServerError) => {
        this.error = error;
    }

}