/* 
 * Piece Square Tables, adapted from Sunfish.py:
 * https://github.com/thomasahle/sunfish/blob/master/sunfish.py
 */
import { position } from "@chakra-ui/react";
import { selectPiece, playCastlingMove, playEnPasant } from "../components/FunctionsAndUtilities/Logic"
import { queen, bishop, rook, knight } from "../components/BoardComponents/Piece.js"
import { pieceImages } from "../components/FunctionsAndUtilities/Utils";
let weights = { pawn: 100, knight: 280, bishop: 320, rook: 479, queen: 929, king: 60000, king_end: 60000 };
let pst_b = {
    'pawn': [
        100, 100, 100, 100, 105, 100, 100, 100,
        78, 83, 86, 73, 102, 82, 85, 90,
        7, 29, 21, 44, 40, 31, 44, 7,
        -17, 16, -2, 15, 14, 0, 15, -13,
        -26, 3, 10, 9, 6, 1, 0, -23,
        -22, 9, 5, -11, -10, -2, 3, -19,
        -31, 8, -7, -37, -36, -14, 3, -31,
        0, 0, 0, 0, 0, 0, 0, 0
    ],
    'knight': [
        -66, -53, -75, -75, -10, -55, -58, -70,
        -3, -6, 100, -36, 4, 62, -4, -14,
        10, 67, 1, 74, 73, 27, 62, -2,
        24, 24, 45, 37, 33, 41, 25, 17,
        -1, 5, 31, 21, 22, 35, 2, 0,
        -18, 10, 13, 22, 18, 15, 11, -14,
        -23, -15, 2, 0, 2, 0, -23, -20,
        -74, -23, -26, -24, -19, -35, -22, -69
    ],
    'bishop': [
        -59, -78, -82, -76, -23, -107, -37, -50,
        -11, 20, 35, -42, -39, 31, 2, -22,
        -9, 39, -32, 41, 52, -10, 28, -14,
        25, 17, 20, 34, 26, 25, 15, 10,
        13, 10, 17, 23, 17, 16, 0, 7,
        14, 25, 24, 15, 8, 25, 20, 15,
        19, 20, 11, 6, 7, 6, 20, 16,
        -7, 2, -15, -12, -14, -15, -10, -10
    ],
    'rook': [
        35, 29, 33, 4, 37, 33, 56, 50,
        55, 29, 56, 67, 55, 62, 34, 60,
        19, 35, 28, 33, 45, 27, 25, 15,
        0, 5, 16, 13, 18, -4, -9, -6,
        -28, -35, -16, -21, -13, -29, -46, -30,
        -42, -28, -42, -25, -25, -35, -26, -46,
        -53, -38, -31, -26, -29, -43, -44, -53,
        -30, -24, -18, 5, -2, -18, -31, -32
    ],
    'queen': [
        6, 1, -8, -104, 69, 24, 88, 26,
        14, 32, 60, -10, 20, 76, 57, 24,
        -2, 43, 32, 60, 72, 63, 43, 2,
        1, -16, 22, 17, 25, 20, -13, -6,
        -14, -15, -2, -5, -1, -10, -20, -22,
        -30, -6, -13, -11, -16, -11, -16, -27,
        -36, -18, 0, -19, -15, -15, -21, -38,
        -39, -30, -31, -13, -31, -36, -34, -42
    ],
    'king': [
        4, 54, 47, -99, -99, 60, 83, -62,
        -32, 10, 55, 56, 56, 55, 10, 3,
        -62, 12, -57, 44, -67, 28, 37, -31,
        -55, 50, 11, -4, -19, 13, 0, -49,
        -55, -43, -52, -28, -51, -47, -8, -50,
        -47, -42, -43, -79, -64, -32, -29, -32,
        -4, 3, -14, -50, -57, -18, 13, 4,
        17, 30, -3, -14, 6, -1, 40, 18
    ],

    // Endgame King Table
    'king_end': [
        -50, -40, -30, -20, -20, -30, -40, -50,
        -30, -20, -10, 0, 0, -10, -20, -30,
        -30, -10, 20, 30, 30, 20, -10, -30,
        -30, -10, 30, 40, 40, 30, -10, -30,
        -30, -10, 30, 40, 40, 30, -10, -30,
        -30, -10, 20, 30, 30, 20, -10, -30,
        -30, -30, 0, 0, 0, 0, -30, -30,
        -50, -30, -30, -30, -30, -30, -30, -50
    ]
};
let pst_w = {
    'pawn': pst_b['pawn'].slice().reverse(),
    'knight': pst_b['knight'].slice().reverse(),
    'bishop': pst_b['bishop'].slice().reverse(),
    'rook': pst_b['rook'].slice().reverse(),
    'queen': pst_b['queen'].slice().reverse(),
    'king': pst_b['king'].slice().reverse(),
    'king_end': pst_b['king_end'].slice().reverse()
}
export default function playComputerMove(PiecesRef, depth, isMaximizingPlayer) {
    let pieceArray = { ...PiecesRef.current }
    let allMoves = getAllMoves(pieceArray, isMaximizingPlayer)
    let [bestMove, bestSum] = minimax(pieceArray, allMoves, isMaximizingPlayer, 2)
    playMove(pieceArray, bestMove.to, bestMove.piece)
    PiecesRef.current = pieceArray
}

