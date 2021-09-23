// SPDX-License-Identifier: MIT
pragma solidity >=0.6.0 <0.7.0;

/****************************************************************************************
 ██████████   █████ █████ ██████   █████   █████████   ██████   ██████ █████ █████ █████
░░███░░░░███ ░░███ ░░███ ░░██████ ░░███   ███░░░░░███ ░░██████ ██████ ░░███ ░░███ ░░███ 
 ░███   ░░███ ░░███ ███   ░███░███ ░███  ░███    ░███  ░███░█████░███  ░███  ░░███ ███  
 ░███    ░███  ░░█████    ░███░░███░███  ░███████████  ░███░░███ ░███  ░███   ░░█████   
 ░███    ░███   ░░███     ░███ ░░██████  ░███░░░░░███  ░███ ░░░  ░███  ░███    ███░███  
 ░███    ███     ░███     ░███  ░░█████  ░███    ░███  ░███      ░███  ░███   ███ ░░███ 
 ██████████      █████    █████  ░░█████ █████   █████ █████     █████ █████ █████ █████
░░░░░░░░░░      ░░░░░    ░░░░░    ░░░░░ ░░░░░   ░░░░░ ░░░░░     ░░░░░ ░░░░░ ░░░░░ ░░░░░ 
                                                                                        

> Dynamix Mission Contract to Secure Transfer Process																					
> More information on https://dynamix.finance/

*****************************************************************************************/

library Address {
    function isContract(address account) internal view returns (bool) {
        // According to EIP-1052, 0x0 is the value returned for not-yet created accounts
        // and 0xc5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470 is returned
        // for accounts without code, i.e. `keccak256('')`
        bytes32 codehash;
        bytes32 accountHash = 0xc5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470;
        // solhint-disable-next-line no-inline-assembly
        assembly { codehash := extcodehash(account) }
        return (codehash != accountHash && codehash != 0x0);
    }

    function sendValue(address payable recipient, uint256 amount) internal {
        require(address(this).balance >= amount, "Address: insufficient balance");

        // solhint-disable-next-line avoid-low-level-calls, avoid-call-value
        (bool success, ) = recipient.call{ value: amount }("");
        require(success, "Address: unable to send value, recipient may have reverted");
    }

    function functionCall(address target, bytes memory data) internal returns (bytes memory) {
      return functionCall(target, data, "Address: low-level call failed");
    }

    function functionCall(address target, bytes memory data, string memory errorMessage) internal returns (bytes memory) {
        return _functionCallWithValue(target, data, 0, errorMessage);
    }

    function functionCallWithValue(address target, bytes memory data, uint256 value) internal returns (bytes memory) {
        return functionCallWithValue(target, data, value, "Address: low-level call with value failed");
    }

    function functionCallWithValue(address target, bytes memory data, uint256 value, string memory errorMessage) internal returns (bytes memory) {
        require(address(this).balance >= value, "Address: insufficient balance for call");
        return _functionCallWithValue(target, data, value, errorMessage);
    }

    function _functionCallWithValue(address target, bytes memory data, uint256 weiValue, string memory errorMessage) private returns (bytes memory) {
        require(isContract(target), "Address: call to non-contract");

        // solhint-disable-next-line avoid-low-level-calls
        (bool success, bytes memory returndata) = target.call{ value: weiValue }(data);
        if (success) {
            return returndata;
        } else {
            // Look for revert reason and bubble it up if present
            if (returndata.length > 0) {
                // The easiest way to bubble the revert reason is using memory via assembly

                // solhint-disable-next-line no-inline-assembly
                assembly {
                    let returndata_size := mload(returndata)
                    revert(add(32, returndata), returndata_size)
                }
            } else {
                revert(errorMessage);
            }
        }
    }
}

