---
title: ContractMethodCaller
section: Architecture
order: 3
---

The `ContractMethodCaller` (short `Caller`) class is a part of the `ContractClient` to passively interact with objects on the blockchain and doesn't produce transactions. They are usually created for a `ContractClient` class on its initialization (e.g. the [ColonyClient](/colonyjs/api-colonyclient)) and are associated with one single method on the smart contract.

For more info see the [ContractClient](/colonyjs/docs-contractclient/) docs.

==TOC==

## Instance methods

### `call(inputValues)`

Given named input values, perform a call on the method's contract function, and get named output values from the result.

**Arguments**

**`inputValues`** `{ [string]: any }` - Any key value pair of contract input parameters

**Returns**

`Promise<{ [string]: any }>` - Promise that resolves to key value pairs of the called contract methods output
