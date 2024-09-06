import * as XLSX from 'xlsx';
import {WalletData} from "../types";

export function saveFullToExcel(walletData: WalletData, fileName: string) {
    const workbook = XLSX.utils.book_new()
    const worksheet = XLSX.utils.aoa_to_sheet([[]])

    // Extract unique providers for header
    const providers = new Set<string>()
    for (const walletAddress in walletData) {
        for (const provider in walletData[walletAddress]) {
            providers.add(provider);
        }
    }

    // Create header row
    const headerRow = ['Wallet Address', ...Array.from(providers)];
    XLSX.utils.sheet_add_aoa(worksheet, [headerRow], { origin: 'A1' });

    let rowIndex = 2;
    for (const walletAddress in walletData) {
        const rowData = [walletAddress];

        for (const provider of Array.from(providers)) {
            const tokens = walletData[walletAddress][provider];

            let cellInfo = '';
            if (Array.isArray(tokens) && tokens.length > 0) {
                tokens.forEach(token => {
                    cellInfo += `${token.ticker} - ${token.amount.toFixed(4)} ($${(token.amount * token.price).toFixed(2)}) \n`;
                });
            } else {
                cellInfo = '-'
            }
            rowData.push(cellInfo);
        }

        XLSX.utils.sheet_add_aoa(worksheet, [rowData], { origin: `A${rowIndex}` });
        rowIndex++;
    }

    XLSX.utils.book_append_sheet(workbook, worksheet, 'Wallet Data');
    XLSX.writeFile(workbook, fileName);
}

