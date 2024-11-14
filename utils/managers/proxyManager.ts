import {randomChoice} from "../helpers";
import {HttpProvider, Web3} from "web3";
import {HttpsProxyAgent} from "https-proxy-agent";
import pLimit from "p-limit";

export class ProxyManager {
    private proxies: string[]
    private RPCs_FOR_PROXY_CHECK: string[]
    private max_attempts: number
    private verify_threads: number

    constructor(proxies: string[], RPCs_FOR_PROXY_CHECK: string[], max_attempts: number, verify_threads: number) {
        this.proxies = proxies;
        this.max_attempts = max_attempts
        this.RPCs_FOR_PROXY_CHECK = RPCs_FOR_PROXY_CHECK
        this.verify_threads = verify_threads
    }


    async checkProxyStatus(proxy: string): Promise<boolean> {
        const proxyAgent = new HttpsProxyAgent(proxy);
        const provider = randomChoice(this.RPCs_FOR_PROXY_CHECK)
        const web3 = new Web3(new HttpProvider(provider, {
            // @ts-ignore
            agent: proxyAgent
        }))
        try {
            await web3.eth.getBlockNumber();
            return true;
        } catch (e) {
            return false;
        }
    }

    async getWorkingProxies(): Promise<string[]> {
        const limit = pLimit(this.verify_threads);
        const proxyChecks = this.proxies.map(proxy => limit(() => this.checkProxyWithRetries(proxy)));
        const results = await Promise.all(proxyChecks);
        return this.proxies.filter((_, index) => results[index]);
    }

    private async checkProxyWithRetries(proxy: string): Promise<boolean> {
        for (let attempt = 1; attempt <= this.max_attempts; attempt++) {
            if (await this.checkProxyStatus(proxy)) {
                return true;
            }
        }
        return false;
    }
}