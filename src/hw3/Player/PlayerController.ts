import StateMachineAI from "../../Wolfie2D/AI/StateMachineAI";
import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import OrthogonalTilemap from "../../Wolfie2D/Nodes/Tilemaps/OrthogonalTilemap";

import Airborne from "./PlayerStates/Airborne";
import Idle from "./PlayerStates/Idle";
import Run from "./PlayerStates/Run";
import Fly from "./PlayerStates/Fly";
import PlayerWeapon from "./PlayerWeapon";
import Input from "../../Wolfie2D/Input/Input";

import { HW3Controls } from "../HW3Controls";
import HW3AnimatedSprite from "../Nodes/HW3AnimatedSprite";
import MathUtils from "../../Wolfie2D/Utils/MathUtils";
import { HW3Events } from "../HW3Events";
import Dead from "./PlayerStates/Dead";
import GameEvent from "../../Wolfie2D/Events/GameEvent";
import Timer, { TimerState } from "../../Wolfie2D/Timing/Timer";
import { GameEventType } from "../../Wolfie2D/Events/GameEventType";

/**
 * Animation keys for the player spritesheet
 */
export const PlayerAnimations = {
    IDLE: "IDLE",
    RUN_LEFT: "RUN_LEFT",
    RUN_RIGHT: "RUN_RIGHT",
    FLY: "FLY",
    DYING: "DYING",
    DEAD: "DEAD",
    DAMAGE: "DAMAGE"
} as const

/**
 * Tween animations the player can player.
 */
export const PlayerTweens = {
    FLIP: "FLIP",
    DEATH: "DEATH"
} as const

/**
 * Keys for the states the PlayerController can be in.
 */
export const PlayerStates = {
    IDLE: "IDLE",
    RUN: "RUN",
	JUMP: "JUMP",
    FALL: "FALL",
    DEAD: "DEAD",
    FLY: "FLY",
    AIRBORNE: "AIRBORNE",
    BOUNCESLIME: "BOUNCESLIME"
} as const

/**
 * The controller that controls the player.
 */
export default class PlayerController extends StateMachineAI {
    public readonly MAX_SPEED: number = 200;
    public readonly MIN_SPEED: number = 100;

    /** Health and max health for the player */
    protected _health: number;
    protected _maxHealth: number;
    protected healthTimer: Timer;

    // Fuel Properties
    protected _fuel: number;
    protected _maxFuel: number;
    
    protected fuelTimer: Timer;
    /** The players game node */
    protected owner: HW3AnimatedSprite;

    protected _velocity: Vec2;
	protected _speed: number;

    protected tilemap: OrthogonalTilemap;
    // protected cannon: Sprite;
    protected weapon: PlayerWeapon;

    protected timerForDeathAnimation: Timer;

    protected timerForDamageAnimation: Timer;

    // Determining if Player has Infinite Fuel
    protected infiniteFuel: boolean = false;
    protected infiniteHealth: boolean = false;

    // Lower Boundary Property
    protected lowerBoundary: number;

    protected deltaT: number = 0;
    protected slimeBounceTimer: Timer = new Timer(100, () => {
        console.log("Finished bounce")
    })

    
    public initializeAI(owner: HW3AnimatedSprite, options: Record<string, any>){
        this.owner = owner;

        this.weapon = options.weaponSystem;

        this.lowerBoundary = options.lowerBoundary;

        this.tilemap = this.owner.getScene().getTilemap("Sleeping Slimes") as OrthogonalTilemap;
        console.log("These are the sceneOptions" + this.owner.getScene().sceneOptions)
        console.log("This is the tilemap + "  + this.tilemap);
        this.speed = 400;
        this.velocity = Vec2.ZERO;

        this.health = 10
        this.maxHealth = 10;
        this.fuel = 100
        this.maxFuel = 100;
        // Add the different states the player can be in to the PlayerController 
		this.addState(PlayerStates.IDLE, new Idle(this, this.owner));
		this.addState(PlayerStates.RUN, new Run(this, this.owner));
        this.addState(PlayerStates.DEAD, new Dead(this, this.owner));
        this.addState(PlayerStates.FLY, new Fly(this, this.owner));
        this.addState(PlayerStates.AIRBORNE, new Airborne(this, this.owner));
        // this is the parent, this.owner is the owner, use for updating based on events

        this.receiver.subscribe(HW3Events.BOUNCED_ON_PAIN) // bounce on pain
        this.receiver.subscribe(HW3Events.BOUNCED_ON_SLIME) // bounce on slime
        this.receiver.subscribe(HW3Events.PICKED_UP_FUEL) // picked up fuel
        this.receiver.subscribe(HW3Events.INFINITE_FUEL_TOGGLE); // infinite fuel being used
        this.receiver.subscribe(HW3Events.INFINITE_HEALTH_TOGGLE); // toggle for infinite health
        // Start the player in the Idle state

        this.fuelTimer = new Timer(300, () => {
            this.fuel +=3;
        },true);
        this.healthTimer = new Timer(300, () => {
            this.health -= 2;
        }, false);
        this.fuelTimer.start();
        this.initialize(PlayerStates.IDLE);

        // Timer for Death Animation
        this.timerForDeathAnimation = new Timer(500,  () => {
            this.owner.animation.play(PlayerAnimations.DEAD);
            this.emitter.fireEvent(HW3Events.PLAYER_DEAD);
        })

        // // Timer for Pain Animation
        this.timerForDamageAnimation = new Timer(50, () => {
            this.owner.animation.play(PlayerAnimations.FLY);
        })
    }

