pragma solidity ^0.5.0;

import "../../node_modules/openzeppelin-solidity/contracts/token/ERC20/ERC20Detailed.sol";
import "../../node_modules/openzeppelin-solidity/contracts/token/ERC20/ERC20Burnable.sol";
import "../../node_modules/openzeppelin-solidity/contracts/token/ERC20/ERC20Mintable.sol";
import "../../node_modules/openzeppelin-solidity/contracts/token/ERC20/ERC20Capped.sol";

contract LedderSharesToken is ERC20Detailed, ERC20Capped {

    constructor (uint256 tokenCount) public
    ERC20Detailed("Ledder Shares Token", "LEDST", 18)
    ERC20Capped(tokenCount)
    {}

}