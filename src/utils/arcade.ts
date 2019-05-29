import { Joystick } from "./joystick"

export class Arcade {
    private joysticks: Joystick[]
    private readonly REDIRECT_URL: string = "http://hr-cmgt.github.io/arcade-server"

    // PROPERTIES
    public get Joysticks(): Joystick[] { return this.joysticks }

    /**
     * Creates an arcade 'cabinet'
     */
    constructor() {
        this.joysticks = []

        document.addEventListener("redirect", () => this.onRedirect())
        window.addEventListener("gamepadconnected", (e: Event) => this.onGamePadConnected(e as GamepadEvent))
        window.addEventListener("gamepaddisconnected", (e: Event) => this.onGamePadDisconnected(e as GamepadEvent))
    }

    /**
     * Handles redirect fired from joystick
     */
    private onRedirect(): void {
        window.location.href = this.REDIRECT_URL
    }

    /**
     * Handles connecting a joystick
     * @param e Gamepad event
     */
    private onGamePadConnected(e: GamepadEvent): void {

        console.log('Game pad connected')
        console.log("Joystick number: " + e.gamepad.index)

        let joystick = this.createAndAddJoystick(e.gamepad.index, 6)
        joystick.isConnected = true
        joystick.PreviousGamepad = joystick.Gamepad
        joystick.Gamepad = e.gamepad
        if (joystick.PreviousGamepad == null) {
            joystick.PreviousGamepad = e.gamepad
        }
    }

    /**
     * Handles disconnecting a joystick
     * @param e Gamepad event
     */
    private onGamePadDisconnected(e: GamepadEvent): void {
        this.removeJoystick(e.gamepad.index);
    }

    /**
     * Creates an Joystick and adds it to this arcade
     * @param joystickNumber Unique identifier given by the joystick
     * @param numOfButtons Sets number of buttons on joystick
     */
    public createAndAddJoystick(joystickNumber: number, numOfButtons: number): Joystick {
        let joystickCheck = this.getJoystickByNumber(joystickNumber)
        if (joystickCheck != null) {
            return joystickCheck
        }

        let joystickNew = new Joystick(joystickNumber, numOfButtons)
        this.joysticks[joystickNumber] = joystickNew
        return joystickNew
    }

    /**
     * Removes a Joystick from this arcade
     * @param joystickNumber Unique identifier of the joystick
     */
    public removeJoystick(joystickNumber: number): void {
        let joystickCheck = this.getJoystickByNumber(joystickNumber)
        if (joystickCheck == null) {
            return
        }

        var index = this.joysticks.indexOf(joystickCheck);
        this.joysticks[index].destroy()
        if (index > -1) {
            this.joysticks.splice(index, 1);
        }
    }

    /**
     * Get a Joystick with its unique identifier
     * @param joystickNumber Unique identifier given by the joystick
     */
    public getJoystickByNumber(joystickNumber: number): any {
        for (let joystick of this.joysticks) {
            if (joystick.JoystickNumber == joystickNumber) {
                return joystick
            }
        }
        return null;
    }
}