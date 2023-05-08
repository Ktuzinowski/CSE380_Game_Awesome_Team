import { SlugmaAnimations, SlugmaStates } from "../SlugmaController";
import PlayerState from "./PlayerState";

export default class Airborne extends PlayerState {

    onEnter(options: Record<string, any>): void {
        console.log("ENTERING AIRBORNE")
        if (!this.owner.animation.isPlaying(SlugmaAnimations.DAMAGE)) {
            this.owner.animation.playIfNotAlready(SlugmaAnimations.FLY);
        }
        //console.log(this.parent.velocity.y)
        // If we're falling, the vertical velocity should be >= 0
        
    }

    update(deltaT: number): void {
        if (!this.owner.animation.isPlaying(SlugmaAnimations.DAMAGE) && !this.owner.animation.isPlaying(SlugmaAnimations.DYING) && !this.owner.animation.isPlaying(SlugmaAnimations.DEAD)) {
            this.owner.animation.playIfNotAlready(SlugmaAnimations.FLY);
        }
        //console.log(this.parent.velocity.y)
        // If the player hits the ground, start idling and check if we should take damage
        if (this.owner.onGround) {
            //this.parent.health -= Math.floor(this.parent.velocity.y / 300);
            if(this.parent.velocity.y < 50 && this.parent.velocity.y > -50){
                // we are here
                this.finished(SlugmaStates.IDLE)
            }  
            else 
                this.parent.velocity.y = this.prev.y * -1 * 0.35;
        } 
        
        // else if(this.parent.fuel !==0 && Input.isPressed(HW3Controls.FLY)) {
        //     this.finished(SlugmaStates.FLY);

        // }
        // Otherwise, keep moving
        else {
            // Get the movement direction from the player 
           // let dir = this.parent.inputDir;
            // Update the horizontal velocity of the player
            //this.parent.velocity.x += dir.x * this.parent.speed/3.5 - 0.3*this.parent.velocity.x;
            // Update the vertical velocity of the player
            this.parent.velocity.y += this.gravity*deltaT;
            // Indicating that we hit the ceiling
            if (this.owner.onCeiling) {
                this.parent.velocity.y *= -0.5
            }
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