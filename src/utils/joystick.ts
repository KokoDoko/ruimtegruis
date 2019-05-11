export class Joystick {

    private readonly DEBUG : boolean = true;

    // FIELDS
    // Buttons
    private numberOfBUttons     = 0
    private axes: number[]      = [0,0]

    // currently only one player
    private gamepad : Gamepad | null // kan null zijn als listener nog niet is afgevuurd
    private previousGamepad : Gamepad
    private isConnected : boolean = false

    // ANALOG MOVEMENT
    public get XAxis(): number {
        return (this.axes[0])
    }
    public get YAxis(): number {
        return (this.axes[1])
    }
    
    /**
     * Creates a joystick object for one player
     * @param numOfButtons The number of buttons needed by your game
     */
    constructor(numOfButtons : number = 0) {
        this.numberOfBUttons = numOfButtons
        
        window.addEventListener("gamepadconnected", (e : Event) => this.onGamePadConnected(e as GamepadEvent))
        window.addEventListener("gamepaddisconnected", (e: Event) => this.onGamePadDisconnected(e as GamepadEvent))
    }

    private onGamePadConnected(e:GamepadEvent) : void {
        if (this.DEBUG) { console.log('Game pad connected') }

        this.gamepad = e.gamepad
        this.previousGamepad = this.gamepad
        
        this.isConnected = true
    }

    private onGamePadDisconnected(e:GamepadEvent) {
        if (this.DEBUG) { console.log('Game pad disconnected') }
        this.isConnected = false
    }

    // crazy null check
    public update() : void {
        if(this.isConnected) {
            let gamepads = navigator.getGamepads()

            if(gamepads) {
                let pad: Gamepad | null = gamepads[0]
                if (pad) {
                    this.readGamepad(pad)
                } 
            } 
        }
    }

    public readGamepad(gamepad: Gamepad) : void {
         
        for (let i = 0; i < this.numberOfBUttons; i++) {
            if (this.buttonPressed(gamepad.buttons[i]) && !this.buttonPressed(this.previousGamepad.buttons[i])) 
            {
                document.dispatchEvent(new Event('button' + i))
            }
        }

        this.axes = [gamepad.axes[0], gamepad.axes[1]]
        this.previousGamepad = gamepad
    }

    /**
     * Helper function to filter some bad input
     * @param b 
     */
    private buttonPressed(b:any) : boolean {
        if (typeof(b) == "object") {
          return b.pressed;
        }
        return b == 1.0;
      }
}

