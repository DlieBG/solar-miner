import { MiningFunctions } from './functions/miningFunctions';
import { StorageFunctions } from './functions/storageFunctions';
import { Server } from './server';

export const server = new Server();
export const storage = new StorageFunctions();
export const mining = new MiningFunctions();