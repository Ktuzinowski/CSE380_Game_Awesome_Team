import StateMachineAI from "../../Wolfie2D/AI/StateMachineAI";
import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import OrthogonalTilemap from "../../Wolfie2D/Nodes/Tilemaps/OrthogonalTilemap";

import Input from "../../Wolfie2D/Input/Input";

import HW3AnimatedSprite from "../Nodes/HW3AnimatedSprite";
import MathUtils from "../../Wolfie2D/Utils/MathUtils";
import { HW3Events } from "../HW3Events";
import GameEvent from "../../Wolfie2D/Events/GameEvent";
import Timer, { TimerState } from "../../Wolfie2D/Timing/Timer";

/**
 * Animation keys for the slime spritesheet
 */
export const SlimeAnimations = {
    IDLE: "IDLE",
    PREP_JUMP: "PREP_JUMP",
    AIRBORNE: "AIRBORNE"
} as const

/**
 * Keys for the states the PlayerController can be in.
 */
export const SlimeStates = {
    IDLE: "IDLE",
    PREP_JUMP: "PREP_JUMP",
    AIRBORNE: "AIRBORNE"
} as const

/**
 * The controller that controls the player.
 */
export default class SlimeController extends StateMachineAI {
    public readonly MAX_SPEED: number = 200;
    public readonly MIN_SPEED: number = 100;

    /** The players game node */
    protected owner: HW3AnimatedSprite;

    protected _velocity: Vec2;
	protected _speed: number;

    protected tilemap: OrthogonalTilemap;

    protected deltaT: number = 0;

    
    public initializeAI(owner: HW3AnimatedSprite, options: Record<string, any>){
        this.owner = owner;

        this.tilemap = this.owner.getScene().getTilemap(options.tilemap) as OrthogonalTilemap;
        this.speed = 400;
        this.velocity = Vec2.ZERO;

        // Add the different states the player can be in to the PlayerController 
        /* TODO: Create Slime States
		this.addState(PlayerStates.IDLE, new Idle(this, this.owner));
		this.addState(PlayerStates.RUN, new Run(this, this.owner));
        this.addState(PlayerStates.DEAD, new Dead(this, this.owner));
        this.addState(PlayerStates.FLY, new Fly(this, this.owner));
        this.addState(PlayerStates.AIRBORNE, new Airborne(this, this.owner));
        */
        // this is the parent, this.owner is the owner, use for updating based on events

        /*TODO: Subscribe to approprate events
        this.receiver.subscribe(HW3Events.BOUNCED_ON_PAIN) // bounce on pain
        this.receiver.subscribe(HW3Events.BOUNCED_ON_SLIME) // bounce on slime
        */
        // Start the player in the Idle state

        //TODO: Initilize
        //this.initialize(PlayerStates.IDLE);
    }

    /** 
     * Gets the direction of the mouse from the player's position as a Vec2
     */

    public update(deltaT: number): void {
		super.update(deltaT);
        this.deltaT = deltaT;


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

}