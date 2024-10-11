# 🚀 Debank Checker

## 🔍 Overview

DeBank Checker is a tool written in TypeScript for mass analysis of crypto wallets on the DeBank service. It bypasses all DeBank protections (429, x-headers, etc.) and parses data about tokens in networks and liquidity pools with subsequent saving to excel table in a convenient form. 

## 🛠️ Key Features

* **Proxy Support**: Works with http/https proxy in format `http://user:pass@ip:port`
* **Asynchronous & Concurrent**:  Uses asynchronous programming based on Promise and [p-limit](https://github.com/sindresorhus/p-limit) for maximum speed
* **Customizable Filtering**:  Filter tokens displayed in the output based on their minimum value in dollars.
* **Excel Export**:  Export collected data to a structured Excel spreadsheet.
* **Open Source & Modular**: Written in TypeScript with a clean, object-oriented structure for easy customization and extension.

## 🧩 Modules

* **`DebankAPI`**: Manages all interactions with the Debank API. Includes logic for signature generation, changing TLS fingerprints and repeat requests.
* **`DebankChecker`**:  Provides high-level functions to retrieve portfolio and token balance data for a given wallet address and proxy.
* **`ProxyManager`**:  Manages a pool of proxy servers, ensuring their **SUPER FAST** validation via Web3 and issuance.
* **`ExcelManager`**:  Handles the formatting and saving of data to an Excel spreadsheet. 
* **`Helpers & Decorators`**: Contains utility functions (like random string generation, file reading) and custom decorators for retry logic. 

## ⚙️ Getting Started

1. **Prerequisites**:
   - **Node.js and npm**: Make sure you have Node.js v20.12.0.
   - **Dependencies:** Install the project dependencies: `npm install`

2. **Configuration:**
   - **Update `config.yaml`**:  Set your desired configuration, including minimum token balance, paths to wallet/proxy files, output filename, and the number of threads.

3. **Run the Checker:**
   - Execute: `npx tsx index.ts`

## ⚠️ Disclaimer

This software is provided "as is" for educational and research purposes only. Use at your own risk. The developers are not responsible for any losses or damages resulting from the use of this software.