function minimax(pieceArray, allMoves, isMaximizingPlayer, depth) {
    
    if (depth <= 0) {
        let evaluationSumCurrent = evaluateBoard(pieceArray)
        return [null, evaluationSumCurrent]
    }

    let mini = Number.MAX_SAFE_INTEGER, maxi = Number.MIN_SAFE_INTEGER;
    let bestMinimizingMove, bestMaximizingMove

    for (let iter in allMoves) {
        let move = allMoves[iter]
        let pieceCurrent = { ...pieceArray }
        let [obj, wp, bp, ep, condition] = playThisMove(pieceCurrent, move);
        if (condition === 'fatal') {

            return [move, pieceCurrent[move.piece].color==='black'?Number.MIN_SAFE_INTEGER:Number.MAX_SAFE_INTEGER]
        }
        let allMovesCurrent = getAllMoves(pieceCurrent, !isMaximizingPlayer);
        let [bestChileMove, bestChildSum] = minimax(pieceCurrent, allMovesCurrent, !isMaximizingPlayer, depth - 1)
        if (bestChildSum > maxi) {
            maxi = bestChildSum;
            bestMaximizingMove = move;
        }
        if (bestChildSum < mini) {
            mini = bestChildSum
            bestMinimizingMove = move
        }
        undoThisMove(pieceCurrent, obj, wp, bp, ep);
    }

    if (isMaximizingPlayer) {
        return [bestMaximizingMove, maxi];
    }
    else {
        return [bestMinimizingMove, mini]
    }
}
function getAllMoves(pieceArray, isMaximizingPlayer) {
    let color = isMaximizingPlayer ? "white" : "black";
    let allMoves = []
    for (let piece in pieceArray) {
        if (pieceArray[piece].color === color) {
            selectPiece(pieceArray, piece, null, true)
            for (let i = 0; i < 64; i++) {
                if (pieceArray[piece].attackedSquares[i]) {
                    allMoves.push({
                        piece: piece,
                        from: pieceArray[piece].position,
                        to: i
                    })
                }
            }
        }
    }
    return allMoves
}

function playThisMove(pieceArray, move) {
    let wp = new Array(64)
    let bp = new Array(64)
    wp.fill(0)
    bp.fill(0)
    let obj = {};
    for (let piece in pieceArray) {
        obj[piece] = { position: pieceArray[piece].position, hasMoved: pieceArray[piece].hasMoved }
        if (pieceArray[piece].color === "black") bp[pieceArray[piece].position] = 1;
        else wp[pieceArray[piece].position] = 1;
    }
    let ep = pieceArray['wking'].en_pasant[0]
    let condition = playMove(pieceArray, move.to, move.piece)
    return [obj, wp, bp, ep, condition]
}

function undoThisMove(pieceArray, obj, wp, bp, ep) {
    let done = false;
    for (let piece in obj) {
        if (pieceArray[piece]) {
            pieceArray[piece].position = obj[piece].position
            pieceArray[piece].hasMoved = obj[piece].hasMoved
        }
        if (!done && pieceArray[piece] && pieceArray[piece].color === "black") {
            done = true;
            pieceArray[piece].en_pasant[0] = ep;
            for (let i = 0; i < 63; i++) {
                pieceArray[piece].occupiedSquares[i] = bp[i]
                pieceArray[piece].opponentOccupiedSquares[i] = wp[i]
            }
        }
    }
}

function playMove(Pieces, clickedPos, selected) {
    let sum = 0;
    let attackedPiece = null;
    for (let piece in Pieces) {
        if (Pieces[piece].position == clickedPos)
            attackedPiece = piece;
    }
    Pieces[selected].occupiedSquares[Pieces[selected].position] = 0;
    Pieces[selected].occupiedSquares[clickedPos] = 1;
    if (attackedPiece) {
        Pieces[attackedPiece].occupiedSquares[clickedPos] = 0;
        let name = Pieces[attackedPiece].constructor.name
        delete Pieces[attackedPiece];
        if (name === 'king') return 'fatal'
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

    // if (Pieces[selected].constructor.name == "pawn" && (clickedPos <= 7 || clickedPos >= 56)) {
    //     let color = Pieces[selected].color
    //     addPiece('queen',Pieces,clickedPos,color)
    // }

    return 'safe'
}
function evaluateBoard(pieceArray) {
    let total = 0;
    for (let piece in pieceArray) {
        if (pieceArray[piece].color === "white") {
            total += weights[pieceArray[piece].constructor.name]
            total+=pst_w[pieceArray[piece].constructor.name][pieceArray[piece].position]
            
        }
        else {
            total -= weights[pieceArray[piece].constructor.name]
            total -= pst_b[pieceArray[piece].constructor.name][pieceArray[piece].position]
        }
    }

    return total;
}

function addPiece(pieceName,Pieces,clickedPos,color) {
    
    let max = 0
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
}