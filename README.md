# MCP Crypto Wallet EVM

This repository contains a Model Context Protocol (MCP) server that provides Claude with access to Ethereum and EVM-compatible blockchain operations via ethers.js v5. The server enables Claude to perform operations like creating wallets, checking balances, sending transactions, and interacting with smart contracts on EVM-compatible blockchains.

## Overview

The MCP server exposes the following tools to Claude:

### Wallet Creation and Management
- `wallet_create_random`: Create a new wallet with a random private key
- `wallet_from_private_key`: Create a wallet from a private key
- `wallet_from_mnemonic`: Create a wallet from a mnemonic phrase
- `wallet_from_encrypted_json`: Create a wallet by decrypting an encrypted JSON wallet
- `wallet_encrypt`: Encrypt a wallet with a password

### Wallet Properties
- `wallet_get_address`: Get the wallet address
- `wallet_get_public_key`: Get the wallet public key
- `wallet_get_private_key`: Get the wallet private key (with appropriate security warnings)
- `wallet_get_mnemonic`: Get the wallet mnemonic phrase (if available)

### Blockchain Methods
- `wallet_get_balance`: Get the balance of the wallet
- `wallet_get_chain_id`: Get the chain ID the wallet is connected to
- `wallet_get_gas_price`: Get the current gas price
- `wallet_get_transaction_count`: Get the number of transactions sent from this account (nonce)
- `wallet_call`: Call a contract method without sending a transaction

### Transaction Methods
- `wallet_send_transaction`: Send a transaction
- `wallet_sign_transaction`: Sign a transaction without sending it
- `wallet_populate_transaction`: Populate a transaction with missing fields

### Signing Methods
- `wallet_sign_message`: Sign a message
- `wallet_sign_typed_data`: Sign typed data (EIP-712)
- `wallet_verify_message`: Verify a signed message
- `wallet_verify_typed_data`: Verify signed typed data

### Provider Methods
- `provider_get_block`: Get a block by number or hash
- `provider_get_transaction`: Get a transaction by hash
- `provider_get_transaction_receipt`: Get a transaction receipt
- `provider_get_code`: Get the code at an address
- `provider_get_storage_at`: Get the storage at a position for an address
- `provider_estimate_gas`: Estimate the gas required for a transaction
- `provider_get_logs`: Get logs that match a filter
- `provider_get_ens_resolver`: Get the ENS resolver for a name
- `provider_lookup_address`: Lookup the ENS name for an address
- `provider_resolve_name`: Resolve an ENS name to an address

### Network Methods
- `network_get_network`: Get the current network information
- `network_get_block_number`: Get the current block number
- `network_get_fee_data`: Get the current fee data (base fee, max priority fee, etc.)

## Prerequisites

- Node.js (v16 or higher)
- Claude Desktop application

## Installation

### Option 1: Using npx (Recommended)

You can run the MCP server directly without installation using npx:

```bash
npx @mcp-dockmaster/mcp-cryptowallet-evm
```

This will download and execute the server directly from npm.

### Option 2: Manual Installation

1. Clone this repository:
   ```bash
   git clone https://github.com/dcSpark/mcp-cryptowallet-evm.git
   cd mcp-cryptowallet-evm
   ```

2. Install dependencies:
   ```bash
   npm ci
   ```

3. Build the project:
   ```bash
   npm run build
   ```

## Configuration

### Environment Variables

The MCP server supports the following environment variables:

- `PRIVATE_KEY`: Optional private key to use for wallet operations when no wallet is explicitly provided

### Configure Claude Desktop

To configure Claude Desktop to use this MCP server:

1. Open Claude Desktop
2. Navigate to the Claude Desktop configuration file:
   - macOS: `~/Library/Application Support/Claude/claude_desktop_config.json`
   - Windows: `%APPDATA%\Claude\claude_desktop_config.json`
   - Linux: `~/.config/Claude/claude_desktop_config.json`

3. Add the MCP server configuration:

```json
{
  "mcpServers": {
    "mcp-cryptowallet-evm": {
      "command": "npx",
      "args": [
        "@mcp-dockmaster/mcp-cryptowallet-evm"
      ]
    }
  }
}
```

Alternatively, if you installed the package locally:

```json
{
  "mcpServers": {
    "mcp-cryptowallet-evm": {
      "command": "node",
      "args": [
        "/path/to/your/mcp-cryptowallet-evm/build/index.js"
      ]
    }
  }
}
```

### Running Locally

```bash
node build/index.js
```

## Usage

Once configured, restart Claude Desktop. Claude will now have access to the Ethereum and EVM-compatible blockchain tools. You can ask Claude to:

1. Create a new wallet:
   ```
   Can you create a new Ethereum wallet for me?
   ```

2. Check a wallet balance:
   ```
   What's the balance of the Ethereum wallet address 0x742d35Cc6634C0532925a3b844Bc454e4438f44e?
   ```

3. Send a transaction:
   ```
   Can you help me send 0.1 ETH to 0x742d35Cc6634C0532925a3b844Bc454e4438f44e?
   ```

Claude will use the MCP server to interact with the Ethereum blockchain directly.

## Development

### Adding New Tools

To add new tools to the MCP server:

1. Define the tool in `src/tools.ts`
2. Create a handler function in the appropriate handler file
3. Add the handler to the `handlers` object in `src/tools.ts`

### Building

```bash
npm run build
```

## License

MIT
