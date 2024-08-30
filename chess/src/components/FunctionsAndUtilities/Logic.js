import React from "react";
import { socket } from "../../connection/socket.js";
import { queen, bishop, rook, knight } from "../BoardComponents/Piece.js"
import { pieceImages } from "./Utils.js";

function playMove({boardObject, clickedPos,Promotion, wasOpponentMove, promotionModalDisclosure}) {
    let {PiecesRef,selected,setSelected,setPieces,gameid,turn} = boardObject
    let Pieces = { ...PiecesRef.current }
    let attackedSquares = Pieces[selected].attackedSquares;
    let attackedPiece = null;
    for (let piece in Pieces) {
        if (Pieces[piece].position == clickedPos)
            attackedPiece = piece;
    }
    let flag = false;
    if (attackedSquares[clickedPos] || wasOpponentMove) {
        flag = true;
        turn.current = turn.current === 0 ? 1 : 0
        Pieces[selected].occupiedSquares[Pieces[selected].position] = 0;
        Pieces[selected].occupiedSquares[clickedPos] = 1;
        if (attackedPiece) {
            Pieces[attackedPiece].occupiedSquares[clickedPos] = 0;
            delete Pieces[attackedPiece];
        }
        if ((selected == "bking" || selected == "wking") && (clickedPos == Pieces[selected].position - 2 || clickedPos == Pieces[selected].position + 2)) {
            playCastlingMove(clickedPos, selected, Pieces)
        }
        let ep = Pieces[selected].en_pasant[0];
        if (ep && Pieces[ep] && Pieces[selected].constructor.name == "pawn")
            playEnPasant(Pieces, selected, ep, clickedPos);
        if (Pieces[selected].constructor.name == "pawn" && clickedPos == Pieces[selected].position - 16 || clickedPos == Pieces[selected].position + 16)
            Pieces[selected].en_pasant[0] = selected;
        else Pieces[selected].en_pasant[0] = null;

        if (Pieces[selected].constructor.name == "rook" || Pieces[selected].constructor.name == "king" || Pieces[selected].constructor.name == "pawn") {
            Pieces[selected].hasMoved = true;
        }
        Pieces[selected].position = clickedPos;
        PiecesRef.current = Pieces
        setPieces(Pieces)
        if (!wasOpponentMove && Pieces[selected].constructor.name == "pawn" && (clickedPos <= 7 || clickedPos >= 56)) {
            Promotion.current = { ...Promotion.current, promoted: true, promotedPawn: selected, clickedPos: clickedPos };
            promotionModalDisclosure.onOpen()
        }
        else if (!wasOpponentMove) {
            socket.emit('opponent move', { selected: selected, clickedPos: clickedPos, gameid: gameid })
        }
    }
    setSelected(null);
    return flag
}

function playEnPasant(Pieces, selected, ep, clickedPos) {
    if (Pieces[ep].color == Pieces[selected].color || (Pieces[ep].position != Pieces[selected].position - 1 && Pieces[ep].position != Pieces[selected].position + 1)) return;
    if (clickedPos == Pieces[ep].position - 8 || clickedPos == Pieces[ep].position + 8) {
        Pieces[ep].occupiedSquares[Pieces[ep].position] = 0;
        delete Pieces[ep];
    }
}

function playCastlingMove(clickedPos, selected, Pieces) {
    if (clickedPos == Pieces[selected].position - 2) {
        let rook = (Pieces[selected].color == "black" ? "b" : "w") + "rook1";
        Pieces[rook].occupiedSquares[Pieces[rook].position] = 0;
        Pieces[rook].position += 2;
        Pieces[rook].occupiedSquares[Pieces[rook].position] = 1;

    }
    if (clickedPos == Pieces[selected].position + 2) {
        let rook = (Pieces[selected].color == "black" ? "b" : "w") + "rook2";
        Pieces[rook].occupiedSquares[Pieces[rook].position] = 0;
        Pieces[rook].position -= 3;
        Pieces[rook].occupiedSquares[Pieces[rook].position] = 1;
    }
}

