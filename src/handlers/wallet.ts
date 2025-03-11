import { ethers } from "ethers";
import { ToolResultSchema } from "../types.js";
import { createSuccessResponse, createErrorResponse, getProvider, getWallet } from "./utils.js";
import { fromPrivateKeyHandlerInput, createMnemonicPhraseHandlerInput } from "./wallet.types.js";
import { generateMnemonic,  } from '@scure/bip39';
// Wallet Creation and Management

export const createWalletHandler = async (input: any): Promise<ToolResultSchema<any>> => {
  try {
    const options: any = {};

    if (input.path) {
      options.path = input.path;
    }

    if (input.locale) {
      options.locale = input.locale;
    }

    const wallet = ethers.Wallet.createRandom(options);

    let result: any = {
      address: wallet.address,
      mnemonic: wallet.mnemonic?.phrase,
      privateKey: wallet.privateKey,
      publicKey: wallet.publicKey
    };

    if (input.password) {
      // If a password is provided, encrypt the wallet
      const encryptedWallet = await wallet.encrypt(input.password);
      result.encryptedWallet = encryptedWallet;
    }

    return createSuccessResponse(result, `Wallet created successfully:
      Address: ${wallet.address}
      Private Key: ${wallet.privateKey}
      Public Key: ${wallet.publicKey}
      Mnemonic: ${wallet.mnemonic?.phrase}
      Encrypted Wallet: ${result.encryptedWallet ? "Yes" : "No"}
    `);
  } catch (error) {
    return createErrorResponse(`Failed to create wallet: ${(error as Error).message}`);
  }
};

export const fromPrivateKeyHandler = async (input: fromPrivateKeyHandlerInput): Promise<ToolResultSchema<any>> => {
  try {
    if (!input.privateKey) {
      return createErrorResponse("Private key is required");
    }

    const provider = input.provider ? getProvider(input.provider) : undefined;
    const wallet = new ethers.Wallet(input.privateKey, provider);

    return createSuccessResponse({
      address: wallet.address,
      privateKey: wallet.privateKey,
      publicKey: wallet.publicKey
    }, `Wallet created from private key successfully:
      Address: ${wallet.address}
      Private Key: ${wallet.privateKey}
      Public Key: ${wallet.publicKey}
    `);
  } catch (error) {
    return createErrorResponse(`Failed to create wallet from private key: ${(error as Error).message}`);
  }
};

export const createMnemonicPhraseHandler = async (input: createMnemonicPhraseHandlerInput): Promise<ToolResultSchema<any>> => {
  try {
    const { wordlist } = await import(`@scure/bip39/wordlists/${input.locale || 'english'}`);
    if (!wordlist) {
      return createErrorResponse("Invalid locale");
    }
    // Convert length to entropy bits (12 words = 128 bits, 15 words = 160 bits, etc)
    const entropyBits = ((input.length ?? 12) / 3) * 32;
    const mnemonic = generateMnemonic(wordlist, entropyBits);

    return createSuccessResponse({
      mnemonic: mnemonic
    }, `Mnemonic phrase created successfully:
      Mnemonic: "${mnemonic}"
    `);
  } catch (error) {
    return createErrorResponse(`Failed to create mnemonic phrase: ${(error as Error).message}`);
  }
};

export const fromMnemonicHandler = async (input: any): Promise<ToolResultSchema<any>> => {
  try {
    if (!input.mnemonic) {
      return createErrorResponse("Mnemonic is required");
    }

    const options: any = {
      path: input.path,
      wordlist: (input.locale && ethers.wordlists[input.locale]) || ethers.wordlists.en
    };

    const provider = input.provider ? getProvider(input.provider) : undefined;
    const wallet = ethers.Wallet.fromMnemonic(input.mnemonic, options.path, options.wordlist);

    if (provider) wallet.connect(provider);

    return createSuccessResponse({
      address: wallet.address,
      mnemonic: wallet.mnemonic?.phrase,
      privateKey: wallet.privateKey,
      publicKey: wallet.publicKey
    }, `Wallet created from mnemonic successfully:
      Address: ${wallet.address}
      Private Key: ${wallet.privateKey}
      Public Key: ${wallet.publicKey}
    `);
  } catch (error) {
    return createErrorResponse(`Failed to create wallet from mnemonic: ${(error as Error).message}`);
  }
};

