pragma solidity ^0.5.0;

import "../../node_modules/openzeppelin-solidity/contracts/token/ERC20/ERC20Detailed.sol";
import "../../node_modules/openzeppelin-solidity/contracts/token/ERC20/ERC20Burnable.sol";
import "../../node_modules/openzeppelin-solidity/contracts/token/ERC20/ERC20Mintable.sol";
import "../../node_modules/openzeppelin-solidity/contracts/token/ERC20/ERC20Capped.sol";
import "../../node_modules/openzeppelin-solidity/contracts/ownership/Ownable.sol";

contract LedderSharesToken is ERC20Detailed, ERC20Capped, ERC20Burnable, Ownable {

    constructor (uint256 tokenCount) public
    ERC20Detailed("Ledder Shares Token", "LST", 18)
    ERC20Capped(tokenCount) // 5000 tokens
    {}
}