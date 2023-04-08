import { PlayerStates, PlayerAnimations } from "../PlayerController";
import PlayerState from "./PlayerState";
import Input from "../../../Wolfie2D/Input/Input";
import { HW3Controls } from "../../HW3Controls";

export default class Idle extends PlayerState {

	public onEnter(options: Record<string, any>): void {
        console.log("ENTERING IDLE")
        this.owner.animation.play(PlayerAnimations.IDLE);
		this.parent.speed = this.parent.MIN_SPEED;

        this.parent.velocity.x = 0;
        this.parent.velocity.y = 0;
	}

	public update(deltaT: number): void {
        // Adjust the direction the player is facing
		super.update(deltaT);

        // Get the direction of the player's movement
		let dir = this.parent.inputDir;

        // If the player is moving along the x-axis, transition to the walking state
		if (!dir.isZero() && dir.y === 0){
			this.finished(PlayerStates.RUN);
		} 
        //if the player is flying, transition to fly state
        else if(this.parent.fuel !==0 && Input.isPressed(HW3Controls.FLY)) {
            this.finished(PlayerStates.FLY);
        }
        // If the player is not on the ground, transition to the falling state
        else if (!this.owner.onGround && this.parent.velocity.y > 0) {
            this.finished(PlayerStates.AIRBORNE);
        } else {
            // Update the vertical velocity of the player
            //this.parent.velocity.y += this.gravity*deltaT;
            console.log(this.parent.velocity.y + "in idle")
            // Move the player
            //this.owner.move(this.parent.velocity.scaled(deltaT));
        }
        

        // Otherwise, do nothing (keep idling)
		
	}

	public onExit(): Record<string, any> {
		this.owner.animation.stop();
		return {};
	}
}