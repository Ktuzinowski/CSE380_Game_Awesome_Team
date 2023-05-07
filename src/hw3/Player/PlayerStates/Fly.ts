import GameEvent from "../../../Wolfie2D/Events/GameEvent";
import { GameEventType } from "../../../Wolfie2D/Events/GameEventType";
import { PlayerAnimations, PlayerStates, PlayerTweens } from "../PlayerController";
import Input from "../../../Wolfie2D/Input/Input";
import { HW3Controls } from "../../HW3Controls";

import PlayerState from "./PlayerState";

export default class Fly extends PlayerState {
	public onEnter(options: Record<string, any>): void {
        console.log("ENTERING FLY")
        this.owner.animation.playIfNotAlready(PlayerAnimations.FLY);
        // Give the player a burst of upward momentum
        if(this.parent.fuel !== 0) {
            
        this.parent.fuel -= 1.4;
        this.parent.velocity.y += -15;
        }
	}

	public update(deltaT: number): void {
        // Update the direction the player is facing
        super.update(deltaT);
        if(Input.isPressed(HW3Controls.FLY)) {
            this.finished(PlayerStates.FLY);
            this.emitter.fireEvent(GameEventType.PLAY_SOUND, {key: this.owner.getScene().getJumpAudioKey(), loop: false, holdReference: false});
        }
        // If the player hit the ground, start idling
        if (this.owner.onGround) {
			this.finished(PlayerStates.IDLE);
		} 
        // If the player hit the ceiling or their velocity is >= to zero, 
        else if(this.owner.onCeiling || this.parent.velocity.y >= 0){
            this.finished(PlayerStates.AIRBORNE);
		}
        
        
        // Otherwise move the player
        else {
            // Get the input direction from the player
            let dir = this.parent.inputDir;
            // Update the horizontal velocity of the player
            this.parent.velocity.x += dir.x * this.parent.speed/3.5 - 0.3*this.parent.velocity.x;
            // Update the vertical velocity of the player
            this.parent.velocity.y += this.gravity*deltaT;
            // Move the player
        }
        
        this.owner.move(this.parent.velocity.scaled(deltaT));
	}

	public onExit(): Record<string, any> {
		this.owner.animation.stop();
		return {};
	}
}