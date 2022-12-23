import React from "react"
import { Color, initialBoard, PieceType } from "../Constants"
import { Piece, Position } from "../models"
import Chessboard from "./Chessboard"
import Footer from "./Footer"
import Header from "./Header"
import PromotionModal from "./PromotionModal"

function Referee() {
    const promotionModalRef = React.useRef<HTMLDivElement>(null)
    const [promotionPawn, setPromotionPawn] = React.useState<Piece | null>(null)
    const [pieces, setPieces] = React.useState<Piece[]>(initialBoard) //can be changed to object later for faster access
    const [validPos, setValidPos] = React.useState<Position[]>([])
    const [activePiece, setActivePiece] = React.useState<Piece | null>(null)
    const [enPassantPiece, setEnPassantPiece] = React.useState<Piece | null>(null)
    const [capturedWhite, setCapturedWhite] = React.useState<Set<Piece>>(new Set())
    const [capturedBlack, setCapturedBlack] = React.useState<Set<Piece>>(new Set())

    function isOccupied(pos: Position) {
        return pieces.some(p => p.position.x === pos.x && p.position.y === pos.y)
    }

    function isOccupiedByOpponent(pos: Position, color: Color) {
        const opposite_color: Color = color === Color.White ? Color.Black : Color.White
        return pieces.some(p => p.position.x === pos.x && p.position.y === pos.y && p.color === opposite_color)
    }

    function isEligibleForEnPassant(pos: Position) {
        return enPassantPiece && enPassantPiece.position.samePosition(pos)
    }

    function isEnpassantMove(boardPiece: Piece, curPiece: Piece): boolean {
        const z = (
            enPassantPiece &&
            enPassantPiece.id !== activePiece!.id &&
            boardPiece.id === enPassantPiece.id &&
            activePiece!.type === PieceType.Pawn &&
            enPassantPiece.position.samePosition(new Position(curPiece.position.x, activePiece!.position.y))
            //enPassantPiece.x === x && enPassantPiece.y === activePiece.y)
        )!
        return (z)
    }

    function capturePiece(piece: Piece) {
        piece.color === Color.White ?
            setCapturedWhite(prevCaptured => (prevCaptured.add(piece))) :
            setCapturedBlack(prevCaptured => (prevCaptured.add(piece)))
    }

    console.log('Rendered')

    function handleClick(event: React.MouseEvent, curPiece: Piece, valid: boolean = false) {
        if (valid) {
            const end_row = activePiece?.color === Color.White ? 7 : 0
            let active: Piece = activePiece!.clone()
            const isEligibleForPromotion: boolean = activePiece!.type === PieceType.Pawn && curPiece.position.y === end_row 
            
            //pawn promotion
                            // if (curPiece.type === PieceType.Pawn && curPiece.position.y === end_row) {
                            //     //pawn promotion    
                            // }

            console.log("Valid clicked at ", curPiece.position.x, curPiece.position.y)

            // move the piece to valid position
            setPieces(prev => {
                let res: Piece[] = []
                for (let i = 0; i < prev.length; i += 1) {

                    if (prev[i].position.samePosition(curPiece.position)) {
                        //remove this piece and add it to captured list
                        capturePiece(prev[i])
                    }
                    else {
                        //handle enpassant capture
                        if (enPassantPiece && prev[i].id === enPassantPiece!.id && isEnpassantMove(prev[i], curPiece)) {
                            //remove this piece and add it to captured list
                            capturePiece(prev[i])

                        } else {

                            //push piece back with updated coordinates for the moved piece
                            if (activePiece!.id === prev[i].id) {
                                active.setPosition = curPiece.position

                                if(isEligibleForPromotion){
                                    setPromotionPawn(active)
                                    promotionModalRef.current?.classList.remove("hidden");
                                }

                                res.push(active)
                            }
                            else {
                                res.push(prev[i])
                            }
                        }
                    }
                }
                return res
            })

            //set enPassantPiece if its pawn and moved by 2 positions
            if (activePiece!.type === PieceType.Pawn &&
                activePiece!.position.x === curPiece.position.x &&
                Math.abs(activePiece!.position.y - curPiece.position.y) === 2) {
                setEnPassantPiece(active)
            } else {
                //clear enPassantPiece
                setEnPassantPiece(null)
            }

            // clear valid pos
            setValidPos([])

            // clear active piece
            setActivePiece(null)
        }
        else if (curPiece.type !== PieceType.Empty) {
            // clear current valid pos
            setValidPos([])

            // set active piece
            setActivePiece(curPiece)

            // show valid spots
            setValidPos(showValidPos(curPiece))
        }
        else {
            // handle clicking of non valid spots
            // clear current valid pos
            setValidPos([])
        }
    }

    // Done No changes here
    // Find possible valid moves for selected piece in [rook, bishop, knight, queen and king]
    function findValidMoves(moves: Array<Array<number>>, piece: Piece) {
        let dir = Array(moves.length).fill(true);
        let proceed = true
        let possibleMoves: Position[] = []
        while (proceed) {
            moves.forEach((move_direction, idx) => {
                if (dir[idx]) {
                    const newPos = new Position(piece.position.x + move_direction[0], piece.position.y + move_direction[1])

                    if (newPos.isInRange()) {
                        if (!isOccupied(newPos)) {
                            possibleMoves.push(newPos)
                        }
                        else if (isOccupiedByOpponent(newPos, piece.color)) {
                            possibleMoves.push(newPos)
                            dir[idx] = false
                        }
                        else {
                            dir[idx] = false
                        }
                    }
                    else {
                        dir[idx] = false
                    }
                }
            })
            if (piece.type === PieceType.Knight || piece.type === PieceType.King) {
                break;
            }
            proceed = dir.reduce((a, b) => (a || b))
            moves = moves.map(x => x.map(t => t && t + Math.sign(t)))
        }
        return possibleMoves
    }

    // Done No changes here
    function showValidPos(piece: Piece): Position[] { //(type, x, y, color) {
        console.log("Piece Clicked", piece.type, piece.position.x, piece.position.y, piece.color)
        //logic to show correct pos
        let temp: Position[] = []
        const direction = piece.color === Color.White ? 1 : -1
        const special_row = piece.color === Color.White ? 1 : 6

        if (piece.type === PieceType.Pawn) {
            let newPos = new Position(piece.position.x, piece.position.y + direction)
            if (piece.position.y === special_row) {
                let specialPos = new Position(piece.position.x, piece.position.y + 2 * direction)
                if (newPos.isInRange() && !isOccupied(newPos) && specialPos.isInRange() && !isOccupied(specialPos)) {
                    temp.push(specialPos)
                }
            }
            if (newPos.isInRange() && !isOccupied(newPos)) {
                temp.push(newPos)
            }
            let x_direction = 1
            for (let i = 0; i < 2; i += 1) {
                x_direction *= -1
                let diagPos = new Position(piece.position.x + x_direction, piece.position.y + direction)
                let enPassantPos = new Position(piece.position.x + x_direction, piece.position.y)
                if (diagPos.isInRange()) {
                    if (isOccupiedByOpponent(diagPos, piece.color)) {
                        temp.push(diagPos)
                    }

                    if (isEligibleForEnPassant(enPassantPos)) {
                        temp.push(diagPos)
                    }
                }
            }
        }
        else {
            let moves: Array<Array<number>>
            switch (piece.type) {
                case PieceType.Rook:
                    moves = [[-1, 0], [1, 0], [0, 1], [0, -1]] //left, right, top, bottom
                    break;
                case PieceType.Bishop:
                    moves = [[-1, -1], [-1, 1], [1, 1], [1, -1]] //south-west, north-west, north-east, south-east
                    break;
                case PieceType.Knight:
                    moves = [[-1, 2], [1, 2], [-2, 1], [-2, -1], [2, 1], [2, -1], [-1, -2], [1, -2]]
                    break;
                case PieceType.Queen:
                    moves = [[-1, 0], [-1, 1], [0, 1], [1, 1], [1, 0], [1, -1], [0, -1], [-1, -1]]
                    break;
                case PieceType.King:
                    moves = [[-1, 0], [-1, 1], [0, 1], [1, 1], [1, 0], [1, -1], [0, -1], [-1, -1]]
                    break;
                default:
                    moves = []
                    console.log("Invalid Type")
            }
            temp = findValidMoves(moves, piece)
        }
        return temp
    }

    function promotePawn(type: PieceType){
        promotionModalRef.current?.classList.add("hidden")
        setPieces(prevPieces => (prevPieces.map(piece => {
            if(piece.id === promotionPawn!.id){
                piece.type = type
                piece.image = `${type}_${piece.color}.png`
            } 
            return piece
        })))
        setPromotionPawn(null)
    }

    const boardProps = {
        pieces, validPos, handleClick
    }

    const promotionModalProps = {
        promotePawn
    }

    return (
        <div className="bg-slate-200 max-w-full min-h-screen">
            <Header />
            <div className="hidden" ref={promotionModalRef}>
                <PromotionModal {...promotionModalProps} />
            </div>
            <Chessboard {...boardProps} />
            <Footer />
        </div>
    )
}

export default Referee