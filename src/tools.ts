import {
  createWalletHandler,
  fromPrivateKeyHandler,
  fromMnemonicHandler,
  fromEncryptedJsonHandler,
  encryptWalletHandler,
  getAddressHandler,
  getPublicKeyHandler,
  getPrivateKeyHandler,
  getMnemonicHandler,
  getBalanceHandler,
  getChainIdHandler,
  getGasPriceHandler,
  getTransactionCountHandler,
  callHandler,
  sendTransactionHandler,
  signTransactionHandler,
  populateTransactionHandler,
  signMessageHandler,
  signTypedDataHandler,
  verifyMessageHandler,
  verifyTypedDataHandler,
  getBlockHandler,
  getTransactionHandler,
  getTransactionReceiptHandler,
  getCodeHandler,
  getStorageAtHandler,
  estimateGasHandler,
  getLogsHandler,
  getEnsResolverHandler,
  lookupAddressHandler,
  resolveNameHandler,
  getNetworkHandler,
  getBlockNumberHandler,
  getFeeDataHandler
} from "./handlers/wallet.js";

export const tools = [
  // Wallet Creation and Management
  {
    name: "wallet_create_random",
    description: "Create a new wallet with a random private key",
    inputSchema: {
      type: "object",
      properties: {
        password: { type: "string", description: "Optional password to encrypt the wallet" },
        path: { type: "string", description: "Optional HD path" },
        locale: { type: "string", description: "Optional locale for the wordlist" }
      },
      required: []
    }
  },
  {
    name: "wallet_from_private_key",
    description: "Create a wallet from a private key",
    inputSchema: {
      type: "object",
      properties: {
        privateKey: { type: "string", description: "The private key" },
        provider: { type: "string", description: "Optional JSON RPC provider URL" }
      },
      required: ["privateKey"]
    }
  },
  {
    name: "wallet_from_mnemonic",
    description: "Create a wallet from a mnemonic phrase",
    inputSchema: {
      type: "object",
      properties: {
        mnemonic: { type: "string", description: "The mnemonic phrase" },
        path: { type: "string", description: "Optional HD path" },
        locale: { type: "string", description: "Optional locale for the wordlist" },
        provider: { type: "string", description: "Optional JSON RPC provider URL" }
      },
      required: ["mnemonic"]
    }
  },
  {
    name: "wallet_from_encrypted_json",
    description: "Create a wallet by decrypting an encrypted JSON wallet",
    inputSchema: {
      type: "object",
      properties: {
        json: { type: "string", description: "The encrypted JSON wallet" },
        password: { type: "string", description: "The password to decrypt the wallet" },
        provider: { type: "string", description: "Optional JSON RPC provider URL" }
      },
      required: ["json", "password"]
    }
  },
  {
    name: "wallet_encrypt",
    description: "Encrypt a wallet with a password",
    inputSchema: {
      type: "object",
      properties: {
        wallet: { type: "string", description: "The wallet to encrypt (private key, mnemonic, or JSON)" },
        password: { type: "string", description: "The password to encrypt the wallet" },
        options: { 
          type: "object", 
          description: "Optional encryption options",
          properties: {
            scrypt: {
              type: "object",
              properties: {
                N: { type: "number" },
                r: { type: "number" },
                p: { type: "number" }
              }
            }
          }
        }
      },
      required: ["wallet", "password"]
    }
  },

  // Wallet Properties
  {
    name: "wallet_get_address",
    description: "Get the wallet address",
    inputSchema: {
      type: "object",
      properties: {
        wallet: { type: "string", description: "The wallet (private key, mnemonic, or JSON)" }
      },
      required: ["wallet"]
    }
  },
  {
    name: "wallet_get_public_key",
    description: "Get the wallet public key",
    inputSchema: {
      type: "object",
      properties: {
        wallet: { type: "string", description: "The wallet (private key, mnemonic, or JSON)" }
      },
      required: ["wallet"]
    }
  },
  {
    name: "wallet_get_private_key",
    description: "Get the wallet private key (with appropriate security warnings)",
    inputSchema: {
      type: "object",
      properties: {
        wallet: { type: "string", description: "The wallet (private key, mnemonic, or JSON)" },
        password: { type: "string", description: "The password to decrypt the wallet if it's encrypted" }
      },
      required: ["wallet"]
    }
  },
  {
    name: "wallet_get_mnemonic",
    description: "Get the wallet mnemonic phrase (if available)",
    inputSchema: {
      type: "object",
      properties: {
        wallet: { type: "string", description: "The wallet (private key, mnemonic, or JSON)" },
        password: { type: "string", description: "The password to decrypt the wallet if it's encrypted" }
      },
      required: ["wallet"]
    }
  },

  // Blockchain Methods
  {
    name: "wallet_get_balance",
    description: "Get the balance of the wallet",
    inputSchema: {
      type: "object",
      properties: {
        wallet: { type: "string", description: "The wallet (private key, mnemonic, or JSON)" },
        provider: { type: "string", description: "Optional JSON RPC provider URL" },
        blockTag: { type: "string", description: "Optional block tag (latest, pending, etc.)" }
      },
      required: ["wallet"]
    }
  },
  {
    name: "wallet_get_chain_id",
    description: "Get the chain ID the wallet is connected to",
    inputSchema: {
      type: "object",
      properties: {
        wallet: { type: "string", description: "The wallet (private key, mnemonic, or JSON)" },
        provider: { type: "string", description: "Optional JSON RPC provider URL" }
      },
      required: ["wallet"]
    }
  },
  {
    name: "wallet_get_gas_price",
    description: "Get the current gas price",
    inputSchema: {
      type: "object",
      properties: {
        wallet: { type: "string", description: "The wallet (private key, mnemonic, or JSON)" },
        provider: { type: "string", description: "Optional JSON RPC provider URL" }
      },
      required: ["wallet"]
    }
  },
  {
    name: "wallet_get_transaction_count",
    description: "Get the number of transactions sent from this account (nonce)",
    inputSchema: {
      type: "object",
      properties: {
        wallet: { type: "string", description: "The wallet (private key, mnemonic, or JSON)" },
        provider: { type: "string", description: "Optional JSON RPC provider URL" },
        blockTag: { type: "string", description: "Optional block tag (latest, pending, etc.)" }
      },
      required: ["wallet"]
    }
  },
  {
    name: "wallet_call",
    description: "Call a contract method without sending a transaction",
    inputSchema: {
      type: "object",
      properties: {
        wallet: { type: "string", description: "The wallet (private key, mnemonic, or JSON)" },
        provider: { type: "string", description: "Optional JSON RPC provider URL" },
        transaction: { 
          type: "object", 
          description: "The transaction to call",
          properties: {
            to: { type: "string" },
            from: { type: "string" },
            data: { type: "string" },
            value: { type: "string" },
            gasLimit: { type: "string" },
            gasPrice: { type: "string" }
          },
          required: ["to"]
        },
        blockTag: { type: "string", description: "Optional block tag (latest, pending, etc.)" }
      },
      required: ["wallet", "transaction"]
    }
  },

  // Transaction Methods
  {
    name: "wallet_send_transaction",
    description: "Send a transaction",
    inputSchema: {
      type: "object",
      properties: {
        wallet: { type: "string", description: "The wallet (private key, mnemonic, or JSON)" },
        provider: { type: "string", description: "Optional JSON RPC provider URL" },
        transaction: { 
          type: "object", 
          description: "The transaction to send",
          properties: {
            to: { type: "string" },
            from: { type: "string" },
            data: { type: "string" },
            value: { type: "string" },
            gasLimit: { type: "string" },
            gasPrice: { type: "string" },
            nonce: { type: "number" },
            type: { type: "number" },
            maxFeePerGas: { type: "string" },
            maxPriorityFeePerGas: { type: "string" }
          },
          required: ["to"]
        }
      },
      required: ["wallet", "transaction"]
    }
  },
  {
    name: "wallet_sign_transaction",
    description: "Sign a transaction without sending it",
    inputSchema: {
      type: "object",
      properties: {
        wallet: { type: "string", description: "The wallet (private key, mnemonic, or JSON)" },
        provider: { type: "string", description: "Optional JSON RPC provider URL" },
        transaction: { 
          type: "object", 
          description: "The transaction to sign",
          properties: {
            to: { type: "string" },
            from: { type: "string" },
            data: { type: "string" },
            value: { type: "string" },
            gasLimit: { type: "string" },
            gasPrice: { type: "string" },
            nonce: { type: "number" },
            type: { type: "number" },
            maxFeePerGas: { type: "string" },
            maxPriorityFeePerGas: { type: "string" }
          },
          required: ["to"]
        }
      },
      required: ["wallet", "transaction"]
    }
  },
  {
    name: "wallet_populate_transaction",
    description: "Populate a transaction with missing fields",
    inputSchema: {
      type: "object",
      properties: {
        wallet: { type: "string", description: "The wallet (private key, mnemonic, or JSON)" },
        provider: { type: "string", description: "Optional JSON RPC provider URL" },
        transaction: { 
          type: "object", 
          description: "The transaction to populate",
          properties: {
            to: { type: "string" },
            from: { type: "string" },
            data: { type: "string" },
            value: { type: "string" },
            gasLimit: { type: "string" },
            gasPrice: { type: "string" },
            nonce: { type: "number" },
            type: { type: "number" },
            maxFeePerGas: { type: "string" },
            maxPriorityFeePerGas: { type: "string" }
          },
          required: ["to"]
        }
      },
      required: ["wallet", "transaction"]
    }
  },

  // Signing Methods
  {
    name: "wallet_sign_message",
    description: "Sign a message",
    inputSchema: {
      type: "object",
      properties: {
        wallet: { type: "string", description: "The wallet (private key, mnemonic, or JSON)" },
        message: { type: "string", description: "The message to sign" }
      },
      required: ["wallet", "message"]
    }
  },
  {
    name: "wallet_sign_typed_data",
    description: "Sign typed data (EIP-712)",
    inputSchema: {
      type: "object",
      properties: {
        wallet: { type: "string", description: "The wallet (private key, mnemonic, or JSON)" },
        domain: { type: "object", description: "The domain data" },
        types: { type: "object", description: "The type definitions" },
        value: { type: "object", description: "The value to sign" }
      },
      required: ["wallet", "domain", "types", "value"]
    }
  },
  {
    name: "wallet_verify_message",
    description: "Verify a signed message",
    inputSchema: {
      type: "object",
      properties: {
        message: { type: "string", description: "The original message" },
        signature: { type: "string", description: "The signature to verify" },
        address: { type: "string", description: "The address that supposedly signed the message" }
      },
      required: ["message", "signature", "address"]
    }
  },
  {
    name: "wallet_verify_typed_data",
    description: "Verify signed typed data",
    inputSchema: {
      type: "object",
      properties: {
        domain: { type: "object", description: "The domain data" },
        types: { type: "object", description: "The type definitions" },
        value: { type: "object", description: "The value that was signed" },
        signature: { type: "string", description: "The signature to verify" },
        address: { type: "string", description: "The address that supposedly signed the data" }
      },
      required: ["domain", "types", "value", "signature", "address"]
    }
  },

  // Provider Methods
  {
    name: "provider_get_block",
    description: "Get a block by number or hash",
    inputSchema: {
      type: "object",
      properties: {
        provider: { type: "string", description: "JSON RPC provider URL" },
        blockHashOrBlockTag: { type: "string", description: "Block hash or block tag (latest, pending, etc.)" },
        includeTransactions: { type: "boolean", description: "Whether to include full transactions or just hashes" }
      },
      required: ["provider", "blockHashOrBlockTag"]
    }
  },
  {
    name: "provider_get_transaction",
    description: "Get a transaction by hash",
    inputSchema: {
      type: "object",
      properties: {
        provider: { type: "string", description: "JSON RPC provider URL" },
        transactionHash: { type: "string", description: "The transaction hash" }
      },
      required: ["provider", "transactionHash"]
    }
  },
  {
    name: "provider_get_transaction_receipt",
    description: "Get a transaction receipt",
    inputSchema: {
      type: "object",
      properties: {
        provider: { type: "string", description: "JSON RPC provider URL" },
        transactionHash: { type: "string", description: "The transaction hash" }
      },
      required: ["provider", "transactionHash"]
    }
  },
  {
    name: "provider_get_code",
    description: "Get the code at an address",
    inputSchema: {
      type: "object",
      properties: {
        provider: { type: "string", description: "JSON RPC provider URL" },
        address: { type: "string", description: "The address to get code from" },
        blockTag: { type: "string", description: "Optional block tag (latest, pending, etc.)" }
      },
      required: ["provider", "address"]
    }
  },
  {
    name: "provider_get_storage_at",
    description: "Get the storage at a position for an address",
    inputSchema: {
      type: "object",
      properties: {
        provider: { type: "string", description: "JSON RPC provider URL" },
        address: { type: "string", description: "The address to get storage from" },
        position: { type: "string", description: "The storage position" },
        blockTag: { type: "string", description: "Optional block tag (latest, pending, etc.)" }
      },
      required: ["provider", "address", "position"]
    }
  },
  {
    name: "provider_estimate_gas",
    description: "Estimate the gas required for a transaction",
    inputSchema: {
      type: "object",
      properties: {
        provider: { type: "string", description: "JSON RPC provider URL" },
        transaction: { 
          type: "object", 
          description: "The transaction to estimate gas for",
          properties: {
            to: { type: "string" },
            from: { type: "string" },
            data: { type: "string" },
            value: { type: "string" }
          }
        }
      },
      required: ["provider", "transaction"]
    }
  },
  {
    name: "provider_get_logs",
    description: "Get logs that match a filter",
    inputSchema: {
      type: "object",
      properties: {
        provider: { type: "string", description: "JSON RPC provider URL" },
        filter: { 
          type: "object", 
          description: "The filter to apply",
          properties: {
            address: { type: "string" },
            topics: { type: "array", items: { type: "string" } },
            fromBlock: { type: "string" },
            toBlock: { type: "string" }
          }
        }
      },
      required: ["provider", "filter"]
    }
  },
  {
    name: "provider_get_ens_resolver",
    description: "Get the ENS resolver for a name",
    inputSchema: {
      type: "object",
      properties: {
        provider: { type: "string", description: "JSON RPC provider URL" },
        name: { type: "string", description: "The ENS name" }
      },
      required: ["provider", "name"]
    }
  },
  {
    name: "provider_lookup_address",
    description: "Lookup the ENS name for an address",
    inputSchema: {
      type: "object",
      properties: {
        provider: { type: "string", description: "JSON RPC provider URL" },
        address: { type: "string", description: "The address to lookup" }
      },
      required: ["provider", "address"]
    }
  },
  {
    name: "provider_resolve_name",
    description: "Resolve an ENS name to an address",
    inputSchema: {
      type: "object",
      properties: {
        provider: { type: "string", description: "JSON RPC provider URL" },
        name: { type: "string", description: "The ENS name to resolve" }
      },
      required: ["provider", "name"]
    }
  },

  // Network Methods
  {
    name: "network_get_network",
    description: "Get the current network information",
    inputSchema: {
      type: "object",
      properties: {
        provider: { type: "string", description: "JSON RPC provider URL" }
      },
      required: ["provider"]
    }
  },
  {
    name: "network_get_block_number",
    description: "Get the current block number",
    inputSchema: {
      type: "object",
      properties: {
        provider: { type: "string", description: "JSON RPC provider URL" }
      },
      required: ["provider"]
    }
  },
  {
    name: "network_get_fee_data",
    description: "Get the current fee data (base fee, max priority fee, etc.)",
    inputSchema: {
      type: "object",
      properties: {
        provider: { type: "string", description: "JSON RPC provider URL" }
      },
      required: ["provider"]
    }
  }
];

