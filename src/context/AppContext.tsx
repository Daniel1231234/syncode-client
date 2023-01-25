import axios from 'axios';
import  React, {createContext, useContext, useState} from 'react';
import { io, Socket } from 'socket.io-client';
import { ICodeBlock } from '../models/ICodeBlock';
import { codeBlockService } from '../services/codeBlockService';

interface AppContextProp {
    isMentor: boolean
    setIsMentor: React.Dispatch<React.SetStateAction<boolean>>;
    codeBlock: ICodeBlock | null;
    solution: string;
    setSolution: React.Dispatch<React.SetStateAction<string>>;
    isMatch: boolean;
    setIsMatch: React.Dispatch<React.SetStateAction<boolean>>;
    getAllBlocks: Function;
    getBlockById: Function;
    getCurrBlock:Function
    saveCurrBlock:Function
}

export const AppContext = createContext<AppContextProp>({
    isMentor: false,
    setIsMentor: () => { },
    codeBlock: null,
    solution: "",
    setSolution: () => { },
    isMatch: false,
    setIsMatch: () => { },
    getAllBlocks:() => {},
    getBlockById: () => { },
    getCurrBlock:() => {},
    saveCurrBlock: () => { },
});


export const AppContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isMentor, setIsMentor] = useState(false);
    const [codeBlock, setCodeBlock] = useState<ICodeBlock | null>(null);
    const [solution, setSolution] = useState('');
    const [isMatch, setIsMatch] = useState(false)


    const getAllBlocks = async () => {
        try {
            const blocks:ICodeBlock[] = await codeBlockService.getTotalBlocks()
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

    const saveCurrBlock = (codeBlock:ICodeBlock | null) => {
        setCodeBlock(codeBlock)
        localStorage.setItem('codeBlock', JSON.stringify(codeBlock))
    }

    const getBlockById = async (blockId:string) => {
        try {
            const chosenBlock = await codeBlockService.getById(blockId)
            return chosenBlock
        } catch (err) {
            console.log(err)
        }
    }


    const value = {
        isMentor,
        setIsMentor,
        codeBlock,
        getBlockById,
        solution,
        setSolution,
        isMatch,
        setIsMatch, 
        getAllBlocks,
        getCurrBlock,
        saveCurrBlock
    };

    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    );
}
