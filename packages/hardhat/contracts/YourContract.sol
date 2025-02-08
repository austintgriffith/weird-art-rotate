//SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

/*
__        __   _         _      _         _     ____       _        _         _____ _     _                   
 \ \      / /__(_)_ __ __| |    / \   _ __| |_  |  _ \ ___ | |_ __ _| |_ ___  |_   _| |__ (_)_ __   __ _ _   _ 
  \ \ /\ / / _ \ | '__/ _` |   / _ \ | '__| __| | |_) / _ \| __/ _` | __/ _ \   | | | '_ \| | '_ \ / _` | | | |
   \ V  V /  __/ | | | (_| |  / ___ \| |  | |_  |  _ < (_) | || (_| | ||  __/   | | | | | | | | | | (_| | |_| |
    \_/\_/ \___|_|_|  \__,_| /_/   \_\_|   \__| |_| \_\___/ \__\__,_|\__\___|   |_| |_| |_|_|_| |_|\__, |\__, |
                                                                                                   |___/ |___/ 
                                                                                                   */

// Useful for debugging. Remove when deploying to a live network.
import "hardhat/console.sol";

// Use openzeppelin to inherit battle-tested implementations (ERC20, ERC721, etc)
import "@openzeppelin/contracts/access/Ownable.sol";

interface IWETH {
    function deposit() external payable;
    function transfer(address to, uint value) external returns (bool);
}

/**
 * A smart contract that allows changing a state variable of the contract and tracking the changes
 * It also allows the owner to withdraw the Ether in the contract
 * @author BuidlGuidl
 */
contract YourContract {
    event Buy(address indexed buyer, uint256 amount);

    string public name = "Optimistic Onchain Explorer";

    uint256 public price = 0.001 ether;

    address public owner = 0x34aA3F359A9D614239015126635CE7732c18fDF3;

    address public previous = 0x34aA3F359A9D614239015126635CE7732c18fDF3;

    address public previousPrevious = 0x34aA3F359A9D614239015126635CE7732c18fDF3;

    address public previousPreviousPrevious = 0x34aA3F359A9D614239015126635CE7732c18fDF3;

    address public constant weth = 0x4200000000000000000000000000000000000006;

    function sendNoMatterWhat(address to, uint256 amount) internal {
        (bool success, ) = to.call{value: amount}("");
        if(!success){
            IWETH(weth).deposit{value: amount}();
            IWETH(weth).transfer(to, amount);
        }
    }

    function buy() public payable {
        require(msg.value >= price, "Insufficient funds");

        uint256 amount = msg.value;

        price = price * 1033 / 1000;

        uint256 feeToPrevious = amount * 10 / 100;
        uint256 feeToPreviousPrevious = feeToPrevious / 2;
        uint256 feeToPreviousPreviousPrevious = feeToPreviousPrevious / 2;

        sendNoMatterWhat(previous, feeToPrevious);
        sendNoMatterWhat(previousPrevious, feeToPreviousPrevious);
        sendNoMatterWhat(previousPreviousPrevious, feeToPreviousPreviousPrevious);
        sendNoMatterWhat(owner, address(this).balance);

        previousPreviousPrevious = previousPrevious;
        previousPrevious = previous;
        previous = owner;
        owner = msg.sender;

        emit Buy(msg.sender, amount);
    }

    function blockNumber() public view returns (uint256) {
        return block.number;
    }
}

