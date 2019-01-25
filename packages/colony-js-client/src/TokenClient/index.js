/* @flow */

import BigNumber from 'bn.js';
import ContractClient from '@colony/colony-js-contract-client';
import GetTokenInfo from './callers/GetTokenInfo';

type Address = string;

type Approval = ContractClient.Event<{
  owner: Address, // The address that approved the allowance (the token `owner`).
  spender: Address, // The address that was approved for the allowance (the token `spender`).
  value: BigNumber, // The amount of tokens that were approved (the amount `allowed`).
}>;
type Burn = ContractClient.Event<{
  address: Address, // The address from which the tokens were burned.
  amount: BigNumber, // The amount of tokens that were burned.
}>;
type LogSetAuthority = ContractClient.Event<{
  authority: Address, // The address that was assigned an authority role.
}>;
type LogSetOwner = ContractClient.Event<{
  owner: Address, // The address that was assigned as the new owner.
}>;
type Mint = ContractClient.Event<{
  address: Address, // The address to which the minted tokens were sent.
  amount: BigNumber, // The amount of tokens that were minted.
}>;
type Transfer = ContractClient.Event<{
  from: Address, // The address that sent the tokens.
  to: Address, // The address that received the tokens.
  value: BigNumber, // The amount of tokens that were transferred.
}>;

export default class TokenClient extends ContractClient {
  events: {
    Approval: Approval,
    Burn: Burn,
    LogSetAuthority: LogSetAuthority,
    LogSetOwner: LogSetOwner,
    Mint: Mint,
    Transfer: Transfer,
  };

  /*
  Approve a token allowance. This function can only be called by the token `owner`. The allowance is the amount of tokens that the `spender` is authorized to transfer using the `transferFrom` function.
  */
  approve: TokenClient.Sender<
    {
      user: Address, // The address that will be approved for the allowance (the token `spender`).
      amount: BigNumber, // The amount of tokens that will be approved (the amount `allowed`).
    },
    { Approval: Approval },
    TokenClient,
  >;
  /*
  Burn tokens. This is an `ERC20Extended` function that can only be called by the token `owner`. When a colony contract address is assigned as the token `owner`, this function can only be called by the user assigned the `FOUNDER` authority role.
  */
  burn: TokenClient.Sender<
    {
      user: Address, // The address from which to burn tokens.
      amount: BigNumber, // The amount of tokens that will be burned.
    },
    { Burn: Burn },
    TokenClient,
  >;
  /*
  Get the token allowance of an address. The allowance is the amount of tokens that the `spender` is authorized to transfer using the `transferFrom` function.
  */
  getAllowance: TokenClient.Caller<
    {
      sourceAddress: Address, // The address that approved the allowance (the token `owner`).
      user: Address, // The address that was approved for the allowance (the token `spender`).
    },
    {
      amount: BigNumber, // The amount of tokens that were approved (the amount `allowed`).
    },
    TokenClient,
  >;
  /*
  Get the the token balance of an address.
  */
  getBalanceOf: TokenClient.Caller<
    {
      sourceAddress: Address, // The address that will be checked.
    },
    {
      amount: BigNumber, // The balance of tokens for the address.
    },
    TokenClient,
  >;
  /*
  Get information about the token.
  */
  getTokenInfo: TokenClient.Caller<
    {},
    {
      name: string, // The name of the token.
      symbol: string, // The symbol of the token.
      decimals: number, // The number of decimals.
    },
    TokenClient,
  >;
  /*
  Get the total supply of the token.
  */
  getTotalSupply: TokenClient.Caller<
    {},
    {
      amount: BigNumber, // The total supply of the token.
    },
    TokenClient,
  >;
  /*
  Mint new tokens. This is an `ERC20Extended` function that can only be called by the token `owner`. When a colony contract address is assigned as the token `owner`, this function can only be called by the user assigned the `FOUNDER` authority role.
  */
  mint: TokenClient.Sender<
    {
      user: Address, // The address to send the minted tokens to
      amount: BigNumber, // The amount of tokens that will be minted.
    },
    { Mint: Mint },
    TokenClient,
  >;
  /*
  Assign an account the `ADMIN` authority role within a colony.
  */
  setAuthority: TokenClient.Sender<
    {
      authority: Address, // The address that will be assigned the `ADMIN` authority role.
    },
    { LogSetAuthority: LogSetAuthority },
    TokenClient,
  >;
  /*
  Set the `name` of a token contract. This function can only be called by the current `owner` of the contract. In order to call token contract methods from within a colony, the token `owner` must be the address of the colony contract.
  */
  setName: TokenClient.Sender<
    {
      name: string, // The new name for the token
    },
    {},
    TokenClient,
  >;
  /*
  Set the `owner` of a token contract. This function can only be called by the current `owner` of the contract. In order to call token contract methods from within a colony, the token `owner` must be the address of the colony contract.
  */
  setOwner: TokenClient.Sender<
    {
      owner: Address, // The address that will be assigned as the new owner.
    },
    { LogSetOwner: LogSetOwner },
    TokenClient,
  >;
  /*
  Transfer tokens from the address calling the function to another address. The current address must have a sufficient token balance.
  */
  transfer: TokenClient.Sender<
    {
      destinationAddress: Address, // The address to which tokens will be transferred.
      amount: BigNumber, // The amount of tokens that will be transferred.
    },
    {},
    TokenClient,
  >;
  /*
  Transfer tokens from one address to another address. The address the tokens are transferred from must have a sufficient token balance and it must have a sufficient token allowance approved by the token owner.
  */
  transferFrom: TokenClient.Sender<
    {
      sourceAddress: Address, // The address from which tokens will be transferred.
      destinationAddress: Address, // The address to which tokens will be transferred.
      amount: BigNumber, // The amount of tokens that will be transferred.
    },
    { Transfer: Transfer },
    TokenClient,
  >;

