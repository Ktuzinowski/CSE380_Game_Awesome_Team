import MathUtils from "../../../Wolfie2D/Utils/MathUtils";
import { PlayerStates } from "../PlayerController";
import PlayerState from "./PlayerState";

import Input from "../../../Wolfie2D/Input/Input";
import { HW3Controls } from "../../HW3Controls";
export default class Fall extends PlayerState {

    onEnter(options: Record<string, any>): void {
        // If we're falling, the vertical velocity should be >= 0
        this.parent.velocity.y = 0;
    }

    update(deltaT: number): void {

        // If the player hits the ground, start idling and check if we should take damage
        if (this.owner.onGround) {
            this.parent.health -= Math.floor(this.parent.velocity.y / 300);
            this.parent.fuel += 0;
            this.finished(PlayerStates.IDLE);
        } 
        else if(this.parent.fuel !==0 && Input.isPressed(HW3Controls.FLY)) {
            this.finished(PlayerStates.FLY);

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

    }

    onExit(): Record<string, any> {
        return {};
    }
}