function boardClicked({boardObject,clickedPos}) {
    let {PiecesRef,setSelected,turn,color} = boardObject
    
    let Pieces = PiecesRef.current
    let selected = null;
    for (let piece in Pieces) {
        if (Pieces[piece].position == clickedPos) {
            selected = piece;
        }
    }
    
    
    if (selected === null || Pieces[selected].color != color) return;
    
    
    if (turn.current === 0) return;
    let checkingMate = false;
    selectPiece(Pieces, selected, setSelected, checkingMate)
}

function selectPiece(Pieces, selected, setSelected, checkingMate) {
    Pieces[selected].getAttackedSquares();
    for (let i = 0; i < 64; i++) {
        if (Pieces[selected].attackedSquares[i]) {
            Pieces[selected].attackedSquares[i] = playVirtualMove(Pieces, selected, i) ? 1 : 0;

        }
    }
    if (selected == "bking" || selected == "wking") {
        Pieces[selected].getCastlingMoves(Pieces);
    }
    if (Pieces[selected].constructor.name == "pawn") {
        checkEnPasant(Pieces, selected);
    }
    for (let i = 0; i < 64; i++) {
        if (Pieces[selected].attackedSquares[i] === 1) {
            if (!checkingMate) {
                setSelected(selected)
            }
            return true
        }
    }
    if (!checkingMate) setSelected(null);
    return false;
}
function playVirtualMove(originalPieces, selected, i) {
    let Pieces = { ...originalPieces }
    // console.log("here")
    // console.log(selected,i,JSON.stringify(Pieces))
    // console.log(JSON.stringify(Pieces[selected].position))
    let pos = Pieces[selected].position;
    let pieceAttacked = false;
    let Possible = true;
    for (let pc in Pieces) {
        if (Pieces[pc].color !== Pieces[selected].color && Pieces[pc].position === i) {
            pieceAttacked = true;
            Pieces[pc].occupiedSquares[i] = 0;
            delete Pieces[pc];
            break;
        }
    }
    
    Pieces[selected].occupiedSquares[pos] = 0;
    Pieces[selected].position = i;
    Pieces[selected].occupiedSquares[i] = 1;
    
    for (let pc in Pieces) {
        if (Pieces[pc].color != Pieces[selected].color) {
            Pieces[pc].getAttackedSquares();
            let king = (Pieces[selected].color === "black" ? "b" : "w") + "king";
            
            // console.log("here")
            // console.log(Pieces[king].position)
            if (Pieces[pc].attackedSquares[Pieces[king].position]) {
                Possible = false;
                break;
            }
        }
    }
    if (pieceAttacked) Pieces[selected].opponentOccupiedSquares[i] = 1;

    Pieces[selected].occupiedSquares[pos] = 1;
    Pieces[selected].position = pos;
    Pieces[selected].occupiedSquares[i] = 0;

    return Possible;
}

function checkEnPasant(originalPieces, selected) {
    let Pieces = { ...originalPieces };
    let ep = Pieces[selected].en_pasant[0];
    if (!ep || Pieces[ep].color == Pieces[selected].color) return;
    let dir = Pieces[selected].color == "black" ? -1 : 1;
    let pos = Pieces[selected].position;
    let king = (Pieces[selected].color == "black" ? "b" : "w") + "king";

    if ((pos + 1) % 8 != 0 && pos + 1 == Pieces[ep].position) {
        Pieces[ep].occupiedSquares[pos + 1] = 0;
        delete Pieces[ep];

        let i;
        if (dir == 1) i = pos + 9 * dir;
        if (dir == -1) i = pos + 7 * dir;
        Pieces[selected].attackedSquares[i] = 1;
        Pieces[selected].occupiedSquares[pos] = 0;
        Pieces[selected].occupiedSquares[i] = 1;
        Pieces[selected].position = i;

        for (let pc in Pieces) {
            if (Pieces[pc].color != Pieces[selected].color) {
                Pieces[pc].getAttackedSquares();
                if (Pieces[pc].attackedSquares[Pieces[king].position]) {
                    Pieces[selected].attackedSquares[i] = 0;
                    break;
                }
            }
        }

        Pieces[selected].occupiedSquares[pos] = 1;
        Pieces[selected].occupiedSquares[i] = 0;
        Pieces[selected].position = pos;
        Pieces[selected].opponentOccupiedSquares[pos + 1] = 1;
    }
    else if ((pos) % 8 != 0 && pos - 1 == Pieces[ep].position) {
        Pieces[ep].occupiedSquares[pos - 1] = 0;
        delete Pieces[ep];

        let i;
        if (dir == 1) i = pos + 7 * dir;
        if (dir == -1) i = pos + 9 * dir;

        Pieces[selected].attackedSquares[i] = 1;
        Pieces[selected].occupiedSquares[pos] = 0;
        Pieces[selected].occupiedSquares[i] = 1;
        Pieces[selected].position = i;

        for (let pc in Pieces) {
            if (Pieces[pc].color != Pieces[selected].color) {
                Pieces[pc].getAttackedSquares();
                if (Pieces[pc].attackedSquares[Pieces[king].position]) {
                    Pieces[selected].attackedSquares[i] = 0;
                    break;
                }
            }
        }

        Pieces[selected].occupiedSquares[pos] = 1;
        Pieces[selected].occupiedSquares[i] = 0;
        Pieces[selected].position = pos;
        Pieces[selected].opponentOccupiedSquares[pos - 1] = 1;
    }

}

