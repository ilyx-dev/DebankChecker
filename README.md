# 🚀 Debank Checker

## 🔍 Overview

Debank Checker is a fast and efficient tool for mass analysis of cryptocurrency wallets on the Debank platform. It bypasses rate limits and security measures to provide comprehensive insights into wallet holdings across different blockchains and DeFi protocols. Designed for researchers, analysts, and anyone interested in on-chain data.

## 🛠️ Key Features

* **Proxy Support**: Works with various proxy types, including mobile proxies, for uninterrupted operation and privacy.
* **Asynchronous & Concurrent**:  Utilizes asynchronous programming for maximum speed, enabling checks of large numbers of wallets in parallel.
* **Customizable Filtering**:  Filter tokens displayed in the output based on their minimum value in dollars.
* **Excel Export**:  Easily export collected data to a structured Excel spreadsheet.
* **Open Source & Modular**: Written in TypeScript with a clean, object-oriented structure for easy customization and extension.

## 🧩 Modules

* **`DebankAPI`**: Handles all interactions with the Debank API. Includes logic for signature generation, proxy rotation, and request retrying.
* **`DebankChecker`**:  Provides high-level functions to retrieve portfolio data and token balances for a given wallet address.
* **`ProxyManager`**:  Manages the pool of proxies, ensuring efficient usage and optional validation.
* **`ExcelManager`**:  Handles the formatting and saving of data to an Excel spreadsheet. 
* **`Helpers & Decorators`**: Contains utility functions (like random string generation, file reading) and custom decorators for retry logic. 

## ⚙️ Getting Started

1. **Prerequisites**:
   - **Node.js and npm**: Make sure you have Node.js and npm installed.
   - **Dependencies:** Install the project dependencies: `npm install`

2. **Configuration:**
   - **Update `config.yaml`**:  Set your desired configuration, including minimum token balance, paths to wallet/proxy files, output filename, and the number of threads.

3. **Run the Checker:**
   - Execute: `node index.ts`

## ⚠️ Disclaimer

This software is provided "as is" for educational and research purposes only. Use at your own risk. The developers are not responsible for any losses or damages resulting from the use of this software.
