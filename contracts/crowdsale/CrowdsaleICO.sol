pragma solidity ^0.5.0;

import "./UsdCrowdsale.sol";
import "../../node_modules/openzeppelin-solidity/contracts/token/ERC20/ERC20Mintable.sol";
import "../../node_modules/openzeppelin-solidity/contracts/crowdsale/validation/CappedCrowdsale.sol";
import "../../node_modules/openzeppelin-solidity/contracts/crowdsale/emission/MintedCrowdsale.sol";

contract CrowdsaleICO is UsdCrowdsale, MintedCrowdsale{

    uint256 _increaseStep;
    uint256 _firstThresholdAmount;
    uint256 _secondThresholdAmount;
    uint _firstThresholdDiscount;
    uint _secondThresholdDiscount;

    constructor (
        address oracle,
        address payable wallet,
        uint256 rate,
        uint256 minUsdAmount,
        ERC20Mintable token,
        uint256 increaseStep,
        uint256 firstThresholdAmount,
        uint256 secondThresholdAmount,
        uint256 firstThresholdDiscount,
        uint256 secondThresholdDiscount
    )

    public UsdCrowdsale(oracle, rate, wallet, minUsdAmount, token){
        _increaseStep = increaseStep;
        _firstThresholdAmount = firstThresholdAmount;
        _secondThresholdAmount = secondThresholdAmount;
        _firstThresholdDiscount = firstThresholdDiscount;
        _secondThresholdDiscount = secondThresholdDiscount;
    }

    function calculateIncrease() private view returns (uint256){
        uint256 sale = token().totalSupply();
        uint256 step = sale / _increaseStep;
        return step;
    }

    function calculateDiscount(uint256 usdAmount) private view returns (uint256){
        if (usdAmount > _secondThresholdAmount)
            return _secondThresholdDiscount;
        if (usdAmount > _firstThresholdAmount)
            return _firstThresholdDiscount;
        return 0;
    }

    function _getTokenAmountForUsd(uint256 usdAmount) internal view returns (uint256) {
        uint256 amount = super._getTokenAmountForUsd(usdAmount);
        uint256 increase = calculateIncrease();
        uint256 discount = calculateDiscount(usdAmount);

        uint256 maxPercent = 100;
        uint256 increaseAmount = amount.mul(maxPercent).div(increase + maxPercent);
        uint256 discountAmount = increaseAmount.mul(maxPercent + discount).div(maxPercent);
        return discountAmount;
    }

}