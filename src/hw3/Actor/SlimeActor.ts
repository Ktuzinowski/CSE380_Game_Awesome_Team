import Spritesheet from "../../Wolfie2D/DataTypes/Spritesheet";
import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import HW3AnimatedSprite from "../Nodes/HW3AnimatedSprite"
import NavigationPath from "../../Wolfie2D/Pathfinding/NavigationPath";
import { HW3Events } from "../HW3Events";
import HW3Scene from "../Scenes/HW3Level";


import Timer from "../../Wolfie2D/Timing/Timer";


export default class SlimeActor extends HW3AnimatedSprite {

    /** Override the type of the scene to be the HW4 scene */
    protected scene: HW3Scene



    public constructor(sheet: Spritesheet) {
        super(sheet);

    }
}