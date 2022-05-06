pragma solidity ^0.5.0; ///compiler version

contract Roulette {
  address public contractOwner;
  uint256 public pool;
  uint256 public numberOfBets;
  uint256 public maxPlayers = 5;
  address[] public players;

  struct Player {
    uint256 amountBet;
    uint256 numberSelected;
  }

  mapping (address => Player) public playerInfo;

  function() external payable {} 

  constructor() public {                // constructor
    contractOwner = msg.sender;
  }

  function kill() public {              // kill contract
    if(msg.sender == contractOwner) selfdestruct(address(uint160(contractOwner)));
  }

  function checkPlayerExists(address _playerAddress) public view returns(bool) {        // check if player exists
    for(uint256 i = 0; i < players.length; i++) {
      if(players[i] == _playerAddress) return true;
    }
    return false;
  }

  function resetData() internal {                                                       // reset data
     players.length = 0; 
     pool = 0;
     numberOfBets = 0;
  }



  function givePrize(uint256 _winnerNumber) internal {                                  // give prize to winner
    address[5] memory winnerPlayers; //temporary array created in memory with fixed size
    uint256 count = 0;
    for(uint256 i = 0; i < players.length; i++) {
      address playerAddress = players[i];
      if(playerInfo[playerAddress].numberSelected == _winnerNumber) {
        winnerPlayers[count] = playerAddress;
        count++;
      }
      delete playerInfo[playerAddress];                                             // delete player info   
    }
    players.length = 0; //deletes the players in the array
    if(count > 0){
      uint256 winnerEtherAmount = pool/count;
      for(uint256 i = 0; i < count; i++) {
        address payable payTo = address(uint160(winnerPlayers[i]));
        if(payTo != address(0)) { //checking that address is not empty due to error
          payTo.transfer(winnerEtherAmount);
        }
      }
      resetData();
    }else{
      resetData();
    }
  }

  function createWinnerNumber() internal {                           // create winner number
    uint256 winnerNumber = (block.number+now)%10 + 1;
    givePrize(uint256(winnerNumber));
  }


  //betting function for number from 1 to 10
  function bet(uint256 _numberSelected) public payable {            // bet function
    require(!checkPlayerExists(msg.sender));                        //checks whether msg.sender exists in players array
    require(_numberSelected >= 1 && _numberSelected <= 10);
    playerInfo[msg.sender].amountBet = msg.value;
    playerInfo[msg.sender].numberSelected = _numberSelected;
    numberOfBets++;
    players.push(msg.sender);
    pool += msg.value;
    if (numberOfBets >= maxPlayers) createWinnerNumber();
  }
}