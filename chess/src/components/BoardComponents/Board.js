import React from "react"
import { useState, useRef, useEffect, useContext } from "react";
import Square from "./Square.js";
import { playMove, boardClicked, movePlayed, checkForMate, addPiece } from "../FunctionsAndUtilities/Logic.js";
import playComputerMove from "../../ai/pst.js";
import "../../styles/Board.css"
import GameContext from "../../Context/GameContext.js";
import { CheckMateModal } from "../uiComponents/Modal.js";
import { PromotionModal } from "../uiComponents/Modal.js"

export default function (props) {
    let { color, gameid } = useContext(GameContext);
    let { Pieces, setPieces, selected, setSelected, checkMate, Promotion, PiecesRef, turn, promotionModalDisclosure, checkMateModalDisclosure, playComputer } = props
    let boardObject = { selected: selected, PiecesRef: PiecesRef, setPieces: setPieces, setSelected: setSelected, gameid: gameid, turn: turn, color: color }

    const [screenWidth, setScreenWidth] = useState(window.innerWidth);


    useEffect(() => {
        const handleResize = () => {
            setScreenWidth(() => document.documentElement.clientWidth);
           
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);




    function handleEvent(e) {
        e.stopPropagation();
        Promotion.x = e.clientX
        Promotion.y = e.clientY
        let x = e.clientX - e.currentTarget.offsetLeft
        let y = e.clientY - e.currentTarget.offsetTop
        
        let clickedPos = -1
        if(screenWidth>=450){
            if (x < 0 || y < 0 || x >= 400 || y >= 400) return;
            clickedPos = Math.floor(y / 50) * 8 + Math.floor(x / 50);
        }else{
            if (x < 0 || y < 0 || x >= 320 || y >= 320) return;
            clickedPos = Math.floor(y / 40) * 8 + Math.floor(x / 40);
        }
        if (color === 'white') clickedPos = 63 - clickedPos

        if(clickedPos<0 || clickedPos>63)   return

        if (selected) {
            let wasOpponentMove = false
            let flag = playMove({ boardObject: boardObject, clickedPos: clickedPos, Promotion: Promotion, wasOpponentMove: wasOpponentMove, promotionModalDisclosure: promotionModalDisclosure })
            let mated = checkForMate({ boardObject: boardObject, checkMate: checkMate, checkMateModalDisclosure: checkMateModalDisclosure });

            if (!mated && flag && playComputer) {
                let depth = 4
                let isMaximizingPlayer = false;

                playComputerMove(PiecesRef, depth, isMaximizingPlayer)
                turn.current = turn.current === 0 ? 1 : 0
                setPieces({ ...PiecesRef.current })
                let bObject = { PiecesRef: PiecesRef, color: "black", gameid: gameid }
                checkForMate({ boardObject: bObject, checkMate: checkMate, checkMateModalDisclosure: checkMateModalDisclosure });
            }

        }

        else
            boardClicked({ boardObject: boardObject, clickedPos: clickedPos })

    }

    function outsideEvent() {
        setSelected(null)
    }

    let squares = [];
    let flag = 1;
    for (let i = 0; i < 64; i++) {
        let image = undefined;
        for (let piece in Pieces) {
            if (Pieces[piece].position == (color === 'white' ? 63 - i : i))
                image = Pieces[piece].image;
        }
        if (i % 8 == 0) flag = !flag;

        squares.push(<Square _color={flag ? "black" : "white"} image={image} key={i} id={i} highlight={selected ? color === 'white' ? Pieces[selected].attackedSquares[63 - i] : Pieces[selected].attackedSquares[i] : 0} />)

        flag = !flag
    }
    return (
        <div id="board" onClick={outsideEvent}>

            <CheckMateModal boardObject={boardObject} checkMateModalDisclosure={checkMateModalDisclosure} checkMate={checkMate.current} />

            <PromotionModal boardObject={boardObject} promotionModalDisclosure={promotionModalDisclosure} checkMateModalDisclosure={checkMateModalDisclosure} Promotion={Promotion} checkMate={checkMate} />

            {/* <div>
                <h1>Screen Size: {screenWidth}</h1>
            </div> */}

            <div id="chess_board" onClick={handleEvent}>
                {squares}
            </div>
        </div>
    )
}