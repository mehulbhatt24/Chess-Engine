import Board from "../BoardComponents/Board"
import React from "react"
import { useState, useRef, useEffect, useContext } from "react";
import { createInitialPieces } from "../BoardComponents/Piece.js";
import { newBoard } from "../FunctionsAndUtilities/Utils.js";
import "../../styles/Board.css"
import GameContext from "../../Context/GameContext.js";
import { useParams } from "react-router-dom";
import { useDisclosure } from "@chakra-ui/react";
export default function PlayWithComputer() {

        //disclosures for promotion and checkmate
        const promotionModalDisclosure = useDisclosure()
        const checkMateModalDisclosure = useDisclosure()

        //state variables
        let { color,setColor, gameid } = useContext(GameContext);

        let [Pieces, setPieces] = useState(createInitialPieces());
        let [selected, setSelected] = useState(null);
        let checkMate = useRef("");
        let Promotion = useRef({ promoted: false, x: 55, y: 55, promotedPawn: "", clickedPos: 0 })
        let PiecesRef = useRef(Pieces);
        let params = useParams();
        let turn = useRef(0);

        //on every mounting change pieceref to current value
        useEffect(() => {
            PiecesRef.current = Pieces
        })

        //registering sockets and setting turn for first render
        useEffect(() => {
            setColor('white')
            turn.current = 1;
            // turn.current = color === 'white' ? 1 : 0;
            newBoard();
            
        }, [])
        return (
            <>
            <Board Pieces={Pieces} setPieces={setPieces} selected={selected} setSelected={setSelected} checkMate={checkMate} Promotion={Promotion} PiecesRef={PiecesRef} turn={turn} promotionModalDisclosure={promotionModalDisclosure} checkMateModalDisclosure={checkMateModalDisclosure} playComputer={true}/>
            </>
        )
   
}