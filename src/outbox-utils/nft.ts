import {fetchFileBytesFromIPFS} from "../ipfs/utils";
import {sha256, utf8} from "@fleet-sdk/crypto";
import {OutputBuilder, SByte, SColl, TransactionBuilder} from "@fleet-sdk/core";
import {Box} from "../explorer-api/types";
import {SPair} from "@fleet-sdk/serializer";
import {EIP12UnsignedTransaction} from "@fleet-sdk/common";


export async function generateAudioNftTx(nft_data: any, inputBox: Box, height: number, recipient: string, changeAddress: string, fee: number = 1100000): Promise<EIP12UnsignedTransaction>{
    const ipfsImageURL = `https://gateway.ipfs.io/ipfs/${nft_data["IPFS CID Image"].split("ipfs://")[1]}`;  // IF AUDIO NFT, CHANGE TO nft["IPFS CID Audio"]
    const fileBytes = new Uint8Array(await fetchFileBytesFromIPFS(ipfsImageURL));

    const fileHash = sha256(fileBytes);

    return new TransactionBuilder(height)
        .from(inputBox as unknown as any)
        .to(
            new OutputBuilder('1000000', recipient)
                .mintToken({ amount: nft_data["Number to mint"] })
                .setAdditionalRegisters({
                    R4: SColl(SByte, utf8.decode(nft_data["NFT Name/Title"])).toHex(),
                    R5: SColl(SByte, utf8.decode(nft_data["Description"])).toHex(),
                    R6: SColl(SByte, utf8.decode('0')).toHex(), // 0 decimal places, so 1 whole token where 1 decimal place would be 1.0 tokens (.1 increments)
                    R7: SColl(SByte, [0x01, 0x01]).toHex(), // 0x01, 0x01 is image // 0x01, 0x02 is audio
                    R8: SColl(SByte, fileHash).toHex(),
                    R9: SPair(
                        SColl(SByte, utf8.decode(nft_data["IPFS CID Image"])),
                        SColl(SByte, utf8.decode(nft_data["IPFS CID Audio"]))
                    ).toHex(),
                })
        )
        .sendChangeTo(changeAddress)
        .payFee(BigInt(fee))
        .build()
        .toEIP12Object();
}