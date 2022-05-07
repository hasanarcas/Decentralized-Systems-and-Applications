pragma solidity ^0.8.13;

contract Slot {
    uint256 public contractBalance;
    uint256 public currentRandom;

    function start() public payable {
        uint256 userBalance = msg.value;
        require(userBalance > 0);
        uint256 randomValue = random();
        contractBalance = address(this).balance;
        currentRandom = randomValue;
        if(randomValue >= 67)
        {    
            uint256 winBalance = userBalance * 3;
            if(contractBalance < winBalance){
                winBalance = contractBalance;
            }
            payable(msg.sender).transfer(winBalance); 
            contractBalance = address(this).balance;        
        }
    }
    
    function random() public view returns (uint256) {
        return uint(keccak256(abi.encodePacked(block.difficulty, block.timestamp))) % 100 + 1;
    }
}