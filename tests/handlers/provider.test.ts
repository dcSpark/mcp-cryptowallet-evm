import { ethers } from 'ethers';
import {
  getBlockHandler,
  getTransactionHandler,
  getTransactionReceiptHandler,
  getCodeHandler,
  getStorageAtHandler,
  estimateGasHandler,
  getLogsHandler,
  getEnsResolverHandler,
  lookupAddressHandler,
  resolveNameHandler
} from '../../src/handlers/wallet.js';

// Mock ethers.js functions
jest.mock('ethers', () => {
  const originalModule = jest.requireActual('ethers');
  
  // Create a mock provider
  const mockProvider = {
    getBlock: jest.fn().mockResolvedValue({ 
      hash: '0xblock', 
      number: 1000000, 
      timestamp: Date.now() / 1000,
      transactions: ['0xtx1', '0xtx2']
    }),
    getTransaction: jest.fn().mockResolvedValue({ 
      hash: '0xtx', 
      from: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e', 
      to: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e' 
    }),
    getTransactionReceipt: jest.fn().mockResolvedValue({ 
      status: 1, 
      blockNumber: 1000000,
      gasUsed: originalModule.BigNumber.from(21000)
    }),
    getCode: jest.fn().mockResolvedValue('0x'),
    getStorageAt: jest.fn().mockResolvedValue('0x0000000000000000000000000000000000000000000000000000000000000000'),
    estimateGas: jest.fn().mockResolvedValue(originalModule.BigNumber.from(21000)),
    getLogs: jest.fn().mockResolvedValue([{
      blockNumber: 1000000,
      blockHash: '0xblock',
      transactionIndex: 0,
      removed: false,
      address: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e',
      data: '0x',
      topics: ['0xtopic1', '0xtopic2']
    }]),
    getResolver: jest.fn().mockResolvedValue({
      address: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e',
      name: 'test.eth'
    }),
    lookupAddress: jest.fn().mockResolvedValue('test.eth'),
    resolveName: jest.fn().mockResolvedValue('0x742d35Cc6634C0532925a3b844Bc454e4438f44e')
  };
  
  return {
    ...originalModule,
    providers: {
      JsonRpcProvider: jest.fn().mockReturnValue(mockProvider)
    },
    getDefaultProvider: jest.fn().mockReturnValue(mockProvider),
    utils: originalModule.utils
  };
});

describe('Provider Methods Handlers', () => {
  test('getBlockHandler should return a block', async () => {
    const result = await getBlockHandler({ 
      provider: 'https://mainnet.infura.io/v3/your-api-key',
      blockHashOrBlockTag: 'latest',
      includeTransactions: true
    });
    
    expect(result.isError).toBe(false);
    expect(result.toolResult).toHaveProperty('block');
    expect(result.toolResult.block).toHaveProperty('hash');
    expect(result.toolResult.block).toHaveProperty('number');
    expect(result.toolResult.block).toHaveProperty('timestamp');
    expect(result.toolResult.block).toHaveProperty('transactions');
  });
  
  test('getTransactionHandler should return a transaction', async () => {
    const result = await getTransactionHandler({ 
      provider: 'https://mainnet.infura.io/v3/your-api-key',
      transactionHash: '0xtx'
    });
    
    expect(result.isError).toBe(false);
    expect(result.toolResult).toHaveProperty('transaction');
    expect(result.toolResult.transaction).toHaveProperty('hash');
    expect(result.toolResult.transaction).toHaveProperty('from');
    expect(result.toolResult.transaction).toHaveProperty('to');
  });
  
  test('getTransactionReceiptHandler should return a transaction receipt', async () => {
    const result = await getTransactionReceiptHandler({ 
      provider: 'https://mainnet.infura.io/v3/your-api-key',
      transactionHash: '0xtx'
    });
    
    expect(result.isError).toBe(false);
    expect(result.toolResult).toHaveProperty('receipt');
    expect(result.toolResult.receipt).toHaveProperty('status');
    expect(result.toolResult.receipt).toHaveProperty('blockNumber');
    expect(result.toolResult.receipt).toHaveProperty('gasUsed');
  });
  
  test('getCodeHandler should return code at an address', async () => {
    const result = await getCodeHandler({ 
      provider: 'https://mainnet.infura.io/v3/your-api-key',
      address: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e'
    });
    
    expect(result.isError).toBe(false);
    expect(result.toolResult).toHaveProperty('code');
    expect(result.toolResult.code).toBe('0x');
  });
  
  test('getStorageAtHandler should return storage at a position', async () => {
    const result = await getStorageAtHandler({ 
      provider: 'https://mainnet.infura.io/v3/your-api-key',
      address: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e',
      position: '0x0'
    });
    
    expect(result.isError).toBe(false);
    expect(result.toolResult).toHaveProperty('storage');
    expect(result.toolResult.storage).toBe('0x0000000000000000000000000000000000000000000000000000000000000000');
  });
  
  test('estimateGasHandler should estimate gas for a transaction', async () => {
    const result = await estimateGasHandler({ 
      provider: 'https://mainnet.infura.io/v3/your-api-key',
      transaction: {
        to: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e',
        data: '0x'
      }
    });
    
    expect(result.isError).toBe(false);
    expect(result.toolResult).toHaveProperty('gasEstimate');
    expect(result.toolResult.gasEstimate).toBe('21000');
  });
  
  test('getLogsHandler should return logs matching a filter', async () => {
    const result = await getLogsHandler({ 
      provider: 'https://mainnet.infura.io/v3/your-api-key',
      filter: {
        address: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e',
        fromBlock: 'latest',
        toBlock: 'latest'
      }
    });
    
    expect(result.isError).toBe(false);
    expect(result.toolResult).toHaveProperty('logs');
    expect(Array.isArray(result.toolResult.logs)).toBe(true);
    expect(result.toolResult.logs.length).toBe(1);
    expect(result.toolResult.logs[0]).toHaveProperty('blockNumber');
    expect(result.toolResult.logs[0]).toHaveProperty('topics');
  });
  
  test('getEnsResolverHandler should return an ENS resolver', async () => {
    const result = await getEnsResolverHandler({ 
      provider: 'https://mainnet.infura.io/v3/your-api-key',
      name: 'test.eth'
    });
    
    expect(result.isError).toBe(false);
    expect(result.toolResult).toHaveProperty('resolver');
    expect(result.toolResult.resolver).toHaveProperty('address');
    expect(result.toolResult.resolver).toHaveProperty('name');
  });
  
  test('lookupAddressHandler should lookup an ENS name for an address', async () => {
    const result = await lookupAddressHandler({ 
      provider: 'https://mainnet.infura.io/v3/your-api-key',
      address: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e'
    });
    
    expect(result.isError).toBe(false);
    expect(result.toolResult).toHaveProperty('name');
    expect(result.toolResult.name).toBe('test.eth');
  });
  
  test('resolveNameHandler should resolve an ENS name to an address', async () => {
    const result = await resolveNameHandler({ 
      provider: 'https://mainnet.infura.io/v3/your-api-key',
      name: 'test.eth'
    });
    
    expect(result.isError).toBe(false);
    expect(result.toolResult).toHaveProperty('address');
    expect(result.toolResult.address).toBe('0x742d35Cc6634C0532925a3b844Bc454e4438f44e');
  });
});
