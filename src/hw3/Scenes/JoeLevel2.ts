import AABB from "../../Wolfie2D/DataTypes/Shapes/AABB";
import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import HW3Level, { HW3Layers } from "./HW3Level";

import Viewport from "../../Wolfie2D/SceneGraph/Viewport";
import RenderingManager from "../../Wolfie2D/Rendering/RenderingManager";
import SceneManager from "../../Wolfie2D/Scene/SceneManager";
import { HW3PhysicsGroups } from "../HW3PhysicsGroups";
import { HW3Events } from "../HW3Events";
import MainMenu from "./MainMenu";
import { HW3Controls } from "../HW3Controls";
import Input from "../../Wolfie2D/Input/Input";
import Level1 from "./HW3Level1";
/**
 * The second level for HW4. It should be the goose dungeon / cave.
 */
export default class JoeLevel1 extends HW3Level {

    public static readonly PLAYER_SPAWN = new Vec2(190, 232);
    public static readonly PLAYER_SPRITE_KEY = "PLAYER_SPRITE_KEY";
    public static readonly PLAYER_SPRITE_PATH = "hw4_assets/spritesheets/Intern.json";

    public static readonly TILEMAP_KEY = "LEVEL1";
    public static readonly TILEMAP_PATH = "hw4_assets/tilemaps/JoeLevel2.json";
    public static readonly TILEMAP_SCALE = new Vec2(2, 2);
    public static readonly DESTRUCTIBLE_LAYER_KEY = "Destructable";
    public static readonly WALLS_LAYER_KEY = "Main";
    
    public static readonly SLEEPING_SLIMES_LAYER_KEY = "Sleeping Slimes"
    public static readonly PAINFUL_SLIMES_LAYER_KEY = "Painful Slimes"
    public static readonly LEVEL_MUSIC_KEY = "LEVEL_MUSIC";
    public static readonly LEVEL_MUSIC_PATH = "hw4_assets/music/hw5_level_music.wav";

    public static readonly JUMP_AUDIO_KEY = "PLAYER_JUMP";
    public static readonly JUMP_AUDIO_PATH = "hw4_assets/sounds/jump.wav";
    public static readonly PORTAL_AUDIO_KEY = "PORTAL_AUDIO_KEY";
    public static readonly PORTAL_AUDIO_PATH = "hw4_assets/sounds/VacumeCleaner.wav"
    public static readonly PAINFUL_SLIME_BOUNCE_AUDIO_KEY ="PAINFUL_SLIME_BOUNCE_AUDIO_KEY";
    public static readonly PAINFUL_SLIME_BOUNCE_AUDIO_PATH = "hw4_assets/sounds/PainfulSlimeBounce.wav"
    public static readonly SLIME_BOUNCE_AUDIO_KEY = "SLIME_BOUNCE_AUDIO_KEY"
    public static readonly SLIME_BOUNCE_AUDIO_PATH = "hw4_assets/sounds/SlimeBounce.wav"
    public static readonly DEATH_AUDIO_KEY = "DEATH_AUDIO_KEY";
    public static readonly DEATH_AUDIO_PATH = "hw4_assets/sounds/Death.wav"
    public static readonly FUEL_PACK_KEY = "FUEL_PACK_KEY";
    public static readonly FUEL_PACK_PATH = "hw4_assets/sounds/Fuelpack.mp3";

    public static readonly TILE_DESTROYED_KEY = "TILE_DESTROYED";
    public static readonly TILE_DESTROYED_PATH = "hw4_assets/sounds/switch.wav";
    public static readonly FUELPACK_KEY = "FUELPACK"
    public static readonly FUELPACK_PATH = "hw4_assets/fuelpack.png"
    public static readonly LEVEL_END = new AABB(new Vec2(224, 232), new Vec2(24, 16));
    protected fuelpackKey: string;
    