export const fromEncryptedJsonHandler = async (input: any): Promise<ToolResultSchema<any>> => {
  try {
    if (!input.json) {
      return createErrorResponse("Encrypted JSON is required");
    }

    if (!input.password) {
      return createErrorResponse("Password is required");
    }

    const wallet = await ethers.Wallet.fromEncryptedJson(input.json, input.password);
    const provider = input.provider ? getProvider(input.provider) : undefined;

    if (provider) {
      wallet.connect(provider);
    }

    return createSuccessResponse({
      address: wallet.address,
      privateKey: wallet.privateKey,
      publicKey: wallet.publicKey
    }, "Wallet created from encrypted JSON successfully");
  } catch (error) {
    return createErrorResponse(`Failed to create wallet from encrypted JSON: ${(error as Error).message}`);
  }
};

export const encryptWalletHandler = async (input: any): Promise<ToolResultSchema<any>> => {
  try {
    if (!input.wallet) {
      return createErrorResponse("Wallet is required");
    }

    if (!input.password) {
      return createErrorResponse("Password is required");
    }

    const wallet = await getWallet(input.wallet);
    const encryptedWallet = await wallet.encrypt(input.password, input.options);

    return createSuccessResponse({
      encryptedWallet
    }, "Wallet encrypted successfully");
  } catch (error) {
    return createErrorResponse(`Failed to encrypt wallet: ${(error as Error).message}`);
  }
};

// Wallet Properties

export const getAddressHandler = async (input: any): Promise<ToolResultSchema<any>> => {
  try {
    const wallet = await getWallet(input.wallet);

    return createSuccessResponse({
      address: wallet.address
    }, `Wallet address retrieved successfully:
      Address: ${wallet.address}
    `);
  } catch (error) {
    return createErrorResponse(`Failed to get wallet address: ${(error as Error).message}`);
  }
};

export const getPublicKeyHandler = async (input: any): Promise<ToolResultSchema<any>> => {
  try {
    const wallet = await getWallet(input.wallet);

    return createSuccessResponse({
      publicKey: wallet.publicKey
    }, `Wallet public key retrieved successfully:
      Public Key: ${wallet.publicKey}
    `);
  } catch (error) {
    return createErrorResponse(`Failed to get wallet public key: ${(error as Error).message}`);
  }
};

export const getPrivateKeyHandler = async (input: any): Promise<ToolResultSchema<any>> => {
  try {
    const wallet = await getWallet(input.wallet, input.password);

    return createSuccessResponse({
      privateKey: wallet.privateKey
    }, `Wallet private key retrieved successfully:
      Private Key: ${wallet.privateKey}
    `);
  } catch (error) {
    return createErrorResponse(`Failed to get wallet private key: ${(error as Error).message}`);
  }
};
// Blockchain Methods

export const getBalanceHandler = async (input: any): Promise<ToolResultSchema<any>> => {
  try {
    if (!input.provider) {
      return createErrorResponse("Provider URL is required to get balance");
    }

    const wallet = await getWallet(input.wallet, input.password, input.provider);

    const balance = await wallet.getBalance(input.blockTag ?? "latest");

    return createSuccessResponse({
      balance: balance.toString(),
      balanceInEth: ethers.utils.formatEther(balance)
    }, `Wallet balance retrieved successfully
      Balance: ${balance.toString()}
      Balance in ETH: ${ethers.utils.formatEther(balance)}
    `);
  } catch (error) {
    return createErrorResponse(`Failed to get wallet balance: ${(error as Error).message}`);
  }
};

export const getChainIdHandler = async (input: any): Promise<ToolResultSchema<any>> => {
  try {
    const wallet = await getWallet(input.wallet, input.password, input.provider);

    if (!wallet.provider) {
      return createErrorResponse("Provider is required to get chain ID");
    }

    const chainId = await wallet.getChainId();

    return createSuccessResponse({
      chainId
    }, `Chain ID retrieved successfully
      Chain ID: ${chainId.toString()}
    `);
  } catch (error) {
    return createErrorResponse(`Failed to get chain ID: ${(error as Error).message}`);
  }
};

export const getGasPriceHandler = async (input: any): Promise<ToolResultSchema<any>> => {
  try {
    const wallet = await getWallet(input.wallet, input.password, input.provider);

    if (!wallet.provider) {
      return createErrorResponse("Provider is required to get gas price");
    }

    const gasPrice = await wallet.getGasPrice();

    return createSuccessResponse({
      gasPrice: gasPrice.toString(),
      gasPriceInGwei: ethers.utils.formatUnits(gasPrice, "gwei")
    }, `Gas price retrieved successfully
      Gas price: ${gasPrice.toString()}
      Gas price in Gwei: ${ethers.utils.formatUnits(gasPrice, "gwei")}
    `);
  } catch (error) {
    return createErrorResponse(`Failed to get gas price: ${(error as Error).message}`);
  }
};

