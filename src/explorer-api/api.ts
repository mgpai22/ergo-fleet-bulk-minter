import axios from 'axios';
import {BlockHeadersResponse, ResponseData} from "./types";

export class ExplorerAPI {
    private readonly baseUrl: string;

    constructor(baseUrl: string) {
        this.baseUrl = baseUrl;
    }

    // @ts-ignore
    public async getUnspentBoxesByAddress(address: string, limit: number = 100, offset: number = 0): Promise<ResponseData> {
        const url = `${this.baseUrl}/api/v1/boxes/unspent/byAddress/${address}?limit=${limit}&offset=${offset}`;
        try {
            return (await axios.get(url)).data;
        } catch (error) {
            // console.error(error);
            // throw error;
            console.log("error getting boxes")
        }
    }

    // @ts-ignore
    public async submitTransaction(transaction: any): Promise<{id: string}> {
        const url = `${this.baseUrl}/api/v1/mempool/transactions/submit`;
        try {
            return (await axios.post(url, transaction)).data;
        } catch (error) {
            // console.error(error);
            // throw error;
            console.log("error submitting tx")
        }
    }

    // @ts-ignore
    public async getBlockHeaders(): Promise<BlockHeadersResponse> {
        const url = `${this.baseUrl}/api/v1/blocks/headers`;
        try {
            const response = await axios.get(url);
            return response.data;
        } catch (error) {
            // console.error(error);
            // throw error;
            console.log("error getting headers")
        }
    }
}
