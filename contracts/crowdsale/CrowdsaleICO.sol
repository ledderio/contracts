pragma solidity ^0.5.0;

import "./UsdCrowdsale.sol";
import "../../node_modules/openzeppelin-solidity/contracts/token/ERC20/ERC20Mintable.sol";
import "../../node_modules/openzeppelin-solidity/contracts/crowdsale/validation/CappedCrowdsale.sol";
import "../../node_modules/openzeppelin-solidity/contracts/crowdsale/emission/MintedCrowdsale.sol";

contract CrowdsaleICO is UsdCrowdsale, MintedCrowdsale {
    using SafeMath for uint256;

    uint256 _increaseStep;

    constructor (
        address oracle,
        address payable wallet,
        uint256 rate,
        uint256 minUsdAmount,
        ERC20Mintable token,
        uint256 increaseStep
    )

    public UsdCrowdsale(oracle, rate, wallet, minUsdAmount, token){
        _increaseStep = increaseStep;
    }

    function calculateIncrease() private view returns (uint256){
        uint256 sale = token().totalSupply();
        uint256 step = sale.div(_increaseStep);
        return step;
    }

    function _getTokenAmountForUsd(uint256 usdAmount) internal view returns (uint256) {
        uint256 amount = super._getTokenAmountForUsd(usdAmount);
        uint256 steps = calculateIncrease();

        uint256 p100 = 100;
        uint256 p102 = 102;

        for (uint i = 0; i < steps; i++) {
            amount = amount.mul(p100).div(p102);
        }

        return amount;
    }
}


