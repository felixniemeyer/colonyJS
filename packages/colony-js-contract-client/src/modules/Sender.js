/* @flow */

import type BigNumber from 'bn.js';
import type {
  EstimateFn,
  EventHandlers,
  InterfaceFn,
  MinedTransaction,
  SendFn,
  Transaction,
  TransactionOptions,
  TransactionReceipt,
} from '@colony/colony-js-adapter';

import utils from '@colony/colony-js-utils';

import ContractClient from './ContractClient';
import { DEFAULT_TIMEOUT, MINING_TIMEOUT } from '../constants';
import Validator from './Validator';

import type { SenderDef } from '../types';

type SendOptions = {
  events?: EventHandlers,
  estimate?: boolean,
  miningTimeoutMs?: number,
  timeoutMs: number,
} & TransactionOptions;

type ContractResponse<EventData> = {
  eventData?: EventData,
  meta: {
    minedTransaction?: MinedTransaction,
    receipt: TransactionReceipt,
    transaction: Transaction,
  },
};

export default class Sender<
  Params: {},
  EventData: {},
  // eslint-disable-next-line
  IContractClient: ContractClient<*>
> extends Validator<Params> {
  static eventHandlers: EventHandlers;
  _send: SendFn<*>;
  _estimate: EstimateFn<*>;
  _proxy: ?InterfaceFn<*>;
  client: IContractClient;
  static create(
    client: IContractClient,
    { params, eventHandlers = {}, send, estimate, proxy }: SenderDef,
  ): Sender<Params, EventData, IContractClient> {
    class _Sender extends Sender<Params, EventData, IContractClient> {
      static params = params;
      static eventHandlers = eventHandlers;
    }
    return new _Sender(client, send, estimate, proxy);
  }
  getArgs(params: Params): Array<*> {
    const args = this.constructor.getArgs(params);
    if (typeof this._proxy === 'function') {
      const { data } = this._proxy(...args);
      return [data];
    }
    return args;
  }
  constructor(
    client: IContractClient,
    send?: SendFn<*>,
    estimate?: EstimateFn<*>,
    proxy?: InterfaceFn<*>,
  ) {
    super();
    this.client = client;
    if (typeof estimate === 'function') this._estimate = estimate;
    if (typeof send === 'function') this._send = send;
    if (typeof proxy === 'function') this._proxy = proxy;
  }
  async estimate(
    params: Params,
    { timeoutMs }: SendOptions,
  ): Promise<BigNumber> {
    if (typeof this._estimate !== 'function')
      throw new TypeError('Expected an estimate function for Sender');

    return utils.raceAgainstTimeout(
      this._estimate(...this.getArgs(params)),
      timeoutMs,
    );
  }
  // TODO provide another function to send without awaiting Promises?
  // TODO or provide options like `waitForMining`?
  async send(
    params: Params,
    options: SendOptions,
  ): Promise<ContractResponse<EventData>> {
    if (typeof this._send !== 'function')
      throw new TypeError('Expected a send function for Sender');

    const {
      timeoutMs = DEFAULT_TIMEOUT,
      miningTimeoutMs = MINING_TIMEOUT,
      ...transactionOptions
    } =
      options || {};
    const transaction = await this.sendTransaction(
      params,
      transactionOptions,
      timeoutMs,
    );
    const receipt = await this.client.adapter.getTransactionReceipt(
      transaction.hash,
    );
    const meta = {
      receipt,
      transaction,
    };
    if (receipt.status === 1) {
      const minedTransaction = await this.client.adapter.waitForTransaction(
        transaction.hash,
        miningTimeoutMs,
      );
      const eventData: EventData = await this.client.adapter.getEventData({
        contract: this.client.contract,
        events: this.constructor.eventHandlers,
        timeoutMs: miningTimeoutMs,
        transactionHash: transaction.hash,
      });
      return {
        eventData,
        meta: {
          ...meta,
          minedTransaction,
        },
      };
    }
    return {
      meta,
    };
  }
  async sendTransaction(
    params: Params,
    transactionOptions: {},
    timeoutMs: number,
  ) {
    return utils.raceAgainstTimeout(
      this._send(...this.getArgs(params), transactionOptions),
      timeoutMs,
    );
  }
}
