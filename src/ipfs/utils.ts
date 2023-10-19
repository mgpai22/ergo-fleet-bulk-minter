import axios from "axios";


export async function fetchFileBytesFromIPFS(ipfs_url: string): Promise<Uint8Array> {
    try {
        const response = await axios.get(ipfs_url, {
            responseType: 'arraybuffer', // to handle binary data
        });
        return new Uint8Array(response.data);
    } catch (error) {
        console.error(`Failed to fetch file from IPFS: ${error}`);
        throw new Error(`Could not fetch file from IPFS: ${error}`);
    }
}