import State from "../../../Wolfie2D/DataTypes/State/State";
import Vec2 from "../../../Wolfie2D/DataTypes/Vec2";
import GameEvent from "../../../Wolfie2D/Events/GameEvent";
import MathUtils from "../../../Wolfie2D/Utils/MathUtils";
import HW3AnimatedSprite from "../../Nodes/HW3AnimatedSprite";
import PlayerController from "../PlayerController";

/**
 * An abstract state for the PlayerController 
 */
export default abstract class PlayerState extends State {

    protected parent: PlayerController;
	protected owner: HW3AnimatedSprite;
	protected gravity: number;
    protected prev: Vec2;

	public constructor(parent: PlayerController, owner: HW3AnimatedSprite){
		super(parent);
		this.owner = owner;
        this.gravity = 500;
        this.prev = Vec2.ZERO;
	}

    public abstract onEnter(options: Record<string, any>): void;

    /**
     * Handle game events from the parent.
     * @param event the game event
     */
	public handleInput(event: GameEvent): void {
        switch(event.type) {
            // Default - throw an error
            default: {
                throw new Error(`Unhandled event in PlayerState of type ${event.type}`);
            }
        }
	}

	public update(deltaT: number): void {

    }

    public abstract onExit(): Record<string, any>;
}