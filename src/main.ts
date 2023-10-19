import {BackendWallet} from "./rust/BackendWallet";
import {Network} from "@fleet-sdk/core";
import {ExplorerAPI} from "./explorer-api/api";
import {Box} from "./explorer-api/types";
import {generateAudioNftTx} from "./outbox-utils/nft";


const amountOfNftsToMint = 1; // make sure this matches nft_data
const recipient = "";

const addressIndex = 0;
const mnemonic = "";
const mnemonicPw = ""; // generally empty for most people
const explorerApi = "https://api.ergoplatform.com";
const network = Network.Mainnet; //Network.Testnet

const explorer = new ExplorerAPI(explorerApi)
const wallet = new BackendWallet(mnemonic, mnemonicPw, network)
const address = wallet.getAddress(addressIndex);

// do not touch
const limit = 100;
let offset = 0;
let inputs: Box[] = [];
let totalInputs = 0;

while (totalInputs < amountOfNftsToMint) {
    const response = await explorer.getUnspentBoxesByAddress(address, limit, offset);
    if (response.items.length === 0) {
        break;
    }
    totalInputs += response.items.length;
    inputs = inputs.concat(response.items);
    offset += limit;
}
// end of barrier

const nft_data = [
    {
        "NFT Name/Title": "Bulk NFT Mushroom #1",
        "Description": "This is a bulk minted NFT with audio pairing.",
        "Number to mint": 1,
        "IPFS CID Audio": "ipfs://bafybeibozolkzncsjcehbf6uvki33ehfynn3g3ysvdke5vw5d7257kc7fy",
        "IPFS CID Image": "ipfs://bafybeie2tb3hkdlwshdfj2vvbkwkod7qjpn77w2ywich4kqqgj6uujqg2u"
    }
]

const blockHeaders = (await explorer.getBlockHeaders()).items

const transactions = nft_data.map(async (data, index) => await generateAudioNftTx(data, inputs[index], blockHeaders[0].height, recipient, address))

const signedTransactions = transactions.map(async tx => await wallet.signTransaction(await tx, blockHeaders, addressIndex))

signedTransactions.forEach(async tx => {
    const txid = (await explorer.submitTransaction(await tx)).id

    console.log(txid)
})


