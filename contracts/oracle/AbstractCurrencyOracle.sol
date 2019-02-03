pragma solidity ^0.5.0;

contract AbstractCurrencyOracle {
    function setRate(uint256 rate) public;

    function getRate() external view returns (uint256);
}
