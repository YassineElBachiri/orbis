import * as anchor from '@coral-xyz/anchor';
import { Program } from '@coral-xyz/anchor';
import { Keypair } from '@solana/web3.js';
import { Orbis } from '../target/types/orbis';

describe('orbis', () => {
  // Configure the client to use the local cluster.
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);
  const payer = provider.wallet as anchor.Wallet;

  const program = anchor.workspace.Orbis as Program<Orbis>;

  const orbisKeypair = Keypair.generate();

  it('Initialize Orbis', async () => {
    await program.methods
      .initialize()
      .accounts({
        orbis: orbisKeypair.publicKey,
        payer: payer.publicKey,
      })
      .signers([orbisKeypair])
      .rpc();

    const currentCount = await program.account.orbis.fetch(
      orbisKeypair.publicKey
    );

    expect(currentCount.count).toEqual(0);
  });

  it('Increment Orbis', async () => {
    await program.methods
      .increment()
      .accounts({ orbis: orbisKeypair.publicKey })
      .rpc();

    const currentCount = await program.account.orbis.fetch(
      orbisKeypair.publicKey
    );

    expect(currentCount.count).toEqual(1);
  });

  it('Increment Orbis Again', async () => {
    await program.methods
      .increment()
      .accounts({ orbis: orbisKeypair.publicKey })
      .rpc();

    const currentCount = await program.account.orbis.fetch(
      orbisKeypair.publicKey
    );

    expect(currentCount.count).toEqual(2);
  });

  it('Decrement Orbis', async () => {
    await program.methods
      .decrement()
      .accounts({ orbis: orbisKeypair.publicKey })
      .rpc();

    const currentCount = await program.account.orbis.fetch(
      orbisKeypair.publicKey
    );

    expect(currentCount.count).toEqual(1);
  });

  it('Set orbis value', async () => {
    await program.methods
      .set(42)
      .accounts({ orbis: orbisKeypair.publicKey })
      .rpc();

    const currentCount = await program.account.orbis.fetch(
      orbisKeypair.publicKey
    );

    expect(currentCount.count).toEqual(42);
  });

  it('Set close the orbis account', async () => {
    await program.methods
      .close()
      .accounts({
        payer: payer.publicKey,
        orbis: orbisKeypair.publicKey,
      })
      .rpc();

    // The account should no longer exist, returning null.
    const userAccount = await program.account.orbis.fetchNullable(
      orbisKeypair.publicKey
    );
    expect(userAccount).toBeNull();
  });
});
