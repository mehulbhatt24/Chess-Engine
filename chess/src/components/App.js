import Board from "./BoardComponents/Board"
import CreateGame from "./GameComponents/CreateGame";
import NewGame from "./GameComponents/NewGame";
import PlayWithComputer from "./GameComponents/PlayWithComputer";
import Sidebar from "./uiComponents/Sidebar"
import "../styles/App.css"
import { useState,useRef } from "react";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import GameContext from '../Context/GameContext'
import { ChakraProvider, Flex, background } from '@chakra-ui/react'
import { Box } from "@chakra-ui/react";
import { hydrateRoot } from "react-dom/client";



export default function () {
    const [gameid, setGameid] = useState('');
    const [color, setColor] = useState("white");
    const isCreator = useRef(false);


    return (
        <GameContext.Provider value={{ gameid, setGameid, color, setColor,isCreator }}>
            <ChakraProvider>
                <Router>
                    <Sidebar />
                    {/* <Box height='100vh' w={{ base: "60vh", md: "450px" }} ml={{ base: "10vh", md: "400px" }} pt={{ base: "30px", "md": "70px" }}> */}
                    <Box h={{base:"80vh", md:'100vh'}} w={{ base: "100vw", md: "80vw" }} pt={{ base: "20px", md: "60px" }} ml={{ base: "0px", md: "20vw" }}>

                        <Box maxW={{ base: "450px", md: "600px" }} px={{base:"10px", md:"0px"}} margin='auto'>
                            <Routes>
                                <Route path='/game' element={<CreateGame />} exact />
                                <Route path='/game/:gameid' element={<NewGame />} exact />
                                <Route path='/comp' element={<PlayWithComputer />} exact />
                            </Routes>
                        </Box>

                    </Box>
                    
                </Router>
            </ChakraProvider>
        </GameContext.Provider >
    )
}
//here