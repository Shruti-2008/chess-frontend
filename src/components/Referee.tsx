import React from "react"
import { EmitHelper } from "typescript"
import { BOARD_SIZE, Color, initialBoard, PieceType } from "../Constants"
import { Piece, Position } from "../models"
import { Move } from "../models/Move"
import Chessboard from "./Chessboard"
import Footer from "./Footer"
import Header from "./Header"
import PromotionModal from "./PromotionModal"

function Referee() {
    const [pieces, setPieces] = React.useState<Piece[]>([]) //can be changed to object later for faster access
    const [activePiece, setActivePiece] = React.useState<Piece | null>(null)
    const [promotionPawn, setPromotionPawn] = React.useState<Piece | null>(null)

    const [castleMove, setCastleMove] = React.useState<Position[]>([])
    const promotionModalRef = React.useRef<HTMLDivElement>(null)
    const [validPos, setValidPos] = React.useState<Position[]>([])
    const [enPassantPiece, setEnPassantPiece] = React.useState<Piece | null>(null) //comes from opponent
    const [capturedWhite, setCapturedWhite] = React.useState<Set<Piece>>(new Set())
    const [capturedBlack, setCapturedBlack] = React.useState<Set<Piece>>(new Set())

    //const [enPassantPosition, setEnPassantPosition] = React.useState<Position | null>(null)
    const [board, setBoard] = React.useState<Piece[][]>(initialBoard)
    const [pins, setPins] = React.useState<Piece[]>([])
    const [checkingPieces, setCheckingPieces] = React.useState<Piece[]>([])
    const [isChecked, setIsChecked] = React.useState<boolean>(false)
    const [player, setPlayer] = React.useState<Color>(Color.Black)
    const [moves, setMoves] = React.useState<Move[]>([])
    const [validMoves, setValidMoves] = React.useState<Move[]>([])
    const [moveStart, setMoveStart] = React.useState<Position | null>(null)
    const [promotionPawnPosition, setPromotionPawnPosition] = React.useState<Position | null>(null)

    React.useEffect(() => {
        findMoves([]) /************/
        changePlayer()
    }, [])

    console.log('Rendered')

    function opponentColor(color: Color) {
        return color === Color.White ? Color.Black : Color.White
    }

    function handleClick(event: React.MouseEvent, posClicked: Position, valid: boolean = false) {
        console.log("clicked ", posClicked)
        if (valid) {
            const enPassantPos = makeMove(posClicked)
            changePlayer()
            findMoves(enPassantPos)
            setMoveStart(null)
            setValidMoves([])
        } else {
            showValidMoves(posClicked)
            setMoveStart(posClicked)
        }
    }

    function makeMove(destPos: Position): Position[] {

        let enPassantPos: Position[] = []
        const src = board[moveStart!.x][moveStart!.y]
        const dest = board[destPos.x][destPos.y]

        const curMove = new Move(moveStart!, destPos)
        const move = moves.find(move => move.isEqual(curMove))

        if (dest.type !== PieceType.Empty && dest.color === opponentColor(src.color)) {
            capture(dest)
        }

        //enpassant
        if (move && move!.isEnPassantMove) { //maybe improve????????????
            console.log("Enpassant capturing piece : ",moveStart!.x, destPos.y)
            const enPassantPosition = new Position(moveStart!.x, destPos.y)
            capture(board[enPassantPosition!.x][enPassantPosition!.y])
            board[enPassantPosition!.x][enPassantPosition!.y] = new Piece(PieceType.Empty, Color.None)
        }
        if (src.type === PieceType.Pawn && Math.abs(moveStart!.x - destPos.x) === 2) {
            enPassantPos.push(new Position(destPos.x, destPos.y))
        }

        board[moveStart!.x][moveStart!.y] = new Piece(PieceType.Empty, Color.None)
        board[destPos.x][destPos.y] = src
        return enPassantPos
    }

    function capture(piece: Piece) {
        piece.color === Color.White ?
            setCapturedWhite(prevCaptured => (prevCaptured.add(piece))) :
            setCapturedBlack(prevCaptured => (prevCaptured.add(piece)))
    }

    function changePlayer() {
        setPlayer(prev => (prev === Color.White ? Color.Black : Color.White))
    }

    function showValidMoves(posClicked: Position) {
        setValidMoves(
            moves.filter(move => move.startPos.samePosition(posClicked))
        )
    }

    function getPinsandCheckingPieces(king: Piece, position: Position) {
        let _isChecked: boolean = false
        let _pins: Position[] = []
        let _checkingPieces: Position[] = []

        let possiblePins: Position[]
        let directions = [[-1, 0], [1, 0], [0, 1], [0, -1], [-1, -1], [1, -1], [-1, 1], [1, 1]]
        directions.forEach((direction, idx) => {
            possiblePins = []
            for (let i = 1; i < 8; i++) {
                let newPos = new Position(position.x + direction[0] * i, position.y + direction[1] * i)
                if (newPos.isInRange()) {
                    const piece = board[newPos.x][newPos.y]
                    if (piece.type !== PieceType.Empty) {
                        if (piece.color === king.color) { //ally
                            if (possiblePins.length === 0) {
                                possiblePins.push(newPos)
                            } else {
                                break
                            }
                        } else { //enemy
                            // 1. rook, 2. bishop, 3. pawn, 4. queen 5. king
                            if (
                                (piece.type === PieceType.Rook && 0 <= idx && idx < 4) ||
                                (piece.type === PieceType.Bishop && idx >= 4 && idx <= 8) ||
                                (piece.type === PieceType.Pawn && i === 1 &&
                                    ((piece.color === Color.White && 4 <= idx && idx <= 5) ||
                                        (piece.color === Color.Black && 6 <= idx && idx <= 7))) ||
                                (piece.type === PieceType.Queen) ||
                                (piece.type === PieceType.King && i === 1)
                            ) {
                                if (possiblePins.length === 0) {
                                    _isChecked = true
                                    _checkingPieces.push(newPos)
                                    break
                                } else {
                                    _pins.push(possiblePins[0])
                                    break
                                }
                            } else {
                                break
                            }
                        }
                    }
                } else {
                    break
                }

            }
        })

        const knightMoves = [[-1, 2], [1, 2], [-1, -2], [1, -2], [-2, 1], [2, 1], [-2, -1], [2, -1]]
        knightMoves.forEach(move => {
            const newPos = new Position(position.x + move[0], position.y + move[1])
            if (newPos.isInRange()) {
                const piece = board[newPos.x][newPos.y]
                if (piece.type === PieceType.Knight && piece.color !== king.color) {
                    _isChecked = true
                    _checkingPieces.push(newPos)
                }
            }
        })

        return [_isChecked, _checkingPieces, _pins]
    }

    function findMoves(enPassantPos: Position[]) {
        let _moves: Move[] = []
        for (let row = 0; row < BOARD_SIZE; row += 1) {
            for (let col = 0; col < BOARD_SIZE; col += 1) {
                const piece = board[row][col]
                const color = opponentColor(player)
                if (piece.color === color) {
                    getMoves(piece, new Position(row, col), _moves, enPassantPos)
                }
            }
        }
        setMoves(_moves)
    }

    function getMoves(piece: Piece, position: Position, moves: Move[], enPassantPos: Position[]) {
        let directions: Array<Array<number>> = []
        switch (piece.type) {
            case PieceType.Pawn:
                getPawnMoves(piece, position, moves, enPassantPos)
                return;
            case PieceType.Rook:
                directions = [[-1, 0], [1, 0], [0, 1], [0, -1]] //left, right, top, bottom
                break;
            case PieceType.Bishop:
                directions = [[-1, -1], [-1, 1], [1, 1], [1, -1]] //south-west, north-west, north-east, south-east
                break;
            case PieceType.Knight:
                directions = [[-1, 2], [1, 2], [-2, 1], [-2, -1], [2, 1], [2, -1], [-1, -2], [1, -2]]
                break;
            case PieceType.Queen:
                directions = [[-1, 0], [-1, 1], [0, 1], [1, 1], [1, 0], [1, -1], [0, -1], [-1, -1]]
                break;
            case PieceType.King:
                directions = [[-1, 0], [-1, 1], [0, 1], [1, 1], [1, 0], [1, -1], [0, -1], [-1, -1]]
                break;
            case PieceType.Empty:
            default:
                return
        }
        getPieceMoves(directions, piece, position, moves,)
    }

    function getPieceMoves(directions: Array<Array<number>>, srcPiece: Piece, srcPosition: Position, moves: Move[]) {
        let isDirectionValid = Array(directions.length).fill(true);
        let proceed = true
        let possibleMoves: Move[] = []
        while (proceed) {
            directions.forEach((move_direction, idx) => {
                if (isDirectionValid[idx]) {
                    const destPosition = new Position(srcPosition.x + move_direction[0], srcPosition.y + move_direction[1])
                    if (destPosition.isInRange()) {
                        const destPiece = board[destPosition.x][destPosition.y] // ************ need to get board *************//
                        if (destPiece.type == PieceType.Empty) {
                            possibleMoves.push(new Move(srcPosition, destPosition))
                        }
                        else if (destPiece.color === opponentColor(srcPiece.color)) {
                            possibleMoves.push(new Move(srcPosition, destPosition))
                            isDirectionValid[idx] = false
                        }
                        else {
                            isDirectionValid[idx] = false
                        }
                    }
                    else {
                        isDirectionValid[idx] = false
                    }
                }
            })

            if (srcPiece.type === PieceType.Pawn) {
                break;
            }

            if (srcPiece.type === PieceType.Knight) {
                break;
            }
            if (srcPiece.type === PieceType.King) {
                // if (!srcPiece.isMoved) {
                //     // QueenSide
                //     let castleMoves: Position[] = []
                //     if (isEligibleForCastling(srcPosition, new Position(0, srcPosition.y))) {
                //         const castlePos = new Position(srcPosition.x - 2, srcPosition.y)
                //         possibleMoves.push(new Move(srcPosition, castlePos))
                //         castleMoves.push(castlePos) /****************need to look into this */
                //     }
                //     // KingSide
                //     if (isEligibleForCastling(srcPosition, new Position(7, srcPosition.y))) {
                //         const castlePos = new Position(srcPosition.x + 2, srcPosition.y)
                //         possibleMoves.push(new Move(srcPosition, castlePos))
                //         castleMoves.push(castlePos)
                //     }
                //     setCastleMove(castleMoves)
                // }
                break;
            }
            proceed = isDirectionValid.reduce((a, b) => (a || b))
            directions = directions.map(x => x.map(t => t && t + Math.sign(t)))
        }
        moves.push(...possibleMoves)
    }

    function getPawnMoves(piece: Piece, srcPosition: Position, moves: Move[], enPassantPos: Position[]) {
        const row_direction = piece.color === Color.White ? 1 : -1
        const special_row = piece.color === Color.White ? 1 : 6
        const forwardPosition = new Position(srcPosition.x + row_direction, srcPosition.y)
        if (forwardPosition.isInRange() && board[forwardPosition.x][forwardPosition.y].type === PieceType.Empty) {
            moves.push(new Move(srcPosition, forwardPosition))
            if (srcPosition.x === special_row) {
                const doubleForwardPosition = new Position(forwardPosition.x + row_direction, forwardPosition.y)
                const doubleForwardPiece = board[doubleForwardPosition.x][doubleForwardPosition.y]
                if (doubleForwardPiece.type === PieceType.Empty) {
                    moves.push(new Move(srcPosition, doubleForwardPosition))
                }
            }
        }
        let col_direction = 1
        for (let i = 0; i < 2; i += 1) {
            col_direction *= -1
            const diagonalPosition = new Position(srcPosition.x + row_direction, srcPosition.y + col_direction)
            if (diagonalPosition.isInRange()) {
                if (enPassantPos.length > 0 && enPassantPos[0].samePosition(new Position(srcPosition.x, srcPosition.y + col_direction))) {
                    moves.push(new Move(srcPosition, diagonalPosition, true))
                }
                else if (board[diagonalPosition.x][diagonalPosition.y].type !== PieceType.Empty &&
                    board[diagonalPosition.x][diagonalPosition.y].color === opponentColor(piece.color)) {
                    moves.push(new Move(srcPosition, diagonalPosition))
                }

            }
        }
    }

    function promotePawn(type: PieceType) {
        promotionModalRef.current?.classList.add("hidden")
        setBoard(prevBoard => {
            let newBoard: Piece[][] = []
            for (let col = 0; col < BOARD_SIZE; col += 1) {
                newBoard[col] = []
                for (let row = 0; row < BOARD_SIZE; row += 1) {
                    if (promotionPawnPosition?.samePosition(new Position(row, col))) {
                        let piece = prevBoard[row][col].clone()
                        piece.type = type
                        piece.image = `${type}_${piece.color}.png`
                        newBoard[row][col] = piece
                    } else {
                        newBoard[row][col] = prevBoard[row][col]
                    }
                }
            }
            return newBoard
        })
        setPromotionPawnPosition(null)
    }

    const boardProps = {
        board, validMoves, handleClick
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