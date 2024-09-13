import {randomChoice} from "../helpers";
import {HttpProvider, Web3} from "web3";
import {ProxyNotFoundError} from "../errors";
import {HttpsProxyAgent} from "https-proxy-agent";

export class ProxyManager {
    private proxies: string[]
    private RPCs_FOR_PROXY_CHECK: string[]
    private max_attempts: number

    constructor(proxies: string[], RPCs_FOR_PROXY_CHECK: string[], max_attempts: number) {
        this.proxies = proxies;
        this.max_attempts = max_attempts
        this.RPCs_FOR_PROXY_CHECK = RPCs_FOR_PROXY_CHECK
    }


    async checkProxyStatus(proxy: string): Promise<boolean> {
        const proxyAgent = new HttpsProxyAgent(proxy);
        const provider = randomChoice(this.RPCs_FOR_PROXY_CHECK)
        const web3 = new Web3(new HttpProvider(provider, {
            agent: proxyAgent
        }))
        try {
            await web3.eth.getBlockNumber();
            return true;
        } catch (e) {
            return false;
        }
    }

    async getWorkingProxy(): Promise<string> {
        for (let attempt = 1; attempt <= this.max_attempts; attempt++) {
            const randProxy = randomChoice(this.proxies);

            if (await this.checkProxyStatus(randProxy)) {
                return randProxy;
            }
        }
        throw new ProxyNotFoundError()
    }
}