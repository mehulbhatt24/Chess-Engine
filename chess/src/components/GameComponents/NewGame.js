import Board from "../BoardComponents/Board.js"
import React from "react"

import {Alert,AlertIcon,AlertTitle,AlertDescription,} from '@chakra-ui/react'

import { useState, useRef, useEffect, useContext } from "react";
import { createInitialPieces } from "../BoardComponents/Piece.js";
import { newBoard } from "../FunctionsAndUtilities/Utils.js";
import { playMove, addPiece } from "../FunctionsAndUtilities/Logic.js";
import { socket } from "../../connection/socket.js";
import "../../styles/Board.css"
import GameContext from "../../Context/GameContext.js";
import { useParams } from "react-router-dom";
import { useDisclosure } from "@chakra-ui/react";

export default function(){
    //disclosures for promotion and checkmate
    const promotionModalDisclosure = useDisclosure()
    const checkMateModalDisclosure = useDisclosure()

    //state variables
    let { color, gameid,isCreator } = useContext(GameContext);

    let [Pieces, setPieces] = useState(createInitialPieces());
    let [selected, setSelected] = useState(null);
    let [start,setStart] = useState(false)
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
        turn.current = color === 'white' ? 1 : 0;
        newBoard();

        socket.on('move played', (move) => {
            let boardObject = {selected:move.selected,PiecesRef:PiecesRef,setPieces:setPieces,setSelected:setSelected,gameid:gameid,turn:turn}
            playMove({boardObject:boardObject, clickedPos:move.clickedPos,Promotion:Promotion, wasOpponentMove:true, promotionModalDisclosure:promotionModalDisclosure})

        })

        socket.on('checkmated', (color) => {
            checkMate.current = color
            checkMateModalDisclosure.onOpen()   
        })

        socket.on('promotion', (move) => {
            let boardObject = {selected:move.promotedPawn,PiecesRef:PiecesRef,setPieces:setPieces,setSelected:setSelected,gameid:gameid,turn:turn,color:move.color}
            playMove({boardObject:boardObject, clickedPos:move.clickedPos,Promotion:Promotion, wasOpponentMove:true, promotionModalDisclosure:promotionModalDisclosure})
            Promotion.current = { promoted: true, x: 55, y: 55, promotedPawn: move.promotedPawn, clickedPos: move.clickedPos }
            addPiece(move.promoteTo, boardObject,Promotion,checkMate,null,checkMateModalDisclosure) 
            Promotion.current = { promoted: false, x: 55, y: 55, promotedPawn: "", clickedPos: 0 }
            
        })

        socket.on('opponent joined',()=>{
            setStart(true)
        })
        
        
        return () => {
            
            socket.off('move played');
            socket.off('checkmated');
            socket.off('promotion')
            // socket.emit('closeGame',gameid)
        }


    }, [])
    return(
        <>
        {isCreator.current && !start && (
            <Alert status='info' variant='left-accent' flexDirection='column'
            alignItems='center'
            justifyContent='center'
            >
            <AlertIcon />
            <AlertTitle mb={2}>
                Your Game id is {gameid}
            </AlertTitle>
            <AlertDescription color='green'>Ask your friend to type it in join game</AlertDescription>
          </Alert>
        )}
        {/* {!start && <div>hii</div>} */}
        {(!isCreator.current || start) && <Board Pieces={Pieces} setPieces={setPieces} selected={selected} setSelected={setSelected} checkMate={checkMate} Promotion={Promotion} PiecesRef={PiecesRef} turn={turn} promotionModalDisclosure={promotionModalDisclosure} checkMateModalDisclosure={checkMateModalDisclosure} playComputer={false}/>}
        </>
    )
}