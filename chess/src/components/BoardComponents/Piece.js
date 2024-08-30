import { en_pasant,blackPositions,whitePositions, pieceImages } from "../FunctionsAndUtilities/Utils.js";
class piece {
    position;
    color;
    image;
    occupiedSquares;
    opponentOccupiedSquares;
    attackedSquares;
    en_pasant;
    hasMoved;

    constructor(position, color, image) {
        this.attackedSquares = new Array(64).fill(0);
        this.color = color;
        this.position = position - 1;
        this.image = image;
        this.occupiedSquares = color == "black" ? blackPositions : whitePositions;
        this.opponentOccupiedSquares = color == "black" ? whitePositions : blackPositions;
        this.en_pasant = en_pasant
        this.hasMoved = false
        
    }

    deepClone(){

    }

}
class bishop extends piece {
    constructor(position, color, image) {
        super(position, color, image);
    }
    getAttackedSquares() {
        this.attackedSquares.fill(0);
        this.getDiagonalMoves();
    }
    getDiagonalMoves() {
        let i = this.position, j = this.position, k = this.position, l = this.position;
        while (i < 56 && (i + 1) % 8 && !this.occupiedSquares[i + 9]) {
            this.attackedSquares[i + 9] = 1;
            if (this.opponentOccupiedSquares[i + 9]) break;
            i += 9;
        }
        while (j < 56 && j % 8 && !this.occupiedSquares[j + 7]) {
            this.attackedSquares[j + 7] = 1;
            if (this.opponentOccupiedSquares[j + 7]) break;
            j += 7
        }
        while (k > 7 && (k + 1) % 8 && !this.occupiedSquares[k - 7]) {
            this.attackedSquares[k - 7] = 1;
            if (this.opponentOccupiedSquares[k - 7]) break;
            k -= 7;
        }
        while (l > 7 && l % 8 && !this.occupiedSquares[l - 9]) {
            this.attackedSquares[l - 9] = 1;
            if (this.opponentOccupiedSquares[l - 9]) break;
            l -= 9;
        }

    }
}
class knight extends piece {
    constructor(index, color, image) {
        super(index, color, image);
    }
    getAttackedSquares() {
        this.attackedSquares.fill(0);
        this.getKnightMoves();
    }
    getKnightMoves() {
        let l1 = 1, l2 = 1, r1 = 1, r2 = 1, u1 = 1, u2 = 1, d1 = 1, d2 = 1;

        if ((this.position) % 8 == 0) { l1 = 0; l2 = 0; }
        if ((this.position) % 8 == 1) { l2 = 0; }
        if ((this.position + 1) % 8 == 0) { r1 = 0; r2 = 0; }
        if ((this.position + 2) % 8 == 0) { r2 = 0; }
        if (this.position >= 56) { u1 = 0; u2 = 0; }
        if (this.position >= 48) { u2 = 0; }
        if (this.position <= 7) { d1 = 0; d2 = 0; }
        if (this.position <= 15) { d2 = 0; }

        if (l1 && u2 && !this.occupiedSquares[this.position + 15]) this.attackedSquares[this.position + 15] = 1;
        if (l2 && u1 && !this.occupiedSquares[this.position + 6]) this.attackedSquares[this.position + 6] = 1;
        if (r1 && u2 && !this.occupiedSquares[this.position + 17]) this.attackedSquares[this.position + 17] = 1;
        if (r2 && u1 && !this.occupiedSquares[this.position + 10]) this.attackedSquares[this.position + 10] = 1;
        if (l1 && d2 && !this.occupiedSquares[this.position - 17]) this.attackedSquares[this.position - 17] = 1;
        if (l2 && d1 && !this.occupiedSquares[this.position - 10]) this.attackedSquares[this.position - 10] = 1;
        if (r1 && d2 && !this.occupiedSquares[this.position - 15]) this.attackedSquares[this.position - 15] = 1;
        if (r2 && d1 && !this.occupiedSquares[this.position - 6]) this.attackedSquares[this.position - 6] = 1;

    }
}
class rook extends piece {
    // hasMoved;
    constructor(index, color, image) {
        super(index, color, image);
        this.hasMoved = false;
    }
    getAttackedSquares() {
        this.attackedSquares.fill(0);
        this.getStraightMoves();
    }
    getStraightMoves() {
        let i = this.position, j = this.position, k = this.position, l = this.position;
        while (i < 56 && !this.occupiedSquares[i + 8]) {
            this.attackedSquares[i + 8] = 1;
            if (this.opponentOccupiedSquares[i + 8]) break;
            i += 8
        }
        while (j > 7 && !this.occupiedSquares[j - 8]) {
            this.attackedSquares[j - 8] = 1;
            if (this.opponentOccupiedSquares[j - 8]) break;
            j -= 8
        }
        while (k % 8 != 0 && !this.occupiedSquares[k - 1]) {
            this.attackedSquares[k - 1] = 1;
            if (this.opponentOccupiedSquares[k - 1]) break;
            k -= 1;
        }
        while ((l + 1) % 8 != 0 && !this.occupiedSquares[l + 1]) {
            this.attackedSquares[l + 1] = 1;
            if (this.opponentOccupiedSquares[l + 1]) break;
            l += 1;
        }

    }
}
class queen extends piece {
    constructor(index, color, image) {
        super(index, color, image);
    }
    getAttackedSquares() {
        this.attackedSquares.fill(0);
        this.getStraightMoves();
        this.getDiagonalMoves();
    }
    getStraightMoves() {
        let i = this.position, j = this.position, k = this.position, l = this.position;
        while (i < 56 && !this.occupiedSquares[i + 8]) {
            this.attackedSquares[i + 8] = 1;
            if (this.opponentOccupiedSquares[i + 8]) break;
            i += 8
        }
        while (j > 7 && !this.occupiedSquares[j - 8]) {
            this.attackedSquares[j - 8] = 1;
            if (this.opponentOccupiedSquares[j - 8]) break;
            j -= 8
        }
        while (k % 8 != 0 && !this.occupiedSquares[k - 1]) {
            this.attackedSquares[k - 1] = 1;
            if (this.opponentOccupiedSquares[k - 1]) break;
            k -= 1;
        }
        while ((l + 1) % 8 != 0 && !this.occupiedSquares[l + 1]) {
            this.attackedSquares[l + 1] = 1;
            if (this.opponentOccupiedSquares[l + 1]) break;
            l += 1;
        }

    }
    getDiagonalMoves() {
        let i = this.position, j = this.position, k = this.position, l = this.position;
        while (i < 56 && (i + 1) % 8 && !this.occupiedSquares[i + 9]) {
            this.attackedSquares[i + 9] = 1;
            if (this.opponentOccupiedSquares[i + 9]) break;
            i += 9;
        }
        while (j < 56 && j % 8 && !this.occupiedSquares[j + 7]) {
            this.attackedSquares[j + 7] = 1;
            if (this.opponentOccupiedSquares[j + 7]) break;
            j += 7
        }
        while (k > 7 && (k + 1) % 8 && !this.occupiedSquares[k - 7]) {
            this.attackedSquares[k - 7] = 1;
            if (this.opponentOccupiedSquares[k - 7]) break;
            k -= 7;
        }
        while (l > 7 && l % 8 && !this.occupiedSquares[l - 9]) {
            this.attackedSquares[l - 9] = 1;
            if (this.opponentOccupiedSquares[l - 9]) break;
            l -= 9;
        }

    }
}
class king extends piece {
    // hasMoved;
    constructor(index, color, image) {
        super(index, color, image);
        this.hasMoved = false;
    }
    getAttackedSquares() {
        this.attackedSquares.fill(0);
        this.getKingMoves();
    }
    getKingMoves() {
        if (this.position % 8 && !this.occupiedSquares[this.position - 1]) this.attackedSquares[this.position - 1] = 1;
        if ((this.position + 1) % 8 && !this.occupiedSquares[this.position + 1]) this.attackedSquares[this.position + 1] = 1;
        if (this.position < 56 && !this.occupiedSquares[this.position + 8]) this.attackedSquares[this.position + 8] = 1;
        if (this.position > 7 && !this.occupiedSquares[this.position - 8]) this.attackedSquares[this.position - 8] = 1;
        if (this.position % 8 && this.position < 56 && !this.occupiedSquares[this.position + 7]) this.attackedSquares[this.position + 7] = 1;
        if ((this.position + 1) % 8 && this.position < 56 && !this.occupiedSquares[this.position + 9]) this.attackedSquares[this.position + 9] = 1;
        if (this.position % 8 && this.position > 7 && !this.occupiedSquares[this.position - 9]) this.attackedSquares[this.position - 9] = 1;
        if ((this.position + 1) % 8 && this.position > 7 && !this.occupiedSquares[this.position - 7]) this.attackedSquares[this.position - 7] = 1;
    }
    getCastlingMoves(Pieces) {
        if (this.canCastleLong(Pieces))
            this.attackedSquares[this.position + 2] = 1;
        if (this.canCastleShort(Pieces))
            this.attackedSquares[this.position - 2] = 1;
    }
    canCastleLong(Pieces) {

        let rook = (this.color == "white" ? "w" : "b") + "rook2";
        let pos = this.position;

        if (this.hasMoved || Pieces[rook]==undefined ||  Pieces[rook].hasMoved) return false;
        if (this.occupiedSquares[pos + 1] || this.occupiedSquares[pos + 2] || this.occupiedSquares[pos + 3] || this.opponentOccupiedSquares[pos + 1] || this.opponentOccupiedSquares[pos + 2] || this.opponentOccupiedSquares[pos + 3]) return false;
        for (let piece in Pieces) {
            if (Pieces[piece].color != this.color) {
                if (Pieces[piece].attackedSquares[pos] || Pieces[piece].attackedSquares[pos + 1] || Pieces[piece].attackedSquares[pos + 2]) return false;
            }
        }
        return true;
    }
    canCastleShort(Pieces) {

        let rook = (this.color == "white" ? "w" : "b") + "rook1";
        let pos = this.position;

        if (this.hasMoved || Pieces[rook]==undefined || Pieces[rook].hasMoved) return false;
        if (this.occupiedSquares[pos - 1] || this.occupiedSquares[pos - 2] || this.opponentOccupiedSquares[pos - 1] || this.opponentOccupiedSquares[pos - 2]) return false;
        for (let piece in Pieces) {
            if (Pieces[piece].color != this.color) {
                if (Pieces[piece].attackedSquares[pos] || Pieces[piece].attackedSquares[pos - 1] || Pieces[piece].attackedSquares[pos - 2]) return false;
            }
        }
        return true;
    }
}
class pawn extends piece {
    // hasMoved;
    