    public constructor(viewport: Viewport, sceneManager: SceneManager, renderingManager: RenderingManager, options: Record<string, any>) {
        super(viewport, sceneManager, renderingManager, options);

        // Set the keys for the different layers of the tilemap
        this.tilemapKey = JoeLevel1.TILEMAP_KEY;
        this.tilemapScale = JoeLevel1.TILEMAP_SCALE;
        this.destructibleLayerKey = JoeLevel1.DESTRUCTIBLE_LAYER_KEY;
        this.wallsLayerKey = JoeLevel1.WALLS_LAYER_KEY;

        this.sleepingSlimesLayerKey = JoeLevel1.SLEEPING_SLIMES_LAYER_KEY;
        this.painfulSlimesLayerKey = JoeLevel1.PAINFUL_SLIMES_LAYER_KEY;
        this.fuelpackKey = JoeLevel1.FUELPACK_KEY;

        // Set the key for the player's sprite
        this.playerSpriteKey = JoeLevel1.PLAYER_SPRITE_KEY;
        // Set the player's spawn
        this.playerSpawn = JoeLevel1.PLAYER_SPAWN;

        // Music and sound
        this.levelMusicKey = JoeLevel1.LEVEL_MUSIC_KEY
        this.jumpAudioKey = JoeLevel1.JUMP_AUDIO_KEY;
        this.tileDestroyedAudioKey = JoeLevel1.TILE_DESTROYED_KEY;
        this.portalAudioKey = JoeLevel1.PORTAL_AUDIO_KEY;
        this.painfulSlimeBounceAudioKey = JoeLevel1.PAINFUL_SLIME_BOUNCE_AUDIO_KEY;
        this.slimeBounceAudioKey = JoeLevel1.SLIME_BOUNCE_AUDIO_KEY;
        this.deathAudioKey = JoeLevel1.DEATH_AUDIO_KEY;
        this.fuelpackAudioKey = JoeLevel1.FUEL_PACK_KEY;

        // Level end size and position
        this.levelEndPosition = new Vec2(32, 216).mult(this.tilemapScale);
        this.levelEndHalfSize = new Vec2(32, 32).mult(this.tilemapScale);
    }
    /**
     * Load in resources for level 2.
     */
    public loadScene(): void {
        // Load in the tilemap
        this.load.tilemap(this.tilemapKey, JoeLevel1.TILEMAP_PATH);
        this.load.spritesheet(this.playerSpriteKey, JoeLevel1.PLAYER_SPRITE_PATH);
        this.load.image(this.fuelpackKey, JoeLevel1.FUELPACK_PATH)
        this.load.object("Fuelpacks1", "hw4_assets/Fuelpacks1.json");
        this.load.image("fuelpack", "hw4_assets/fuelpack.png");
        //this.fuelpacks = new Array<Fuelpack>();
        //console.log("YOOOOOOOOOO" + fuelpacks.items.length)
        //for(let i = 0; i < fuelpacks.items.length; i++) {
        //    let sprite = this.add.sprite("fuelpack", HW3Layers.PRIMARY)
            
        //}
        console.log("B")
        
        
    }

    public startScene(): void {
        super.startScene();
        this.fuelpacks1 = new Array(12)
        let Fuelpacks =  this.load.getObject("Fuelpacks1")
        for(let i = 0; i < this.fuelpacks1.length; i++) {
            this.fuelpacks1[i] = this.add.sprite(JoeLevel1.FUELPACK_KEY, HW3Layers.PRIMARY);
            this.fuelpacks1[i].visible = true;
            //let collider = new AABB(Vec2.ZERO, JoeLevel1.fuelpacks1[i].sizeWithZoom);
            //JoeLevel1.fuelpacks1[i].setCollisionShape(collider);
            this.fuelpacks1[i].setGroup(HW3PhysicsGroups.FUELPACKS);
            this.fuelpacks1[i].addPhysics()
            
            this.fuelpacks1[i].setTrigger(HW3PhysicsGroups.PLAYER, HW3Events.PICKED_UP_FUEL,null);
            console.log("this is the id of this fuelpack" + this.fuelpacks1[i].id)

            this.fuelpacks1[i].position.set(Fuelpacks.items[i][0]*2, Fuelpacks.items[i][1]*2-2)
        }
        this.nextLevel = MainMenu;
        //this.receiver.subscribe(HW3Events.PICKED_UP_FUEL);
    }
    public updateScene(deltaT: number) {
        if (Input.isPressed(HW3Controls.LEVEL_ONE)) {
            this.sceneManager.changeToScene(Level1)
        }
        else if (Input.isPressed(HW3Controls.INF_FUEL)) {
            this.emitter.fireEvent(HW3Events.INFINITE_FUEL_TOGGLE);
        } 
        else if (Input.isPressed(HW3Controls.INF_HEALTH)) {
            this.emitter.fireEvent(HW3Events.INFINITE_HEALTH_TOGGLE);
        }
        // Handle all game events
        while (this.receiver.hasNextEvent()) {
            this.handleEvent(this.receiver.getNextEvent());
        }
    }

    protected initializeViewport(): void {
        super.initializeViewport();
        this.viewport.setBounds(16, 16, 1600, 1600);
    }
}