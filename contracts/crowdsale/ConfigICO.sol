pragma solidity ^0.5.0;

import "../../node_modules/openzeppelin-solidity/contracts/ownership/Ownable.sol";
import "./CrowdsaleICO.sol";
import "../tokens/LedderPreToken.sol";


contract ConfigICO is Ownable {

    LedderPreToken public token;

    CrowdsaleICO public crowdsale;

    address _oracleAddress;
    address payable _walletAddress;

    constructor (address oracle, address payable wallet)public{
        _oracleAddress = oracle;
        _walletAddress = wallet;
    }

    function deploy() public onlyOwner {

        // 1 mil;
        uint256 increaseStep = 1000000000000000000000000;

        // $50
        uint256 minUsdAmount = 50000000000000000000000;

        // 10%
        uint256 firstThresholdDiscount = 10;

        // $500
        uint256 firstThresholdAmount = 500000000000000000000000;

        // 20%
        uint256 secondThresholdDiscount = 20;

        // $5000
        uint256 secondThresholdAmount = 5000000000000000000000000;

        // $0.01 = 1 token
        uint256 startRate = 10;

        //20 mil tokens
        uint256 tokenCount = 20000000000000000000000000;

        token = new LedderPreToken(tokenCount);

        crowdsale = new CrowdsaleICO(
            _oracleAddress,
            _walletAddress,
            startRate,
            minUsdAmount,
            token,
            increaseStep,
            firstThresholdAmount,
            secondThresholdAmount,
            firstThresholdDiscount,
            secondThresholdDiscount
        );

        token.addMinter(address(crowdsale));
        token.renounceMinter();

    }
}