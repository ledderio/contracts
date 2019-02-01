pragma solidity ^0.5.0;
import "./oracle/AbstractCurrencyOracle.sol";
import "./oracle/OracleUSDETH.sol";
import "./tokens/LedderPreToken.sol";
import "./tokens/LedderSharesToken.sol";
import "./crowdsale/CrowdsaleICO.sol";
import "./crowdsale/CrowdsaleSTO.sol";
import "./crowdsale/ConfigSTO.sol";
import "./crowdsale/ConfigICO.sol";

contract Init is Ownable{
    function deploy() public onlyOwner {
        AbstractCurrencyOracle oracle = new OracleUSDETH();
        oracle.setRate(100000);

        address oracleAddrss = address(oracle);
        address payable icoWalletAddress = 0;//todo need insert real address
        address payable stoWalletAddress = 0;//todo need insert real address

        ConfigICO icoConf = new ConfigICO(
            oracleAddrss,
            icoWalletAddress
        );

        ConfigSTO stoConf = new ConfigSTO(
            oracleAddrss,
            stoWalletAddress
        );
    }
}
