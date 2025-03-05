import { ethers } from 'ethers';
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
  signMessageHandler,
  verifyMessageHandler
} from '../../src/handlers/wallet.js';

// Mock ethers.js functions
jest.mock('ethers', () => {
  const originalModule = jest.requireActual('ethers');
  
  // Create a mock wallet
  const mockWallet = {
    address: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e',
    privateKey: '0x0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef',
    publicKey: '0x04a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6',
    mnemonic: {
      phrase: 'test test test test test test test test test test test junk',
      path: "m/44'/60'/0'/0/0",
      locale: 'en'
    },
    connect: jest.fn().mockImplementation((provider) => {
      mockWallet.provider = provider;
      return mockWallet;
    }),
    getBalance: jest.fn().mockResolvedValue(originalModule.utils.parseEther('1.0')),
    getChainId: jest.fn().mockResolvedValue(1),
    getGasPrice: jest.fn().mockResolvedValue(originalModule.utils.parseUnits('50', 'gwei')),
    getTransactionCount: jest.fn().mockResolvedValue(5),
    call: jest.fn().mockResolvedValue('0x0000000000000000000000000000000000000000000000000000000000000001'),
    signMessage: jest.fn().mockResolvedValue('0xsignature'),
    encrypt: jest.fn().mockResolvedValue(JSON.stringify({ version: 3, id: 'test', address: '742d35cc6634c0532925a3b844bc454e4438f44e' })),
    provider: null
  };
  
  // Create a mock provider
  const mockProvider = {
    getBalance: jest.fn().mockResolvedValue(originalModule.utils.parseEther('1.0')),
    getBlock: jest.fn().mockResolvedValue({ 
      hash: '0xblock', 
      number: 1000000, 
      timestamp: Date.now() / 1000 
    }),
    getTransaction: jest.fn().mockResolvedValue({ 
      hash: '0xtx', 
      from: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e', 
      to: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e' 
    }),
    getTransactionReceipt: jest.fn().mockResolvedValue({ 
      status: 1, 
      blockNumber: 1000000 
    }),
    getCode: jest.fn().mockResolvedValue('0x'),
    getStorageAt: jest.fn().mockResolvedValue('0x0000000000000000000000000000000000000000000000000000000000000000'),
    estimateGas: jest.fn().mockResolvedValue(ethers.BigNumber.from(21000)),
    getLogs: jest.fn().mockResolvedValue([]),
    getResolver: jest.fn().mockResolvedValue(null),
    lookupAddress: jest.fn().mockResolvedValue(null),
    resolveName: jest.fn().mockResolvedValue(null),
    getNetwork: jest.fn().mockResolvedValue({ name: 'homestead', chainId: 1 }),
    getBlockNumber: jest.fn().mockResolvedValue(1000000),
    getFeeData: jest.fn().mockResolvedValue({
      gasPrice: ethers.utils.parseUnits('50', 'gwei'),
      maxFeePerGas: ethers.utils.parseUnits('100', 'gwei'),
      maxPriorityFeePerGas: ethers.utils.parseUnits('2', 'gwei')
    })
  };
  
  return {
    ...originalModule,
    Wallet: {
      createRandom: jest.fn().mockReturnValue(mockWallet),
      fromMnemonic: jest.fn().mockReturnValue(mockWallet),
      fromEncryptedJson: jest.fn().mockResolvedValue(mockWallet)
    },
    providers: {
      JsonRpcProvider: jest.fn().mockReturnValue(mockProvider)
    },
    getDefaultProvider: jest.fn().mockReturnValue(mockProvider),
    utils: originalModule.utils
  };
});

describe('Wallet Creation and Management Handlers', () => {
  test('createWalletHandler should create a random wallet', async () => {
    const result = await createWalletHandler({});
    
    expect(result.isError).toBe(false);
    expect(result.toolResult).toHaveProperty('address');
    expect(result.toolResult).toHaveProperty('privateKey');
    expect(result.toolResult).toHaveProperty('publicKey');
    expect(result.toolResult).toHaveProperty('mnemonic');
  });
  
  test('createWalletHandler should encrypt wallet if password is provided', async () => {
    const result = await createWalletHandler({ password: 'test123' });
    
    expect(result.isError).toBe(false);
    expect(result.toolResult).toHaveProperty('encryptedWallet');
  });
  
  test('fromPrivateKeyHandler should create a wallet from a private key', async () => {
    const result = await fromPrivateKeyHandler({ 
      privateKey: '0x0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef' 
    });
    
    expect(result.isError).toBe(false);
    expect(result.toolResult).toHaveProperty('address');
    expect(result.toolResult).toHaveProperty('privateKey');
    expect(result.toolResult).toHaveProperty('publicKey');
  });
  
  test('fromMnemonicHandler should create a wallet from a mnemonic', async () => {
    const result = await fromMnemonicHandler({ 
      mnemonic: 'test test test test test test test test test test test junk' 
    });
    
    expect(result.isError).toBe(false);
    expect(result.toolResult).toHaveProperty('address');
    expect(result.toolResult).toHaveProperty('privateKey');
    expect(result.toolResult).toHaveProperty('publicKey');
    expect(result.toolResult).toHaveProperty('mnemonic');
  });
  
  test('fromEncryptedJsonHandler should create a wallet from encrypted JSON', async () => {
    const result = await fromEncryptedJsonHandler({ 
      json: JSON.stringify({ version: 3, id: 'test', address: '742d35cc6634c0532925a3b844bc454e4438f44e' }),
      password: 'test123'
    });
    
    expect(result.isError).toBe(false);
    expect(result.toolResult).toHaveProperty('address');
    expect(result.toolResult).toHaveProperty('privateKey');
    expect(result.toolResult).toHaveProperty('publicKey');
  });
  
  test('encryptWalletHandler should encrypt a wallet', async () => {
    const result = await encryptWalletHandler({ 
      wallet: '0x0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef',
      password: 'test123'
    });
    
    expect(result.isError).toBe(false);
    expect(result.toolResult).toHaveProperty('encryptedWallet');
  });
});

