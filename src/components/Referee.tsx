import React from "react"
import { useRef, useState } from "react"
import { BOARD_SIZE, Color, initialBoard, PieceType, capturedCount } from "../Constants"
import { Position } from "../models"
import { Move } from "../models/Move"
import Chessboard from "./Chessboard"
import PromotionModal from "./PromotionModal"
import EndGame from "./EndGame"
import Moves from "./Moves"
import { api } from "../services/authService"

function Referee() {

    const [player, setPlayer] = useState<Color>(Color.Black)
    const [board, setBoard] = useState<string[][]>(initialBoard)
    const [capturedWhite, setCapturedWhite] = useState(capturedCount)
    const [capturedBlack, setCapturedBlack] = useState(capturedCount)
    const [whiteKingPos, setWhiteKingPos] = useState<Position>(new Position(0, 4))
    const [blackKingPos, setBlackKingPos] = useState<Position>(new Position(7, 4))
    const [promotionPawnPosition, setPromotionPawnPosition] = useState<Position | null>(null)
    const [moves, setMoves] = useState<Move[]>([])
    const [validMoves, setValidMoves] = useState<Move[]>([])
    const [playedMoves, setPlayedMoves] = useState<string[][]>([])
    const [lastMove, setLastMove] = useState<Move | null>(null)
    const [moveStartPosition, setMoveStartPosition] = useState<Position | null>(null)
    const [checkedKing, setCheckedKing] = useState<Color | null>(null)
    const [checkmate, setCheckmate] = useState(false)
    const [stalemate, setStalemate] = useState(false)
    const [winner, setWinner] = useState<Color | null>(null)
    const [isEligibleForCastle, setIsEligibleForCastle] = useState([{ color: Color.White, side: "Q", value: true }, { color: Color.White, side: "K", value: true }, { color: Color.Black, side: "Q", value: true }, { color: Color.Black, side: "K", value: true }])

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

    // return color of opponent
    function getOpponentColor(color: Color) {
        return color === Color.White ? Color.Black : Color.White
    }

    // return color of piece
    function getColor(symbol: string) {
        return symbol.toLowerCase() === symbol ? Color.White : Color.Black
    }

    // returns true if the piece = PieceType passed
    function isEqual(piece: string, type: PieceType) {
        return piece.toLowerCase() === type
    }

    function opponentPlays(move: Move, enPassantPosition: Position[], _board: string[][]) {
        // #int# Piece[][] should not be used anywhere
        changePlayer()
        findMoves(_board, enPassantPosition)
        setMoveStartPosition(null) // is this really required here?
        setValidMoves([])
    }

    // post move steps
    function postMoveSteps(_board: string[][], enPassantPosition: Position[]) {
        // set active player to opponent
        changePlayer()
        // find moves of opponent player
        findMoves(_board, enPassantPosition)
        // set next move start position as null
        setMoveStartPosition(null)
        // set valid moves for newly started move to null since no move will be started by opponent immediately
        setValidMoves([])
    }

    // handle tile click
    function handleClick(event: React.MouseEvent, posClicked: Position, valid: boolean = false) {
        if (valid) {
            makeMove(posClicked)
        } else {
            showValidMoves(posClicked)
            if (board[posClicked.x][posClicked.y] !== PieceType.Empty) {
                setMoveStartPosition(posClicked)
            } else {
                setMoveStartPosition(null)
            }
        }
    }

    // play the move and update the board
    // capture piece if applicable
    // add notation of move to the state playedMoves
    // update the state lastMove
    // update the states whiteKingPosition, blackKingPosition if applicable
    // disqualify king, rook for further castle moves as applicable
    function makeMove(moveEndPosition: Position) {
        //clone the board
        let _board: string[][] = []
        for (let i = 0; i < BOARD_SIZE; i += 1) {
            _board[i] = []
            for (let j = 0; j < BOARD_SIZE; j += 1) {
                _board[i].push(board[i][j])
            }
        }

        // retreive start and end pieces
        const srcPiece = _board[moveStartPosition!.x][moveStartPosition!.y]
        const destPiece = _board[moveEndPosition.x][moveEndPosition.y]
        const srcPieceColor = getColor(srcPiece)
        const destPieceColor = getColor(destPiece)

        let enPassantPosition: Position[] = []
        const endRow = srcPieceColor === Color.White ? (BOARD_SIZE - 1) : 0
        const curMove = new Move({ startPos: moveStartPosition!, endPos: moveEndPosition })
        const move = moves.find(move => move.isEqual(curMove))

        if (move) {
            if (destPiece !== PieceType.Empty && destPieceColor === getOpponentColor(srcPieceColor)) {
                capture(destPiece)
            }

            // enpassant capture move
            if (move.isEnPassantCaptureMove) {
                const capturePosition = new Position(moveStartPosition!.x, moveEndPosition.y)
                capture(board[capturePosition.x][capturePosition.y])
                _board[capturePosition.x][capturePosition.y] = PieceType.Empty
            }

            // enpassant move
            if (isEqual(srcPiece, PieceType.Pawn) && Math.abs(moveStartPosition!.x - moveEndPosition.x) === 2) {
                enPassantPosition.push(new Position(moveEndPosition.x, moveEndPosition.y))
            }

            // castle move
            if (isEqual(srcPiece, PieceType.King) && Math.abs(moveStartPosition!.y - moveEndPosition.y) === 2) { // #int# need to change this condition?
                const castleSide = moveEndPosition.y === 2 ? 0 : 7 // 2 on left and 6 on right (as king is always in column 4 initially)
                const newRookPos = new Position(moveEndPosition.x, moveEndPosition.y === 2 ? 3 : 5)
                _board[newRookPos.x][newRookPos.y] = _board[newRookPos.x][castleSide]
                _board[newRookPos.x][castleSide] = PieceType.Empty
            }

            // pawn promotion
            if (isEqual(srcPiece, PieceType.Pawn) && moveEndPosition.x === endRow) {
                promotionModalRef.current!.classList.remove("hidden")
                setPromotionPawnPosition(moveEndPosition)
            } else {
                // add this move notation to playedMoves list
                const notation = move.getNotation({ srcPiece, destPiece })
                addNotation(notation)
            }

            // update King position
            if (isEqual(srcPiece, PieceType.King)) {
                getColor(srcPiece) === Color.White ?
                    setWhiteKingPos(moveEndPosition) :
                    setBlackKingPos(moveEndPosition)
                // disqualify king from castle move
                setIsEligibleForCastle(prev => prev.map(obj => (obj.color === srcPieceColor && obj.value) ? { ...obj, value: false } : { ...obj }))
            }
            else if (isEqual(srcPiece, PieceType.Rook)) {
                // disqualify rook from castle move
                const side = curMove.startPos.y === 0 ? "Q" : "K" // #int# change condition maybe
                setIsEligibleForCastle(prev => prev.map(obj => (obj.color === srcPieceColor && obj.value && obj.side === side) ? { ...obj, value: false } : { ...obj }))
            }

            // move srcPiece to destination tile and set source tile as empty
            _board[moveStartPosition!.x][moveStartPosition!.y] = PieceType.Empty
            _board[moveEndPosition.x][moveEndPosition.y] = srcPiece

            // update board and the most recent move
            setBoard(_board)
            setLastMove(curMove)

        } else {
            alert("No such move found")
        }

        // perform post move steps if the move is not a pawn promotion move (in case of pawn promotion, the move has not yet been completed)
        if (!(srcPiece === PieceType.Pawn && moveEndPosition.x === endRow)) {
            postMoveSteps(_board, enPassantPosition)
        }
    }

    // increment the count of piece captured
    function capture(piece: string) {
        getColor(piece) === Color.White ?
            setCapturedWhite(
                prev => prev.map(obj => isEqual(piece, obj.type) ? { ...obj, value: obj.value + 1 } : obj)
            ) :
            setCapturedBlack(
                prev => prev.map(obj => isEqual(piece, obj.type) ? { ...obj, value: obj.value + 1 } : obj)
            )
    }

    // change player from white to black and vice-versa
    function changePlayer() {
        setPlayer(prev => (prev === Color.White ? Color.Black : Color.White))
    }

    // fiter moves based on starting position and save it in state validMoves
    function showValidMoves(posClicked: Position) {
        setValidMoves(
            moves.filter(move => move.startPos.isSamePosition(posClicked))
        )
    }

    // return an object with the following items:
    // _isChecked : boolean => whether the king is in check
    // _checkingPieces : array of objects => denoting the pieces which put the king into check and their direction with respect to the king
    // _pins : array of objects => denoting the pinned pieces and the direction of pin with respect to the king
    function getPinsandCheckingPieces(_board: string[][], kingColor: Color, kingPosition: Position) {
        let _isChecked: boolean = false
        let _pins: { position: Position, direction: Position }[] = []
        let _checkingPieces: { position: Position, direction: Position }[] = []

        let possiblePins: Position[]
        let directions = [[-1, 0], [1, 0], [0, 1], [0, -1], [-1, -1], [-1, 1], [1, -1], [1, 1]]
        directions.forEach((direction, idx) => {
            possiblePins = []
            for (let i = 1; i < BOARD_SIZE; i++) {
                // tile under evaluation
                let newPos = new Position(kingPosition.x + direction[0] * i, kingPosition.y + direction[1] * i)
                if (newPos.isInRange()) {
                    const piece = _board[newPos.x][newPos.y]
                    const pieceColor = getColor(piece)

                    if (piece !== PieceType.Empty) {
                        if (pieceColor === kingColor && !isEqual(piece, PieceType.King)) {
                            // ally 
                            // second check in cases when we are trying out if moving king will put it into check
                            if (possiblePins.length === 0) {
                                possiblePins.push(newPos)
                            } else {
                                break
                            }
                        } else if (pieceColor === getOpponentColor(kingColor)) {
                            // enemy
                            // 1. rook, 2. bishop, 3. pawn, 4. queen 5. king
                            if (
                                (isEqual(piece, PieceType.Rook) && 0 <= idx && idx < 4) ||
                                (isEqual(piece, PieceType.Bishop) && idx >= 4 && idx < 8) ||
                                (isEqual(piece, PieceType.Pawn) && i === 1 &&
                                    ((pieceColor === Color.White && 4 <= idx && idx <= 5) ||
                                        (pieceColor === Color.Black && 6 <= idx && idx <= 7))) ||
                                (isEqual(piece, PieceType.Queen)) ||
                                (isEqual(piece, PieceType.King) && i === 1) // should never happen ideally
                            ) {
                                if (possiblePins.length === 0) {
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

        // since knight gives direct check (in 1 move) and knight moves in 2 + 1 steps
        const knightMoves = [[-1, 2], [1, 2], [-1, -2], [1, -2], [-2, 1], [2, 1], [-2, -1], [2, -1]]
        knightMoves.forEach(move => {
            const newPos = new Position(kingPosition.x + move[0], kingPosition.y + move[1])
            if (newPos.isInRange()) {
                const piece = _board[newPos.x][newPos.y]
                if (isEqual(piece, PieceType.Knight) && getColor(piece) !== kingColor) {
                    _isChecked = true
                    _checkingPieces.push({ position: newPos, direction: new Position(move[0], move[1]) })
                }
            }
        })

        return { _isChecked, _checkingPieces, _pins }
    }

    // find all moves
    function findMoves(_board: string[][], enPassantPosition: Position[]) {
        let _moves: Move[] = []
        const kingColor = getOpponentColor(player)
        const kingPosition = kingColor === Color.White ? whiteKingPos : blackKingPos // position of opponent king 
        const kingPiece = _board[kingPosition.x][kingPosition.y]
        const { _isChecked, _checkingPieces, _pins } = getPinsandCheckingPieces(_board, getColor(kingPiece), kingPosition)

        if (_isChecked) {
            setCheckedKing(kingColor)
            // check given by just 1 piece
            if (_checkingPieces.length === 1) {
                const checking = _checkingPieces[0]
                const checkingPiece = _board[checking.position.x][checking.position.y]
                const validTiles: Position[] = []
                // kill checking piece OR block checking piece OR move king
                // get a list of valid tiles that will kill/block:
                if (checkingPiece === PieceType.Knight) {
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
                getAllMoves(_board, _moves, enPassantPosition, _pins)
                // filter the moves to keep just the moves whose destination is a valid square OR the valid king moves 
                _moves = _moves.filter(
                    move => validTiles.some(tile => tile.isSamePosition(move.endPos)) ||
                        move.startPos.isSamePosition(kingPosition) // shouldn't we check if king is also moving into a checked position?
                )
            } else {
                // double-check so king has to move
                // call function to get just king moves
                // const directions = [[-1, 0], [-1, 1], [0, 1], [1, 1], [1, 0], [1, -1], [0, -1], [-1, -1]]
                getKingMoves(_board, kingPiece, kingPosition, _moves)
            }
        } else {
            // not under check
            setCheckedKing(null)
            //get all moves as usual
            getAllMoves(_board, _moves, enPassantPosition, _pins)
        }

        setMoves(_moves)

        if (_moves.length === 0) {
            // no valid moves
            if (_isChecked) { ///another function ******************************* #int#
                setCheckmate(true)
                showHideModal()
                setWinner(getOpponentColor(player)) // #int# is this correct? should be player imo
            } else {
                showHideModal()
                setWinner(getOpponentColor(player)) // #int# same as above
                setStalemate(true)
            }
        } else { // #int# is this necessary? also once game ends, set moves to null so no new move is allowed to be played
            checkmate && setCheckmate(false)
            stalemate && setStalemate(false)
        }
    }

    // find moves for pieces from the opponent team
    function getAllMoves(_board: string[][], _moves: Move[], enPassantPosition: Position[], pins: { position: Position, direction: Position }[]) {
        const color = getOpponentColor(player)
        for (let row = 0; row < BOARD_SIZE; row += 1) {
            for (let col = 0; col < BOARD_SIZE; col += 1) {
                const piece = _board[row][col]
                if (getColor(piece) === color) { // the next player's color
                    getMoves(_board, piece, new Position(row, col), _moves, enPassantPosition, pins)
                }
            }
        }
    }

    // find moves for a piece based on piece type
    function getMoves(_board: string[][], piece: string, position: Position, moves: Move[], enPassantPosition: Position[], pins: { position: Position, direction: Position }[]) {
        let directions: Array<Array<number>> = []
        switch (piece.toLowerCase()) {
            case PieceType.Pawn:
                getPawnMoves(_board, piece, position, moves, enPassantPosition, pins)
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
                getKingMoves(_board, piece, position, moves)
                return;
            case PieceType.Empty:
            default:
                return
        }
        getPieceMoves(_board, directions, piece, position, moves, pins)
    }

    // find moves for rook, bishop, knight, queen
    function getPieceMoves(_board: string[][], directions: Array<Array<number>>, srcPiece: string, srcPosition: Position, moves: Move[], pins: { position: Position, direction: Position }[]) {
        const srcPieceColor = getColor(srcPiece)
        const opponentColor = getOpponentColor(srcPieceColor)
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
                        if (isEqual(destPiece, PieceType.Empty)) {
                            possibleMoves.push(new Move({ startPos: srcPosition, endPos: destPosition }))
                        }
                        // tile occupied by opponent piece
                        else if (getColor(destPiece) === opponentColor) {
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
                    if (srcPiece === PieceType.Knight) {
                        // since knight can just move one step at a time
                        break;
                    }
                }
            }
        });
        moves.push(...possibleMoves)
    }

    // get possible castle moves for given king 
    function getCastleMoves(_board: string[][], kingColor: Color, kingPosition: Position, side: string, possibleCastleMoves: Move[]) {
        isEligibleForCastle.forEach((obj) => {
            if (obj.color === kingColor && obj.side === side && obj.value) {
                // eligible for castle
                const [direction, y] = side === "Q" ? [-1, 0] : [1, 7] // [y-direction of king movement, y position of rook]
                const rookPosition = new Position(kingPosition.x, y)
                if (isCastlePathClear(_board, kingPosition, rookPosition, direction)) {
                    possibleCastleMoves.push(new Move({ startPos: kingPosition, endPos: new Position(kingPosition.x, kingPosition.y + 2 * direction), isCastleMove: true }))
                }
            }
        })
    }

    // return true if there is no piece between the king and rook
    function isCastlePathClear(_board: string[][], kingPos: Position, rookPos: Position, direction: number) {
        for (let col = kingPos.y + direction; (col - rookPos.y) !== 0; col += direction) {
            const piece = _board[kingPos.x][col]
            if (piece !== PieceType.Empty) {
                return false
            }
        }
        return true
    }

    // find moves for pawns
    // Pawn moves: 1 step forward move, 2 step forward move, diagonal capture move, diagonal enpassant capture move
    function getPawnMoves(_board: string[][], piece: string, srcPosition: Position, moves: Move[], enPassantPosition: Position[], pins: { position: Position, direction: Position }[]) {
        const [rowDirection, specialRow, opponentColor] = getColor(piece) === Color.White ? [1, 1, Color.Black] : [-1, 6, Color.White] // special row denotes the row from which pawn can move forwrd 2 steps i.e. start row of pawn
        const pin = pins.find(pin => pin.position.isSamePosition(srcPosition))
        const isPinned = pin ? true : false

        // move pawn one step ahead
        const forwardPosition = new Position(srcPosition.x + rowDirection, srcPosition.y)
        if (forwardPosition.isInRange() && isEqual(_board[forwardPosition.x][forwardPosition.y], PieceType.Empty)) {
            // pawn is not pinned or even if it is pinned, the direction of movement of pawn keeps it pinned
            if (!isPinned ||
                (pin!.direction.x === rowDirection && pin!.direction.y === 0) ||
                (-pin!.direction.x === rowDirection && pin!.direction.y === 0)
            ) {
                moves.push(new Move({ startPos: srcPosition, endPos: forwardPosition }))
                if (srcPosition.x === specialRow) {
                    // move pawn 2 steps ahead
                    const doubleForwardPosition = new Position(forwardPosition.x + rowDirection, forwardPosition.y)
                    const doubleForwardPiece = _board[doubleForwardPosition.x][doubleForwardPosition.y]
                    if (isEqual(doubleForwardPiece, PieceType.Empty)) {
                        moves.push(new Move({ startPos: srcPosition, endPos: doubleForwardPosition }))
                    }
                }
            }
        }

        let colDirection = 1 // one step to the left or right
        for (let i = 0; i < 2; i += 1) {
            colDirection *= -1
            const diagonalPosition = new Position(srcPosition.x + rowDirection, srcPosition.y + colDirection)
            const diagonalPiece = _board[diagonalPosition.x][diagonalPosition.y]
            if (diagonalPosition.isInRange()) {
                // pawn is not pinned or even if it is pinned, the direction of movement of pawn keeps it pinned
                if (!isPinned ||
                    (pin!.direction.x === rowDirection && pin!.direction.y === colDirection) ||
                    (-pin!.direction.x === rowDirection && -pin!.direction.y === colDirection)
                ) {
                    // if previous move was an enpassant move right beside the current pawn
                    if (enPassantPosition.length > 0 && enPassantPosition[0].isSamePosition(new Position(srcPosition.x, srcPosition.y + colDirection))) {
                        moves.push(new Move({
                            startPos: srcPosition,
                            endPos: diagonalPosition,
                            isEnPassantCaptureMove: true
                        }))
                    }
                    // possible to diagonally capture an opponent piece
                    else if (!isEqual(diagonalPiece, PieceType.Empty) &&
                        getColor(diagonalPiece) === opponentColor) {
                        moves.push(new Move({
                            startPos: srcPosition,
                            endPos: diagonalPosition
                        }))
                    }
                }
            }
        }
    }

    // find moves for king while ensuring that the move is safe i.e. it does not place the king in check
    // King moves: 1 step in each direction, castle moves 
    function getKingMoves(_board: string[][], piece: string, srcPosition: Position, moves: Move[]) {
        
        const pieceColor = getColor(piece)
        const directions = [[-1, 0], [-1, 1], [0, 1], [1, 1], [1, 0], [1, -1], [0, -1], [-1, -1]]
        directions.forEach(direction => {
            const destPos = new Position(srcPosition.x + direction[0], srcPosition.y + direction[1])
            if (destPos.isInRange()) {
                const destPiece = _board[destPos.x][destPos.y]
                // destination is empty or holds an opponent piece
                if (isEqual(destPiece, PieceType.Empty) || getColor(destPiece) !== pieceColor) {
                    // place king at destination position and find out if it leads to check
                    const { _isChecked } = getPinsandCheckingPieces(_board, pieceColor, destPos)
                    if (!_isChecked) {
                        moves.push(new Move({
                            startPos: srcPosition,
                            endPos: destPos
                        }))
                    }
                }
            }
        })

        let possibleCastleMoves: Move[] = []
        // Queenside
        getCastleMoves(_board, getColor(piece), srcPosition, "Q", possibleCastleMoves) 
        // Kingside
        getCastleMoves(_board, getColor(piece), srcPosition, "K", possibleCastleMoves)

        // check if the castle move places the king under check
        possibleCastleMoves.forEach((move) => {
            const { _isChecked } = getPinsandCheckingPieces(_board, getColor(piece), move.endPos)
            if (!_isChecked) {
                moves.push(move)
            }
        })
    }

    // 
    function isTileUnderAttack(position: Position, _board: string[][]): boolean {
        // const color = getOpponentColor(player)
        // let moves: Move[] = []
        findMoves(_board, [])
        return false
    }

    // function called after user selects a piece type to promote the pawn into
    function promotePawn(type: PieceType) {
        // hide the modal
        promotionModalRef.current?.classList.add("hidden")

        // #int# set isPawnPromotion = true?????????
        // add notation of the move to state playedMoves
        const move = new Move({ 
            startPos: moveStartPosition!, 
            endPos: promotionPawnPosition! 
        }) 
        const notation = move.getNotation({ 
            srcPiece: PieceType.Pawn, 
            destPiece: board[promotionPawnPosition!.x][promotionPawnPosition!.y], 
            isPawnPromotionMove: true, 
            promotionType: type 
        })
        addNotation(notation)
        
        // update the board
        let newBoard: string[][] = []
        for (let row = 0; row < BOARD_SIZE; row += 1) {
            newBoard[row] = []
            for (let col = 0; col < BOARD_SIZE; col += 1) {
                if (promotionPawnPosition!.isSamePosition(new Position(row, col))) {
                    const piece = player === Color.White ? type.toLowerCase() : type.toUpperCase()
                    // piece.image = `${type}_${getColor(piece)}.png` #int# remove this line
                    newBoard[row].push(piece)
                } else {
                    newBoard[row].push(board[row][col])
                }
            }
        }
        setBoard(newBoard)
        setPromotionPawnPosition(null)
        postMoveSteps(newBoard, [])
    }

    // add notation to state playedMoves
    function addNotation(notation: string) {
        const movePlayedBy = player // pawnPromotion ? getOpponentColor(player) : player  removed now #int#
        if (notation) {
            if (movePlayedBy === Color.Black) {
                // push notation to last moveSet
                setPlayedMoves(prev => {
                    const newArr = [...prev]
                    newArr[newArr.length - 1].push(notation)
                    return newArr
                })
            } else {
                // add a new moveSet and push notation into it
                setPlayedMoves(prev => [...prev, [notation]])
            }
        }
    }

    // toggle the endGame modal
    function showHideModal() {
        endGameRef.current!.classList.toggle("hidden")
    }

    const flipBoard = player === Color.Black 
    const boardProps = {
        board, validMoves, lastMove, moveStartPosition, capturedBlack, capturedWhite, checkedKing, handleClick, flipBoard
    }

    const promotionModalProps = {
        promotePawn,
        color: player // getOpponentColor(player) #int#
    }

    const endGameProps = {
        winner: getOpponentColor(player),
        reason: checkmate ? "Stalemate" : "Checkmate", // #int# Check if this is correct
        showHideModal
    }

    const movesProps = {
        moves: playedMoves
    }

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