export const getTransactionCountHandler = async (input: any): Promise<ToolResultSchema<any>> => {
  try {
    const wallet = await getWallet(input.wallet, input.password, input.provider);

    if (!wallet.provider) {
      return createErrorResponse("Provider is required to get transaction count");
    }

    const transactionCount = await wallet.getTransactionCount(input.blockTag);

    return createSuccessResponse({
      transactionCount
    }, `Transaction count retrieved successfully
      Transaction count: ${transactionCount.toString()}
    `);
  } catch (error) {
    return createErrorResponse(`Failed to get transaction count: ${(error as Error).message}`);
  }
};

export const callHandler = async (input: any): Promise<ToolResultSchema<any>> => {
  try {
    if (!input.transaction) {
      return createErrorResponse("Transaction is required");
    }

    const wallet = await getWallet(input.wallet, input.password, input.provider);

    if (!wallet.provider) {
      return createErrorResponse("Provider is required to call a contract");
    }

    const result = await wallet.call(input.transaction, input.blockTag);

    return createSuccessResponse({
      result
    }, `Contract call executed successfully
      Result: ${result}
    `);
  } catch (error) {
    return createErrorResponse(`Failed to call contract: ${(error as Error).message}`);
  }
};

// Transaction Methods

export const sendTransactionHandler = async (input: any): Promise<ToolResultSchema<any>> => {
  try {
    if (!input.transaction) {
      return createErrorResponse("Transaction is required");
    }

    const wallet = await getWallet(input.wallet, input.password, input.provider);

    if (!wallet.provider) {
      return createErrorResponse("Provider is required to send a transaction");
    }

    const tx = await wallet.sendTransaction(input.transaction);

    return createSuccessResponse({
      hash: tx.hash,
      nonce: tx.nonce,
      gasLimit: tx.gasLimit.toString(),
      gasPrice: tx.gasPrice?.toString(),
      data: tx.data,
      value: tx.value.toString(),
      chainId: tx.chainId,
      from: tx.from,
      to: tx.to,
      type: tx.type
    }, `Transaction sent successfully
      Hash: ${tx.hash}
      Nonce: ${tx.nonce.toString()}
      Gas limit: ${tx.gasLimit.toString()}
      Gas price: ${tx.gasPrice?.toString()}
      Data: ${tx.data}
    `);
  } catch (error) {
    return createErrorResponse(`Failed to send transaction: ${(error as Error).message}`);
  }
};

export const signTransactionHandler = async (input: any): Promise<ToolResultSchema<any>> => {
  try {
    if (!input.transaction) {
      return createErrorResponse("Transaction is required");
    }

    const wallet = await getWallet(input.wallet, input.password, input.provider);

    // For signing a transaction, we need to populate it first
    const populatedTx = await wallet.populateTransaction(input.transaction);
    const signedTx = await wallet.signTransaction(populatedTx);

    return createSuccessResponse({
      signedTransaction: signedTx
    }, `Transaction signed successfully
      Signed transaction: ${signedTx}
    `);
  } catch (error) {
    return createErrorResponse(`Failed to sign transaction: ${(error as Error).message}`);
  }
};

export const populateTransactionHandler = async (input: any): Promise<ToolResultSchema<any>> => {
  try {
    if (!input.transaction) {
      return createErrorResponse("Transaction is required");
    }

    const wallet = await getWallet(input.wallet, input.password, input.provider);

    if (!wallet.provider) {
      return createErrorResponse("Provider is required to populate a transaction");
    }

    const populatedTx = await wallet.populateTransaction(input.transaction);

    return createSuccessResponse({
      populatedTransaction: {
        to: populatedTx.to,
        from: populatedTx.from,
        nonce: populatedTx.nonce,
        gasLimit: populatedTx.gasLimit?.toString(),
        gasPrice: populatedTx.gasPrice?.toString(),
        data: populatedTx.data,
        value: populatedTx.value?.toString(),
        chainId: populatedTx.chainId,
        type: populatedTx.type,
        maxFeePerGas: populatedTx.maxFeePerGas?.toString(),
        maxPriorityFeePerGas: populatedTx.maxPriorityFeePerGas?.toString()
      }
    }, `Transaction populated successfully
      To: ${populatedTx.to}
      From: ${populatedTx.from}
      Nonce: ${populatedTx.nonce?.toString() ?? "Not specified"}
      Gas limit: ${populatedTx.gasLimit?.toString() ?? "Not specified"}
      Gas price: ${populatedTx.gasPrice?.toString() ?? "Not specified"}
    `);
  } catch (error) {
    return createErrorResponse(`Failed to populate transaction: ${(error as Error).message}`);
  }
};

