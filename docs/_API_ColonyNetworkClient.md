---
title: ColonyNetworkClient
section: API
order: 0
---

The `ColonyNetworkClient` is a standard interface for interactions with functions and events described in `IColonyNetwork.sol`.

These interactions are generally concerned with the colony network as a whole, rather than at the colony level. This includes operations like getting a count of all colonies on the network, querying for information about a parent skillId, or deposits/withdrawals of staked CLNY for use in the reputation system.

You can learn more about the solidity implementation from the [Colony Network Docs](/colonynetwork/docs-colony).

For interactions within a particular colony, see the [ColonyClient API](/colonyjs/api-colonyclient/).

==TOC==

## Create an instance

You can create an instance of `ColonyNetworkClient` by providing an [adapter](/colonyjs/docs-adapters):

```js

const networkClient = new ColonyNetworkClient({ adapter });

await networkClient.init();

```

## Instance methods

**All instance methods return promises.**

### `getColonyClientByAddress(contractAddress)`

Returns an initialized ColonyClient for the contract at address `contractAddress`

**Arguments**

|Argument|Type|Description|
|---|---|---|
|contractAddress|Adress|Address of a deployed Colony contract|

**Returns**

`Promise<ColonyClient>`. An instance of a `ColonyClient` associated with the given Colony contract

### `getColonyClient(id)`

Returns an initialized ColonyClient for the specified id of a deployed colony contract.

**Arguments**

|Argument|Type|Description|
|---|---|---|
|key|string|Name of the Colony to get|
|id|number|Integer number of the Colony|

**Returns**

`Promise<ColonyClient>`. An instance of a `ColonyClient` associated with the given Colony contract

### `getColonyAddress(id)`

Get the address of a Colony for the specified id of a deployed colony contract.

**Arguments**

|Argument|Type|Description|
|---|---|---|
|key|string|Name of the Colony to get|
|id|number|Integer number of the Colony|

**Returns**

`Promise<Address>`. The address of the given Colony contract

### `getMetaColonyClient()`

Gets the Meta Colony as an initialized ColonyClient

**Returns**

`Promise<ColonyClient>`. An instance of a `ColonyClient` associated with the MetaColony contract

  
## Callers

