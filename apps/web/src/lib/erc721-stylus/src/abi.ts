export const ERC721_ABI = [
  // ERC721 Standard Interface
  "event Transfer(address indexed from, address indexed to, uint256 indexed token_id)",
  "function name() view returns (string)",
  "function symbol() view returns (string)",
  "function balanceOf(address owner) view returns (uint256)",
  "function ownerOf(uint256 token_id) view returns (address)",
  "function safeTransferFrom(address from, address to, uint256 token_id, bytes data)",
  "function safeTransferFrom(address from, address to, uint256 token_id)",
  "function transferFrom(address from, address to, uint256 token_id)",
  "function approve(address approved, uint256 token_id)",
  "function setApprovalForAll(address operator, bool approved)",
  "function getApproved(uint256 token_id) view returns (address)",
  "function isApprovedForAll(address owner, address operator) view returns (bool)",
  // StylusNFT Specific Functions
  "function mint()",
  "function mintTo(address to)",
  "function safeMint(address to)",
  "function burn(uint256 token_id)",
  "function total_supply() view returns (uint256)",
  "function token_uri(uint256 token_id) view returns (string)",
];
