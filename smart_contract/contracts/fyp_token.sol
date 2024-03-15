// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

import "@openzeppelin/contracts/access/Ownable.sol";

// // can use console.log() to display output for debug use
import "hardhat/console.sol";

contract FypToken is ERC721URIStorage, Ownable {
    using Counters for Counters.Counter;
    using Strings for uint256;
    Counters.Counter private _tokenIds;
    mapping(uint256 => uint256) private _terminated;
    mapping(uint256 => address) private _company_address;
    mapping(uint256 => bool) private disable;

    event return_uint256(uint256 value);

    constructor() ERC721("FypToken", "FypToken") {}

    function isSigned(
        string memory message, 
        address _address_1, uint8 v_1, bytes32 r_1, bytes32 s_1,
        address _address_2, uint8 v_2, bytes32 r_2, bytes32 s_2) public pure returns (bool) {
        string memory header = "\x19Ethereum Signed Message:\n";
        string memory length = Strings.toString(bytes(message).length);

        bytes32 check = keccak256(abi.encodePacked(header, length, message));

        return ecrecover(check, v_1, r_1, s_1) == _address_1 && ecrecover(check, v_2, r_2, s_2) == _address_2;
    }

    function mint(string memory message, 
        address _employer, uint8 v_1, bytes32 r_1, bytes32 s_1,
        address _candidate, uint8 v_2, bytes32 r_2, bytes32 s_2) public{
        if (isSigned(message, _employer ,v_1, r_1, s_1, _candidate, v_2, r_2, s_2)){
            _tokenIds.increment();
            uint256 newItemId = _tokenIds.current();
            disable[newItemId] = false;
            _mint(_candidate, newItemId);
            _setTokenURI(newItemId, message);
            _terminated[newItemId] = 0;
            _company_address[newItemId] = _employer;
            disable[newItemId] = true;
            // return newItemId;
            emit return_uint256(newItemId);
        }
        else{
            // return 0;
            emit return_uint256(0);
        }
    }

    function terminate_time(uint256 token_id) public view returns (uint256){
        return _terminated[token_id];
    }

    function company_address(uint256 token_id) public view returns (address){
        return _company_address[token_id];
    }

    function terminate(uint256 token_id, uint8 v_1, bytes32 r_1, bytes32 s_1) public{
        uint256 timestamp = block.timestamp;
        string memory message = string(abi.encodePacked(Strings.toString(token_id)));
        string memory header = "\x19Ethereum Signed Message:\n";
        string memory length = Strings.toString(bytes(message).length);
        bytes32 check = keccak256(abi.encodePacked(header, length, message));

        if (_exists(token_id) && _terminated[token_id]==0 && (ecrecover(check, v_1, r_1, s_1) == company_address(token_id)|| ecrecover(check, v_1, r_1, s_1) == ownerOf(token_id))){
            _terminated[token_id] = timestamp;
            emit return_uint256(timestamp);
        }
        emit return_uint256(0);
    }
    
    function _beforeTokenTransfer(address, address, uint256 id, uint256) internal view override{
        require(!disable[id], "Cannot transfer - currently locked");
    }
}