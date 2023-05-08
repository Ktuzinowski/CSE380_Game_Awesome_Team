import { SlugmaStates, SlugmaAnimations } from "../SlugmaController";
import Input from "../../../Wolfie2D/Input/Input";
import { HW3Controls } from "../../HW3Controls";
import PlayerState from "./PlayerState";
import { HW3Events } from "../../HW3Events";

export default class Follow extends PlayerState {

	onEnter(options: Record<string, any>): void {
        console.log("ENTERING RUN")
		this.parent.speed = this.parent.MIN_SPEED;
        const shouldTurnLeft = options.shouldTurnLeft;
        if (shouldTurnLeft) {
            this.owner.animation.playIfNotAlready(SlugmaAnimations.RUN_LEFT, true);
        } else {
            this.owner.animation.playIfNotAlready(SlugmaAnimations.RUN_RIGHT, true);
        }
	}

	update(deltaT: number): void {
        // Call the update method in the parent class - updates the direction the player is facing
        super.update(deltaT);
        const differenceOfX = this.parent.targetXPosition  - this.owner.position.x;
        const differenceOfY = this.parent.targetYPosition - this.owner.position.y;
        console.log(this.parent.targetXPosition +  " "  + this.parent.targetYPosition)
        // console.log("Difference " + differenceOfX)
        if (differenceOfX > 200) {
            // too far away to chase the player
            this.owner.animation.playIfNotAlready(SlugmaAnimations.IDLE, true);
        }

        if (differenceOfX === 16 || differenceOfX === -16) {
            this.parent.velocity.x = 0
            this.owner.move(this.parent.velocity.scaled(deltaT));
            this.emitter.fireEvent(HW3Events.BOUNCED_ON_PAIN, null);
            this.owner.animation.playIfNotAlready(SlugmaAnimations.IDLE, true);
        } 
        else if (differenceOfX > 0) {
            this.parent.velocity.x = this.parent.speed / 4
            this.owner.animation.playIfNotAlready(SlugmaAnimations.RUN_RIGHT, true);
        }  else {
            this.parent.velocity.x = -this.parent.speed / 4
            this.owner.animation.playIfNotAlready(SlugmaAnimations.RUN_LEFT, true);
        }


        if (!this.owner.onGround) {
            //this.parent.velocity.y = -this.parent.speed / 4; 
            this.parent.velocity.y += this.gravity*deltaT;
        }
        this.owner.move(this.parent.velocity.scaled(deltaT));
	}

	onExit(): Record<string, any> {
		this.owner.animation.stop();
		return {};
	}
}