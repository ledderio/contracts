const {BN, balance, ether, should, shouldFail, time} = require('openzeppelin-test-helpers');

const CrowdsaleSTO = artifacts.require('CrowdsaleSTO');
const SharesToken = artifacts.require('LedderSharesToken');
const OracleUSDETH = artifacts.require('OracleUSDETH');

async function buyTokenAndCheckBalance(investor, investmentAmount, expectedTokenAmount) {
    await this.crowdsale.buyTokens(investor, {value: investmentAmount, from: investor});
    (await this.token.balanceOf(investor)).should.be.bignumber.equal(expectedTokenAmount);
    (await this.token.totalSupply()).should.be.bignumber.equal(expectedTokenAmount);
}

async function buyTokenAndCheckBalanceUsd(investor, owner, investmentAmount, expectedTokenAmount) {
    await this.crowdsale.buyTokensForUsd(investor,investmentAmount, {from: owner});
    (await this.token.balanceOf(investor)).should.be.bignumber.equal(expectedTokenAmount);
    (await this.token.totalSupply()).should.be.bignumber.equal(expectedTokenAmount);
}

contract('CrowdsaleSTO', function ([_, deployer, owner, wallet, investor]) {

    const RATE = new BN(40000);//Rate - $40
    const TOKENS = new BN('5000000000000000000000');//5000
    const minUsdAmount = new BN('5000000000000000000000000'); //$5000

    beforeEach(async function () {
        this.token = await SharesToken.new(TOKENS, {from: deployer});
        this.oracle = await OracleUSDETH.new({from: deployer});
        this.crowdsale = await CrowdsaleSTO.new(
            this.oracle.address,
            wallet,
            RATE,
            minUsdAmount,
            this.token.address,
            {from: owner}
        );

        await this.token.addMinter(this.crowdsale.address, {from: deployer});
        await this.token.renounceMinter({from: deployer});
        await this.oracle.setRate(new BN(110000), {from: deployer}); //Oracle rate - $110
    });

    it('should create crowdsale with correct parameters', async function () {
        should.exist(this.token);
        should.exist(this.crowdsale);
        should.exist(this.oracle);
        (await this.crowdsale.wallet()).should.be.equal(wallet);
    });

    it('should reject payments by disadvantage cap', async function () {
        await shouldFail.reverting(this.crowdsale.buyTokens(investor, {value: ether('45'), from: investor}));
    });

    it('should accept payments during the sale', async function () {
        await buyTokenAndCheckBalance.call(this, investor, ether('46'), ether('126.5'));
    });

    it('should reject payments over cap', async function () {
        await buyTokenAndCheckBalance.call(this, investor, ether('1765'), ether('4853.75'));
        await shouldFail.reverting(this.crowdsale.buyTokens(investor, {value: ether('54'), from: investor}));
    });

    it('should working purchase per USD', async function () {
        await shouldFail.reverting(this.crowdsale.buyTokensForUsd(investor,ether('4999'), {from: owner}));
        await buyTokenAndCheckBalanceUsd.call(this, investor, owner, ether('5000'), ether('125'));
    });

});
