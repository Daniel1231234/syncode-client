import axios from "axios"

export const codeBlockService = {
    getTotalBlocks,
    getById
}

const BASE_URL = import.meta.env.MODE === 'development' ? 'http://localhost:3001/api/block' : '/api/block'


async function getTotalBlocks() {
    try {
        const { data } = await axios.get(BASE_URL)
        return data
    } catch (err) {
        console.log(err)
    }
}

async function getById(blockId:string) {
    try {
        const { data } = await axios.get(`${BASE_URL}/${blockId}`)
        // console.log(data)
        return data
    } catch (err) {
        console.log(err)
    }
}