pragma solidity ^0.5.0;

import "./AbstractCurrencyOracle.sol";
import "../../node_modules/openzeppelin-solidity/contracts/ownership/Ownable.sol";

contract OracleUSDETH is AbstractCurrencyOracle, Ownable {

    uint private _current_rate;

    function setRate(uint256 rate) public onlyOwner {
        _current_rate = rate;
    }

    function getRate() public view returns (uint256) {
        return _current_rate;
    }

}
