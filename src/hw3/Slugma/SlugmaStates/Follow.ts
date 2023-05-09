import { SlugmaStates, SlugmaAnimations } from "../SlugmaController";
import Input from "../../../Wolfie2D/Input/Input";
import { HW3Controls } from "../../HW3Controls";
import PlayerState from "./PlayerState";
import { HW3Events } from "../../HW3Events";
import Timer, { TimerState } from "../../../Wolfie2D/Timing/Timer";

export default class Follow extends PlayerState {

    protected timerForIncreasingYVelocity: Timer = new Timer(10, () => {
        console.log("FINISHING UP VELOCITY")
    })

	onEnter(options: Record<string, any>): void {
        console.log("ENTERING RUN")
        this.timerForIncreasingYVelocity.start();
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
        console.log(this.parent.targetXPosition +  " "  + this.parent.targetYPosition)
        // console.log("Difference " + differenceOfX)
        if (differenceOfX > 200) {
            // too far away to chase the player
            this.owner.animation.playIfNotAlready(SlugmaAnimations.IDLE, true);
            this.finished(SlugmaAnimations.IDLE);
        }

        if (differenceOfX === 16 || differenceOfX === -16) {
            this.parent.velocity.x = 0
            this.owner.move(this.parent.velocity.scaled(deltaT));
            this.emitter.fireEvent(HW3Events.BOUNCED_ON_PAIN, {
                isSlumga: true
            });
            this.owner.animation.playIfNotAlready(SlugmaAnimations.IDLE, true);
        } 
        else if (differenceOfX > 0) {
            this.parent.velocity.x = this.parent.speed / 4
            this.owner.animation.playIfNotAlready(SlugmaAnimations.RUN_RIGHT, true);
        }  else {
            this.parent.velocity.x = -this.parent.speed / 4
            this.owner.animation.playIfNotAlready(SlugmaAnimations.RUN_LEFT, true);
        }

        const differenceOfY = this.parent.targetYPosition - this.owner.position.y;
        console.log("DIFF Y : " + differenceOfY);
        if (differenceOfY < 0) {
            if (this.timerForIncreasingYVelocity.getCurrentStateOfTimer() === TimerState.ACTIVE) {
            } else {
                this.timerForIncreasingYVelocity.reset();
                this.timerForIncreasingYVelocity.start();
                this.parent.velocity.y += -30;
            }
            this.parent.velocity.y += this.gravity*deltaT;
        }
        else if (differenceOfY > 16) {
            if (this.timerForIncreasingYVelocity.getCurrentStateOfTimer() === TimerState.ACTIVE) {
            } else {
                this.timerForIncreasingYVelocity.reset();
                this.timerForIncreasingYVelocity.start();
                if (differenceOfY > 50) {
                    this.parent.velocity.y += -30;
                }
            }
            this.parent.velocity.y += this.gravity*deltaT;
            // this.parent.velocity.y += -30;
            // this.parent.velocity.y += this.gravity*deltaT;
        }
        else if (!this.owner.onGround) {
            this.parent.velocity.y += this.gravity*deltaT;
        }
        console.log("The Y velocity of the SLUGMA " + this.parent.velocity.y);
        if (this.parent.velocity.y < -30) {
            this.parent.velocity.y = -30
            this.parent.velocity.y += this.gravity*deltaT;
        } 
        this.owner.move(this.parent.velocity.scaled(deltaT));
	}

	onExit(): Record<string, any> {
		this.owner.animation.stop();
		return {};
	}
}