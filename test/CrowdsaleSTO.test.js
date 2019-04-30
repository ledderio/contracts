const {BN, balance, ether, should, shouldFail, time} = require('openzeppelin-test-helpers');

const CrowdsaleSTO = artifacts.require('CrowdsaleSTO');
const SToken = artifacts.require('LedderSecurityToken');
const OracleUSDETH = artifacts.require('OracleUSDETH');

async function buyTokenAndCheckBalance(investor, investmentAmount, expectedTokenAmount) {
    await this.crowdsale.buyTokens(investor, {value: investmentAmount, from: investor});
    (await this.token.balanceOf(investor)).should.be.bignumber.equal(expectedTokenAmount);
    (await this.token.totalSupply()).should.be.bignumber.equal(expectedTokenAmount);
}

async function buyTokenAndCheckBalanceUsd(investor, owner, investmentAmount, expectedTokenAmount) {
    await this.crowdsale.buyTokensForUsd(investor, investmentAmount, {from: owner});
    (await this.token.balanceOf(investor)).should.be.bignumber.equal(expectedTokenAmount);
    (await this.token.totalSupply()).should.be.bignumber.equal(expectedTokenAmount);
}

contract('CrowdsaleSTO', function ([_, deployer, owner, wallet, investor]) {

    const RATE = new BN(40000);//Rate - $40
    const TOKENS = new BN('5000000000000000000000');//5000
    const minUsdAmount = new BN('5000000000000000000000'); //$5

    beforeEach(async function () {
        this.token = await SToken.new(TOKENS, {from: deployer});
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

    it('should sending token', async function () {
        var amount = new BN(1000);
        var expectedTokenAmount = new BN(2000);
        await this.crowdsale.sendDirectTokens(investor, amount, {from: owner});
        await this.crowdsale.sendDirectTokens(investor, amount, {from: owner});
        (await this.token.balanceOf(investor)).should.be.bignumber.equal(expectedTokenAmount);
        (await this.token.totalSupply()).should.be.bignumber.equal(expectedTokenAmount);
        await shouldFail.reverting(this.crowdsale.sendDirectTokens(owner, amount, {from: investor}));
    });

    it('should reject payments by disadvantage cap', async function () {
        await shouldFail.reverting(this.crowdsale.buyTokens(investor, {value: ether('0.0445'), from: investor}));
    });

    it('should accept payments during the sale', async function () {
        await buyTokenAndCheckBalance.call(this, investor, ether('0.046'), ether('0.1265'));
    });

    it('should reject payments over cap', async function () {
        await buyTokenAndCheckBalance.call(this, investor, ether('1818'), ether('4999.5'));
        await shouldFail.reverting(this.crowdsale.buyTokens(investor, {value: ether('0.2'), from: investor}));
    });

    it('should working purchase per USD', async function () {
        await shouldFail.reverting(this.crowdsale.buyTokensForUsd(investor, ether('4.999'), {from: owner}));
        await buyTokenAndCheckBalanceUsd.call(this, investor, owner, ether('5.0'), ether('0.125'));
    });

});
