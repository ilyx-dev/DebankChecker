import {randomChoice} from "../helpers";

export class ProxyManager {
    private proxies: string[]

    constructor(proxies: string[]) {
        this.proxies = proxies;
    }

    getWorkingProxy(): string {
        return randomChoice(this.proxies)
    }
}