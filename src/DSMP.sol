// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";

/**
 * @title A contract for DSMP Token
 * @author Team DSMP
 * @notice This contract demonstrates how to create your own ERC20 token with added security features.
 */
contract DSMP is ERC20, Ownable, Pausable {
    mapping(address => bool) public allowedContracts;

    event ContractAllowed(address indexed contractAddress);
    event ContractDisallowed(address indexed contractAddress);

    /**
     * @dev Contract constructor.
     * @param name The name of the token.
     * @param symbol The symbol of the token.
     */
    constructor(string memory name, string memory symbol) ERC20(name, symbol) Ownable(msg.sender) {}

    /**
     * @dev Buys tokens based on the user's input amount in USD.
     * @param amount The amount of tokens to buy.
     */
    function mint(address _address, uint256 amount) public whenNotPaused {
        require(_address != address(0), "Invalid address");
        require(allowedContracts[msg.sender], "Caller is not an allowed contract");
        _mint(_address, amount);
    }

    /**
     * @dev To add an allowed external contract address.
     * @param _contract The address of the external contract.
     */
    function addAllowedContract(address _contract) public onlyOwner {
        require(_contract != address(0), "Invalid contract address");
        allowedContracts[_contract] = true;
        emit ContractAllowed(_contract);
    }

    /**
     * @dev To remove an allowed external contract address.
     * @param _contract The address of the external contract.
     */
    function removeAllowedContract(address _contract) public onlyOwner {
        require(_contract != address(0), "Invalid contract address");
        require(allowedContracts[_contract] != false, "Contract address is not listed");
        allowedContracts[_contract] = false;
        emit ContractDisallowed(_contract);
    }

    /**
     * @dev Burn tokens.
     * @param _address The address from which to burn tokens.
     * @param amount The amount of tokens to burn.
     */
    function burn(address _address, uint256 amount) public whenNotPaused {
        require(_address != address(0), "Invalid address");
        _burn(_address, amount);
    }

    /**
     * @dev Transfer tokens from an account to another account.
     * @param sender The sender's address.
     * @param recipient The recipient's address.
     * @param amount The amount of tokens to transfer.
     * @return A boolean indicating the success of the transfer.
     */
    function transferFrom(address sender, address recipient, uint256 amount)
        public
        override
        whenNotPaused
        returns (bool)
    {
        require(sender != address(0), "Invalid sender address");
        require(recipient != address(0), "Invalid recipient address");
        _transfer(sender, recipient, amount);
        return true;
    }

    /**
     * @dev Transfer tokens from the sender's account to a recipient's account.
     * @param recipient The recipient's address.
     * @param amount The amount of tokens to transfer.
     * @return A boolean indicating the success of the transfer.
     */
    function transfer(address recipient, uint256 amount) public virtual override whenNotPaused returns (bool) {
        require(recipient != address(0), "Invalid recipient address");
        _transfer(_msgSender(), recipient, amount);
        return true;
    }

    /**
     * @dev Pause the contract, preventing certain functions from being executed.
     */
    function pause() public onlyOwner {
        _pause();
    }

    /**
     * @dev Unpause the contract, allowing functions to be executed again.
     */
    function unpause() public onlyOwner {
        _unpause();
    }

    /**
     * @dev Override to customize the decimal value of the token.
     */
    function decimals() public view virtual override returns (uint8) {
        return 18;
    }
}