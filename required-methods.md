# Required Methods for EVM Crypto Wallet MCP Server

Based on the ethers.js v5 documentation and the example MCP servers, the following methods should be implemented for our crypto wallet MCP server:

## Wallet Creation and Management
- `wallet_create_random` - Create a new wallet with a random private key
- `wallet_from_private_key` - Create a wallet from a private key
- `wallet_from_mnemonic` - Create a wallet from a mnemonic phrase
- `wallet_from_encrypted_json` - Create a wallet by decrypting an encrypted JSON wallet
- `wallet_encrypt` - Encrypt a wallet with a password

## Wallet Properties
- `wallet_get_address` - Get the wallet address
- `wallet_get_public_key` - Get the wallet public key
- `wallet_get_private_key` - Get the wallet private key (with appropriate security warnings)
- `wallet_get_mnemonic` - Get the wallet mnemonic phrase (if available)

## Blockchain Methods
- `wallet_get_balance` - Get the balance of the wallet
- `wallet_get_chain_id` - Get the chain ID the wallet is connected to
- `wallet_get_gas_price` - Get the current gas price
- `wallet_get_transaction_count` - Get the number of transactions sent from this account (nonce)
- `wallet_call` - Call a contract method without sending a transaction

## Transaction Methods
- `wallet_send_transaction` - Send a transaction
- `wallet_sign_transaction` - Sign a transaction without sending it
- `wallet_populate_transaction` - Populate a transaction with missing fields

## Signing Methods
- `wallet_sign_message` - Sign a message
- `wallet_sign_typed_data` - Sign typed data (EIP-712)
- `wallet_verify_message` - Verify a signed message
- `wallet_verify_typed_data` - Verify signed typed data

## Provider Methods
- `provider_get_block` - Get a block by number or hash
- `provider_get_transaction` - Get a transaction by hash
- `provider_get_transaction_receipt` - Get a transaction receipt
- `provider_get_code` - Get the code at an address
- `provider_get_storage_at` - Get the storage at a position for an address
- `provider_estimate_gas` - Estimate the gas required for a transaction
- `provider_get_logs` - Get logs that match a filter
- `provider_get_ens_resolver` - Get the ENS resolver for a name
- `provider_lookup_address` - Lookup the ENS name for an address
- `provider_resolve_name` - Resolve an ENS name to an address

## Network Methods
- `network_get_network` - Get the current network information
- `network_get_block_number` - Get the current block number
- `network_get_fee_data` - Get the current fee data (base fee, max priority fee, etc.)

These methods cover the core functionality needed for a comprehensive EVM crypto wallet implementation using ethers.js v5.