    constructor(index, color, image) {
        super(index, color, image);
        this.hasMoved = false;
        
    }
    getAttackedSquares() {
        this.attackedSquares.fill(0);
        this.getPawnMoves();
    }
    getPawnMoves() {
        let dir = this.color == "black" ? -1 : 1;
        let pos = this.position;
        if ((pos + 8 * dir) < 0 || (pos + 8 * dir) > 63) return;

        if (!this.occupiedSquares[pos + 8 * (dir)] && !this.opponentOccupiedSquares[pos + 8 * (dir)]) {
            this.attackedSquares[pos + 8 * (dir)] = 1;
            if (!this.hasMoved && (pos + 16 * dir) > 0 && (pos + 16 * dir) < 64 && !this.occupiedSquares[pos + 16 * (dir)] && !this.opponentOccupiedSquares[pos + 16 * (dir)]) this.attackedSquares[pos + 16 * dir] = 1;
        }
        if (dir == 1 && (this.position+1) % 8 != 0 && this.opponentOccupiedSquares[pos + 9 * dir]) this.attackedSquares[pos + 9 * dir] = 1;
        if (dir == -1 && (this.position+1) % 8 != 0 && this.opponentOccupiedSquares[pos + 7 * dir]) this.attackedSquares[pos + 7 * dir] = 1;
        
        if (dir == 1 && (this.position % 8 != 0) && this.opponentOccupiedSquares[pos + 7 * dir]) this.attackedSquares[pos + 7 * dir] = 1;
        if (dir == -1 && (this.position % 8 != 0) && this.opponentOccupiedSquares[pos + 9 * dir]) this.attackedSquares[pos + 9 * dir] = 1;
    }
    

}


