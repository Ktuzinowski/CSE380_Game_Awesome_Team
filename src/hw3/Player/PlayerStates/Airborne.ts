import MathUtils from "../../../Wolfie2D/Utils/MathUtils";
import { PlayerStates } from "../PlayerController";
import PlayerState from "./PlayerState";

export default class Airborne extends PlayerState {

    onEnter(options: Record<string, any>): void {
        console.log("ENTERING AIRBORNE")
        // If we're falling, the vertical velocity should be >= 0
        
    }

    update(deltaT: number): void {

        // If the player hits the ground, start idling and check if we should take damage
        if (this.owner.onGround) {
            if(this.parent.velocity.y < 50 && this.parent.velocity.y > -50)
                this.finished(PlayerStates.IDLE)
            else 
                this.parent.velocity.y = this.prev.y * -1 * 0.6;
        } 
        // Otherwise, keep moving
        else {
            // Get the movement direction from the player 
            let dir = this.parent.inputDir;
            // Update the horizontal velocity of the player
            this.parent.velocity.x += dir.x * this.parent.speed/3.5 - 0.3*this.parent.velocity.x;
            // Update the vertical velocity of the player
            this.parent.velocity.y += this.gravity*deltaT;
            // Move the player
            this.owner.move(this.parent.velocity.scaled(deltaT));
        }

        this.prev = this.parent.velocity.clone();
        // console.log(this.parent.velocity.y);
    }

    onExit(): Record<string, any> {
        return {};
    }
}