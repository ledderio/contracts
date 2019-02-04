pragma solidity ^0.5.0;

import "./UsdCrowdsale.sol";
import "../../node_modules/openzeppelin-solidity/contracts/crowdsale/validation/CappedCrowdsale.sol";
import "../../node_modules/openzeppelin-solidity/contracts/crowdsale/emission/MintedCrowdsale.sol";

contract CrowdsaleSTO is UsdCrowdsale, MintedCrowdsale {

    constructor (
        address oracle,
        address payable wallet,
        uint256 startRate,
        uint256 minUsdAmount,
        ERC20Mintable token
    )

    public UsdCrowdsale(oracle, startRate, wallet, minUsdAmount, token){}
}