// const wal_data = '{"0x22Ad5351e2e5E9955f50A4e6a7b95f088Cc75Ce7":{"Maverick V2 (base)":[],"LayerBank (linea)":[{"name":"Wrapped liquid staked Ether 2.0","ticker":"wstETH","amount":0.0187911259240517,"price":2825.2522293142806},{"name":"Wrapped eETH","ticker":"weETH","amount":-0.010049608997270344,"price":2512.3170798301194}],"SyncSwap (linea)":[{"name":"Wrapped eETH","ticker":"weETH","amount":0.0084321660752562,"price":2512.3170798301194},{"name":"ETH","ticker":"ETH","amount":0.012119312018363474,"price":2395.69}],"iZUMi Finance (scrl)":[{"name":"USD Coin","ticker":"USDC","amount":8.781171822358697,"price":1.000100010001},{"name":"Wrapped Ether","ticker":"WETH","amount":0.009838878442435634,"price":2399.86}],"Ambient (scrl)":{},"scrl (STONE)":{},"SyncSwap (scrl)":{}},"0xE0Ca7C81bffDB2c131a14Ed21cb8c42976AED28A":{"Maverick V2 (base)":[],"LayerBank (linea)":[{"name":"Wrapped liquid staked Ether 2.0","ticker":"wstETH","amount":0.018908052825871845,"price":2825.2522293142806},{"name":"Wrapped eETH","ticker":"weETH","amount":-0.01014971390650211,"price":2512.3170798301194}],"SyncSwap (linea)":[{"name":"Wrapped eETH","ticker":"weETH","amount":0.008516487737757053,"price":2512.3170798301194},{"name":"ETH","ticker":"ETH","amount":0.012240505141059876,"price":2398.59}],"iZUMi Finance (scrl)":[{"name":"USD Coin","ticker":"USDC","amount":8.900006258824824,"price":1.000100010001},{"name":"Wrapped Ether","ticker":"WETH","amount":0.009788978783492537,"price":2399.86}],"Ambient (scrl)":{},"scrl (STONE)":{},"SyncSwap (scrl)":{}},"0xA671681272201b8bf9B276306772DfeB23c4800f":{"Maverick V2 (base)":[],"LayerBank (linea)":[{"name":"Wrapped liquid staked Ether 2.0","ticker":"wstETH","amount":0.01879106572791546,"price":2825.2522293142806},{"name":"Wrapped eETH","ticker":"weETH","amount":-0.010079635429268163,"price":2512.3170798301194}],"SyncSwap (linea)":[{"name":"Wrapped eETH","ticker":"weETH","amount":0.008457461779708042,"price":2512.3170798301194},{"name":"ETH","ticker":"ETH","amount":0.012155668813549918,"price":2398.59}],"iZUMi Finance (scrl)":[{"name":"USD Coin","ticker":"USDC","amount":8.900009258824824,"price":1.000100010001},{"name":"Wrapped Ether","ticker":"WETH","amount":0.009788979757507706,"price":2398.59}],"Ambient (scrl)":{},"scrl (STONE)":{},"SyncSwap (scrl)":{}},"0xB35D4B6d1Fd24e6C95cc8219752D3d03F53B7626":{"LayerBank (linea)":[{"name":"Wrapped liquid staked Ether 2.0","ticker":"wstETH","amount":0.01786259954013695,"price":2825.2522293142806},{"name":"Wrapped eETH","ticker":"weETH","amount":-0.009037148862232947,"price":2512.3170798301194}],"iZUMi Finance (scrl)":[{"name":"USD Coin","ticker":"USDC","amount":17.28101639056913,"price":1.000100010001},{"name":"Wrapped Ether","ticker":"WETH","amount":0.019644271997196337,"price":2398.59}],"Maverick V2 (base)":{},"SyncSwap (linea)":{},"Ambient (scrl)":{},"scrl (STONE)":{},"SyncSwap (scrl)":{}},"0x7d7c35d36C13525327545EeF84A2E56A1E11B8B0":{"SyncSwap (linea)":[{"name":"Renzo Restaked ETH","ticker":"ezETH","amount":0.010160305418971064,"price":2437.5013267311624},{"name":"ETH","ticker":"ETH","amount":0.00887064731348207,"price":2398.59}],"Maverick V2 (base)":{},"LayerBank (linea)":{},"iZUMi Finance (scrl)":{},"Ambient (scrl)":{},"scrl (STONE)":{},"SyncSwap (scrl)":{}},"0x25b3c0A86e4F316dd4e0406d1321049725c25039":{"Ambient (scrl)":[{"name":"ETH","ticker":"ETH","amount":0.01642468860538957,"price":2398.59},{"name":"Tether USD","ticker":"USDT","amount":39.322232,"price":0.99983}],"Maverick V2 (base)":{},"LayerBank (linea)":{},"SyncSwap (linea)":{},"iZUMi Finance (scrl)":{},"scrl (STONE)":{},"SyncSwap (scrl)":{}},"0xdC6cB9f61721071BE6B077DB455724Ee885b5D59":{"Ambient (scrl)":[{"name":"ETH","ticker":"ETH","amount":0.007311605888292933,"price":2400},{"name":"Tether USD","ticker":"USDT","amount":17.632227,"price":0.99983}],"Maverick V2 (base)":{},"LayerBank (linea)":{},"SyncSwap (linea)":{},"iZUMi Finance (scrl)":{},"scrl (STONE)":{},"SyncSwap (scrl)":{}},"0x36C162b500426e9a311aF20c9da11fEc2690FcFB":{"SyncSwap (linea)":[{"name":"Tether USD","ticker":"USDT","amount":21.891100040960318,"price":0.99983},{"name":"ETH","ticker":"ETH","amount":0.012164008777382702,"price":2400}],"scrl (STONE)":[{"name":"StakeStone Ether","ticker":"STONE","amount":0.01678862733572364,"price":2460.152651226733}],"Maverick V2 (base)":{},"LayerBank (linea)":{},"iZUMi Finance (scrl)":{},"Ambient (scrl)":{},"SyncSwap (scrl)":{}},"0x9D4ACa3fbcAd9C4D2961e058485A7A0e900c1Af3":{"Ambient (scrl)":[{"name":"ETH","ticker":"ETH","amount":0.00814485068024934,"price":2400},{"name":"Tether USD","ticker":"USDT","amount":19.503445,"price":0.99983}],"Maverick V2 (base)":{},"LayerBank (linea)":{},"SyncSwap (linea)":{},"iZUMi Finance (scrl)":{},"scrl (STONE)":{},"SyncSwap (scrl)":{}},"0x85f3ABAC056151028b75C3a2e633aa1c86544219":{"Ambient (scrl)":[{"name":"ETH","ticker":"ETH","amount":0.012087113859824097,"price":2399.21},{"name":"Tether USD","ticker":"USDT","amount":28.921852,"price":0.99983}],"SyncSwap (scrl)":[{"name":"ETH","ticker":"ETH","amount":0.013323782629859641,"price":2399.21},{"name":"Wrapped liquid staked Ether 2.0","ticker":"wstETH","amount":0.009144330511429379,"price":2816.1242975962855}],"Maverick V2 (base)":{},"LayerBank (linea)":{},"SyncSwap (linea)":{},"iZUMi Finance (scrl)":{},"scrl (STONE)":{}}}'
// await saveFullToExcel(JSON.parse(wal_data), '123.xlsx')