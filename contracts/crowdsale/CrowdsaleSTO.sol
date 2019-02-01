pragma solidity ^0.5.0;

import "./FloatRateCrowdsale.sol";
import "../../node_modules/openzeppelin-solidity/contracts/crowdsale/validation/CappedCrowdsale.sol";
import "../../node_modules/openzeppelin-solidity/contracts/crowdsale/emission/MintedCrowdsale.sol";
import "../../node_modules/openzeppelin-solidity/contracts/ownership/Ownable.sol";

contract CrowdsaleSTO is FloatRateCrowdsale, MintedCrowdsale, Ownable {

    constructor (
        address oracle,
        address payable wallet,
        uint256 startRate,
        uint256 minUsdAmount,
        ERC20Mintable token
    )

    public FloatRateCrowdsale(oracle, startRate, wallet, minUsdAmount, token){}
}