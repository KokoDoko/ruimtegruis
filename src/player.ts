import { Ship } from "./objects/ship";

export class Player {

    private name        : string 
    private score       : number    = 0

    private number : number = 0

    
    public get Number() : number { return this.number }

    public get Score()  : number        { return this.score     }
    public set Score(score : number)    { this.score = score    }

    public get Color() : number         {  return Ship.COLORS[this.Number]   }
    
    constructor(number : number) {
        this.number = number
    }
}