import { BOARD_SIZE } from "../Constants"

export class Position{
    x : number
    y : number
    constructor(x: number, y: number){
        this.x = x
        this.y = y
    }

    isInRange() : boolean {
        return (
            this.x >= 0 && 
            this.x < BOARD_SIZE && 
            this.y >= 0 && 
            this.y < BOARD_SIZE
        )    
    }

    samePosition(pos : Position) : boolean{
        return this.x === pos.x && this.y === pos.y 
    }
}