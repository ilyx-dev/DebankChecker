import * as helpers from "./utils/helpers";
import * as yaml from 'js-yaml'
import {DebankAPI} from "./services/api/debankApi";
import {ProxyManager} from "./utils/managers/proxyManager";
import {DebankChecker} from "./services/debankChecker";
import {saveFullToExcel} from "./utils/managers/excelManager";
import {Config, WalletData} from "./utils/types";

async function getWalletInfo(address: string, debankChecker: DebankChecker, allPools: Set<string>, CHAINS: string[], MIN_AMOUNT_BALANCE_TOKEN = 1): Promise<{ address: string; data: { [poolName: string]: any } }> {
    console.log(`Fetching data for address: ${address}`);
    const walletInfo: { [poolName: string]: any } = {};

    const pools = await debankChecker.getPortfolio(address);

    for (const pool of pools) {
        const poolInfo = `${pool.name} (${pool.chain})`;
        allPools.add(poolInfo);
        walletInfo[poolInfo] = [];

        for (const item of pool.portfolio_item_list) {
            for (const token of item.asset_token_list) {
                if (Math.abs(token.amount) * token.price > MIN_AMOUNT_BALANCE_TOKEN) {
                    walletInfo[poolInfo].push({
                        name: token.name,
                        ticker: token.symbol,
                        amount: token.amount,
                        price: token.price,
                    });
                }
            }
        }
    }

    for (const chain of CHAINS) {
        allPools.add(chain)
        walletInfo[chain] = []
        const tokens = await debankChecker.getTokensForChain(address, chain)
        for (const token of tokens) {
            if (Math.abs(token.amount) * token.price > MIN_AMOUNT_BALANCE_TOKEN) {
                walletInfo[chain].push({
                    name: token.name,
                    ticker: token.symbol,
                    amount: token.amount,
                    price: token.price,
                })
            }
        }
    }
    return { address, data: walletInfo };
}

async function main() {
    const config = loadConfig('config.yaml');
    const CONCURRENT_CHECKS = config.threads
    const MIN_AMOUNT_BALANCE_TOKEN = config.api.min_balance
    const MAX_PROXY_ATTEMPTS = config.proxy.max_attempts
    const MAX_API_REQUESTS_ATTEMPTS = config.api.max_attempts
    const RPCs_FOR_PROXY_CHECK = config.proxy.rpcs
    const CHAINS = config.chains

    let addresses = helpers.readFromFile(config.paths.wallets).split('\n');
    let proxies = helpers.readFromFile(config.paths.proxies).split('\n');

    const proxyManager = new ProxyManager(proxies, RPCs_FOR_PROXY_CHECK, MAX_PROXY_ATTEMPTS);
    const debankAPI = new DebankAPI(proxyManager, MAX_API_REQUESTS_ATTEMPTS);
    const debankChecker = new DebankChecker(debankAPI);

    const allPools = new Set<string>();
    const walletsInfo: WalletData = {};

    const addressChunks = [];
    for (let i = 0; i < addresses.length; i += CONCURRENT_CHECKS) {
        addressChunks.push(addresses.slice(i, i + CONCURRENT_CHECKS));
    }

    for (const chunk of addressChunks) {
        const promises = chunk.map((address) =>
            getWalletInfo(address, debankChecker, allPools, CHAINS, MIN_AMOUNT_BALANCE_TOKEN)
        );
        const results = await Promise.all(promises);

        for (const result of results) {
            walletsInfo[result.address] = result.data;
        }
    }

    for (const address of addresses) {
        for (const poolName of allPools) {
            if (!walletsInfo[address].hasOwnProperty(poolName)) {
                walletsInfo[address][poolName] = {};
            }
        }
    }

    await saveFullToExcel(walletsInfo, config.paths.output);
}

function loadConfig(path: string): Config {
    try {
        return yaml.load(helpers.readFromFile(path)) as Config;
    } catch (e) {
        console.error("Error reading configuration file:", e);
        process.exit(1);
    }
}

await main();