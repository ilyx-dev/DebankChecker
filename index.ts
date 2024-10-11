import * as helpers from "./utils/helpers";
import * as yaml from 'js-yaml';
import {DebankAPI} from "./services/api/debankApi";
import {ProxyManager} from "./utils/managers/proxyManager";
import {DebankChecker} from "./services/debankChecker";
import {saveFullToExcel} from "./utils/managers/excelManager";
import {Config, Project, TokenBalance, WalletData} from "./utils/types";
import pLimit from 'p-limit';

async function getWalletInfoWithProxy(
    address: string,
    debankChecker: DebankChecker,
    proxyManager: ProxyManager,
    allPools: Set<string>,
    CHAINS: string[],
    MIN_AMOUNT_BALANCE_TOKEN: number
): Promise<{ address: string; data: { [poolName: string]: any } }> {

    const proxy = await proxyManager.getWorkingProxy();
    console.log(`Fetching data for address: ${address} using proxy ${proxy}`);

    let totalUsdBalance = 0;

    const walletInfo: { [poolName: string]: any } = {};

    const pools: Project[] = await debankChecker.getPortfolio(address, proxy);

    for (const pool of pools) {
        const poolInfo = `${pool.name} (${pool.chain})`;
        allPools.add(poolInfo);
        walletInfo[poolInfo] = [];

        for (const item of pool.portfolio_item_list) {
            for (const token of item.asset_token_list) {
                const tokenUsdValue = Math.abs(token.amount) * token.price;
                totalUsdBalance += tokenUsdValue
                if (tokenUsdValue > MIN_AMOUNT_BALANCE_TOKEN) {
                    walletInfo[poolInfo].push({
                        name: token.name,
                        ticker: token.symbol,
                        amount: token.amount,
                        price: token.price,
                        usd_value: tokenUsdValue
                    });
                }
            }
        }
    }

    for (const chain of CHAINS) {
        allPools.add(chain);
        walletInfo[chain] = [];
        const tokens: TokenBalance[] = await debankChecker.getTokensForChain(address, chain, proxy);
        for (const token of tokens) {
            if (Math.abs(token.amount) * token.price > MIN_AMOUNT_BALANCE_TOKEN) {
                walletInfo[chain].push({
                    name: token.name,
                    ticker: token.symbol,
                    amount: token.amount,
                    price: token.price,
                });
            }
        }
    }

    const usedChains = await debankChecker.getUsedChains(address, proxy);

    for (const chain of usedChains) {
        const tokens: TokenBalance[] = await debankChecker.getTokensForChain(address, chain, proxy);

        for (const token of tokens) {
            const tokenUsdValue = Math.abs(token.amount) * token.price;
            totalUsdBalance += tokenUsdValue;
        }
    }

    walletInfo['total balance'] = []
    walletInfo['total balance'].push({
        name: '',
        ticker: '',
        amount: totalUsdBalance,
        price: 1,
    })

    return { address, data: walletInfo };
}

async function main() {
    const config = loadConfig('config.yaml');
    const CONCURRENT_CHECKS = config.threads;
    const MIN_AMOUNT_BALANCE_TOKEN = config.api.min_balance;
    const MAX_PROXY_ATTEMPTS = config.proxy.max_attempts;
    const MAX_API_REQUESTS_ATTEMPTS = config.api.max_attempts;
    const RPCs_FOR_PROXY_CHECK = config.proxy.rpcs;
    const CHAINS = config.chains;

    let addresses = helpers.readFromFile(config.paths.wallets).split('\n');
    let proxies = helpers.readFromFile(config.paths.proxies).split('\n');

    const proxyManager = new ProxyManager(proxies, RPCs_FOR_PROXY_CHECK, MAX_PROXY_ATTEMPTS);
    const debankAPI = new DebankAPI(MAX_API_REQUESTS_ATTEMPTS);
    const debankChecker = new DebankChecker(debankAPI);

    const allPools = new Set<string>();
    const walletsInfo: WalletData = {};

    const limit = pLimit(CONCURRENT_CHECKS);

    const promises = addresses.map((address) =>
        limit(() => getWalletInfoWithProxy(address, debankChecker, proxyManager, allPools, CHAINS, MIN_AMOUNT_BALANCE_TOKEN))
    );

    const results = await Promise.all(promises);

    for (const result of results) {
        walletsInfo[result.address] = result.data;
    }

    for (const address of addresses) {
        for (const poolName of allPools) {
            if (!walletsInfo[address].hasOwnProperty(poolName)) {
                walletsInfo[address][poolName] = {};
            }
        }
    }

    saveFullToExcel(walletsInfo, config.paths.output);
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
