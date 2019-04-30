const {BN, balance, ether, should, shouldFail, time} = require('openzeppelin-test-helpers');

const CrowdsaleICO = artifacts.require('CrowdsaleICO');
const UToken = artifacts.require('LedderUtilityToken');
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

contract('CrowdsaleICO', function ([_, deployer, owner, wallet, investor]) {

    const RATE = new BN(10);//Start token rate - $0.01
    const tokenCount = new BN('45000000000000000000000000');
    const increaseStep = new BN('1000000000000000000000000');
    const minUsdAmount = new BN('5000000000000000000000'); //$5

    beforeEach(async function () {
        this.token = await UToken.new(tokenCount, {from: deployer});
        this.oracle = await OracleUSDETH.new({from: deployer});
        this.crowdsale = await CrowdsaleICO.new(
            this.oracle.address,
            wallet,
            RATE,
            minUsdAmount,
            this.token.address,
            increaseStep,
            {from: owner}
        );

        await this.token.addMinter(this.crowdsale.address, {from: deployer});
        await this.token.renounceMinter({from: deployer});
        await this.oracle.setRate(new BN(100000), {from: deployer});//Oracle rate - $100
    });

    it('should create crowdsale with correct parameters', async function () {
        should.exist(this.token);
        should.exist(this.crowdsale);
        should.exist(this.oracle);
        (await this.crowdsale.wallet()).should.be.equal(wallet);
    });

    it('should reject payments by disadvantage cap', async function () {
        await buyTokenAndCheckBalance.call(this, investor, ether('0.05'), ether('500'));
        await shouldFail.reverting(this.crowdsale.buyTokens(investor, {value: ether('0.049'), from: investor}));
    });

    it('should accept payments during the sale', async function () {
        await buyTokenAndCheckBalance.call(this, investor, ether('0.05'), ether('500'));
    })

    it('should working purchase per USD', async function () {
        await shouldFail.reverting(this.crowdsale.buyTokensForUsd(investor, ether('4.9'), {from: owner}));
        await buyTokenAndCheckBalanceUsd.call(this, investor, owner, ether('5'), ether('500'));
        await buyTokenAndCheckBalanceUsd.call(this, investor, owner, ether('100.1'), ether('10510'));
        await buyTokenAndCheckBalanceUsd.call(this, investor, owner, ether('500'), ether('60510'));
        await shouldFail.reverting(this.crowdsale.buyTokensForUsd(investor, ether('100'), {from: investor}));
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

    it('the cost rises by 2% after the sale of each of the next million tokens', async function () {
        await buyTokenAndCheckBalance.call(this, investor, ether('100'), ether('1000000'));
        await buyTokenAndCheckBalance.call(this, investor, ether('102'), ether('2000000'));//2% rise
        await buyTokenAndCheckBalance.call(this, investor, ether('104.04'), ether('3000000'));//2%+2% rise
        await buyTokenAndCheckBalance.call(this, investor, ether('106.1208'), ether('4000000'));//2%+2%+2% rise
        await buyTokenAndCheckBalance.call(this, investor, ether('108.243216'), ether('5000000'));//2%+2%+2%+2% rise
        await buyTokenAndCheckBalance.call(this, investor, ether('110.40808032'), ether('6000000'));//2%+2%+2%+2%+2% rise
        await buyTokenAndCheckBalance.call(this, investor, ether('112.6162419264'), ether('7000000'));//2%+2%+2%+2%+2%+2% rise
        await buyTokenAndCheckBalance.call(this, investor, ether('114.868566764928'), ether('8000000'));//2%+2%+2%+2%+2%+2%+2% rise
    });

    it('the price is determined at the beginning of the transaction', async function () {
        await buyTokenAndCheckBalance.call(this, investor, ether('1000'), ether('10000000'));
        await buyTokenAndCheckBalance.call(this, investor, ether('1.21899441999476'), ether('10010000.000000000023542024'));//~21.9% rise
    });

    it('should reject payments over cap', async function () {
        await buyTokenAndCheckBalance.call(this, investor, ether('4499'), ether('44990000'));
        await shouldFail.reverting(this.crowdsale.buyTokens(investor, {value: ether('3'), from: investor}));
    });

});
