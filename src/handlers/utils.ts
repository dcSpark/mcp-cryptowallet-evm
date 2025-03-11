import { ethers } from "ethers";
import { ToolResultSchema } from "../types.js";


let provider: ethers.providers.Provider | undefined;
try {
  provider = process.env.PROVIDER_URL ? 
    ethers.providers.getDefaultProvider(process.env.PROVIDER_URL) : 
    ethers.providers.getDefaultProvider('https://eth.llamarpc.com');
} catch (error) {
  console.error("Error initializing provider:", error);
}

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
 * Gets the provider setup in memory
 * @returns An ethers.js provider
 */
export const getProvider = (): ethers.providers.Provider => {
  if (!provider) {
    throw new Error(`Invalid provider URL: ${process.env.PROVIDER_URL}`);
  }
  return provider
};

export const setProvider = (providerURL: string) => {
  try {
    provider = ethers.providers.getDefaultProvider(providerURL);
  } catch (error) {
    throw new Error(`Invalid provider URL: ${providerURL}`);
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
  walletData?: string, 
  password?: string,
): Promise<ethers.Wallet> => {
  const provider = getProvider()
  // If walletData is not provided, check for PRIVATE_KEY environment variable
  if (!walletData && process.env.PRIVATE_KEY) {
    const wallet = new ethers.Wallet(process.env.PRIVATE_KEY);
    return provider ? wallet.connect(provider) : wallet;
  }
  
  // If no walletData and no environment variable, throw an error
  if (!walletData) {
    throw new Error("Wallet data is required or set PRIVATE_KEY environment variable");
  }
  
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