describe('Wallet Properties Handlers', () => {
  test('getAddressHandler should return the wallet address', async () => {
    const result = await getAddressHandler({ 
      wallet: '0x0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef' 
    });
    
    expect(result.isError).toBe(false);
    expect(result.toolResult).toHaveProperty('address');
    expect(result.toolResult.address).toBe('0x742d35Cc6634C0532925a3b844Bc454e4438f44e');
  });
  
  test('getPublicKeyHandler should return the wallet public key', async () => {
    const result = await getPublicKeyHandler({ 
      wallet: '0x0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef' 
    });
    
    expect(result.isError).toBe(false);
    expect(result.toolResult).toHaveProperty('publicKey');
  });
  
  test('getPrivateKeyHandler should return the wallet private key', async () => {
    const result = await getPrivateKeyHandler({ 
      wallet: '0x0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef' 
    });
    
    expect(result.isError).toBe(false);
    expect(result.toolResult).toHaveProperty('privateKey');
    expect(result.toolResult.privateKey).toBe('0x0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef');
  });
  
  test('getMnemonicHandler should return the wallet mnemonic', async () => {
    const result = await getMnemonicHandler({ 
      wallet: 'test test test test test test test test test test test junk' 
    });
    
    expect(result.isError).toBe(false);
    expect(result.toolResult).toHaveProperty('mnemonic');
    expect(result.toolResult.mnemonic).toBe('test test test test test test test test test test test junk');
  });
});

describe('Blockchain Methods Handlers', () => {
  test('getBalanceHandler should return the wallet balance', async () => {
    const result = await getBalanceHandler({ 
      wallet: '0x0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef',
      provider: 'https://mainnet.infura.io/v3/your-api-key'
    });
    
    expect(result.isError).toBe(false);
    expect(result.toolResult).toHaveProperty('balance');
    expect(result.toolResult).toHaveProperty('balanceInEth');
    expect(result.toolResult.balanceInEth).toBe('1.0');
  });
  
  test('getChainIdHandler should return the chain ID', async () => {
    const result = await getChainIdHandler({ 
      wallet: '0x0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef',
      provider: 'https://mainnet.infura.io/v3/your-api-key'
    });
    
    expect(result.isError).toBe(false);
    expect(result.toolResult).toHaveProperty('chainId');
    expect(result.toolResult.chainId).toBe(1);
  });
  
  test('getGasPriceHandler should return the gas price', async () => {
    const result = await getGasPriceHandler({ 
      wallet: '0x0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef',
      provider: 'https://mainnet.infura.io/v3/your-api-key'
    });
    
    expect(result.isError).toBe(false);
    expect(result.toolResult).toHaveProperty('gasPrice');
    expect(result.toolResult).toHaveProperty('gasPriceInGwei');
    expect(result.toolResult.gasPriceInGwei).toBe('50.0');
  });
  
  test('getTransactionCountHandler should return the transaction count', async () => {
    const result = await getTransactionCountHandler({ 
      wallet: '0x0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef',
      provider: 'https://mainnet.infura.io/v3/your-api-key'
    });
    
    expect(result.isError).toBe(false);
    expect(result.toolResult).toHaveProperty('transactionCount');
    expect(result.toolResult.transactionCount).toBe(5);
  });
  
  test('callHandler should call a contract method', async () => {
    const result = await callHandler({ 
      wallet: '0x0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef',
      provider: 'https://mainnet.infura.io/v3/your-api-key',
      transaction: {
        to: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e',
        data: '0x70a08231000000000000000000000000742d35cc6634c0532925a3b844bc454e4438f44e'
      }
    });
    
    expect(result.isError).toBe(false);
    expect(result.toolResult).toHaveProperty('result');
  });
});

describe('Signing Methods Handlers', () => {
  test('signMessageHandler should sign a message', async () => {
    const result = await signMessageHandler({ 
      wallet: '0x0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef',
      message: 'Hello, world!'
    });
    
    expect(result.isError).toBe(false);
    expect(result.toolResult).toHaveProperty('signature');
    expect(result.toolResult).toHaveProperty('message');
    expect(result.toolResult.signature).toBe('0xsignature');
    expect(result.toolResult.message).toBe('Hello, world!');
  });
  
  test('verifyMessageHandler should verify a signed message', async () => {
    const result = await verifyMessageHandler({ 
      message: 'Hello, world!',
      signature: '0xsignature',
      address: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e'
    });
    
    expect(result.isError).toBe(false);
    expect(result.toolResult).toHaveProperty('isValid');
    expect(result.toolResult).toHaveProperty('recoveredAddress');
  });
});