library SafeMath {
    function add(uint256 a, uint256 b) internal pure returns (uint256) {
        uint256 c = a + b;
        require(c >= a, "SafeMath: addition overflow");

        return c;
    }

    function sub(uint256 a, uint256 b) internal pure returns (uint256) {
        return sub(a, b, "SafeMath: subtraction overflow");
    }

    function sub(uint256 a, uint256 b, string memory errorMessage) internal pure returns (uint256) {
        require(b <= a, errorMessage);
        uint256 c = a - b;

        return c;
    }

    function mul(uint256 a, uint256 b) internal pure returns (uint256) {
        if (a == 0) {
            return 0;
        }

        uint256 c = a * b;
        require(c / a == b, "SafeMath: multiplication overflow");

        return c;
    }


    function div(uint256 a, uint256 b) internal pure returns (uint256) {
        return div(a, b, "SafeMath: division by zero");
    }

    function div(uint256 a, uint256 b, string memory errorMessage) internal pure returns (uint256) {
        require(b > 0, errorMessage);
        uint256 c = a / b;
        // assert(a == b * c + a % b); // There is no case in which this doesn't hold

        return c;
    }

    function mod(uint256 a, uint256 b) internal pure returns (uint256) {
        return mod(a, b, "SafeMath: modulo by zero");
    }

    function mod(uint256 a, uint256 b, string memory errorMessage) internal pure returns (uint256) {
        require(b != 0, errorMessage);
        return a % b;
    }
}

contract DynamixMission {
	using SafeMath for uint256;
	using Address for address;

	struct Wallet {
        address wallet; 
        string name;  
        string tg;  
    }
	
	Wallet public Buyer;
	Wallet public Seller;

	string public Description;
	uint public CreationDate;
	
	bool public BuyerHasCanceledMission;
	bool public BuyerHasFundedMission;
	bool public BuyerHasPaidMission;
	bool public SellerHasAcceptedMission;
	
	address payable public feesAddress = payable(0x34A1a24BB6C8a692e6F5f7650C89bd88cB51A28d);

	event MissionFunded();
	event MissionPaid();
	event MissionCanceled();
	event MissionAccepted();
	event MissionGivenUp();

	receive() external payable {}

	modifier onlyBuyer() {
        require(Buyer.wallet == msg.sender, "Caller is not the buyer");
        _;
    }
	
	modifier onlySeller() {
        require(Seller.wallet == msg.sender, "Caller is not the seller");
        _;
    }
	
	constructor(address buyerWallet, string memory buyerName, string memory buyerTG
				, address sellerWallet, string memory sellerName, string memory sellerTG
				, string memory missionDescription) public {
		require(buyerWallet != sellerWallet, "Buyer and Seller can't be equal");

		Buyer = Wallet(buyerWallet, buyerName, buyerTG);
		Seller = Wallet(sellerWallet, sellerName, sellerTG);
		Description = missionDescription;
		
		CreationDate = block.timestamp;
	}

	// Finance the mission
	function financeMission() external onlyBuyer() {
		require(!BuyerHasCanceledMission, "Mission is canceled");

		// Transfer all BNB Contract to Seller
		
		// Take Fees 
		// Transfer to feesAddress
		// address(this).balance.sub(initialcontractBNBBalance);
		// feesAddress.transfer(balanceFees);

		BuyerHasFundedMission = true;
		emit MissionPaid();
	}
	
	// Pay mission to the Seller
	function payMission() external onlyBuyer() {
		require(BuyerHasFundedMission, "Mission is not funded");
		require(!BuyerHasCanceledMission, "Mission is canceled");
		// Transfer all BNB Contract to Seller
		
		BuyerHasPaidMission = true;
		emit MissionPaid();
	}
	
	// Cancel mission. Not possible if mission is already accepted by the Seller
	function cancelMission() external onlyBuyer() {
		require(!SellerHasAcceptedMission, "The seller has accepted the mission, you can't cancel it");
		// Transfer all BNB Contract to Buyer
		
		BuyerHasCanceledMission = true;
		BuyerHasFundedMission = false;
		emit MissionCanceled();
	}
	
	// Accepte the mission
	function acceptMission() external onlySeller() {
		require(!SellerHasAcceptedMission, "The seller already accepted the mission");

		SellerHasAcceptedMission = true;
		emit MissionAccepted();
	}
	
	// Give Up the mission
	function giveUpMission() external onlySeller() {
		require(!BuyerHasPaidMission, "Mission is already paid");
		require(SellerHasAcceptedMission, "The seller already giveup the mission");

		SellerHasAcceptedMission = false;
		emit MissionGivenUp();
	}
}