import { ethers } from "ethers";
import { ToolResultSchema } from "../types.js";

/**
 * Creates a success response with the given result
 * @param result The result to include in the response
 * @param message Optional message to include in the response
 * @returns A ToolResultSchema with the result and message
 */
export const createSuccessResponse = <T>(result: T, message?: string): ToolResultSchema<T> => {
  return {
    content: [
      {
        type: "text",
        text: message || "Operation completed successfully"
      }
    ],
    isError: false,
    toolResult: result
  };
};

/**
 * Creates an error response with the given message
 * @param message The error message
 * @returns A ToolResultSchema with the error message
 */
export const createErrorResponse = (message: string): ToolResultSchema<any> => {
  return {
    content: [
      {
        type: "text",
        text: message
      }
    ],
    isError: true,
    toolResult: { error: message }
  };
};

/**
 * Gets a provider from a provider URL
 * @param providerUrl The provider URL
 * @returns An ethers.js provider
 */
export const getProvider = (providerUrl?: string): ethers.providers.Provider => {
  if (!providerUrl) {
    // Default to Ethereum mainnet if no provider URL is specified
    return ethers.getDefaultProvider();
  }
  
  try {
    return new ethers.providers.JsonRpcProvider(providerUrl);
  } catch (error) {
    throw new Error(`Invalid provider URL: ${providerUrl}`);
  }
};

/**
 * Gets a wallet from a private key, mnemonic, or JSON wallet
 * @param walletData The wallet data (private key, mnemonic, or JSON)
 * @param password Optional password for encrypted JSON wallets
 * @param provider Optional provider to connect the wallet to
 * @returns An ethers.js wallet
 */
export const getWallet = async (
  walletData: string, 
  password?: string,
  providerUrl?: string
): Promise<ethers.Wallet> => {
  const provider = providerUrl ? getProvider(providerUrl) : undefined;
  
  try {
    // Try to parse as JSON first
    if (walletData.startsWith("{")) {
      if (!password) {
        throw new Error("Password is required for encrypted JSON wallets");
      }
      
      const wallet = await ethers.Wallet.fromEncryptedJson(walletData, password);
      return provider ? wallet.connect(provider) : wallet;
    }
    
    // Check if it's a mnemonic (12, 15, 18, 21, or 24 words)
    const words = walletData.trim().split(/\s+/);
    if ([12, 15, 18, 21, 24].includes(words.length)) {
      const wallet = ethers.Wallet.fromMnemonic(walletData);
      return provider ? wallet.connect(provider) : wallet;
    }
    
    // Assume it's a private key
    const wallet = new ethers.Wallet(walletData);
    return provider ? wallet.connect(provider) : wallet;
  } catch (error) {
    throw new Error(`Invalid wallet data: ${(error as Error).message}`);
  }
};
