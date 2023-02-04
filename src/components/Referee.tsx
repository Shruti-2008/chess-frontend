import React from "react"
import { useRef, useState } from "react"
import { BOARD_SIZE, Color, initialBoard, PieceType, capturedCount } from "../Constants"
import { Piece, Position } from "../models"
import { Move } from "../models/Move"
import Chessboard from "./Chessboard"
import PromotionModal from "./PromotionModal"
import EndGame from "./EndGame"
import Moves from "./Moves"
import { api } from "../services/authService"

function Referee() {

    const [player, setPlayer] = useState<Color>(Color.Black)
    const [board, setBoard] = useState<Piece[][]>(initialBoard)
    const [capturedWhite, setCapturedWhite] = useState(capturedCount)
    const [capturedBlack, setCapturedBlack] = useState(capturedCount)
    const [whiteKingPos, setWhiteKingPos] = useState<Position>(new Position(0, 4))
    const [blackKingPos, setBlackKingPos] = useState<Position>(new Position(7, 4))
    const [promotionPawnPosition, setPromotionPawnPosition] = useState<Position | null>(null)
    const [moves, setMoves] = useState<Move[]>([])
    const [validMoves, setValidMoves] = useState<Move[]>([])
    const [playedMoves, setPlayedMoves] = useState<string[][]>([])
    const [lastMove, setLastMove] = useState<Move | null>(null)
    const [moveStartPos, setMoveStartPos] = useState<Position | null>(null)
    const [checkedKing, setCheckedKing] = useState<Color | null>(null)
    const [checkmate, setCheckmate] = useState(false)
    const [stalemate, setStalemate] = useState(false)
    const [winner, setWinner] = useState<Color | null>(null)
    const [isEligibleForCastle, setIsEligibleForCastle] = useState([{ color: Color.White, side: "Q", value: true }, { color: Color.White, side: "K", value: true }, { color: Color.Black, side: "Q", value: true }, { color: Color.Black, side: "K", value: true }])

    // const [pins, setPins] = useState<Piece[]>([])
    // const [checkingPieces, setCheckingPieces] = useState<Piece[]>([])

    const promotionModalRef = useRef<HTMLDivElement>(null)
    const endGameRef = useRef<HTMLDivElement>(null)

    // #int# accept board and player from server and remove the useWffect

    React.useEffect(() => {
        findMoves(board, []) /************/
        changePlayer()

        // try {
        //     api.post("/startGame", {},)
        //         .then(response => {
        //             setBoard(response.data.board)
        //             setPlayer(response.data.player)
        //         })
        //         .catch((error) => {
        //             if (error.response && error.response.status === 403) {
        //                 alert(error.response.data.detail)
        //             } else if (error.request) {
        //                 alert("No response from server")
        //             } else {
        //                 alert("Unexpected error occured")
        //             }
        //             //errRef.current?.focus()
        //         })
        // } catch (error) {
        //     alert("Unexpected error occured")
        //     //errRef.current?.focus()
        // }
    }, [])

    console.log('Rendered')

    // return color of opponent /************ better name */
    function opponentColor(color: Color) {
        return color === Color.White ? Color.Black : Color.White
    }

    function opponentPlays(move: Move, enPassantPos: Position[], _board: Piece[][]) {
        // #int# Piece[][] should not be used anywhere
        changePlayer()
        findMoves(_board, enPassantPos)
        setMoveStartPos(null) // is this really required here?
        setValidMoves([])
    }

    function postMoveSteps(_board: Piece[][], enPassantPos: Position[]) {
        changePlayer()
        findMoves(_board, enPassantPos)
        setMoveStartPos(null)
        setValidMoves([])
    }

    function handleClick(event: React.MouseEvent, posClicked: Position, valid: boolean = false) {
        if (valid) {
            makeMove(posClicked)
            // postMoveSteps(_board, enPassantPos)
        } else {
            showValidMoves(posClicked)
            if (board[posClicked.x][posClicked.y].type !== PieceType.Empty) { // Check if player based highlighting is desired
                setMoveStartPos(posClicked)
            } else {
                setMoveStartPos(null)
            }
        }
    }

    function makeMove(moveEndPos: Position) {

        //clone the board
        let _board: Piece[][] = []
        for (let i = 0; i < BOARD_SIZE; i += 1) {
            _board[i] = []
            for (let j = 0; j < BOARD_SIZE; j += 1) {
                _board[i].push(board[i][j])
            }
        }

        const src = _board[moveStartPos!.x][moveStartPos!.y]
        const dest = _board[moveEndPos.x][moveEndPos.y]

        let enPassantPos: Position[] = []
        let endRow = src.color === Color.White ? 7 : 0

        const curMove = new Move({ startPos: moveStartPos!, endPos: moveEndPos })
        const move = moves.find(move => move.isEqual(curMove))

        if (move) {

            if (dest.type !== PieceType.Empty && dest.color === opponentColor(src.color)) {
                capture(dest)
            }

            // enpassant capture move
            if (move.isEnPassantMove) { // maybe improve naming????????????
                const capturePosition = new Position(moveStartPos!.x, moveEndPos.y)
                capture(board[capturePosition.x][capturePosition.y])
                _board[capturePosition.x][capturePosition.y] = new Piece(PieceType.Empty, Color.None)
            }

            // enpassant move
            if (src.type === PieceType.Pawn && Math.abs(moveStartPos!.x - moveEndPos.x) === 2) {
                enPassantPos.push(new Position(moveEndPos.x, moveEndPos.y))
            }

            // castle move
            if (src.type === PieceType.King && Math.abs(moveStartPos!.y - moveEndPos.y) === 2) { // need to change this condition?
                const castleSide = moveEndPos.y === 2 ? 0 : 7 // 2 on left and 6 on right 
                const newRookPos = new Position(moveEndPos.x, moveEndPos.y === 2 ? 3 : 5)
                _board[newRookPos.x][newRookPos.y] = _board[newRookPos.x][castleSide].clone()
                _board[newRookPos.x][castleSide] = new Piece(PieceType.Empty, Color.None)
                // _board[newRookPos.x][castleSide].isMoved = true //************significance of this? remove it */
            }

            // pawn promotion
            if (src.type === PieceType.Pawn && moveEndPos.x === endRow) {
                promotionModalRef.current!.classList.remove("hidden")
                setPromotionPawnPosition(moveEndPos)
            } else {
                // add this move notation to playedMoves list
                const notation = move.getNotation({ srcPiece: src, destPiece: dest })
                addNotation(notation)
                // setMoveStartPos(null)
            }

            // update King position
            if (src.type === PieceType.King) {
                src.color === Color.White ?
                    setWhiteKingPos(moveEndPos) :
                    setBlackKingPos(moveEndPos)

                setIsEligibleForCastle(prev => prev.map(obj => (obj.color === src.color && obj.value) ? { ...obj, value: false } : { ...obj }))
            }
            else if (src.type === PieceType.Rook) {
                const side = curMove.startPos.y === 0 ? "Q" : "K" // change condition maybe
                setIsEligibleForCastle(prev => prev.map(obj => (obj.color === src.color && obj.value && obj.side === side) ? { ...obj, value: false } : { ...obj }))
            }

            _board[moveStartPos!.x][moveStartPos!.y] = new Piece(PieceType.Empty, Color.None)
            _board[moveEndPos.x][moveEndPos.y] = src
            // _board[moveEndPos.x][moveEndPos.y].isMoved = true

            setBoard(_board)
            setLastMove(curMove)

        } else {
            alert("No such move found")
        }

        if (!(src.type === PieceType.Pawn && moveEndPos.x === endRow)) {
            postMoveSteps(_board, enPassantPos)
        }
        // return { enPassantPos, _board }

    }

    // increment the count of piece captured
    function capture(piece: Piece) {
        piece.color === Color.White ?
            setCapturedWhite(
                prev => prev.map(obj => obj.type === piece.type ? { ...obj, value: obj.value + 1 } : obj)
            ) :
            setCapturedBlack(
                prev => prev.map(obj => obj.type === piece.type ? { ...obj, value: obj.value + 1 } : obj)
            )
    }

    // change player from white to black and vice-versa //*************name better? */
    function changePlayer() {
        setPlayer(prev => (prev === Color.White ? Color.Black : Color.White))
    }

    // fiter moves based on starting position and save it in state validMoves
    function showValidMoves(posClicked: Position) {
        setValidMoves(
            moves.filter(move => move.startPos.isSamePosition(posClicked))
        )
    }

    function getPinsandCheckingPieces(_board: Piece[][], king: Piece, position: Position) {
        let _isChecked: boolean = false
        let _pins: { position: Position, direction: Position }[] = []
        let _checkingPieces: { position: Position, direction: Position }[] = []

        console.log("King is ", king.color, position)
        let possiblePins: Position[]
        let directions = [[-1, 0], [1, 0], [0, 1], [0, -1], [-1, -1], [-1, 1], [1, -1], [1, 1]] // swapped 5,6 previously [[-1, 0], [1, 0], [0, 1], [0, -1], [-1, -1], [1, -1], [-1, 1], [1, 1]]
        directions.forEach((direction, idx) => {
            possiblePins = []
            for (let i = 1; i < 8; i++) {
                let newPos = new Position(position.x + direction[0] * i, position.y + direction[1] * i)
                if (newPos.isInRange()) {
                    const piece = _board[newPos.x][newPos.y]
                    if (piece.type !== PieceType.Empty) {
                        if (piece.color === king.color && piece.type !== PieceType.King) { // ally // second check in cases when we are trying out if moving king will put it into check
                            if (possiblePins.length === 0) {
                                possiblePins.push(newPos)
                            } else {
                                break
                            }
                        } else if (piece.color === opponentColor(king.color)) { // enemy
                            // 1. rook, 2. bishop, 3. pawn, 4. queen 5. king
                            if (piece.type === PieceType.Pawn) {
                                console.log(newPos)
                                console.log(piece.type, i, piece.color, idx)
                            }
                            if (
                                (piece.type === PieceType.Rook && 0 <= idx && idx < 4) ||
                                (piece.type === PieceType.Bishop && idx >= 4 && idx < 8) ||
                                (piece.type === PieceType.Pawn && i === 1 &&
                                    ((piece.color === Color.White && 4 <= idx && idx <= 5) ||
                                        (piece.color === Color.Black && 6 <= idx && idx <= 7))) ||
                                (piece.type === PieceType.Queen) ||
                                (piece.type === PieceType.King && i === 1) // should never happen ideally
                            ) {
                                if (piece.type === PieceType.Pawn) {
                                    console.log("AAAAAAAAAAAAAAAAAAAAAAAAAAA")
                                }

                                if (possiblePins.length === 0) {
                                    if (piece.type === PieceType.Pawn) {
                                        console.log("BBBBBBBBBBBBBBBBBBB")
                                    }

                                    _isChecked = true
                                    _checkingPieces.push({ position: newPos, direction: new Position(direction[0], direction[1]) })
                                    break
                                } else {
                                    _pins.push({ position: possiblePins[0], direction: new Position(direction[0], direction[1]) })
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
                const piece = _board[newPos.x][newPos.y]
                if (piece.type === PieceType.Knight && piece.color !== king.color) {
                    _isChecked = true
                    _checkingPieces.push({ position: newPos, direction: new Position(move[0], move[1]) })
                }
            }
        })

        return { _isChecked, _checkingPieces, _pins }
    }

    function findMoves(_board: Piece[][], enPassantPos: Position[]) {
        let _moves: Move[] = []
        const kingPosition = opponentColor(player) === Color.White ? whiteKingPos : blackKingPos
        const kingPiece = _board[kingPosition.x][kingPosition.y]
        const { _isChecked, _checkingPieces, _pins } = getPinsandCheckingPieces(_board, kingPiece, kingPosition)
        console.log(_isChecked, _checkingPieces, _pins)

        if (_isChecked) {
            setCheckedKing(opponentColor(player)) // kingPiece.color
            if (_checkingPieces.length === 1) {
                const checking = _checkingPieces[0]
                const checkingPiece = _board[checking.position.x][checking.position.y]
                const validTiles: Position[] = []
                // kill checking piece OR block checking piece OR move king
                // get a list of valid tiles that will kill/block:
                if (checkingPiece.type === PieceType.Knight) {
                    // if checking piece is a knight, need to kill knight so just 1 valid tile
                    validTiles.push(checking.position)
                } else {
                    // for other checking pieces, any tile in the direction of the checking piece from king upto the checking piece is a valid tile
                    for (let i = 1; i < BOARD_SIZE; i += 1) {
                        const validPos = new Position(kingPosition.x + checking.direction.x * i, kingPosition.y + checking.direction.y * i)
                        validTiles.push(validPos)
                        if (validPos.isSamePosition(checking.position)) {
                            break
                        }
                    }
                }

                // get all moves as usual
                getAllMoves(_board, _moves, enPassantPos, _pins)
                // filter the moves to keep just the moves whose destination is a valid square OR the king moves 
                _moves = _moves.filter(
                    move => validTiles.some(tile => tile.isSamePosition(move.endPos)) ||
                        move.startPos.isSamePosition(kingPosition) // shouldn't we check if king is also moving into a checked position?
                )
            } else {
                // double-check so king has to move
                // call function to get just king moves
                // const directions = [[-1, 0], [-1, 1], [0, 1], [1, 1], [1, 0], [1, -1], [0, -1], [-1, -1]]
                getKingMoves(_board, kingPiece, kingPosition, _moves, enPassantPos)
            }
        } else {
            // not under check
            setCheckedKing(null)
            //get all moves as usual
            getAllMoves(_board, _moves, enPassantPos, _pins)
        }

        setMoves(_moves)

        if (_moves.length === 0) {
            //no valid moves:
            if (_isChecked) { ///another function *******************************
                setCheckmate(true)
                showHideModal()
                setWinner(opponentColor(player)) // is this correct? should be player imo
            } else {
                showHideModal()
                setWinner(opponentColor(player)) // same as above
                setStalemate(true)
            }
        } else {
            setCheckmate(false)
            setStalemate(false)
        }
    }

    function getAllMoves(_board: Piece[][], _moves: Move[], enPassantPos: Position[], pins: { position: Position, direction: Position }[]) {
        for (let row = 0; row < BOARD_SIZE; row += 1) {
            for (let col = 0; col < BOARD_SIZE; col += 1) {
                const piece = _board[row][col]
                const color = opponentColor(player)
                if (piece.color === color) { // the next player's color
                    getMoves(_board, piece, new Position(row, col), _moves, enPassantPos, pins)
                }
            }
        }
    }

    function getMoves(_board: Piece[][], piece: Piece, position: Position, moves: Move[], enPassantPos: Position[], pins: { position: Position, direction: Position }[]) {
        let directions: Array<Array<number>> = []
        switch (piece.type) {
            case PieceType.Pawn:
                getPawnMoves(_board, piece, position, moves, enPassantPos, pins)
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
                getKingMoves(_board, piece, position, moves, enPassantPos)
                return;
            case PieceType.Empty:
            default:
                return
        }
        getPieceMoves(_board, directions, piece, position, moves, pins)
    }

    function getPieceMoves(_board: Piece[][], directions: Array<Array<number>>, srcPiece: Piece, srcPosition: Position, moves: Move[], pins: { position: Position, direction: Position }[]) {
        // let isDirectionValid = Array(directions.length).fill(true);
        // let proceed = true
        let possibleMoves: Move[] = []

        const pin = pins.find(pin => pin.position.isSamePosition(srcPosition))
        const isPinned = pin ? true : false

        directions.forEach((move_direction, idx) => {
            // if the current piece is not pinned or if it is pinned, the direction of piece movement still keeps it pinned
            if (!isPinned ||
                (pin!.direction.x === move_direction[0] && pin!.direction.y === move_direction[1]) ||
                (-pin!.direction.x === move_direction[0] && -pin!.direction.y === move_direction[1])) {
                for (let index = 1; index < BOARD_SIZE; index++) {

                    const destPosition = new Position(srcPosition.x + move_direction[0] * index, srcPosition.y + move_direction[1] * index)
                    if (destPosition.isInRange()) {
                        const destPiece = _board[destPosition.x][destPosition.y]
                        // blank tile
                        if (destPiece.type === PieceType.Empty) {
                            possibleMoves.push(new Move({ startPos: srcPosition, endPos: destPosition }))
                        }
                        // tile occupied by opponent piece
                        else if (destPiece.color === opponentColor(srcPiece.color)) {
                            possibleMoves.push(new Move({ startPos: srcPosition, endPos: destPosition }))
                            break
                        }
                        // tile occupied by ally piece
                        else {
                            break
                        }
                    }
                    else {
                        // tile out of range 
                        break
                    }
                    if (srcPiece.type === PieceType.Knight) {
                        break;
                    }
                }
            }
        });
        moves.push(...possibleMoves)
    }

    // function getCastleMoves(_board: Piece[][], kingPiece: Piece, kingPosition: Position, rookPosition: Position, moves: Move[]) {
    //     const direction = rookPosition.y < kingPosition.y ? -1 : 1
    //     const rook = _board[rookPosition.x][rookPosition.y]
    //     if (rook.type === PieceType.Rook && !rook.isMoved) {
    //         // add castle move. Also set isMoved of king and rook to true
    //         if (isCastlePathClear(_board, kingPosition, rookPosition)) {
    //             moves.push(new Move(kingPosition, new Position(kingPosition.x, kingPosition.y + 2 * direction)))
    //         }
    //     }
    // }

    function getCastleMoves(_board: Piece[][], kingColor: Color, kingPosition: Position, side: string, possibleCastleMoves: Move[]) {
        isEligibleForCastle.forEach((obj) => {
            if (obj.color === kingColor && obj.side === side && obj.value) {
                // eligible for castle
                const [direction, y] = side === "Q" ? [-1, 0] : [1, 7]
                const rookPosition = new Position(kingPosition.x, y)
                if (isCastlePathClear(_board, kingPosition, rookPosition, direction)) {
                    possibleCastleMoves.push(new Move({ startPos: kingPosition, endPos: new Position(kingPosition.x, kingPosition.y + 2 * direction), isCastleMove: true }))
                }
            }
        })
    }

    function isCastlePathClear(_board: Piece[][], kingPos: Position, rookPos: Position, direction: number) {
        // const direction = rookPos.y < kingPos.y ? 1 : -1
        for (let col = kingPos.y + direction; (col - rookPos.y) !== 0; col += direction) {
            const piece = _board[kingPos.x][col]
            if (piece.type !== PieceType.Empty) {
                return false
            }
        }
        return true
    }

    function getPawnMoves(_board: Piece[][], piece: Piece, srcPosition: Position, moves: Move[], enPassantPos: Position[], pins: { position: Position, direction: Position }[]) {
        const row_direction = piece.color === Color.White ? 1 : -1
        const special_row = piece.color === Color.White ? 1 : 6

        const pin = pins.find(pin => pin.position.isSamePosition(srcPosition))
        const isPinned = pin ? true : false

        // const kingPosition = opponentColor(player) === Color.White ? whiteKingPos : blackKingPos
        // const kingPiece = _board[kingPosition.x][kingPosition.y]

        const forwardPosition = new Position(srcPosition.x + row_direction, srcPosition.y)
        if (forwardPosition.isInRange() && _board[forwardPosition.x][forwardPosition.y].type === PieceType.Empty) {
            if (!isPinned || (pin!.direction.x === row_direction && pin!.direction.y === 0) || (-pin!.direction.x === row_direction && pin!.direction.y === 0)) {
                moves.push(new Move({ startPos: srcPosition, endPos: forwardPosition }))
                if (srcPosition.x === special_row) {
                    const doubleForwardPosition = new Position(forwardPosition.x + row_direction, forwardPosition.y)
                    const doubleForwardPiece = _board[doubleForwardPosition.x][doubleForwardPosition.y]
                    if (doubleForwardPiece.type === PieceType.Empty) {
                        moves.push(new Move({ startPos: srcPosition, endPos: doubleForwardPosition }))
                    }
                }
            }
        }

        let col_direction = 1
        for (let i = 0; i < 2; i += 1) {
            col_direction *= -1
            const diagonalPosition = new Position(srcPosition.x + row_direction, srcPosition.y + col_direction)
            if (diagonalPosition.isInRange()) {
                if (!isPinned || (pin!.direction.x === row_direction && pin!.direction.y === col_direction) ||
                    (-pin!.direction.x === row_direction && -pin!.direction.y === col_direction)) {
                    if (enPassantPos.length > 0 && enPassantPos[0].isSamePosition(new Position(srcPosition.x, srcPosition.y + col_direction))) {
                        moves.push(new Move({ startPos: srcPosition, endPos: diagonalPosition, isEnPassantMove: true }))
                    }
                    else if (_board[diagonalPosition.x][diagonalPosition.y].type !== PieceType.Empty &&
                        _board[diagonalPosition.x][diagonalPosition.y].color === opponentColor(piece.color)) {
                        moves.push(new Move({ startPos: srcPosition, endPos: diagonalPosition }))
                    }
                }
            }
        }
    }

    function getKingMoves(_board: Piece[][], piece: Piece, srcPosition: Position, moves: Move[], enPassantPos: Position[]) {
        const directions = [[-1, 0], [-1, 1], [0, 1], [1, 1], [1, 0], [1, -1], [0, -1], [-1, -1]]
        directions.forEach(direction => {
            const destPos = new Position(srcPosition.x + direction[0], srcPosition.y + direction[1])
            if (destPos.isInRange()) {
                const destPiece = _board[destPos.x][destPos.y]
                if (destPiece.color !== piece.color) { //enemy or empty piece // might have to change condition to accomodate empty piece

                    const { _isChecked } = getPinsandCheckingPieces(_board, piece, destPos)
                    if (!_isChecked) {
                        moves.push(new Move({ startPos: srcPosition, endPos: destPos }))
                    }
                }
            }
        })

        // if (!piece.isMoved) { //additional logic to be added********************************
            //Queenside
            // getCastleMoves(_board, piece, srcPosition, new Position(srcPosition.x, 0), moves)
            let possibleCastleMoves: Move[] = []
            getCastleMoves(_board, piece.color, srcPosition, "Q", possibleCastleMoves)
            //Kingside
            // getCastleMoves(_board, piece, srcPosition, new Position(srcPosition.x, 7), moves)
            getCastleMoves(_board, piece.color, srcPosition, "K", possibleCastleMoves)

            possibleCastleMoves.forEach((move) => {
                const { _isChecked } = getPinsandCheckingPieces(_board, piece, move.endPos)
                if (!_isChecked) {
                    moves.push(move)
                }
            })
        // }
    }

    function isTileUnderAttack(position: Position, _board: Piece[][]): boolean {
        // const color = opponentColor(player)
        // let moves: Move[] = []
        findMoves(_board, [])
        return false
    }

    function promotePawn(type: PieceType) {
        promotionModalRef.current?.classList.add("hidden")

        const move = new Move({ startPos: moveStartPos!, endPos: promotionPawnPosition! }) //set isPawnPromotion = true?????????
        const notation = move.getNotation({ srcPiece: new Piece(PieceType.Pawn, player), destPiece: board[promotionPawnPosition!.x][promotionPawnPosition!.y], isPawnPromotionMove: true, promotionType: type })
        addNotation(notation, true)
        let newBoard: Piece[][] = []
        for (let row = 0; row < BOARD_SIZE; row += 1) {
            newBoard[row] = []
            for (let col = 0; col < BOARD_SIZE; col += 1) {
                if (promotionPawnPosition!.isSamePosition(new Position(row, col))) {
                    let piece = board[row][col].clone()
                    piece.type = type
                    piece.image = `${type}_${piece.color}.png`
                    newBoard[row].push(piece)
                } else {
                    newBoard[row].push(board[row][col])
                }
            }
        }
        setBoard(prevBoard => newBoard)
        setPromotionPawnPosition(null)
        // setMoveStartPos(null)
        postMoveSteps(newBoard, [])
    }

    function addNotation(notation: string, pawnPromotion = false) {
        const movePlayedBy = player // pawnPromotion ? opponentColor(player) : player  removed now
        if (notation) {
            if (movePlayedBy === Color.Black) {
                setPlayedMoves(prev => {
                    const newArr = [...prev]
                    newArr[newArr.length - 1].push(notation)
                    return newArr
                })
            } else {
                setPlayedMoves(prev => [...prev, [notation]])
            }
        }
    }

    function showHideModal() {
        endGameRef.current?.classList.toggle("hidden")
    }

    const boardProps = {
        board, validMoves, handleClick, capturedBlack, capturedWhite, lastMove, moveStartPos, checkedKing
    }

    const promotionModalProps = {
        promotePawn,
        color: player // opponentColor(player)
    }

    const endGameProps = {
        winner: opponentColor(player),
        showHideModal
    }

    const movesProps = {
        moves: playedMoves
    }

    ////max-w-full

    return (
        <div className="bg-gradient-to-b from-slate-200 to-slate-400 flex flex-col w-full h-full border-2 border-red-500">
            <div className="relative flex flex-col md:flex-row border-2 border-purple-400">
                <Chessboard {...boardProps} />
                <Moves {...movesProps} />
            </div>
            <div className="hidden" ref={promotionModalRef}>
                <PromotionModal {...promotionModalProps} />
            </div>
            <div ref={endGameRef} className="w-full h-full hidden">{/*className="hidden" */}
                <EndGame {...endGameProps} />
            </div>
        </div>
    )
}

export default Referee