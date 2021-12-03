//SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import 'hardhat/console.sol';
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract KeeyToken is ERC20, Ownable {
    constructor() ERC20 ("Keey","KEY"){
        _mint(msg.sender, 2500 * (10** decimals()));
    }

    function mint(address to, uint256 amount) public onlyOwner {
        _mint(to, amount);
    }
} 