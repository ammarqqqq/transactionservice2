pragma solidity ^0.4.17;

contract AccountSetup { // CapWords
    // Declare state variables outside function, persist through life of contract
    // dictionary that maps addresses to amounts and currencies
    // always be careful about overflow attacks with numbers
    //mapping (address => uint) public amounts;
    mapping (address => uint) public fromdecimalamounts;
    mapping (address => uint) public fromdecimalfractions;
    mapping (address => uint) public todecimalamounts;
    mapping (address => uint) public todecimalfractions;
    mapping (address => string) public currencies;
    // "public " means that other contracts can directly query balances
    //  "private means other contracts can directly query balances but data is still viewable to other parties on blockchain
  address public owner;
    // 'public' makes externally readable (not writeable) by users or contracts

     // Constructor, can receive one or many variables here; only one allowed
    function AccountSetup() payable{
        // msg provides details about the message that's sent to the contract
        // msg.sender is contract caller (address of contract creator)
        owner = msg.sender;
        //amounts[msg.sender] = 50000;
        fromdecimalamounts[msg.sender] = 50000;
        fromdecimalfractions[msg.sender] = 0;
        todecimalamounts[msg.sender] = 50000;
        todecimalfractions[msg.sender] = 0;
    }

    /// @notice Get currency
    /// @return The Currency  in which user is going to pay
    // 'constant' prevents function from editing state variables;
    // allows function to run locally/off blockchain
    function getCurrency() constant returns (string) {
        return currencies[msg.sender];
    }

    /// @notice sets the currency of the user
    function setCurrency(string _newcurrency)
    {
        currencies[msg.sender] = _newcurrency;
     }
    

    /// @notice Get fraction
    /// @return The fraction amount   which user is going to pay
    function getFromDecimalAmount() constant returns (uint)  {
        return fromdecimalamounts[msg.sender];
    }
    /// @notice sets the amount of the user
    function setFromDecimalAmount(uint _newfromdecimalamount) payable
    {
        fromdecimalamounts[msg.sender] = _newfromdecimalamount;
   }
   /// @notice Get fraction
   /// @return The fraction amount   which user is going to pay
   function getFromDecimalFraction() constant returns (uint)  {
     return fromdecimalfractions[msg.sender];
   }
   /// @notice sets the amount of the user
   function setFromDecimalFraction(uint _newfromdecimalfraction) payable
   {
        fromdecimalfractions[msg.sender] = _newfromdecimalfraction;
  }

  /// @notice Get fraction
  /// @return The fraction amount   which user is going to pay
  function getToDecimalAmount() constant returns (uint)  {
      return todecimalamounts[msg.sender];
  }
  /// @notice Get fraction
  /// @return The fraction amount   which user is going to pay
  function getToDecimalFraction() constant returns (uint)  {
    return todecimalfractions[msg.sender];
  }
  /// @notice sets the amount of the user
  function setToDecimalAmount(uint _newtodecimalamount) payable
  {
      todecimalamounts[msg.sender] = _newtodecimalamount;
 }
 /// @notice sets the amount of the user
 function setToDecimalFraction(uint _newtodecimalfraction) payable
 {
      todecimalfractions[msg.sender] = _newtodecimalfraction;
}
function transferAmountWithDecimals(address _from, address _to, uint _newfromdecimalamount,uint _newfromdecimalfraction, uint _newtodecimalamount,uint _newtodecimalfraction) public returns (uint from,uint fromFraction,uint to, uint toFraction) {
  if (fromdecimalamounts[msg.sender] < 0) {
      throw;
  }
  if(fromdecimalamounts[_from] <= 0){
      fromdecimalamounts[_from]= fromdecimalamounts[msg.sender];
      fromdecimalfractions[_from]= fromdecimalfractions[msg.sender];
   }
   else{
     fromdecimalamounts[_from] = _newfromdecimalamount;
     fromdecimalfractions[_from]= _newfromdecimalfraction;
   }

   if (todecimalamounts[_to] <= 0){
     todecimalamounts[_to]=todecimalamounts[msg.sender];
     todecimalfractions[_to]=todecimalfractions[msg.sender];
   }
   else{
     todecimalamounts[_to] = _newtodecimalamount;
     todecimalfractions[_to]= _newtodecimalfraction;
    }
   from= fromdecimalamounts[_from];
   fromFraction= fromdecimalfractions[_from];
   to= todecimalamounts[_to];
   toFraction= todecimalfractions[_to];
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
