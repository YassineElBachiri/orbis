// Here we export some useful types and functions for interacting with the Anchor program.
import { AnchorProvider, Program } from '@coral-xyz/anchor';
import { Cluster, PublicKey } from '@solana/web3.js';
import OrbisIDL from '../target/idl/orbis.json';
import type { Orbis } from '../target/types/orbis';

// Re-export the generated IDL and type
export { Orbis, OrbisIDL };

// The programId is imported from the program IDL.
export const ORBIS_PROGRAM_ID = new PublicKey(OrbisIDL.address);

// This is a helper function to get the Orbis Anchor program.
export function getOrbisProgram(provider: AnchorProvider) {
  return new Program(OrbisIDL as Orbis, provider);
}

// This is a helper function to get the program ID for the Orbis program depending on the cluster.
export function getOrbisProgramId(cluster: Cluster) {
  switch (cluster) {
    case 'devnet':
    case 'testnet':
    case 'mainnet-beta':
    default:
      return ORBIS_PROGRAM_ID;
  }
}
