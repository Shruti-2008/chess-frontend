import React from "react"
import { BOARD_SIZE, Color, initialBoard, PieceType, capturedCount } from "../Constants"
import { Piece, Position } from "../models"
import { Move } from "../models/Move"
import Chessboard from "./Chessboard"
import Footer from "./Footer"
import Header from "./Header"
import PromotionModal from "./PromotionModal"

function Referee() {
    //const [pieces, setPieces] = React.useState<Piece[]>([]) //can be changed to object later for faster access
    //const [activePiece, setActivePiece] = React.useState<Piece | null>(null)
    //const [promotionPawn, setPromotionPawn] = React.useState<Piece | null>(null)

    //const [castleMove, setCastleMove] = React.useState<Position[]>([])
    const promotionModalRef = React.useRef<HTMLDivElement>(null)
    //const [validPos, setValidPos] = React.useState<Position[]>([])
    //const [enPassantPiece, setEnPassantPiece] = React.useState<Piece | null>(null) //comes from opponent
    //const [capturedWhite, setCapturedWhite] = React.useState<Set<Piece>>(new Set())
    //const [capturedBlack, setCapturedBlack] = React.useState<Set<Piece>>(new Set())

    const [capturedWhite, setCapturedWhite] = React.useState(capturedCount)
    const [capturedBlack, setCapturedBlack] = React.useState(capturedCount)
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
    const [checkmate, setCheckmate] = React.useState(false)
    const [stalemate, setStalemate] = React.useState(false)
    const [whiteKingPos, setWhiteKingPos] = React.useState<Position>(new Position(0, 4))
    const [blackKingPos, setBlackKingPos] = React.useState<Position>(new Position(7, 4))

    React.useEffect(() => {
        findMoves(board, []) /************/
        changePlayer()
    }, [])

    console.log('Rendered')

    function opponentColor(color: Color) {
        return color === Color.White ? Color.Black : Color.White
    }

    function handleClick(event: React.MouseEvent, posClicked: Position, valid: boolean = false) {
        console.log("clicked ", posClicked)
        if (valid) {
            const { enPassantPos, _board } = makeMove(posClicked)
            changePlayer()
            findMoves(_board, enPassantPos)
            setMoveStart(null)
            setValidMoves([])
        } else {
            showValidMoves(posClicked)
            setMoveStart(posClicked)
        }
    }

    function makeMove(destPos: Position) {

        //clone the board
        let _board: Piece[][] = []
        for (let i = 0; i < BOARD_SIZE; i += 1) {
            _board[i] = []
            for (let j = 0; j < BOARD_SIZE; j += 1) {
                _board[i].push(board[i][j])
            }
        }

        console.log("Making move from ", moveStart, destPos)
        const src = _board[moveStart!.x][moveStart!.y]
        const dest = _board[destPos.x][destPos.y]

        let enPassantPos: Position[] = []
        let endRow = src.color === Color.White ? 7 : 0

        const curMove = new Move(moveStart!, destPos)
        const move = moves.find(move => move.isEqual(curMove))

        if (dest.type !== PieceType.Empty && dest.color === opponentColor(src.color)) {
            capture(dest)
        }
        console.log("Captured dest ", destPos)

        //enpassant
        if (move && move!.isEnPassantMove) { //maybe improve????????????
            console.log("Enpassant capturing piece : ", moveStart!.x, destPos.y)
            const enPassantPosition = new Position(moveStart!.x, destPos.y)
            capture(board[enPassantPosition!.x][enPassantPosition!.y])
            _board[enPassantPosition!.x][enPassantPosition!.y] = new Piece(PieceType.Empty, Color.None)
        }
        if (src.type === PieceType.Pawn && Math.abs(moveStart!.x - destPos.x) === 2) {
            enPassantPos.push(new Position(destPos.x, destPos.y))
        }

        //castle move
        if (src.type === PieceType.King && Math.abs(moveStart!.y - destPos.y) === 2) {
            const castleSide = destPos.y === 2 ? 0 : 7 //2 on left and 6 on right 
            const newRookPos = new Position(destPos.x, destPos.y === 2 ? 3 : 5)
            _board[newRookPos.x][newRookPos.y] = _board[newRookPos.x][castleSide].clone()
            _board[newRookPos.x][castleSide] = new Piece(PieceType.Empty, Color.None)
            _board[newRookPos.x][castleSide].isMoved = true
        }

        //pawn promotion
        if (src.type === PieceType.Pawn && destPos.x === endRow) {
            console.log("Promote Pawn")
            promotionModalRef.current?.classList.remove("hidden")
            setPromotionPawnPosition(destPos)
        }

        //update King position
        if (src.type === PieceType.King) {
            src.color === Color.White ?
                setWhiteKingPos(destPos) :
                setBlackKingPos(destPos)
        }

        _board[moveStart!.x][moveStart!.y] = new Piece(PieceType.Empty, Color.None)
        _board[destPos.x][destPos.y] = src
        _board[destPos.x][destPos.y].isMoved = true

        setBoard(_board)
        return { enPassantPos, _board }
    }

    function capture(piece: Piece) {
        piece.color === Color.White ?
            // setCapturedWhite(prevCaptured => (prevCaptured.add(piece))) :
            // setCapturedBlack(prevCaptured => (prevCaptured.add(piece)))
            setCapturedWhite(
                prev => prev.map(obj => obj.type === piece.type ? { ...obj, value: obj.value + 1 } : obj)
            ) :
            setCapturedBlack(
                prev => prev.map(obj => obj.type === piece.type ? { ...obj, value: obj.value + 1 } : obj)
            )
    }

    function changePlayer() {
        setPlayer(prev => (prev === Color.White ? Color.Black : Color.White))
    }

    function showValidMoves(posClicked: Position) {
        setValidMoves(
            moves.filter(move => move.startPos.samePosition(posClicked))
        )
    }

    function getPinsandCheckingPieces(_board: Piece[][], king: Piece, position: Position) {
        let _isChecked: boolean = false
        let _pins: { position: Position, direction: Position }[] = []
        let _checkingPieces: { position: Position, direction: Position }[] = []

        let possiblePins: Position[]
        let directions = [[-1, 0], [1, 0], [0, 1], [0, -1], [-1, -1], [1, -1], [-1, 1], [1, 1]]
        directions.forEach((direction, idx) => {
            possiblePins = []
            for (let i = 1; i < 8; i++) {
                let newPos = new Position(position.x + direction[0] * i, position.y + direction[1] * i)
                if (newPos.isInRange()) {
                    const piece = _board[newPos.x][newPos.y]
                    if (piece.type !== PieceType.Empty) {
                        if (piece.color === king.color && piece.type !== PieceType.King) { //ally
                            if (possiblePins.length === 0) {
                                possiblePins.push(newPos)
                            } else {
                                break
                            }
                        } else if (piece.color === opponentColor(king.color)) { //enemy
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

        console.log(_isChecked, _checkingPieces, _pins)
        return { _isChecked, _checkingPieces, _pins }
    }

    function findMoves(_board: Piece[][], enPassantPos: Position[]) {
        let _moves: Move[] = []
        const kingPosition = opponentColor(player) === Color.White ? whiteKingPos : blackKingPos
        const kingPiece = _board[kingPosition.x][kingPosition.y]
        const { _isChecked, _checkingPieces, _pins } = getPinsandCheckingPieces(_board, kingPiece, kingPosition)

        if (_isChecked) {
            console.log("Under Check")
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
                        if (validPos.samePosition(checking.position)) {
                            break
                        }
                    }
                }
                console.log("Valid Tiles are : ", validTiles)

                // get all moves as usual
                getAllMoves(_board, _moves, enPassantPos, _pins)
                // filter the moves to keep just the moves whose destination is a valid square OR the king moves 
                _moves = _moves.filter(
                    move => validTiles.some(tile => tile.samePosition(move.endPos)) ||
                        move.startPos.samePosition(kingPosition)
                )
            } else { //double-check so king has to move
                // get king location
                // call function to get just king moves
                console.log("Double check")
                const directions = [[-1, 0], [-1, 1], [0, 1], [1, 1], [1, 0], [1, -1], [0, -1], [-1, -1]]
                getKingMoves(_board, kingPiece, kingPosition, _moves, enPassantPos)
            }
        } else {
            console.log("Not Under Check")
            //get all moves as usual
            getAllMoves(_board, _moves, enPassantPos, _pins)
        }

        console.log("Moves are : ", _moves)
        setMoves(_moves)

        if (_moves.length === 0) {
            //no valid moves:
            if (_isChecked) { ///another function *******************************
                setCheckmate(true)
            } else {
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
                if (piece.color === color) {
                    console.log("getting moves for: ", row, col)
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
        console.log("getting Piece Moves")
        let isDirectionValid = Array(directions.length).fill(true);
        let proceed = true
        let possibleMoves: Move[] = []

        const pinDirection = pins.find(pin => pin.position.samePosition(srcPosition))
        const isPinned = pinDirection ? true : false

        while (proceed) {
            console.log("proceeding...", isDirectionValid)
            directions.forEach((move_direction, idx) => {
                if (isDirectionValid[idx]) {
                    if (!isPinned ||
                        (pinDirection!.direction.x === move_direction[0] && pinDirection!.direction.y === move_direction[1]) ||
                        (-pinDirection!.direction.x === move_direction[0] && -pinDirection!.direction.y === move_direction[1])
                    ) {
                        const destPosition = new Position(srcPosition.x + move_direction[0], srcPosition.y + move_direction[1])
                        if (destPosition.isInRange()) {
                            const destPiece = _board[destPosition.x][destPosition.y] // ************ need to get board *************//
                            if (destPiece.type === PieceType.Empty) {
                                possibleMoves.push(new Move(srcPosition, destPosition))
                            }
                            else if (destPiece.color === opponentColor(srcPiece.color)) {
                                possibleMoves.push(new Move(srcPosition, destPosition))
                                isDirectionValid[idx] = false
                            }
                            else {
                                isDirectionValid[idx] = false
                            }
                        } else {
                            isDirectionValid[idx] = false
                        }
                    }
                    else {
                        isDirectionValid[idx] = false
                    }
                }
            })

            if (srcPiece.type === PieceType.Knight) {
                break;
            }
            if (srcPiece.type === PieceType.King) {
                if (!srcPiece.isMoved) {
                    //Queenside
                    getCastleMoves(_board, srcPiece, srcPosition, new Position(srcPosition.x, 0), moves)
                    //Kingside
                    getCastleMoves(_board, srcPiece, srcPosition, new Position(srcPosition.x, 7), moves)

                }
                break;
            }
            proceed = isDirectionValid.reduce((a, b) => (a || b))
            directions = directions.map(x => x.map(t => t && t + Math.sign(t)))
        }
        moves.push(...possibleMoves)
    }

    function getCastleMoves(_board: Piece[][], kingPiece: Piece, kingPosition: Position, rookPosition: Position, moves: Move[]) {
        const direction = rookPosition.y < kingPosition.y ? -1 : 1
        const qsRook = _board[rookPosition.x][rookPosition.y]
        if (qsRook.type === PieceType.Rook && !qsRook.isMoved) {
            //move rook also isMoved
            if (isCastlePathClear(_board, kingPosition, rookPosition)) {
                moves.push(new Move(kingPosition, new Position(kingPosition.x, kingPosition.y + 2 * direction)))
            }
        }
    }

    function isCastlePathClear(_board: Piece[][], kingPos: Position, rookPos: Position) {
        const direction = rookPos.y < kingPos.y ? 1 : -1
        for (let col = rookPos.y + direction; (col - kingPos.y) !== 0; col += direction) {
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

        const pin = pins.find(pin => pin.position.samePosition(srcPosition))
        const isPinned = pin ? true : false
        console.log("Pawn pinned", isPinned, pin)

        // const kingPosition = opponentColor(player) === Color.White ? whiteKingPos : blackKingPos
        // const kingPiece = _board[kingPosition.x][kingPosition.y]

        const forwardPosition = new Position(srcPosition.x + row_direction, srcPosition.y)
        if (forwardPosition.isInRange() && _board[forwardPosition.x][forwardPosition.y].type === PieceType.Empty) {
            if (!isPinned || (pin!.direction.x === row_direction && pin!.direction.y === 0) || (-pin!.direction.x === row_direction && pin!.direction.y === 0)) {
                moves.push(new Move(srcPosition, forwardPosition))
                if (srcPosition.x === special_row) {
                    const doubleForwardPosition = new Position(forwardPosition.x + row_direction, forwardPosition.y)
                    const doubleForwardPiece = _board[doubleForwardPosition.x][doubleForwardPosition.y]
                    if (doubleForwardPiece.type === PieceType.Empty) {
                        moves.push(new Move(srcPosition, doubleForwardPosition))
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
                    if (enPassantPos.length > 0 && enPassantPos[0].samePosition(new Position(srcPosition.x, srcPosition.y + col_direction))) {
                        moves.push(new Move(srcPosition, diagonalPosition, true))
                    }
                    else if (_board[diagonalPosition.x][diagonalPosition.y].type !== PieceType.Empty &&
                        _board[diagonalPosition.x][diagonalPosition.y].color === opponentColor(piece.color)) {
                        moves.push(new Move(srcPosition, diagonalPosition))
                    }
                }
            }
        }
    }

    function getKingMoves(_board: Piece[][], piece: Piece, srcPosition: Position, moves: Move[], enPassantPos: Position[]) {
        console.log("Getting King Moves : ", piece.color, srcPosition)
        const directions = [[-1, 0], [-1, 1], [0, 1], [1, 1], [1, 0], [1, -1], [0, -1], [-1, -1]]
        directions.forEach(direction => {
            const destPos = new Position(srcPosition.x + direction[0], srcPosition.y + direction[1])
            if (destPos.isInRange()) {
                const destPiece = _board[destPos.x][destPos.y]
                if (destPiece.color !== piece.color) {//enemy or empty piece

                    const { _isChecked } = getPinsandCheckingPieces(_board, piece, destPos)
                    console.log("Possibly can move king to - checked? ", _isChecked, destPos)
                    if (!_isChecked) {
                        moves.push(new Move(srcPosition, destPos))
                    }
                }
            }
        })

        if (!piece.isMoved) { //additional logic to be added********************************
            //Queenside
            getCastleMoves(_board, piece, srcPosition, new Position(srcPosition.x, 0), moves)
            //Kingside
            getCastleMoves(_board, piece, srcPosition, new Position(srcPosition.x, 7), moves)

        }
    }

    function isTileUnderAttack(position: Position, _board:Piece[][]):boolean{
        const color = opponentColor(player)
        let moves:Move[] = []
        findMoves(_board,[])
        return false
    }

    function promotePawn(type: PieceType) {
        promotionModalRef.current?.classList.add("hidden")
        console.log("Type selected = ", type)
        setBoard(prevBoard => {
            let newBoard: Piece[][] = []
            for (let row = 0; row < BOARD_SIZE; row += 1) {
                newBoard[row] = []
                for (let col = 0; col < BOARD_SIZE; col += 1) {
                    if (promotionPawnPosition?.samePosition(new Position(row, col))) {
                        let piece = prevBoard[row][col].clone()
                        piece.type = type
                        piece.image = `${type}_${piece.color}.png`
                        console.log("New piece = ", piece)
                        newBoard[row].push(piece)
                    } else {
                        newBoard[row].push(prevBoard[row][col])
                    }
                }
            }
            return newBoard
        })
        setPromotionPawnPosition(null)
    }

    const boardProps = {
        board, validMoves, handleClick, capturedBlack, capturedWhite
    }

    const promotionModalProps = {
        promotePawn,
        color: opponentColor(player)
    }

    ////max-w-full

    return (
        <div className="bg-slate-200 flex flex-col">
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