    /** 
	 * Get the inputs from the keyboard, or Vec2.Zero if nothing is being pressed
	 */
    public get inputDir(): Vec2 {
        let direction = Vec2.ZERO;
		direction.x = (Input.isPressed(HW3Controls.MOVE_LEFT) ? -1 : 0) + (Input.isPressed(HW3Controls.MOVE_RIGHT) ? 1 : 0);
		direction.y = (Input.isJustPressed(HW3Controls.JUMP) ? -1 : 0);
		return direction;
    }

    /** 
     * Gets the direction of the mouse from the player's position as a Vec2
     */
    public get faceDir(): Vec2 { return this.owner.position.dirTo(Input.getGlobalMousePosition()); }

    public update(deltaT: number): void {
		super.update(deltaT);
        this.deltaT = deltaT;
        if (this.lowerBoundary) {
            if (this.owner.position.y > 400 && (!(this.timerForDeathAnimation.getCurrentStateOfTimer() === TimerState.ACTIVE) || this.timerForDeathAnimation.hasRun())) {
                this.owner.animation.play(PlayerAnimations.DYING, false);
                this.timerForDeathAnimation.start();
                this.emitter.fireEvent(GameEventType.PLAY_SOUND, {key: this.owner.getScene().getDeathAudioKey(), loop: false, holdReference: false});
            }
        }
        this.emitter.fireEvent(HW3Events.UPDATE_AI_BASED_ON_PLAYER_POSITION, {
            xPosition: this.owner.position.x,
            yPosition: this.owner.position.y
        })
        if (this.timerForDeathAnimation.getCurrentStateOfTimer() === TimerState.ACTIVE || this.timerForDeathAnimation.hasRun()) {
            console.log("Returning from here...")
            return;
        }
        // Update the rotation to apply the particles velocity vector
        this.weapon.rotation = 2*Math.PI - Vec2.UP.angleToCCW(this.faceDir) + Math.PI;

        // If the player hits the attack button and the weapon system isn't running, restart the system and fire!
        /*
        if (Input.isPressed(HW3Controls.ATTACK) && !this.weapon.isSystemRunning()) {
            // Update the rotation to apply the particles velocity vector
            this.weapon.rotation = 2*Math.PI - Vec2.UP.angleToCCW(this.faceDir) + Math.PI;
            // Start the particle system at the player's current position
            this.weapon.startSystem(500, 0, this.owner.position);
        }
        */
        /*
            This if-statement will place a tile wherever the user clicks on the screen. I have
            left this here to make traversing the map a little easier, incase you accidently
            destroy everything with the player's weapon.
        */
        // if (Input.isMousePressed()) {
        //     this.tilemap.setTileAtRowCol(this.tilemap.getColRowAt(Input.getGlobalMousePosition()),5);
        // }
        while (this.receiver.hasNextEvent()) {
            this.handleEvent(this.receiver.getNextEvent());
        }
	}