// Signing Methods

export const signMessageHandler = async (input: any): Promise<ToolResultSchema<any>> => {
  try {
    if (!input.message) {
      return createErrorResponse("Message is required");
    }

    const wallet = await getWallet(input.wallet, input.password);
    const signature = await wallet.signMessage(input.message);

    return createSuccessResponse({
      signature,
      message: input.message
    }, `Message signed successfully
      Signature: ${signature}
      Message: "${input.message}"
    `);
  } catch (error) {
    return createErrorResponse(`Failed to sign message: ${(error as Error).message}`);
  }
};

export const signTypedDataHandler = async (input: any): Promise<ToolResultSchema<any>> => {
  try {
    if (!input.wallet) {
      return createErrorResponse("Wallet is required");
    }

    if (!input.domain || !input.types || !input.value) {
      return createErrorResponse("Domain, types, and value are required");
    }

    const wallet = await getWallet(input.wallet, input.password);

    // Use ethers._signTypedData for EIP-712 signing
    // @ts-ignore - _signTypedData is not in the type definitions but is available
    const signature = await wallet._signTypedData(input.domain, input.types, input.value);

    return createSuccessResponse({
      signature,
      domain: input.domain,
      types: input.types,
      value: input.value
    }, `Typed data signed successfully
      Signature: ${signature}
      Domain: ${input.domain}
      Types: ${input.types}
      Value: ${input.value}
    `);
  } catch (error) {
    return createErrorResponse(`Failed to sign typed data: ${(error as Error).message}`);
  }
};

export const verifyMessageHandler = async (input: any): Promise<ToolResultSchema<any>> => {
  try {
    if (!input.message || !input.signature || !input.address) {
      return createErrorResponse("Message, signature, and address are required");
    }

    const recoveredAddress = ethers.utils.verifyMessage(input.message, input.signature);
    const isValid = recoveredAddress.toLowerCase() === input.address.toLowerCase();

    return createSuccessResponse({
      isValid,
      recoveredAddress
    }, isValid ? `Signature verified successfully
      Message: "${input.message}"
      Signature: ${input.signature}
      Address: ${input.address}
    ` : `Signature verification failed
      Message: "${input.message}"
      Signature: ${input.signature}
      Address: ${input.address}
    `);
  } catch (error) {
    return createErrorResponse(`Failed to verify message: ${(error as Error).message}`);
  }
};

export const verifyTypedDataHandler = async (input: any): Promise<ToolResultSchema<any>> => {
  try {
    if (!input.domain || !input.types || !input.value || !input.signature || !input.address) {
      return createErrorResponse("Domain, types, value, signature, and address are required");
    }

    // Use ethers.utils.verifyTypedData for EIP-712 verification
    const recoveredAddress = ethers.utils.verifyTypedData(
      input.domain,
      input.types,
      input.value,
      input.signature
    );

    const isValid = recoveredAddress.toLowerCase() === input.address.toLowerCase();

    return createSuccessResponse({
      isValid,
      recoveredAddress
    }, isValid ? `Typed data signature is valid
      Domain: ${input.domain}
      Types: ${input.types}
      Value: ${input.value}
      Signature: ${input.signature}
      Address: ${input.address}
    ` : "Typed data signature is invalid");
  } catch (error) {
    return createErrorResponse(`Failed to verify typed data: ${(error as Error).message}`);
  }
};

// Provider Methods

export const getBlockHandler = async (input: any): Promise<ToolResultSchema<any>> => {
  try {
    if (!input.provider) {
      return createErrorResponse("Provider is required");
    }

    if (!input.blockHashOrBlockTag) {
      return createErrorResponse("Block hash or block tag is required");
    }

    const provider = getProvider(input.provider);
    // In ethers.js v5, getBlock can take includeTransactions as a second parameter
    // but TypeScript definitions might not reflect this
    const block = await (provider as any).getBlock(input.blockHashOrBlockTag, input.includeTransactions);

    return createSuccessResponse({
      block
    }, `Block retrieved successfully
      Block hash: ${block.hash}
      Block number: ${block.number?.toString() ?? "Not specified"}
      Block timestamp: ${block.timestamp?.toString() ?? "Not specified"}
      Block transactions: ${block.transactions?.length ?? "Not specified"}
    `);
  } catch (error) {
    return createErrorResponse(`Failed to get block: ${(error as Error).message}`);
  }
};

