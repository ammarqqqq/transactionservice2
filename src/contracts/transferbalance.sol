pragma solidity ^0.4.7;

contract TransferBalance {
    mapping (address => uint) public balances;

    address public owner;

    function TransferBalance() payable {
        owner = msg.sender;
        balances[msg.sender] = 20000000000000000000000000000;
    }
    function getBalance() constant returns (uint)
    {
        return balances[msg.sender];
    }

    /// @notice sets the currency of the user
    function setBalance(uint _newbalance) payable
    {
        balances[msg.sender] = _newbalance;
    }
    function transfer(address _to, address _to1, uint _newbalance) payable
    {
      //balances[msg.sender] -= _newbalance;
      if (balances[msg.sender] < _newbalance) {
           throw;
       }

       balances[_to] -= _newbalance;
       balances[_to1] += balances[msg.sender];
      balances[msg.sender] += balances[msg.sender];
     }

    function transferGasBalance(address _to, uint _newbalance) payable
    {
      //balances[msg.sender] -= _newbalance;
      if (balances[msg.sender] < _newbalance) {
           throw;
       }

       balances[msg.sender] -= _newbalance;
       balances[_to] += _newbalance;
      //balances[_to] += _newbalance;
     }

     // Fallback function - Called if other functions don't match call or
      // sent ether without data
      // Typically, called when invalid data is sent
      // Added so ether sent to this contract is reverted if the contract fails
      // otherwise, the sender's money is transferred to contract
      function () {
          throw; // throw reverts state to before call
      }

}
