export interface Token {
    amount: number;
    name: string;
    ticker: string;
    price: number;
}

export interface WalletData {
    [walletAddress: string]: {
        [provider: string]: Token[] | {};
    };
}

export interface DebankResponse<T> {
    _cache_seconds: number;
    _seconds: number;
    _use_cache: boolean;
    data: T;
    error_code: number;
}

export interface Project {
    chain: string;
    dao_id: string | null;
    has_supported_portfolio: boolean;
    id: string;
    is_tvl: boolean;
    is_visible_in_defi: boolean | null;
    logo_url: string;
    name: string;
    platform_token_id: string | null;
    portfolio_item_list: PortfolioItem[];
    site_url: string;
    tag_ids: string[];
    tvl: number;
}

interface AssetToken {
    amount: number;
    chain: string;
    decimals: number;
    display_symbol: string | null;
    id: string;
    is_core: boolean;
    is_verified: boolean;
    is_wallet: boolean;
    logo_url: string;
    name: string;
    optimized_symbol: string;
    price: number;
    protocol_id: string;
    symbol: string;
    time_at: number | null;
}

export interface DetailCommon {
    reward_token_list: AssetToken[];
    supply_token_list: AssetToken[];
}

export interface DetailLending {
    borrow_token_list: AssetToken[];
    health_rate: number;
    supply_token_list: AssetToken[];
}

export interface Pool {
    adapter_id: string;
    chain: string;
    controller: string;
    id: string;
    index: number | null;
    project_id: string;
    time_at: number;
}

export interface Stats {
    asset_usd_value: number;
    debt_usd_value: number;
    net_usd_value: number;
}

export interface PortfolioItem {
    asset_dict: { [token: string]: number };
    asset_token_list: AssetToken[];
    detail: DetailCommon | DetailLending;
    detail_types: string[];
    name: string;
    pool: Pool;
    position_index: string | null;
    proxy_detail: {};
    stats: Stats;
    update_at: number;
}

export interface TokenBalance {
    amount: number;
    balance: number;
    chain: string;
    credit_score: number;
    decimals: number;
    display_symbol: string | null;
    id: string;
    is_core: boolean;
    is_custom: boolean;
    is_scam: boolean;
    is_suspicious: boolean;
    is_verified: boolean;
    is_wallet: boolean;
    logo_url: string;
    name: string;
    optimized_symbol: string;
    price: number;
    price_24h_change: number;
    protocol_id: string;
    symbol: string;
    time_at: number | null;
}

export interface Config {
    api: {
        min_balance: number
        max_attempts: number
    },
    paths: {
        wallets: string,
        proxies: string,
        output: string
    },
    proxy: {
        max_attempts: number
        verify_threads: number
        rpcs: string[]
    },
    chains: string[],
    features: {
        enable_chains: boolean,
        enable_pools: boolean,
        enable_total_balance: boolean
    },
    threads: number
}