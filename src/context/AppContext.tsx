import axios from 'axios';
import React, { createContext, useContext, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { ICodeBlock } from '../models/ICodeBlock';
import { codeBlockService } from '../services/codeBlockService';

interface AppContextProp {
    isMentor: boolean
    setIsMentor: React.Dispatch<React.SetStateAction<boolean>>;
    checkIfMatch:Function
    getAllBlocks: Function;
    getBlockById: Function;
    getCurrBlock: Function
    saveCurrBlock: Function
    showBackBtn:boolean
    setShowBackBtn:React.Dispatch<React.SetStateAction<boolean>>;
}

export const AppContext = createContext<AppContextProp>({
    isMentor: false,
    setIsMentor: () => { },
    checkIfMatch:() => {},
    getAllBlocks: () => { },
    getBlockById: () => { },
    getCurrBlock: () => { },
    saveCurrBlock: () => { },
    showBackBtn:false,
    setShowBackBtn: () => {}
});


export const AppContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isMentor, setIsMentor] = useState(false);
    const [codeBlock, setCodeBlock] = useState<ICodeBlock | null>(null);
    const [showBackBtn, setShowBackBtn] = useState(false)

    const getAllBlocks = async () => {
        try {
            const blocks: ICodeBlock[] = await codeBlockService.getTotalBlocks()
            return blocks
        } catch (err) {
            console.log(err)
        }
    }

    const getCurrBlock = () => {
        const json = localStorage.getItem('codeBlock')
        if (!json || json.length === 0) return null
        const block = JSON.parse(json)
        return block
    }

    const saveCurrBlock = (codeBlock: ICodeBlock | null) => {
        setCodeBlock(codeBlock)
        localStorage.setItem('codeBlock', JSON.stringify(codeBlock))
    }

    const getBlockById = async (blockId: string) => {
        try {
            const chosenBlock = await codeBlockService.getById(blockId)
            return chosenBlock
        } catch (err) {
            console.log(err)
        }
    }

    const checkIfMatch = (updatedCode: string, solution: string) => {
        const userSolution = getAnswer(updatedCode)
        console.log(userSolution)
        if (userSolution?.toLowerCase() === solution.toLowerCase()) return true
        else return false
    }

    function getAnswer(string:String) {
    let match = string.match(/results:([\s\S]*)/);
    if (match) {
        return match[1].trim();
    }
    return null;
}


    const value = {
        isMentor,
        setIsMentor,
        getBlockById,
        checkIfMatch,
        getAllBlocks,
        getCurrBlock,
        saveCurrBlock,
        showBackBtn,
        setShowBackBtn
    };

    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    );
}
