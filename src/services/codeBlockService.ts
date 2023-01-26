import axios from "axios"

export const codeBlockService = {
    getTotalBlocks,
    getById,
}

const BASE_URL = process.env.NODE_ENV !== "development" ? "/api/block" : "//localhost:3001/api/block"


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
        return data
    } catch (err) {
        console.log(err)
    }
}


