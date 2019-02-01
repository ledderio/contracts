pragma solidity ^0.5.0;

import "../../node_modules/openzeppelin-solidity/contracts/ownership/Ownable.sol";
import "../tokens/LedderSharesToken.sol";
import "./CrowdsaleSTO.sol";

contract ConfigSTO is Ownable {

    LedderSharesToken public token;

    CrowdsaleSTO public crowdsale;

    address _oracleAddress;
    address payable _walletAddress;

    constructor (address oracle, address payable wallet)public{
        _oracleAddress = oracle;
        _walletAddress = wallet;
    }

    function deploy() public onlyOwner {

        // $5000
        uint256 minUsdAmount = 5000000000000000000000000;

        // $40 = 1 token
        uint256 rate = 40000;

        // 5000 tokens
        uint256 tokenCount = 5000000000000000000000;

        token = new LedderSharesToken(tokenCount);

        crowdsale = new CrowdsaleSTO(
            _oracleAddress,
                _walletAddress,
            rate,
            minUsdAmount,
            token
        );

        token.addMinter(address(crowdsale));
        token.renounceMinter();
    }
}