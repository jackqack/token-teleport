const { expectRevert } = require('@openzeppelin/test-helpers');

const EthTelSafeERC20Mock = artifacts.require('contracts/mocks/EthTeleportAgentMocks.sol:SafeERC20Wrapper');
const EthTelERC20ReturnFalseMock = artifacts.require('contracts/mocks/EthTeleportAgentMocks.sol:ERC20ReturnFalseMock');
const EthTelERC20ReturnTrueMock = artifacts.require('contracts/mocks/EthTeleportAgentMocks.sol:ERC20ReturnTrueMock');
const EthTelERC20NoReturnMock = artifacts.require('contracts/mocks/EthTeleportAgentMocks.sol:ERC20NoReturnMock');

const BscTelSafeBEP20Mock = artifacts.require('contracts/mocks/BscTeleportAgentMocks.sol:SafeBEP20Wrapper');
const BscTelBEP20ReturnFalseMock = artifacts.require('contracts/mocks/BscTeleportAgentMocks.sol:BEP20ReturnFalseMock');
const BscTelBEP20ReturnTrueMock = artifacts.require('contracts/mocks/BscTeleportAgentMocks.sol:BEP20ReturnTrueMock');
const BscTelBEP20NoReturnMock = artifacts.require('contracts/mocks/BscTeleportAgentMocks.sol:BEP20NoReturnMock');

contract('EthTelSafeERC20Mock', function (accounts) {
  shouldBehaveLikeSafeERC20(EthTelSafeERC20Mock, EthTelERC20ReturnFalseMock, EthTelERC20ReturnTrueMock, EthTelERC20NoReturnMock, accounts);
});

contract('BscTelSafeBEP20Mock', function (accounts) {
  shouldBehaveLikeSafeERC20(BscTelSafeBEP20Mock, BscTelBEP20ReturnFalseMock, BscTelBEP20ReturnTrueMock, BscTelBEP20NoReturnMock, accounts);
});


function shouldBehaveLikeSafeERC20(artifact, ERC20ReturnFalseMock, ERC20ReturnTrueMock, ERC20NoReturnMock, accounts) {
  const [ hasNoCode ] = accounts;

  describe('with address that has no contract code', function () {
    beforeEach(async function () {
      this.wrapper = await artifact.new(hasNoCode);
    });

    shouldRevertOnAllCalls('Address: call to non-contract');
  });

  describe('with token that returns false on all calls', function () {
    beforeEach(async function () {
      this.wrapper = await artifact.new((await ERC20ReturnFalseMock.new()).address);
    });

    shouldRevertOnAllCalls('SafeERC20: ERC20 operation did not succeed');
  });

  describe('with token that returns true on all calls', function () {
    beforeEach(async function () {
      this.wrapper = await artifact.new((await ERC20ReturnTrueMock.new()).address);
    });

    shouldOnlyRevertOnErrors();
  });

  describe('with token that returns no boolean values', function () {
    beforeEach(async function () {
      this.wrapper = await artifact.new((await ERC20NoReturnMock.new()).address);
    });

    shouldOnlyRevertOnErrors();
  });
}

function shouldRevertOnAllCalls (reason) {
  it('reverts on transfer', async function () {
    await expectRevert(this.wrapper.transfer(), reason);
  });

  it('reverts on transferFrom', async function () {
    await expectRevert(this.wrapper.transferFrom(), reason);
  });

  // it('reverts on approve', async function () {
  //   await expectRevert(this.wrapper.approve(0), reason);
  // });

  // it('reverts on increaseAllowance', async function () {
  //   // [TODO] make sure it's reverting for the right reason
  //   await expectRevert.unspecified(this.wrapper.increaseAllowance(0));
  // });

  // it('reverts on decreaseAllowance', async function () {
  //   // [TODO] make sure it's reverting for the right reason
  //   await expectRevert.unspecified(this.wrapper.decreaseAllowance(0));
  // });
}

function shouldOnlyRevertOnErrors () {
  it('doesn\'t revert on transfer', async function () {
    await this.wrapper.transfer();
  });

  it('doesn\'t revert on transferFrom', async function () {
    await this.wrapper.transferFrom();
  });

  describe('approvals', function () {
    context('with zero allowance', function () {
      beforeEach(async function () {
        await this.wrapper.setAllowance(0);
      });

      // it('doesn\'t revert when approving a non-zero allowance', async function () {
      //   await this.wrapper.approve(100);
      // });
      //
      // it('doesn\'t revert when approving a zero allowance', async function () {
      //   await this.wrapper.approve(0);
      // });

      // it('doesn\'t revert when increasing the allowance', async function () {
      //   await this.wrapper.increaseAllowance(10);
      // });
      //
      // it('reverts when decreasing the allowance', async function () {
      //   await expectRevert(
      //     this.wrapper.decreaseAllowance(10),
      //     'SafeERC20: decreased allowance below zero',
      //   );
      // });
    });

    context('with non-zero allowance', function () {
      beforeEach(async function () {
        await this.wrapper.setAllowance(100);
      });

      // it('reverts when approving a non-zero allowance', async function () {
      //   await expectRevert(
      //     this.wrapper.approve(20),
      //     'SafeERC20: approve from non-zero to non-zero allowance',
      //   );
      // });
      //
      // it('doesn\'t revert when approving a zero allowance', async function () {
      //   await this.wrapper.approve(0);
      // });

      // it('doesn\'t revert when increasing the allowance', async function () {
      //   await this.wrapper.increaseAllowance(10);
      // });
      //
      // it('doesn\'t revert when decreasing the allowance to a positive value', async function () {
      //   await this.wrapper.decreaseAllowance(50);
      // });
      //
      // it('reverts when decreasing the allowance to a negative value', async function () {
      //   await expectRevert(
      //     this.wrapper.decreaseAllowance(200),
      //     'SafeERC20: decreased allowance below zero',
      //   );
      // });
    });
  });
}
