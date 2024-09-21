#![allow(clippy::result_large_err)]

use anchor_lang::prelude::*;

declare_id!("2HHNuLeVEqk1J2MEzbyNcvHDR9vBqNHVeHRVgFeZADTn");

#[program]
pub mod orbis {
    use super::*;

  pub fn close(_ctx: Context<CloseOrbis>) -> Result<()> {
    Ok(())
  }

  pub fn decrement(ctx: Context<Update>) -> Result<()> {
    ctx.accounts.orbis.count = ctx.accounts.orbis.count.checked_sub(1).unwrap();
    Ok(())
  }

  pub fn increment(ctx: Context<Update>) -> Result<()> {
    ctx.accounts.orbis.count = ctx.accounts.orbis.count.checked_add(1).unwrap();
    Ok(())
  }

  pub fn initialize(_ctx: Context<InitializeOrbis>) -> Result<()> {
    Ok(())
  }

  pub fn set(ctx: Context<Update>, value: u8) -> Result<()> {
    ctx.accounts.orbis.count = value.clone();
    Ok(())
  }
}

#[derive(Accounts)]
pub struct InitializeOrbis<'info> {
  #[account(mut)]
  pub payer: Signer<'info>,

  #[account(
  init,
  space = 8 + Orbis::INIT_SPACE,
  payer = payer
  )]
  pub orbis: Account<'info, Orbis>,
  pub system_program: Program<'info, System>,
}
#[derive(Accounts)]
pub struct CloseOrbis<'info> {
  #[account(mut)]
  pub payer: Signer<'info>,

  #[account(
  mut,
  close = payer, // close account and return lamports to payer
  )]
  pub orbis: Account<'info, Orbis>,
}

#[derive(Accounts)]
pub struct Update<'info> {
  #[account(mut)]
  pub orbis: Account<'info, Orbis>,
}

#[account]
#[derive(InitSpace)]
pub struct Orbis {
  count: u8,
}
