// @ts-ignore
import {getSignature} from "./signatureProcessor.js";
import * as helpers from "../../utils/helpers";
import axios, {AxiosRequestConfig} from "axios";
import {HttpsProxyAgent} from "https-proxy-agent";
import {retry} from "../../utils/decorators"

enum HttpMethod {
    GET = "GET",
    POST = "POST"
}

export class DebankAPI {
    private maxAttempts: number

    private headers: Record<string, string> = {
        'Host': 'api.debank.com',
        'Connection': 'keep-alive',
        'sec-ch-ua': '"Not/A)Brand";v="8", "Chromium";v="126", "YaBrowser";v="24.7", "Yowser";v="2.5", "YaBrowserCorp";v="126.0"',
        'source': 'web',
        'sec-ch-ua-mobile': '?0',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 YaBrowser/24.7.0.0 Safari/537.36',
        'sec-ch-ua-platform': '"Windows"',
        'Accept': '*/*; charset=utf-8',
        'Origin': 'https://debank.com',
        'Sec-Fetch-Site': 'same-site',
        'Sec-Fetch-Mode': 'cors',
        'Sec-Fetch-Dest': 'empty',
        'Referer': 'https://debank.com/',
        'Accept-Language': 'ru,en;q=0.9',
        'Accept-Encoding': 'deflate',
    }

    constructor(maxAttempts: number) {
        this.maxAttempts = maxAttempts
    }

    extractPayloadAndPath(url: string): { payload: Record<string, string>, path: string } {
        const urlObject = new URL(url);
        const path = urlObject.pathname;
        const payload: Record<string, string> = {};

        urlObject.searchParams.forEach((value, key) => {
            payload[key] = value;
        });

        return { payload, path };
    }

    addXSignHeaders(url: string, method: HttpMethod) {
        const { payload, path } = this.extractPayloadAndPath(url);
        let signature = getSignature(payload, method, path);

        this.headers['x-api-sign'] = signature.signature
        this.headers['x-api-ts'] = String(signature.ts)
        this.headers['x-api-ver'] = signature.version
        this.headers['x-api-nonce'] = signature.nonce
        this.headers['account'] = '{"random_at":' + (signature.ts - 39) + ',"random_id":"' + helpers.randomStr(32) + '","user_addr":null}'
    }

    @retry(function (this: DebankAPI) { return this.maxAttempts; })
    async get(url: string, proxy: string, headers = {}) {
        this.addXSignHeaders(url, HttpMethod.GET);

        // Заменяем 'Connection' на 'close' при объединении заголовков
        Object.assign(this.headers, headers, { 'Connection': 'close' });

        let proxyAgent = new HttpsProxyAgent(proxy, {
            keepAlive: false, // Отключаем keep-alive
            timeout: 5000,
            ciphers: helpers.getRandomTlsCiphers()
        });

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000);

        // @ts-ignore
        let config: AxiosRequestConfig = {
            method: HttpMethod.GET,
            maxBodyLength: Infinity,
            url: url,
            httpAgent: proxyAgent,
            httpsAgent: proxyAgent,
            headers: this.headers,
            proxy: false,
            validateStatus: function (status) {
                return status >= 200 && status < 300;
            },
            signal: controller.signal,
        };

        try {
            const response = await axios.request(config);
            clearTimeout(timeoutId);

            if (proxyAgent.destroy) {
                proxyAgent.destroy();
            }

            return response.data;
        } catch (error) {
            clearTimeout(timeoutId);

            if (proxyAgent.destroy) {
                proxyAgent.destroy();
            }

            if (controller.signal.aborted) {
                throw new Error('Request timed out and was aborted');
            }
            throw error;
        }
    }

}