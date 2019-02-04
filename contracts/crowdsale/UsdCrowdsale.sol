pragma solidity ^0.5.0;

import "../../node_modules/openzeppelin-solidity/contracts/crowdsale/Crowdsale.sol";
import "../../node_modules/openzeppelin-solidity/contracts/ownership/Ownable.sol";
import "../oracle/AbstractCurrencyOracle.sol";

contract UsdCrowdsale is Crowdsale, Ownable  {

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
        return  AbstractCurrencyOracle(_oracleAddress).getRate();
    }

    function _getTokenAmount(uint256 weiAmount) internal view returns (uint256) {
        uint256 usdAmount = weiAmount.mul(getCurrentRate());
        return _getTokenAmountForUsd(usdAmount);
    }

    function _getTokenAmountForUsd(uint256 usdAmount) internal view returns (uint256) {
        require(usdAmount >= _minUsdAmount);
        return usdAmount.div(_startRate);
    }

    function buyTokensForUsd(address beneficiary,uint256 usd) public onlyOwner payable {
        require(beneficiary != address(0));
        require(usd != 0);

        uint256 usdAmount=usd.mul(1000);
        uint256 tokens = _getTokenAmountForUsd(usdAmount);
        _processPurchase(beneficiary, tokens);
    }
}