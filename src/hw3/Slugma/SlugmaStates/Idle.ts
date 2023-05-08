import { SlugmaStates, SlugmaAnimations } from "../SlugmaController";
import PlayerState from "./PlayerState";
import Input from "../../../Wolfie2D/Input/Input";
import { HW3Controls } from "../../HW3Controls";

export default class Idle extends PlayerState {

	public onEnter(options: Record<string, any>): void {
        console.log("ENTERING IDLE")
        this.owner.animation.play(SlugmaAnimations.IDLE, true);
		this.parent.speed = this.parent.MIN_SPEED;

        this.parent.velocity.x = 0;
        this.parent.velocity.y = 0;
	}

	public update(deltaT: number): void {
        // Adjust the direction the player is facing
		super.update(deltaT);
        // If the player is not on the ground, transition to the falling state

        
        // if (!this.owner.onGround || this.owner.onCeiling) {
        //     console.log("Entering into the airborne state");
        //     this.finished(SlugmaStates.AIRBORNE);
        // }
        if (this.parent.targetXPosition < 200) {
            this.finished(SlugmaStates.FOLLOW)
        }
		
	}

	public onExit(): Record<string, any> {
		this.owner.animation.stop();
		return {};
	}
}