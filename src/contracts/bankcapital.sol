pragma solidity ^0.4.0;

contract BankCapital { // CapWords
    // Declare state variables outside function, persist through life of contract

    // dictionary that maps addresses to balances
    // always be careful about overflow attacks with numbers
    mapping (address => uint) private mainBankCapitalAmounts;
    mapping (address => string) private debtDegrees;
    mapping (address => string) private currencies;
    mapping (address => uint) private balances; //related  to gas balance
    // "private" means that other contracts can't directly query balances
    // but data is still viewable to other parties on blockchain
  address public owner;
    // 'public' makes externally readable (not writeable) by users or contracts


    /// @notice Get currency
    /// @return The Currency  in which user is going to pay
    // 'constant' prevents function from editing state variables;
    // allows function to run locally/off blockchain
    function currency() constant returns (string) {
        return currencies[msg.sender];
    }

    /// @notice sets the currency of the user
    function setCurrency(string _newcurrency)
    {
        currencies[msg.sender] = _newcurrency;
     }
    // Constructor, can receive one or many variables here; only one allowed
    function BankCapital () payable{
        // msg provides details about the message that's sent to the contract
        // msg.sender is contract caller (address of contract creator)
        owner = msg.sender;
    }

    /// @notice Get the bank capital ammount
    /// @return The   in which user is going to pay
    // 'constant' prevents function from editing state variables;
    // allows function to run locally/off blockchain
    function CapitalAmount() constant returns (uint) {
        return mainBankCapitalAmounts[msg.sender];
    }

    /// @notice sets the currency of the user
    function setCapitalAmount(uint _newCapitalAmount)
    {
        mainBankCapitalAmounts[msg.sender] = _newCapitalAmount;
     }

  /// @notice Get balance
    /// @return The balance of the user
    // 'constant' prevents function from editing state variables;
    // allows function to run locally/off blockchain
    function balance() constant returns (uint) {
        return balances[msg.sender];
    }

    /// @notice Set balance
    /// @return   set the balance of the user
    function setBalance( uint _balance) {
         balances[msg.sender] = _balance;
        //mystructmap[_user] = TData({somedata: 11, amount: 42});
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
