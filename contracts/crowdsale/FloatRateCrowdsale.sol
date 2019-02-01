pragma solidity ^0.5.0;

import "../../node_modules/openzeppelin-solidity/contracts/crowdsale/Crowdsale.sol";
import "../oracle/AbstractCurrencyOracle.sol";

contract FloatRateCrowdsale is Crowdsale {

    address _oracleAddress;
    uint256 _startRate;
    uint _minUsdAmount;

    constructor (address oracleAddress, uint256 startRate, address payable wallet, uint minUsdAmount, IERC20 token)
    public  Crowdsale(startRate, wallet, token){
        _oracleAddress = oracleAddress;
        _startRate = startRate;
        _minUsdAmount = minUsdAmount;
    }

    function rate() public view returns (uint256) {
        revert();
    }

    function getCurrentRate() public view returns (uint256) {
        AbstractCurrencyOracle oracle = AbstractCurrencyOracle(_oracleAddress);
        return oracle.getRate();
    }

    function _getTokenAmount(uint256 weiAmount) internal view returns (uint256) {
        uint usdAmount = weiAmount.mul(getCurrentRate());
        require(usdAmount >= _minUsdAmount);
        return usdAmount.div(_startRate);
    }

}