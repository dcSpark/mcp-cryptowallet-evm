import { ethers } from 'ethers';
import {
  getNetworkHandler,
  getBlockNumberHandler,
  getFeeDataHandler
} from '../../src/handlers/wallet.js';

// Mock ethers.js functions
jest.mock('ethers', () => {
  const originalModule = jest.requireActual('ethers');
  
  // Create a mock provider
  const mockProvider = {
    getNetwork: jest.fn().mockResolvedValue({ 
      name: 'homestead', 
      chainId: 1,
      ensAddress: '0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e'
    }),
    getBlockNumber: jest.fn().mockResolvedValue(1000000),
    getFeeData: jest.fn().mockResolvedValue({
      gasPrice: originalModule.utils.parseUnits('50', 'gwei'),
      maxFeePerGas: originalModule.utils.parseUnits('100', 'gwei'),
      maxPriorityFeePerGas: originalModule.utils.parseUnits('2', 'gwei')
    })
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

describe('Network Methods Handlers', () => {
  test('getNetworkHandler should return network information', async () => {
    const result = await getNetworkHandler({ 
      provider: 'https://mainnet.infura.io/v3/your-api-key'
    });
    
    expect(result.isError).toBe(false);
    expect(result.toolResult).toHaveProperty('network');
    expect(result.toolResult.network).toHaveProperty('name');
    expect(result.toolResult.network).toHaveProperty('chainId');
    expect(result.toolResult.network).toHaveProperty('ensAddress');
    expect(result.toolResult.network.name).toBe('homestead');
    expect(result.toolResult.network.chainId).toBe(1);
  });
  
  test('getBlockNumberHandler should return the current block number', async () => {
    const result = await getBlockNumberHandler({ 
      provider: 'https://mainnet.infura.io/v3/your-api-key'
    });
    
    expect(result.isError).toBe(false);
    expect(result.toolResult).toHaveProperty('blockNumber');
    expect(result.toolResult.blockNumber).toBe(1000000);
  });
  
  test('getFeeDataHandler should return fee data', async () => {
    const result = await getFeeDataHandler({ 
      provider: 'https://mainnet.infura.io/v3/your-api-key'
    });
    
    expect(result.isError).toBe(false);
    expect(result.toolResult).toHaveProperty('feeData');
    expect(result.toolResult.feeData).toHaveProperty('gasPrice');
    expect(result.toolResult.feeData).toHaveProperty('maxFeePerGas');
    expect(result.toolResult.feeData).toHaveProperty('maxPriorityFeePerGas');
  });
});