export const getTransactionHandler = async (input: any): Promise<ToolResultSchema<any>> => {
  try {
    if (!input.provider) {
      return createErrorResponse("Provider is required");
    }

    if (!input.transactionHash) {
      return createErrorResponse("Transaction hash is required");
    }

    const provider = getProvider(input.provider);
    const transaction = await provider.getTransaction(input.transactionHash);

    return createSuccessResponse({
      transaction
    }, `Transaction retrieved successfully
      Transaction hash: ${input.transactionHash}
      Transaction: ${transaction}
    `);
  } catch (error) {
    return createErrorResponse(`Failed to get transaction: ${(error as Error).message}`);
  }
};

export const getTransactionReceiptHandler = async (input: any): Promise<ToolResultSchema<any>> => {
  try {
    if (!input.provider) {
      return createErrorResponse("Provider is required");
    }

    if (!input.transactionHash) {
      return createErrorResponse("Transaction hash is required");
    }

    const provider = getProvider(input.provider);
    const receipt = await provider.getTransactionReceipt(input.transactionHash);

    return createSuccessResponse({
      receipt
    }, `Transaction receipt retrieved successfully
      Transaction hash: ${input.transactionHash}
      Transaction receipt: ${receipt}
    `);
  } catch (error) {
    return createErrorResponse(`Failed to get transaction receipt: ${(error as Error).message}`);
  }
};

export const getCodeHandler = async (input: any): Promise<ToolResultSchema<any>> => {
  try {
    if (!input.provider) {
      return createErrorResponse("Provider is required");
    }

    if (!input.address) {
      return createErrorResponse("Address is required");
    }

    const provider = getProvider(input.provider);
    const code = await provider.getCode(input.address, input.blockTag);

    return createSuccessResponse({
      code
    }, `Code retrieved successfully
      Address: ${input.address}
      Code: ${code}
    `);
  } catch (error) {
    return createErrorResponse(`Failed to get code: ${(error as Error).message}`);
  }
};

export const getStorageAtHandler = async (input: any): Promise<ToolResultSchema<any>> => {
  try {
    if (!input.provider) {
      return createErrorResponse("Provider is required");
    }

    if (!input.address) {
      return createErrorResponse("Address is required");
    }

    if (!input.position) {
      return createErrorResponse("Position is required");
    }

    const provider = getProvider(input.provider);
    const storage = await provider.getStorageAt(input.address, input.position, input.blockTag);

    return createSuccessResponse({
      storage
    }, `Storage retrieved successfully
      Address: ${input.address}
      Position: ${input.position}
      Storage: ${storage}
    `);
  } catch (error) {
    return createErrorResponse(`Failed to get storage: ${(error as Error).message}`);
  }
};

export const estimateGasHandler = async (input: any): Promise<ToolResultSchema<any>> => {
  try {
    if (!input.provider) {
      return createErrorResponse("Provider is required");
    }

    if (!input.transaction) {
      return createErrorResponse("Transaction is required");
    }

    const provider = getProvider(input.provider);
    const gasEstimate = await provider.estimateGas(input.transaction);

    return createSuccessResponse({
      gasEstimate: gasEstimate.toString()
    }, `Gas estimate retrieved successfully
      Gas estimate: ${gasEstimate.toString()}
    `);
  } catch (error) {
    return createErrorResponse(`Failed to estimate gas: ${(error as Error).message}`);
  }
};

export const getLogsHandler = async (input: any): Promise<ToolResultSchema<any>> => {
  try {
    if (!input.provider) {
      return createErrorResponse("Provider is required");
    }

    if (!input.filter) {
      return createErrorResponse("Filter is required");
    }

    const provider = getProvider(input.provider);
    const logs = await provider.getLogs(input.filter);

    return createSuccessResponse({
      logs
    }, `Logs retrieved successfully
      Logs: ${logs}
    `);
  } catch (error) {
    return createErrorResponse(`Failed to get logs: ${(error as Error).message}`);
  }
};

