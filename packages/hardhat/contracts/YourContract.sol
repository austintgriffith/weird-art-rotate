//SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

// Useful for debugging. Remove when deploying to a live network.
import "hardhat/console.sol";

// Use openzeppelin to inherit battle-tested implementations (ERC20, ERC721, etc)
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * A smart contract that allows changing a state variable of the contract and tracking the changes
 * It also allows the owner to withdraw the Ether in the contract
 * @author BuidlGuidl
 */
contract YourContract is Ownable {

    constructor(address _owner) Ownable(_owner) {
        // No need for transferOwnership since ownership is set in the Ownable constructor
    }

    function getSeed() public view returns (uint256) {
        return uint8(uint256(keccak256(abi.encodePacked(blockhash(block.number - 1), address(this)))));
    }

    string[] private firstNames = [
        "Sylvarra", "Chyvanna", "Cryvarra", "Kyvarra", "Chyvara", "Zhyvarra", "Chyverra", "Thyvarra", "Vyvarra", "Clyvarra",
        "Tivarra", "Xhyvarra", "Myvarra", "Chytherra", "Chylarra", "Lyvarra", "Chyvarria", "Khyvarra", "Phyvarra", "Syvarra",
        "Thyvarra", "Chyvirae", "Xyvarra", "Crytharra", "Zhytherra", "Fryvarra", "Chyvarra", "Tyvarra", "Byvarra", "Hyvarra",
        "Cryvarra", "Thyvarra", "Chyviel", "Lhyvarra", "Zytherra", "Klyvarra", "Crytharra", "Xyvarra", "Sylvarra", "Chytherra",
        "Vyvarra", "Fhyvarra", "Chyvarra", "Chytherra", "Kylarra", "Sytherra", "Frytherra", "Bytherra", "Ivyarra"
    ];

    string[] private lastNames = [
        "Ecliptica", "Ecliptor", "Elliptica", "Eclipseon", "Eclipthos", "Echolytica", "Eclipsoid", "Aetherica", "Heliontica", "Eclythron",
        "Exothica", "Spectryca", "Cryolithia", "Oscyllis", "Erythica", "Solyxia", "Etheryca", "Axionis", "Auralis", "Luminthia",
        "Pyrithos", "Ionisca", "Asteryca", "Zephyra", "Obscyllos", "Luminex", "Axialos", "Eryllion", "Echionyx", "Solanthis",
        "Ellesthos", "Eridicon", "Ixolyth", "Quinthica", "Oscuron", "Exphyra", "Erythana", "Aetheron", "Olmythos", "Axionith",
        "Auralith", "Helionis", "Solaris", "Empyreon", "Ignithos", "Volynthis", "Echonyx", "Astryca", "Pyralyth", "Nexalith"
    ];

    function getFirstName() public view returns (string memory) {
        uint256 index = uint256(keccak256(abi.encodePacked(blockhash(block.number - 3), getSeed()))) % firstNames.length;
        return firstNames[index];
    }

    function getLastName() public view returns (string memory) {
        uint256 index = uint256(keccak256(abi.encodePacked(blockhash(block.number - 2), getSeed()))) % lastNames.length;
        return lastNames[index];
    }

    function name() public view returns (string memory) {
        return string.concat(getFirstName(), " ", getLastName());
    }

    function blockNumber() public view returns (uint256) {
        return block.number;
    }
}

