import {DebankAPI} from "./api/debankApi";
import {DebankResponse, PortfolioItem, TokenBalance} from "../utils/types";
import {ProxyManager} from "../utils/managers/proxyManager";

export class DebankChecker {
    private debankApi: DebankAPI
    private proxyManager: ProxyManager

    constructor(debankApi: DebankAPI, proxyManager: ProxyManager) {
        this.debankApi = debankApi
        this.proxyManager = proxyManager
    }

    private extractData<T>(response: DebankResponse<T>): T {
        return response.data;
    }

    async getPortfolio(address: string, proxy: string): Promise<PortfolioItem> {
        let response = await this.debankApi.get(`https://api.debank.com/portfolio/project_list?user_addr=${address}`, proxy)
        return this.extractData(response)
    }

    async getTokensForChain(address: string, chain: string, proxy: string): Promise<TokenBalance> {
        let response = await this.debankApi.get(`https://api.debank.com/token/balance_list?user_addr=${address}&chain=${chain}`, proxy)
        return this.extractData(response)
    }

}