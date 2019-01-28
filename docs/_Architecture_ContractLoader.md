---
title: ContractLoader
section: Architecture
order: 0
---

The `ContractLoader` is a superclass for all loader implementations that can be used to access contract data. This page provides an overview of the `ContractLoader` interface and its officially supported implementations.

For a high-level explanation of what loaders are and some quickstart instructions, see [Loaders](/colonyjs/docs-loaders/).

==TOC==

## Create an instance

```js

const loader = new Loader([config]);

```

This will create a new loader instance with the given configuration. The config object varies across implementations and might not be needed at all.

**Arguments**

**`config`** (`?object`): A config object specific to the loader implementation.

A config object can contain a **`transform`** property, which is a function whose default implementation is the identity function.

```
(input, query, requiredProps) => input
```

This function transforms the input of the loader (e.g. from a http endpoint) to a `ContractDefinition` object (see below).

**Returns**

**`Loader`** instance.

## Instance methods

Loaders just implement one function: `load`. It returns a Promise that resolves to a `ContractDefinition` object which may contain the contract's ABI, the address and/or the bytecode.

### `load(query, [requiredProps])`

**This function will be called by the adapter; in most of the cases you would not want to do this.**

**Arguments**

* **`query`** (`object`): can contain the following properties (depending on the router and needs):

|Property|Type|Description|
|---|---|---|
|contractName|string|`contractName` of the router contract (necessary when using upgradable contracts)|
|contractAddress|string|Look up the contract by its address (e.g. EtherScan loader)|
|routerName|string|`contractName` of the router contract (necessary when using upgradable contracts)|
|routerAddress|string|Look up the router by its address|
|version|string|The contract version (if contracts are upgradable)|

* **`requiredProps`** (`?object`): Can contain the following properties (all are optional):

|Propety|Type|Description|
|---|---|---|
|address|boolean|Loader will try to return the address of the loaded contract|
|abi|boolean|Loader will try to return the abi of the required contract|
|bytecode|boolean|Loader will try to return the abi of the required contract|

**Returns**

**`Promise<ContractDefinition>`**: Resolves to a `ContractDefinition` object like shown below.

```
type ContractDefinition = {
  abi?: Object,
  address?: string,
  bytecode?: string,
}
```

## Loaders

### `NetworkLoader`

Consider the `NetworkLoader` the official Loader to load deployed Colony contracts. You just need to specify a `network` on instantiation and the rest will be taken care of by the loader (as long as the contracts are deployed on that specific network).

#### Installation

Install `colony-js-contract-loader-network`:

```
yarn add @colony/colony-js-contract-loader-network
```

Import `NetworkLoader`:

```js

import NetworkLoader from '@colony/colony-js-contract-loader-network'

```

#### `new NetworkLoader({ network, transform })`

Instantiates a new `NetworkLoader`.

**Arguments**

**`network`** (`string`): Defines the (test-)network you'd like to access the contracts on. Currently available networks:

- `rinkeby`

**`transform`** (`?function`): The transform function to use to transform the input data (see [here](#contractloader-interface))

**Returns**

**`NetworkLoader`** instance.

The `NetworkLoader` also implements the `loader.load` function and works like described above. It can take the `contractName`, `routerName` and the `version` properties.

### `HTTPLoader`

The `HTTPLoader` uses the browser's `fetch` API to get contract definitions from a HTTP source (like [trufflepig](https://github.com/JoinColony/trufflepig) or [etherscan](https://etherscan.io/contractsVerified)).

Available sub-loaders: `EtherscanLoader`, `TrufflepigLoader`. These are specialized HTTPLoaders with their respective endpoints and transforms already set.

#### Installation

Install `colony-js-contract-loader-http`:

```
yarn add @colony/colony-js-contract-loader-http
```

Import `HTTPLoader`:

```js

import HTTPLoader from '@colony/colony-js-contract-loader-http'

```

Import `EtherscanLoader`:

```js

import { EtherscanLoader } from '@colony/colony-js-contract-loader-http'

```

Import `TrufflepigLoader`:

```js

import { TrufflepigLoader } from '@colony/colony-js-contract-loader-http'

```

#### `new HTTPLoader({ endpoint, transform })`

Instantiates a new `HTTPLoader`.

**Arguments**

**`endpoint`** (`string`): Defines the http endpoint for the contract (full URL, e.g. `https://api.etherscan.io/api?module=contract&action=getabi&address=%%ADDRESS%%`).

The following values can be interpolated (i.e. will be replaced in the URL with the corresponding values):

|Value|Description|
|---|---|
|`%%ADDRESS%%`|Adress of the loaded contract|
|`%%NAME%%`|Name of the Contract (most likely the contents of the `contractName` field)|
|`%%VERSION%%`|Contract version (if applicable)|

**`transform`** (`?function`): The transform function to use to transform the input data (see [here](#contractloader-interface))

**Returns**

**`HTTPLoader`** instance.

The `HTTPLoader` also implements the `loader.load` function and works like described above. It can take the `contractName`, `contractAddress`, `routerName`, `routerAddress` and the `version` properties.

#### `new TrufflepigLoader({ endpoint, transform })`

This is just a `HTTPLoader` with a specific endpoint (`http://127.0.0.1/contracts?name=%%NAME%%&address=%%ADDRESS%%&version=%%VERSION%%`) and a transform function specialised for truffle compiled ABIs. It can take the `contractName`, `contractAddress`, `routerName`, `routerAddress` properties.

#### `new EtherscanLoader({ endpoint, transform })`

This is just a `HTTPLoader` with a specific endpoint (`https://api.etherscan.io/api?module=contract&action=getabi&address=%%ADDRESS%%`) and a transform function specialised for Etherscan. It can take the `contractAddress` and `routerAddress` properties.

### `FSLoader`

**`FSLoader` is only available in node.js environments.**

This loader loads files by name from a specific directory in a file system.

Available sub-loaders: `Truffleloader`. This one uses a transform function specialized for compiled truffle ABIs.

#### Installation

Install `colony-js-contract-loader-fs`:

```
yarn add @colony/colony-js-contract-loader-fs
```

Import `FSLoader`:

```js

const { FSLoader } = require('@colony/colony-js-contract-loader-fs');

```

Import `TruffleLoader`:

```js

const { TruffleLoader } = require('@colony/colony-js-contract-loader-fs');

```

#### `new FSLoader({ contractDir, transform })`

Instantiates a new `FSLoader`.

**Arguments**

**`contractDir`** (`string`): Path to the contract ABI directory (.json files). For best results, use an absolute path.

**`transform`** (`?function`): The transform function to use to transform the input data (see [here](#contractloader-interface))

**Returns**

**`FSLoader`** instance.

The `FSLoader` also implements the `loader.load` function and works like described above. It can take the `contractName` and `routerName` properties.

#### `new TruffleLoader({ contractDir, transform })`

This is just a `FSLoader` with a transform function specialized for compiled truffle ABIs.