**All callers return promises which resolve to an object containing the given return values.** For a reference please check [here](/colonyjs/docs-contractclient/#callers).

### `ensSupportsInterface.call({ interfaceId })`

Check whether or not ENS supports a contract interface. A supported contract interface implements `interfaceId`.

**Arguments**

|Argument|Type|Description|
|---|---|---|
|interfaceId|Hex string|The hashed ID of the contract interface as specified in ERC-165.|

**Returns**

A promise which resolves to an object containing the following properties:

|Return value|Type|Description|
|---|---|---|
|isSupported|boolean|A boolean indicating whether or not the contract interface is supported.|

### `getAddressForENSHash.call({ nameHash })`

Get the address of a registered ENS label. This function will return an empty address if an ENS label has not been registered.

**Arguments**

|Argument|Type|Description|
|---|---|---|
|nameHash|Hex string|The hached ENS label that will be checked.|

**Returns**

A promise which resolves to an object containing the following properties:

|Return value|Type|Description|
|---|---|---|
|ensAddress|Address|The address associated with the ENS label.|

### `getChildSkillId.call({ skillId, childSkillIndex })`

Get the ID of a child skill.

**Arguments**

|Argument|Type|Description|
|---|---|---|
|skillId|number|The numberic ID of the skill that will be checked.|
|childSkillIndex|number|The index of the child skill array to be checked.|

**Returns**

A promise which resolves to an object containing the following properties:

|Return value|Type|Description|
|---|---|---|
|childSkillId|number|The numeric ID of the child skill.|

### `getColony.call({ id })`

Get the colony contract address for a colony.

**Arguments**

|Argument|Type|Description|
|---|---|---|
|id|number|The numeric ID of the colony.|

**Returns**

A promise which resolves to an object containing the following properties:

|Return value|Type|Description|
|---|---|---|
|address|Address|The address of the colony contract.|

### `getColonyCount.call()`

Get the total number of colonies on the network. The return value is also the numeric ID of the last colony created.


**Returns**

A promise which resolves to an object containing the following properties:

|Return value|Type|Description|
|---|---|---|
|count|number|The total number of colonies.|

### `getColonyVersionResolver.call({ version })`

Get the address of the resolver contract for a specific colony version.

**Arguments**

|Argument|Type|Description|
|---|---|---|
|version|number|The version number of the colony contract.|

**Returns**

A promise which resolves to an object containing the following properties:

|Return value|Type|Description|
|---|---|---|
|address|Address|The address of the resolver contract.|

### `getCurrentColonyVersion.call()`

Get the latest colony contract version. This is the version used to create all new colonies.


**Returns**

A promise which resolves to an object containing the following properties:

|Return value|Type|Description|
|---|---|---|
|version|number|The version number of the latest colony contract.|

### `getMetaColonyAddress.call()`

Get the Meta Colony contract address.


**Returns**

A promise which resolves to an object containing the following properties:

|Return value|Type|Description|
|---|---|---|
|address|Address|The address of the Meta Colony contract.|

### `getParentSkillId.call({ skillId, parentSkillIndex })`

Get the ID of a parent skill.

**Arguments**

|Argument|Type|Description|
|---|---|---|
|skillId|number|The numberic ID of the skill that will be checked.|
|parentSkillIndex|number|The index of the parent skill array to be checked.|

**Returns**

A promise which resolves to an object containing the following properties:

|Return value|Type|Description|
|---|---|---|
|parentSkillId|number|The numeric ID of the parent skill.|

### `getProfileDBAddress.call({ nameHash })`

Get the address of the OrbitDB database associaated with a user profile.

**Arguments**

|Argument|Type|Description|
|---|---|---|
|nameHash|Hex string|The hashed ENS label that was registered for the user.|

**Returns**

A promise which resolves to an object containing the following properties:

|Return value|Type|Description|
|---|---|---|
|orbitDBAddress|string|The path of the OrbitDB database associated with the user profile.|

### `getRecoveryRolesCount.call()`

Get the total number of users that are assigned a network recovery role.


**Returns**

A promise which resolves to an object containing the following properties:

|Return value|Type|Description|
|---|---|---|
|count|number|The total number of users that are assigned a colony recovery role.|

### `getRootGlobalSkillId.call()`

Get the ID of the root global skill.


**Returns**

A promise which resolves to an object containing the following properties:

|Return value|Type|Description|
|---|---|---|
|skillId|number|The numeric ID of the root global skill.|

### `getSkill.call({ skillId })`

Get information about a domain.

**Arguments**

|Argument|Type|Description|
|---|---|---|
|skillId|number|The numeric ID of the skill.|

**Returns**

A promise which resolves to an object containing the following properties:

|Return value|Type|Description|
|---|---|---|
|nParents|number|The total number of parent skills.|
|nChildren|number|The total number of child skills.|
|isGlobalSkill|boolean|A boolean indicating whether or not the skill is a global skill.|

### `getSkillCount.call()`

Get the total number of global and local skills in the network.


**Returns**

A promise which resolves to an object containing the following properties:

|Return value|Type|Description|
|---|---|---|
|count|number|The total number of global and local skills in the network.|

### `getTokenLocking.call()`

Get the token locking contract address.


**Returns**

A promise which resolves to an object containing the following properties:

|Return value|Type|Description|
|---|---|---|
|lockingAddress|Address|The address of the token locking contract.|

### `isColony.call({ colony })`

Check whether or not an address is a colony contract.

**Arguments**

|Argument|Type|Description|
|---|---|---|
|colony|Address|The address that will be checked.|

**Returns**

A promise which resolves to an object containing the following properties:

|Return value|Type|Description|
|---|---|---|
|isColony|boolean|A boolean indicating whether or not an address is a colony contract.|

### `isInRecoveryMode.call()`

Check whether or not the network is in recovery mode.


**Returns**

A promise which resolves to an object containing the following properties:

|Return value|Type|Description|
|---|---|---|
|inRecoveryMode|boolean|A boolean indicating whether or not the network is in recovery mode.|

### `lookupRegisteredENSDomain.call({ ensAddress })`

Lookup the registed ENS label for an address. This function will return an empty string if the address does not have a registered ENS label.

**Arguments**

|Argument|Type|Description|
|---|---|---|
|ensAddress|Address|The address that will checked.|

**Returns**

A promise which resolves to an object containing the following properties:

|Return value|Type|Description|
|---|---|---|
|domain|string|The ENS label associated with the address.|

  
## Senders

**All senders return an instance of a `ContractResponse`.** Every `send()` method takes an `options` object as the second argument. For a reference please check [here](/colonyjs/docs-contractclient/#senders).
### `addColonyVersion.send({ version, resolver }, options)`

Add a new colony contract version and set the address of the resolver contract.

**Arguments**

|Argument|Type|Description|
|---|---|---|
|version|number|The versions number of the colony contract.|
|resolver|Address|The address of the resolver contract.|

**Returns**

An instance of a `ContractResponse` which will eventually receive the following event data:

|Event data|Type|Description|
|---|---|---|
|version|number|The version number of the colony contract that was added.|
|resolver|Address|The address of the resolver contract.|
|ColonyVersionAdded|object|Contains the data defined in [ColonyVersionAdded](#eventscolonyversionaddedaddlistener-version-resolver-------)|

### `addSkill.send({ parentSkillId, globalSkill }, options)`

Add a new global or local skill to the skills tree.

**Arguments**

|Argument|Type|Description|
|---|---|---|
|parentSkillId|number|The numeric ID of the skill under which the new skill will be added.|
|globalSkill|boolean|A boolean indicating whether or not the skill will be a global skill.|

**Returns**

An instance of a `ContractResponse` which will eventually receive the following event data:

|Event data|Type|Description|
|---|---|---|
|skillId|number|The numeric ID of the skill that was added.|
|parentSkillId|number|The numeric ID of the parent skill.|
|SkillAdded|object|Contains the data defined in [SkillAdded](#eventsskilladdedaddlistener-skillid-parentskillid-------)|

### `approveExitRecovery.send(options)`

Indicate approval to exit network recovery mode. This function can only be called by a user with a recovery role.


**Returns**

An instance of a `ContractResponse`



### `createColony.send({ tokenAddress }, options)`

Create a new colony on the network.

**Arguments**

|Argument|Type|Description|
|---|---|---|
|tokenAddress|Address|The address of the token contract.|

**Returns**

An instance of a `ContractResponse` which will eventually receive the following event data:

|Event data|Type|Description|
|---|---|---|
|colonyId|number|The numeric ID of the colony that was added.|
|colonyAddress|Address|The address of the colony contract that was created.|
|tokenAddress|Address|The address of the token contract that was assigned.|
|ColonyAdded|object|Contains the data defined in [ColonyAdded](#eventscolonyaddedaddlistener-colonyid-colonyaddress-tokenaddress-------)|

### `createMetaColony.send({ tokenAddress }, options)`

Create the Meta Colony.

**Arguments**

|Argument|Type|Description|
|---|---|---|
|tokenAddress|Address|The address of the token contract.|

**Returns**

An instance of a `ContractResponse` which will eventually receive the following event data:

|Event data|Type|Description|
|---|---|---|
|colonyAddress|number|The address of the Meta Colony.|
|tokenAddress|Address|The address of the CLNY token contract.|
|rootSkillId|number|The numeric ID of the root skill.|
|MetaColonyCreated|object|Contains the data defined in [MetaColonyCreated](#eventsmetacolonycreatedaddlistener-colonyaddress-tokenaddress-rootskillid-------)|

### `createToken.send({ name, symbol, decimals }, options)`

Create a new ERC20 token contract.

**Arguments**

|Argument|Type|Description|
|---|---|---|
|name|string|The name of the token.|
|symbol|string|The symbol of the token.|
|decimals|number|The number of decimals.|

**Returns**

An instance of a `ContractResponse` which will receive a receipt with a `contractAddress` property (the address of the newly-deployed contract)



### `enterRecoveryMode.send(options)`

Enter network recovery mode. This function can only be called by a user with a recovery role.


**Returns**

An instance of a `ContractResponse`



### `exitRecoveryMode.send(options)`

Exit network recovery mode. This function can be called by anyone if enough whitelist approvals are given.


**Returns**

An instance of a `ContractResponse`



### `registerUserLabel.send({ username, orbitDBPath }, options)`

Register an ENS label for a user.

**Arguments**

|Argument|Type|Description|
|---|---|---|
|username|string|The ENS label that will be registered for the user.|
|orbitDBPath|string|The path of the OrbitDB database associated with the user profile.|

**Returns**

An instance of a `ContractResponse` which will eventually receive the following event data:

|Event data|Type|Description|
|---|---|---|
|user|Address|The address of the user that registered a label.|
|label|string|The ENS label that was registered for the user.|
|UserLabelRegistered|object|Contains the data defined in [UserLabelRegistered](#eventsuserlabelregisteredaddlistener-user-label-------)|

### `removeRecoveryRole.send({ user }, options)`

Remove the network recovery role from a user. This function can only be called by the `FOUNDER` authority role.

**Arguments**

|Argument|Type|Description|
|---|---|---|
|user|Address|The address of the user that will be unassigned a network recovery role.|

**Returns**

An instance of a `ContractResponse`



### `setRecoveryRole.send({ user }, options)`

Assign a network recovery role to a user. This function can only be called by the `FOUNDER` authority role.

**Arguments**

|Argument|Type|Description|
|---|---|---|
|user|Address|The address of the user that will be assigned a network recovery role.|

**Returns**

An instance of a `ContractResponse`



### `setStorageSlotRecovery.send({ slot, value }, options)`

Set the value for a storage slot while in recovery mode. This can only be called by a user with a recovery role.

**Arguments**

|Argument|Type|Description|
|---|---|---|
|slot|number|The numeric ID of the storage slot that will be modified.|
|value|Hex string|The hex string of data that will be set as the value.|

**Returns**

An instance of a `ContractResponse`



### `setTokenLocking.send({ tokenLockingAddress }, options)`

Set the token locking address.

**Arguments**

|Argument|Type|Description|
|---|---|---|
|tokenLockingAddress|Address|The address of the locking contract.|

**Returns**

An instance of a `ContractResponse` which will eventually receive the following event data:

|Event data|Type|Description|
|---|---|---|
|tokenLocking|Address|The address of the token locking contract.|
|TokenLockingAddressSet|object|Contains the data defined in [TokenLockingAddressSet](#eventstokenlockingaddresssetaddlistener-tokenlocking-------)|

### `setupRegistrar.send({ ens, rootNode }, options)`

Set up the registrar.

**Arguments**

|Argument|Type|Description|
|---|---|---|
|ens|Address|The adddress of the ENS registrar.|
|rootNode|string|The namehash of the root node for the domain.|

**Returns**

An instance of a `ContractResponse`



### `startTokenAuction.send({ tokenAddress }, options)`

Create and start an auction for a token owned by the Colony Network. The auction will be for the total amount of the specificed tokens that are owned by the Colony Network.

**Arguments**

|Argument|Type|Description|
|---|---|---|
|tokenAddress|Address|The address of the token contract.|

**Returns**

An instance of a `ContractResponse` which will eventually receive the following event data:

|Event data|Type|Description|
|---|---|---|
|auction|string|The address of the auction contract that was created.|
|token|Address|The address of the token contract that was assigned.|
|quantity|BigNumber|The amount of tokens available for the auction.|
|AuctionCreated|object|Contains the data defined in [AuctionCreated](#eventsauctioncreatedaddlistener-auction-token-quantity-------)|

  
  
## Events

Refer to the `ContractEvent` class [here](/colonyjs/docs-contractclient/#events) to interact with these events.


### `events.AuctionCreated.addListener(({ auction, token, quantity }) => { /* ... */ })`



**Arguments**

|Argument|Type|Description|
|---|---|---|
|auction|string|The address of the auction contract that was created.|
|token|Address|The address of the token contract that was assigned.|
|quantity|BigNumber|The amount of tokens available for the auction.|


### `events.ColonyAdded.addListener(({ colonyId, colonyAddress, tokenAddress }) => { /* ... */ })`



**Arguments**

|Argument|Type|Description|
|---|---|---|
|colonyId|number|The numeric ID of the colony that was added.|
|colonyAddress|Address|The address of the colony contract that was created.|
|tokenAddress|Address|The address of the token contract that was assigned.|


### `events.ColonyLabelRegistered.addListener(({ colony, label }) => { /* ... */ })`



**Arguments**

|Argument|Type|Description|
|---|---|---|
|colony|Address|The address of the colony that registered a label.|
|label|string|The ENS label that was registered for the colony.|


### `events.ColonyNetworkInitialised.addListener(({ resolver }) => { /* ... */ })`



**Arguments**

|Argument|Type|Description|
|---|---|---|
|resolver|Address|The address of the resolver contract.|


### `events.ColonyVersionAdded.addListener(({ version, resolver }) => { /* ... */ })`



**Arguments**

|Argument|Type|Description|
|---|---|---|
|version|number|The version number of the colony contract that was added.|
|resolver|Address|The address of the resolver contract.|


### `events.MetaColonyCreated.addListener(({ colonyAddress, tokenAddress, rootSkillId }) => { /* ... */ })`



**Arguments**

|Argument|Type|Description|
|---|---|---|
|colonyAddress|number|The address of the Meta Colony.|
|tokenAddress|Address|The address of the CLNY token contract.|
|rootSkillId|number|The numeric ID of the root skill.|


### `events.MiningCycleResolverSet.addListener(({ miningCycleResolver }) => { /* ... */ })`



**Arguments**

|Argument|Type|Description|
|---|---|---|
|miningCycleResolver|Address|The address of the resolver contract for the reputation mining cycle contract.|


### `events.NetworkFeeInverseSet.addListener(({ feeInverse }) => { /* ... */ })`



**Arguments**

|Argument|Type|Description|
|---|---|---|
|feeInverse|BigNumber|The inverse value of the network fee that was set.|


### `events.ReputationMiningCycleComplete.addListener(({ hash, nNodes }) => { /* ... */ })`



**Arguments**

|Argument|Type|Description|
|---|---|---|
|hash|Hex string|The root hash of the reputation state that was accepted.|
|nNodes|number|The total number of nodes in the reputation state.|


### `events.ReputationMiningInitialised.addListener(({ inactiveReputationMiningCycle }) => { /* ... */ })`



**Arguments**

|Argument|Type|Description|
|---|---|---|
|inactiveReputationMiningCycle|Address|The address of the reputation mining cycle that was initialized.|


### `events.ReputationRootHashSet.addListener(({ newHash, newNNodes, stakers, reward }) => { /* ... */ })`



**Arguments**

|Argument|Type|Description|
|---|---|---|
|newHash|Hex string|The reputation root hash that was set.|
|newNNodes|number|The total number of nodes in the reputation state.|
|stakers|undefined|The array of users who submitted or backed the accepted hash.|
|reward|undefined|The array of corresponding amounts of CLNY each user received.|


### `events.SkillAdded.addListener(({ skillId, parentSkillId }) => { /* ... */ })`



**Arguments**

|Argument|Type|Description|
|---|---|---|
|skillId|number|The numeric ID of the skill that was added.|
|parentSkillId|number|The numeric ID of the parent skill.|


### `events.TokenLockingAddressSet.addListener(({ tokenLocking }) => { /* ... */ })`



**Arguments**

|Argument|Type|Description|
|---|---|---|
|tokenLocking|Address|The address of the token locking contract.|


### `events.UserLabelRegistered.addListener(({ user, label }) => { /* ... */ })`



**Arguments**

|Argument|Type|Description|
|---|---|---|
|user|Address|The address of the user that registered a label.|
|label|string|The ENS label that was registered for the user.|