let createInitialPieces = ()=>{
    return({
    wrook1: new rook(1, "white", pieceImages.wrook),
    wrook2: new rook(8, "white", pieceImages.wrook),
    wbishop1: new bishop(3, "white", pieceImages.wbishop),
    wbishop2: new bishop(6, "white", pieceImages.wbishop),
    wknight1: new knight(2, "white", pieceImages.wknight),
    wknight2: new knight(7, "white", pieceImages.wknight),
    wqueen: new queen(5, "white", pieceImages.wqueen),
    wking: new king(4, "white", pieceImages.wking),
    wpawn1: new pawn(9, "white", pieceImages.wpawn),
    wpawn2: new pawn(10, "white", pieceImages.wpawn),
    wpawn3: new pawn(11, "white", pieceImages.wpawn),
    wpawn4: new pawn(12, "white", pieceImages.wpawn),
    wpawn5: new pawn(13, "white", pieceImages.wpawn),
    wpawn6: new pawn(14, "white", pieceImages.wpawn),
    wpawn7: new pawn(15, "white", pieceImages.wpawn),
    wpawn8: new pawn(16, "white", pieceImages.wpawn),
    brook1: new rook(57, "black", pieceImages.brook),
    brook2: new rook(64, "black", pieceImages.brook),
    bbishop1: new bishop(59, "black", pieceImages.bbishop),
    bbishop2: new bishop(62, "black", pieceImages.bbishop),
    bknight1: new knight(58, "black", pieceImages.bknight),
    bknight2: new knight(63, "black", pieceImages.bknight),
    bqueen: new queen(61, "black", pieceImages.bqueen),
    bking: new king(60, "black", pieceImages.bking),
    bpawn1: new pawn(49, "black", pieceImages.bpawn),
    bpawn2: new pawn(50, "black", pieceImages.bpawn),
    bpawn3: new pawn(51, "black", pieceImages.bpawn),
    bpawn4: new pawn(52, "black", pieceImages.bpawn),
    bpawn5: new pawn(53, "black", pieceImages.bpawn),
    bpawn6: new pawn(54, "black", pieceImages.bpawn),
    bpawn7: new pawn(55, "black", pieceImages.bpawn),
    bpawn8: new pawn(56, "black", pieceImages.bpawn),
    })
};
export{createInitialPieces,rook,queen,bishop,knight};