  static get defaultQuery() {
    return {
      contractName: 'Token',
    };
  }

  initializeContractMethods() {
    const amount = ['amount', 'bigNumber'];
    const sourceAddress = ['sourceAddress', 'address'];
    const destinationAddress = ['destinationAddress', 'address'];
    const user = ['user', 'address'];

    this.addEvent('Transfer', [
      ['from', 'address'],
      ['to', 'address'],
      ['value', 'bigNumber'],
    ]);
    this.addEvent('Approval', [
      ['owner', 'address'],
      ['spender', 'address'],
      ['value', 'bigNumber'],
    ]);
    this.addEvent('Mint', [['address', 'address'], ['amount', 'bigNumber']]);
    this.addEvent('Burn', [['address', 'address'], ['amount', 'bigNumber']]);
    this.addEvent('LogSetOwner', [['owner', 'address']]);
    this.addEvent('LogSetAuthority', [['authority', 'address']]);

    this.getTokenInfo = new GetTokenInfo({ client: this });

    this.addCaller('getTotalSupply', {
      functionName: 'totalSupply',
      output: [amount],
    });

    this.addCaller('getBalanceOf', {
      functionName: 'balanceOf',
      input: [sourceAddress],
      output: [amount],
    });

    this.addCaller('getAllowance', {
      functionName: 'allowance',
      input: [sourceAddress, user],
      output: [amount],
    });

    this.addSender('transfer', {
      input: [destinationAddress, amount],
    });

    this.addSender('transferFrom', {
      input: [sourceAddress, destinationAddress, amount],
    });

    this.addSender('approve', {
      input: [user, amount],
    });

    this.addSender('mint', {
      input: [user, amount],
    });

    this.addSender('burn', {
      input: [user, amount],
    });

    this.addSender('setName', {
      input: [['name', 'bytes32String']],
    });

    this.addSender('setOwner', {
      input: [['owner', 'address']],
    });

    this.addSender('setAuthority', {
      input: [['authority', 'address']],
    });
  }
}