function checkForMate({boardObject, checkMate, checkMateModalDisclosure}) {

    let {PiecesRef,color,gameid} = boardObject

    let Pieces = PiecesRef.current;
    let opponentColor = color === "black" ? "white" : "black"
    let checkingMate = true
    let setSelected = {}
    for (let piece in Pieces) {
        if (Pieces[piece].color === opponentColor) {
            if (selectPiece(Pieces, piece, setSelected, checkingMate)) {

                return false;
            }
        }
    }
    checkMate.current = (opponentColor)
    checkMateModalDisclosure.onOpen()
    socket.emit("checkmated", { opponentColor: opponentColor, gameid: gameid })
    return true;

}

function addPiece(pieceName, boardObject,Promotion,checkMate,promotionModalDisclosure,checkMateModalDisclosure) {
    let {PiecesRef,color,setPieces,gameid}=boardObject
    let clickedPos = Promotion.current.clickedPos
    let promotedPawn = Promotion.current.promotedPawn

    let max = 0
    let Pieces = PiecesRef.current

    for (let pc in Pieces) {
        if (Pieces[pc].position === clickedPos) {
            Pieces[pc].occupiedSquares[clickedPos] = 0
            delete Pieces[pc]

        }
    }
    for (let pc in Pieces) {
        if (Pieces[pc].constructor.name === pieceName && Pieces[pc].color === color) {
            max = Math.max(pc.match(/\d+/), max);
        }
    }
    let piece = color === "white" ? "w" + pieceName + (max + 1).toString() : "b" + pieceName + (max + 1).toString()

    switch (pieceName) {
        case "queen":
            Pieces[piece] = new queen(clickedPos + 1, color, pieceImages[color === "white" ? "wqueen" : "bqueen"])
            break
        case "rook":
            Pieces[piece] = new rook(clickedPos + 1, color, pieceImages[color === "white" ? "wrook" : "brook"])
            break;
        case "bishop":
            Pieces[piece] = new bishop(clickedPos + 1, color, pieceImages[color === "white" ? "wbishop" : "bbishop"])
            break
        case "knight":
            Pieces[piece] = new knight(clickedPos + 1, color, pieceImages[color === "white" ? "wknight" : "bknight"])
            break
    }
    Pieces[piece].occupiedSquares[clickedPos] = 1

    PiecesRef.current = Pieces
    setPieces((oldPieces) => ({ ...Pieces }))

    if (promotionModalDisclosure && promotionModalDisclosure.onClose) {
        promotionModalDisclosure.onClose()
        
        let boardObject = {PiecesRef:PiecesRef,color:color,gameid:gameid}
        checkForMate({boardObject, checkMate, checkMateModalDisclosure});
        Promotion.current = { promoted: false, x: 55, y: 55, promotedPawn: "", clickedPos: 0 }
        let move = { promotedPawn: promotedPawn, clickedPos: clickedPos, promoteTo: pieceName, color: color, gameid: gameid }
        socket.emit('promotion', move)
    }

}

export { playMove, boardClicked, checkForMate, addPiece,playCastlingMove,playEnPasant,selectPiece }