    /**
     * Handle game events. 
     * @param event the game event
     */
    public handleEvent(event: GameEvent): void {
        switch (event.type) {
            case HW3Events.BOUNCED_ON_PAIN: {
                if (this.healthTimer.getCurrentStateOfTimer() === TimerState.ACTIVE) {
                    break;
                } else {
                    this.healthTimer.start();
                    if (!this.owner.animation.isPlaying(PlayerAnimations.DYING) && !this.owner.animation.isPlaying(PlayerAnimations.DEAD)) {
                        this.owner.animation.playIfNotAlready(PlayerAnimations.DAMAGE);
                        // Painful Slime Sound
		                this.emitter.fireEvent(GameEventType.PLAY_SOUND, {key: this.owner.getScene().getPainfulSlimeBounceAudioKey(), loop: false, holdReference: false});
                    }
                }
                if (this.slimeBounceTimer.getCurrentStateOfTimer() === TimerState.ACTIVE) {
                    return;
                } else {
                    this.slimeBounceTimer.reset();
                    this.slimeBounceTimer.start();
                }
                this.velocity.y *= 2.85
                console.log("This is painful...")
                break;
            }
            case HW3Events.BOUNCED_ON_SLIME: {
                if (this.slimeBounceTimer.getCurrentStateOfTimer() === TimerState.ACTIVE) {
                    return;
                } else {
                    this.slimeBounceTimer.reset();
                    this.slimeBounceTimer.start();
                    this.emitter.fireEvent(GameEventType.PLAY_SOUND, {key: this.owner.getScene().getSlimeBounceAudioKey(), loop: false, holdReference: false});
                }
                this.velocity.y *= 2.85;
                console.log(this.velocity.y + " SLIME")
                this.owner.move(this.velocity.scaled(this.deltaT));
                break;
            }
            case HW3Events.PICKED_UP_FUEL: {
                this.fuel  += 20;
                this.emitter.fireEvent(GameEventType.PLAY_SOUND, {key: this.owner.getScene().getFuelpackAudio(), loop: false, holdReference: false});
                break;
            }
            case HW3Events.INFINITE_FUEL_TOGGLE: {
                // get properties to eventually update to max fuel afterwards
                this.infiniteFuel = !this.infiniteFuel;
                this._fuel = this.maxFuel
                this.emitter.fireEvent(HW3Events.FUEL_CHANGE, {curfuel: this.maxFuel, maxfuel: this.maxFuel});
                break;
            }
            case HW3Events.INFINITE_HEALTH_TOGGLE: {
                this.infiniteHealth = !this.infiniteHealth;
                this._health = this.maxHealth;
                this.emitter.fireEvent(HW3Events.HEALTH_CHANGE, {curhp: this.maxHealth, maxhp: this.maxHealth});
                break;
            }
            // Default: Throw an error! No unhandled events allowed.
            default: {
                throw new Error(`Unhandled event caught in scene with type ${event.type}`)
            }
        }
    }


    public get velocity(): Vec2 { return this._velocity; }
    public set velocity(velocity: Vec2) { this._velocity = velocity; }

    public get speed(): number { return this._speed; }
    public set speed(speed: number) { this._speed = speed; }

    public get maxHealth(): number { return this._maxHealth; }
    public set maxHealth(maxHealth: number) { this._maxHealth = maxHealth; }

    public get health(): number { return this._health; }
    public set health(health: number) { 
        if (this.infiniteHealth) {
            return;
        }
        this._health = MathUtils.clamp(health, 0, this.maxHealth);
        // When the health changes, fire an event up to the scene.
        this.emitter.fireEvent(HW3Events.HEALTH_CHANGE, {curhp: this.health, maxhp: this.maxHealth});
        // If the health hit 0, change the state of the player
        if (this.health == 0 && this.timerForDeathAnimation.getCurrentStateOfTimer() !== TimerState.ACTIVE) {
            this.owner.animation.play(PlayerAnimations.DYING, false);
            this.timerForDeathAnimation.start();
            this.emitter.fireEvent(GameEventType.PLAY_SOUND, {key: this.owner.getScene().getDeathAudioKey(), loop: false, holdReference: false});
        }
    }
    public get maxFuel(): number { return this._maxFuel; }
    public set maxFuel(maxFuel: number) { this._maxFuel = maxFuel; }

    public get fuel(): number { return this._fuel; }
    public set fuel(fuel: number) { 
        if (this.infiniteFuel) {
            return;
        }
        this._fuel = MathUtils.clamp(fuel, 0, this.maxFuel);
        this.emitter.fireEvent(HW3Events.FUEL_CHANGE, {curfuel: this.fuel, maxfuel: this.maxFuel});
    }
}