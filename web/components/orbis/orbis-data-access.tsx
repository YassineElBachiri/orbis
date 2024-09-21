'use client';

import { getOrbisProgram, getOrbisProgramId } from '@orbis/anchor';
import { Program } from '@coral-xyz/anchor';
import { useConnection } from '@solana/wallet-adapter-react';
import { Cluster, Keypair, PublicKey } from '@solana/web3.js';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import toast from 'react-hot-toast';
import { useCluster } from '../cluster/cluster-data-access';
import { useAnchorProvider } from '../solana/solana-provider';
import { useTransactionToast } from '../ui/ui-layout';

export function useOrbisProgram() {
  const { connection } = useConnection();
  const { cluster } = useCluster();
  const transactionToast = useTransactionToast();
  const provider = useAnchorProvider();
  const programId = useMemo(
    () => getOrbisProgramId(cluster.network as Cluster),
    [cluster]
  );
  const program = getOrbisProgram(provider);

  const accounts = useQuery({
    queryKey: ['orbis', 'all', { cluster }],
    queryFn: () => program.account.orbis.all(),
  });

  const getProgramAccount = useQuery({
    queryKey: ['get-program-account', { cluster }],
    queryFn: () => connection.getParsedAccountInfo(programId),
  });

  const initialize = useMutation({
    mutationKey: ['orbis', 'initialize', { cluster }],
    mutationFn: (keypair: Keypair) =>
      program.methods
        .initialize()
        .accounts({ orbis: keypair.publicKey })
        .signers([keypair])
        .rpc(),
    onSuccess: (signature) => {
      transactionToast(signature);
      return accounts.refetch();
    },
    onError: () => toast.error('Failed to initialize account'),
  });

  return {
    program,
    programId,
    accounts,
    getProgramAccount,
    initialize,
  };
}

export function useOrbisProgramAccount({ account }: { account: PublicKey }) {
  const { cluster } = useCluster();
  const transactionToast = useTransactionToast();
  const { program, accounts } = useOrbisProgram();

  const accountQuery = useQuery({
    queryKey: ['orbis', 'fetch', { cluster, account }],
    queryFn: () => program.account.orbis.fetch(account),
  });

  const closeMutation = useMutation({
    mutationKey: ['orbis', 'close', { cluster, account }],
    mutationFn: () =>
      program.methods.close().accounts({ orbis: account }).rpc(),
    onSuccess: (tx) => {
      transactionToast(tx);
      return accounts.refetch();
    },
  });

  const decrementMutation = useMutation({
    mutationKey: ['orbis', 'decrement', { cluster, account }],
    mutationFn: () =>
      program.methods.decrement().accounts({ orbis: account }).rpc(),
    onSuccess: (tx) => {
      transactionToast(tx);
      return accountQuery.refetch();
    },
  });

  const incrementMutation = useMutation({
    mutationKey: ['orbis', 'increment', { cluster, account }],
    mutationFn: () =>
      program.methods.increment().accounts({ orbis: account }).rpc(),
    onSuccess: (tx) => {
      transactionToast(tx);
      return accountQuery.refetch();
    },
  });

  const setMutation = useMutation({
    mutationKey: ['orbis', 'set', { cluster, account }],
    mutationFn: (value: number) =>
      program.methods.set(value).accounts({ orbis: account }).rpc(),
    onSuccess: (tx) => {
      transactionToast(tx);
      return accountQuery.refetch();
    },
  });

  return {
    accountQuery,
    closeMutation,
    decrementMutation,
    incrementMutation,
    setMutation,
  };
}