export const getEnsResolverHandler = async (input: any): Promise<ToolResultSchema<any>> => {
  try {
    if (!input.provider) {
      return createErrorResponse("Provider is required");
    }

    if (!input.name) {
      return createErrorResponse("ENS name is required");
    }

    const provider = getProvider(input.provider);
    // In ethers.js v5, getResolver might not be directly on the provider type
    // but it's available in the implementation
    const resolver = await (provider as any).getResolver(input.name);

    return createSuccessResponse({
      resolver: resolver ? {
        address: resolver.address,
        name: resolver.name
      } : null
    }, resolver ? `ENS resolver retrieved successfully
      Address: ${resolver.address}
      Name: ${resolver.name}
    ` : "No resolver found for this ENS name");
  } catch (error) {
    return createErrorResponse(`Failed to get ENS resolver: ${(error as Error).message}`);
  }
};

export const lookupAddressHandler = async (input: any): Promise<ToolResultSchema<any>> => {
  try {
    if (!input.provider) {
      return createErrorResponse("Provider is required");
    }

    if (!input.address) {
      return createErrorResponse("Address is required");
    }

    const provider = getProvider(input.provider);
    const name = await provider.lookupAddress(input.address);

    return createSuccessResponse({
      name
    }, name ? `ENS name retrieved successfully
      Name: ${name}
    ` : "No ENS name found for this address");
  } catch (error) {
    return createErrorResponse(`Failed to lookup ENS name: ${(error as Error).message}`);
  }
};

export const resolveNameHandler = async (input: any): Promise<ToolResultSchema<any>> => {
  try {
    if (!input.provider) {
      return createErrorResponse("Provider is required");
    }

    if (!input.name) {
      return createErrorResponse("ENS name is required");
    }

    const provider = getProvider(input.provider);
    const address = await provider.resolveName(input.name);

    return createSuccessResponse({
      address
    }, address ? `ENS name resolved successfully
      Name: ${input.name}
      Address: ${address}
    ` : "Could not resolve this ENS name");
  } catch (error) {
    return createErrorResponse(`Failed to resolve ENS name: ${(error as Error).message}`);
  }
};

// Network Methods

export const getNetworkHandler = async (input: any): Promise<ToolResultSchema<any>> => {
  try {
    if (!input.provider) {
      return createErrorResponse("Provider is required");
    }

    const provider = getProvider(input.provider);
    const network = await provider.getNetwork();

    return createSuccessResponse({
      network: {
        name: network.name,
        chainId: network.chainId,
        ensAddress: network.ensAddress
      }
    }, `Network information retrieved successfully
      Network name: ${network.name}
      Chain ID: ${network.chainId}
      ENS address: ${network.ensAddress}
    `);
  } catch (error) {
    return createErrorResponse(`Failed to get network information: ${(error as Error).message}`);
  }
};

export const getBlockNumberHandler = async (input: any): Promise<ToolResultSchema<any>> => {
  try {
    if (!input.provider) {
      return createErrorResponse("Provider is required");
    }

    const provider = getProvider(input.provider);
    const blockNumber = await provider.getBlockNumber();

    return createSuccessResponse({
      blockNumber
    }, `Block number retrieved successfully
      Block number: ${blockNumber.toString()}
    `);
  } catch (error) {
    return createErrorResponse(`Failed to get block number: ${(error as Error).message}`);
  }
};

export const getFeeDataHandler = async (input: any): Promise<ToolResultSchema<any>> => {
  try {
    if (!input.provider) {
      return createErrorResponse("Provider is required");
    }

    const provider = getProvider(input.provider);

    // getFeeData is available in ethers v5.5.0+
    // @ts-ignore - getFeeData might not be in the type definitions depending on the version
    const feeData = await provider.getFeeData();

    return createSuccessResponse({
      feeData: {
        gasPrice: feeData.gasPrice?.toString(),
        maxFeePerGas: feeData.maxFeePerGas?.toString(),
        maxPriorityFeePerGas: feeData.maxPriorityFeePerGas?.toString()
      }
    }, `Fee data retrieved successfully
      Gas price: ${feeData.gasPrice?.toString()}
      Max fee per gas: ${feeData.maxFeePerGas?.toString()}
      Max priority fee per gas: ${feeData.maxPriorityFeePerGas?.toString()}
    `);
  } catch (error) {
    return createErrorResponse(`Failed to get fee data: ${(error as Error).message}`);
  }
};
