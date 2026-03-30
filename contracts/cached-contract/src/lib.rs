#![cfg_attr(not(feature = "std"), no_std)]
extern crate alloc;

use stylus_sdk::{
    prelude::*,
    alloy_primitives::{Address, U256},
    msg,
};

/// Simple NFT with total supply caching pattern
sol_storage! {
    #[entrypoint]
    pub struct CachedNFT {
        /// Map of token ID to owner
        mapping(uint256 => address) owners;
        /// Map of owner to balance
        mapping(address => uint256) balances;
        /// Cached total supply - updated on mint/burn
        uint256 total_supply;
    }
}

#[public]
impl CachedNFT {
    /// Returns the total supply from the cached storage slot
    pub fn total_supply(&self) -> U256 {
        self.total_supply.get()
    }

    /// Optimized mint that updates the cached total supply
    pub fn mint(&mut self, to: Address) -> Result<(), Vec<u8>> {
        let id = self.total_supply.get();
        
        // Update storage
        self.owners.setter(id).set(to);
        
        let mut balance = self.balances.setter(to);
        let new_balance = balance.get() + U256::from(1);
        balance.set(new_balance);
        
        // Increment cached total supply
        self.total_supply.set(id + U256::from(1));
        
        Ok(())
    }

    /// Check owner of a token
    pub fn owner_of(&self, id: U256) -> Address {
        self.owners.get(id)
    }

    /// Check balance of an owner
    pub fn balance_of(&self, owner: Address) -> U256 {
        self.balances.get(owner)
    }
}
