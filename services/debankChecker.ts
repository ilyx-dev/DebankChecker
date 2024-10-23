import {DebankAPI} from "./api/debankApi";
import {DebankResponse, Project, TokenBalance} from "../utils/types";

export class DebankChecker {
    private debankApi: DebankAPI

    constructor(debankApi: DebankAPI) {
        this.debankApi = debankApi
    }

    private extractData<T>(response: DebankResponse<T>): T {
        return response.data;
    }

    async getPortfolio(address: string, proxy: string): Promise<Project[]> {
        let response = await this.debankApi.get(`https://api.debank.com/portfolio/project_list?user_addr=${address}`, proxy)
        return this.extractData(response)
    }

    async getTokensForChain(address: string, chain: string, proxy: string): Promise<TokenBalance[]> {
        let response = await this.debankApi.get(`https://api.debank.com/token/balance_list?user_addr=${address}&chain=${chain}`, proxy)
        return this.extractData(response)
    }

    async getTotalUsdBalance(address: string, proxy: string): Promise<any> {
        let response = await this.debankApi.get(`https://api.debank.com/user?id=${address}`, proxy)
        const data: any = this.extractData(response)
        return data['user']['desc']['usd_value']
    }

    async getUsedChains(address: string, proxy: string): Promise<any> {
        let response = await this.debankApi.get(`https://api.debank.com/user?id=${address}`, proxy)
        const data: any = this.extractData(response)
        return data['user']['desc']['used_chains']
    }

}