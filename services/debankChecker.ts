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

    async getPortfolio(address: string): Promise<Project[]> {
        let response = await this.debankApi.get(`https://api.debank.com/portfolio/project_list?user_addr=${address}`)
        return this.extractData(response)
    }

    async getTokensForChain(address: string, chain: string): Promise<TokenBalance[]> {
        let response = await this.debankApi.get(`https://api.debank.com/token/balance_list?user_addr=${address}&chain=${chain}`)
        return this.extractData(response)
    }

    async getUsedChains(address: string): Promise<any> {
        let response = await this.debankApi.get(`https://api.debank.com/user?id=${address}`)
        const data: any = this.extractData(response)
        return data['user']['desc']['used_chains'] || []
    }

}