type HandlerDictionary = Record<string, (input: any) => any>;

export const handlers: HandlerDictionary = {
  // Wallet Creation and Management
  "wallet_create_random": createWalletHandler,
  "wallet_from_private_key": fromPrivateKeyHandler,
  "wallet_from_mnemonic": fromMnemonicHandler,
  "wallet_from_encrypted_json": fromEncryptedJsonHandler,
  "wallet_encrypt": encryptWalletHandler,

  // Wallet Properties
  "wallet_get_address": getAddressHandler,
  "wallet_get_public_key": getPublicKeyHandler,
  "wallet_get_private_key": getPrivateKeyHandler,
  "wallet_get_mnemonic": getMnemonicHandler,

  // Blockchain Methods
  "wallet_get_balance": getBalanceHandler,
  "wallet_get_chain_id": getChainIdHandler,
  "wallet_get_gas_price": getGasPriceHandler,
  "wallet_get_transaction_count": getTransactionCountHandler,
  "wallet_call": callHandler,

  // Transaction Methods
  "wallet_send_transaction": sendTransactionHandler,
  "wallet_sign_transaction": signTransactionHandler,
  "wallet_populate_transaction": populateTransactionHandler,

  // Signing Methods
  "wallet_sign_message": signMessageHandler,
  "wallet_sign_typed_data": signTypedDataHandler,
  "wallet_verify_message": verifyMessageHandler,
  "wallet_verify_typed_data": verifyTypedDataHandler,

  // Provider Methods
  "provider_get_block": getBlockHandler,
  "provider_get_transaction": getTransactionHandler,
  "provider_get_transaction_receipt": getTransactionReceiptHandler,
  "provider_get_code": getCodeHandler,
  "provider_get_storage_at": getStorageAtHandler,
  "provider_estimate_gas": estimateGasHandler,
  "provider_get_logs": getLogsHandler,
  "provider_get_ens_resolver": getEnsResolverHandler,
  "provider_lookup_address": lookupAddressHandler,
  "provider_resolve_name": resolveNameHandler,

  // Network Methods
  "network_get_network": getNetworkHandler,
  "network_get_block_number": getBlockNumberHandler,
  "network_get_fee_data": getFeeDataHandler
};
