/* eslint-env jest */
/* eslint-disable no-underscore-dangle */

import createSandbox from 'jest-sandbox';
import ColonyNetworkClient from '../ColonyNetworkClient';
import ColonyClient from '../ColonyClient';
import MetaColonyClient from '../MetaColonyClient';
import TokenClient from '../TokenClient';

jest.mock('web3-utils', () => ({
  isHex: jest.fn().mockReturnValue(true),
  isAddress: jest.fn().mockReturnValue(true),
  utf8ToHex: jest.fn().mockImplementation(value => `0x${value}`),
}));

jest.mock('../TokenClient');

describe('ColonyNetworkClient', () => {
  const sandbox = createSandbox();

  const colonyNetworkEvents = [
    'ColonyAdded',
    'SkillAdded',
    'AuctionCreated',
    'UserLabelRegistered',
    'ColonyLabelRegistered',
    'ColonyNetworkInitialised',
    'TokenLockingAddressSet',
    'MiningCycleResolverSet',
    'NetworkFeeInverseSet',
    'ColonyVersionAdded',
    'MetaColonyCreated',
    'ReputationMiningInitialised',
    'ReputationMiningCycleComplete',
    'ReputationRootHashSet',
  ];
  const colonyAddress = '0x123 Colony Lane';
  const contract = {
    interface: {
      events: colonyNetworkEvents.reduce(
        (acc, eventName, i) => ({
          ...acc,
          [eventName]: {
            topics: [`0x${i}`],
          },
        }),
        {},
      ),
    },
  };
  const deployTransaction = {
    hash: 'the deploy transaction hash',
  };
  const transaction = {
    hash: 'the transaction hash',
  };
  const receipt = {
    contractAddress: 'the contract address',
  };
  const wallet = {
    sendTransaction: sandbox.fn().mockImplementation(async () => transaction),
  };
  const adapter = {
    getContract: sandbox.fn().mockImplementation(async () => contract),
    getContractDeployTransaction: sandbox
      .fn()
      .mockImplementation(async () => deployTransaction),
    getTransactionReceipt: sandbox.fn().mockImplementation(async () => receipt),
    wallet,
    provider: {
      name: 'rinkeby',
    },
  };

  beforeEach(() => {
    sandbox.clear();
  });

  test('Creating a token', async () => {
    const networkClient = new ColonyNetworkClient({ adapter });
    await networkClient.init();

    sandbox.spyOn(networkClient.createToken, '_send');

    const symbol = 'TST';

    const options = { gasLimit: 400000 };

    const {
      meta: {
        receipt: { contractAddress },
      },
    } = await networkClient.createToken.send(
      {
        symbol,
      },
      options,
    );

    expect(contractAddress).toBe(receipt.contractAddress);
    expect(adapter.getContractDeployTransaction).toHaveBeenCalledWith(
      expect.objectContaining({ contractName: 'DSToken' }),
      [`0x${symbol.padStart(64, '0')}`],
    );
    expect(wallet.sendTransaction).toHaveBeenCalledWith(
      deployTransaction,
      options,
    );
    expect(adapter.getTransactionReceipt).toHaveBeenCalledWith(
      transaction.hash,
    );
  });

  test('Creating a Colony', async () => {
    const networkClient = new ColonyNetworkClient({ adapter });
    await networkClient.init();

    // The createColony Sender should be configured correctly
    expect(networkClient.createColony).toBeInstanceOf(
      networkClient.constructor.Sender,
    );
    expect(networkClient.createColony).toHaveProperty('_defaultGasLimit');
    expect(networkClient.createColony.input).toEqual([
      ['tokenAddress', 'address'],
    ]);

    const response = {
      eventData: {
        colonyId: 23,
        colonyAddress: 'colony address',
      },
    };
    sandbox
      .spyOn(networkClient.createColony, '_send')
      .mockImplementation(async () => response);

    const tokenAddress = '0xa2dd9cec9eab6c2bb5aef2f758cff78bffd8e958';

    // Send should work as per usual
    const {
      eventData: { colonyId, colonyAddress: address },
    } = await networkClient.createColony.send({ tokenAddress });
    expect(colonyId).toBe(response.eventData.colonyId);
    expect(address).toBe(response.eventData.colonyAddress);
  });

  test('Getting a ColonyClient', async () => {
    const networkClient = new ColonyNetworkClient({ adapter });
    await networkClient.init();

    const colonyClient = {
      contract: {
        address: colonyAddress,
      },
    };
    sandbox
      .spyOn(networkClient, 'getColonyAddress')
      .mockImplementation(async () => colonyAddress);
    sandbox
      .spyOn(networkClient, 'getColonyClientByAddress')
      .mockImplementation(async () => colonyClient);

    // Ensure that the input is validated
    try {
      await networkClient.getColonyClient();
    } catch (error) {
      expect(error.toString()).toMatch('An ID parameter must be provided');
    }

    const id = 23;
    expect(await networkClient.getColonyClient(id)).toEqual(colonyClient);
    expect(networkClient.getColonyAddress).toHaveBeenCalledWith(id);
    expect(networkClient.getColonyClientByAddress).toHaveBeenCalledWith(
      colonyAddress,
    );
  });

  test('Getting a ColonyClient by address', async () => {
    const networkClient = new ColonyNetworkClient({ adapter });
    await networkClient.init();

    let client;
    const MockColonyClient = sandbox.fn((...args) => {
      client = new ColonyClient(...args);
      return client;
    });
    const colonyClientSpy = sandbox
      .spyOn(ColonyNetworkClient, 'ColonyClient', 'get')
      .mockReturnValue(MockColonyClient);
    sandbox.spyOn(ColonyClient.prototype, 'init');
    sandbox
      .spyOn(ColonyClient.prototype, 'initializeContractMethods')
      .mockImplementation(() => {
        client.getToken = {
          call: sandbox.fn().mockImplementation(async () => ({
            address: 'token address',
          })),
        };
      });

    const colonyClient = await networkClient.getColonyClientByAddress(
      colonyAddress,
    );

    expect(colonyClientSpy).toHaveBeenCalled();
    expect(colonyClient).toBeInstanceOf(ColonyClient);
    expect(MockColonyClient).toHaveBeenCalledWith({
      adapter: networkClient.adapter,
      networkClient,
      query: {
        contractAddress: colonyAddress,
      },
    });
    expect(colonyClient.init).toHaveBeenCalled();
    expect(colonyClient.getToken.call).toHaveBeenCalled();
    expect(colonyClient).toHaveProperty('token', expect.any(TokenClient));
    expect(colonyClient.token.init).toHaveBeenCalled();
    expect(TokenClient).toHaveBeenCalledWith(
      expect.objectContaining({
        adapter: colonyClient.adapter,
        query: { contractAddress: 'token address' },
      }),
    );
  });

  test('Getting a Colony address', async () => {
    const networkClient = new ColonyNetworkClient({ adapter });
    await networkClient.init();

    const getColonySpy = sandbox
      .spyOn(networkClient.getColony, 'call')
      .mockImplementation(async () => ({ address: colonyAddress }));

    const id = 24;

    // Ensure that the input is validated
    try {
      await networkClient.getColonyAddress();
      expect(true).toBe(false); // should be unreachable
    } catch (error) {
      expect(error.toString()).toMatch('An ID parameter must be provided');
    }

    // Getting the the address by id
    expect(await networkClient.getColonyAddress(id)).toBe(colonyAddress);
    expect(getColonySpy).toHaveBeenCalledWith({ id });
  });

  test('Getting the Meta Colony as a MetaColonyClient', async () => {
    const networkClient = new ColonyNetworkClient({ adapter });
    await networkClient.init();

    let client;
    const MockMetaColonyClient = sandbox.fn((...args) => {
      client = new MetaColonyClient(...args);
      return client;
    });
    const metaColonyClientSpy = sandbox
      .spyOn(ColonyNetworkClient, 'MetaColonyClient', 'get')
      .mockImplementation(() => MockMetaColonyClient);
    sandbox.spyOn(MetaColonyClient.prototype, 'init');

    // Test the mocked getter
    expect(
      new ColonyNetworkClient.MetaColonyClient({ networkClient }),
    ).toBeInstanceOf(MetaColonyClient);
    expect(MockMetaColonyClient).toHaveBeenCalledWith({ networkClient });
    MockMetaColonyClient.mockClear();

    const metaColonyAddress = 'The Meta Colony lives here';

    sandbox
      .spyOn(networkClient.getMetaColonyAddress, 'call')
      .mockImplementation(async () => ({ address: metaColonyAddress }));
    sandbox
      .spyOn(MetaColonyClient.prototype, 'initializeContractMethods')
      .mockImplementation(() => {
        client.getToken = {
          call: sandbox.fn().mockImplementation(async () => ({
            address: 'token address',
          })),
        };
      });

    const metaColonyClient = await networkClient.getMetaColonyClientByAddress(
      metaColonyAddress,
    );

    expect(metaColonyClientSpy).toHaveBeenCalled();
    expect(metaColonyClient).toBeInstanceOf(MetaColonyClient);
    expect(MockMetaColonyClient).toHaveBeenCalledWith({
      adapter: networkClient.adapter,
      networkClient,
      query: {
        contractAddress: metaColonyAddress,
      },
    });
    expect(metaColonyClient.init).toHaveBeenCalled();
  });
});
