pragma solidity ^0.5.0;

import "../../node_modules/openzeppelin-solidity/contracts/token/ERC20/ERC20Detailed.sol";
import "../../node_modules/openzeppelin-solidity/contracts/token/ERC20/ERC20Burnable.sol";
import "../../node_modules/openzeppelin-solidity/contracts/token/ERC20/ERC20Pausable.sol";
import "../../node_modules/openzeppelin-solidity/contracts/token/ERC20/ERC20Capped.sol";
import "../../node_modules/openzeppelin-solidity/contracts/token/ERC20/ERC20.sol";

contract LedderPreToken is ERC20Detailed, ERC20Capped {

    constructor (uint256 tokenCount) public
    ERC20Detailed("Ledder Pre Token", "LPT", 18)
    ERC20Capped(tokenCount)
    {}

}