import AABB from "../../Wolfie2D/DataTypes/Shapes/AABB";
import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import HW3Level, { HW3Layers } from "./HW3Level";
import RenderingManager from "../../Wolfie2D/Rendering/RenderingManager";
import SceneManager from "../../Wolfie2D/Scene/SceneManager";
import Viewport from "../../Wolfie2D/SceneGraph/Viewport";
import JoeLevel2 from "./JoeLevel2";
import Input from "../../Wolfie2D/Input/Input";
import { HW3Controls } from "../HW3Controls";
import { HW3Events } from "../HW3Events";
import { HW3PhysicsGroups } from "../HW3PhysicsGroups";
import MainMenu from "./MainMenu";

/**
 * The first level for HW4 - should be the one with the grass and the clouds.
 */
export default class Level2 extends HW3Level {

    public static readonly PLAYER_SPAWN = new Vec2(64,120);
    public static readonly PLAYER_SPRITE_KEY = "PLAYER_SPRITE_KEY";
    public static readonly PLAYER_SPRITE_PATH = "hw4_assets/spritesheets/Intern.json";

    public static readonly SLUGMA_SPAWN = new Vec2(88,120);
    public static readonly SLUGMA_SPRITE_KEY = "SLUGMA_SPRITE_KEY";
    public static readonly SLUGMA_SPRITE_PATH = "hw4_assets/spritesheets/Intern3.json"

    public static readonly TILEMAP_KEY = "LEVEL1";
    public static readonly TILEMAP_PATH = "hw4_assets/tilemaps/ActualLevelOne.json";
    public static readonly TILEMAP_SCALE = new Vec2(2, 2);
    public static readonly DESTRUCTIBLE_LAYER_KEY = "Destructable";
    public static readonly SLEEPING_SLIMES_LAYER_KEY = "Sleeping Slimes"
    public static readonly PAINFUL_SLIMES_LAYER_KEY = "Painful Slimes"
    public static readonly WALLS_LAYER_KEY = "Main";

    public static readonly LEVEL_MUSIC_KEY = "LEVEL_MUSIC";
    public static readonly LEVEL_MUSIC_PATH = "hw4_assets/music/MusicForSomeLevel.wav";

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

    public static readonly FUELPACK_KEY = "FUELPACK"
    public static readonly FUELPACK_PATH = "hw4_assets/fuelpack.png"



    public static readonly TILE_DESTROYED_KEY = "TILE_DESTROYED";
    public static readonly TILE_DESTROYED_PATH = "hw4_assets/sounds/switch.wav";

    public static readonly LEVEL_END = new AABB(new Vec2(224, 232), new Vec2(1400, 16));

    public constructor(viewport: Viewport, sceneManager: SceneManager, renderingManager: RenderingManager, options: Record<string, any>) {
        super(viewport, sceneManager, renderingManager, options);

        // Set the keys for the different layers of the tilemap
        this.tilemapKey = Level2.TILEMAP_KEY;
        this.tilemapScale = Level2.TILEMAP_SCALE;
        this.destructibleLayerKey = Level2.DESTRUCTIBLE_LAYER_KEY;
        this.sleepingSlimesLayerKey = Level2.SLEEPING_SLIMES_LAYER_KEY;
        this.painfulSlimesLayerKey = Level2.PAINFUL_SLIMES_LAYER_KEY;
        this.wallsLayerKey = Level2.WALLS_LAYER_KEY;
        // Set the key for the player's sprite
        this.playerSpriteKey = Level2.PLAYER_SPRITE_KEY;
        // Set the player's spawn
        this.playerSpawn = Level2.PLAYER_SPAWN;

        // Set the slugma's spawn
        //this.slugmaSpawn = Level2.SLUGMA_SPAWN;
        // Set the key for the player's sprite
        this.slugmaSpriteKey = Level2.SLUGMA_SPRITE_KEY;

        this.fuelpackKey = Level2.FUELPACK_KEY;
        // Music and sound
        this.levelMusicKey = Level2.LEVEL_MUSIC_KEY
        this.jumpAudioKey = Level2.JUMP_AUDIO_KEY;
        this.portalAudioKey = Level2.PORTAL_AUDIO_KEY;
        this.painfulSlimeBounceAudioKey = Level2.PAINFUL_SLIME_BOUNCE_AUDIO_KEY;
        this.slimeBounceAudioKey = Level2.SLIME_BOUNCE_AUDIO_KEY;
        this.deathAudioKey = Level2.DEATH_AUDIO_KEY;
        this.fuelpackAudioKey = Level2.FUEL_PACK_KEY;
        this.tileDestroyedAudioKey = Level2.TILE_DESTROYED_KEY;

        // Level end size and position
        this.levelEndPosition = new Vec2(1600, 64).mult(this.tilemapScale);
        this.levelEndHalfSize = new Vec2(32, 32).mult(this.tilemapScale);
    }

    /**
     * Load in our resources for level 1
     */
    public loadScene(): void {
        this.load.image("background", "hw4_assets/KeeshaBackground2.jpg");
        // Load in the tilemap
        this.load.tilemap(this.tilemapKey, Level2.TILEMAP_PATH);
        // Load in the player's sprite
        this.load.spritesheet(this.playerSpriteKey, Level2.PLAYER_SPRITE_PATH);
        // Load in the slugma's sprite
        this.load.spritesheet(this.slugmaSpriteKey, Level2.SLUGMA_SPRITE_PATH);
        this.load.object("AI_SLUGMA", "hw4_assets/ActualLevelOneAI.json")

        // FUELPACKS
        this.load.image(this.fuelpackKey, Level2.FUELPACK_PATH)
        this.load.object("FuelpacksActual", "hw4_assets/ActualLevelOneFuelpacks.json");
        this.load.image("fuelpack", "hw4_assets/fuelpack.png");

        // Audio and music
        this.load.audio(this.levelMusicKey, Level2.LEVEL_MUSIC_PATH);
        this.load.audio(this.jumpAudioKey, Level2.JUMP_AUDIO_PATH);
        this.load.audio(this.portalAudioKey, Level2.PORTAL_AUDIO_PATH);
        this.load.audio(this.painfulSlimeBounceAudioKey, Level2.PAINFUL_SLIME_BOUNCE_AUDIO_PATH);
        this.load.audio(this.slimeBounceAudioKey, Level2.SLIME_BOUNCE_AUDIO_PATH);
        this.load.audio(this.deathAudioKey, Level2.DEATH_AUDIO_PATH);
        this.load.audio(this.fuelpackAudioKey, Level2.FUEL_PACK_PATH);
        this.load.audio(this.tileDestroyedAudioKey, Level2.TILE_DESTROYED_PATH);

        // Load Scene Set Property for lower boundary for player
        this.lowerBoundary = 400
    }

    /**
     * Unload resources for level 1 - decide what to keep
     */
    public unloadScene(): void {
        this.load.keepSpritesheet(this.playerSpriteKey);
        this.load.keepAudio(this.levelMusicKey);
        this.load.keepAudio(this.jumpAudioKey);
        this.load.keepAudio(this.portalAudioKey);
        this.load.keepAudio(this.painfulSlimeBounceAudioKey);
        this.load.keepAudio(this.slimeBounceAudioKey);
        this.load.keepAudio(this.deathAudioKey);
        this.load.keepAudio(this.fuelpackAudioKey);
        this.load.keepAudio(this.tileDestroyedAudioKey);
    }

    public startScene(): void {
        super.startScene();
        let Fuelpacks =  this.load.getObject("FuelpacksActual")
        this.fuelpacks1 = new Array(3)
        for(let i = 0; i < this.fuelpacks1.length; i++) {
            this.fuelpacks1[i] = this.add.sprite(Level2.FUELPACK_KEY, HW3Layers.PRIMARY);
            this.fuelpacks1[i].visible = true;
            //let collider = new AABB(Vec2.ZERO, JoeLevel2.fuelpacks1[i].sizeWithZoom);
            //JoeLevel2.fuelpacks1[i].setCollisionShape(collider);
            this.fuelpacks1[i].setGroup(HW3PhysicsGroups.FUELPACKS);
            this.fuelpacks1[i].addPhysics()
            
            this.fuelpacks1[i].setTrigger(HW3PhysicsGroups.PLAYER, HW3Events.PICKED_UP_FUEL,null);
            console.log("this is the id of this fuelpack" + this.fuelpacks1[i].id)

            this.fuelpacks1[i].position.set(Fuelpacks.items[i][0]*2, Fuelpacks.items[i][1]*2-2)
        }

        // Adding AIs into the layers
        let AI_SLUGMAS =  this.load.getObject("AI_SLUGMA")
        this.ai_characters = new Array(2)
        for(let i = 0; i < this.ai_characters.length; i++) {
            const spriteOfSlugma = this.add.animatedSprite(Level2.SLUGMA_SPRITE_KEY, HW3Layers.PRIMARY);
            spriteOfSlugma.visible = true;
            const spawnPointOfSlugma: Vec2 = new Vec2(AI_SLUGMAS.items[i][0]*2, AI_SLUGMAS.items[i][1]*2-2)
            this.ai_characters[i] = this.initializeSlugma(spawnPointOfSlugma, spriteOfSlugma)
        }        
        // Set the next level to be Level2
        // Add a background to the scene
        this.addParallaxLayer("bg", new Vec2(0.5, 1), -1);
        let bg = this.add.sprite("background", HW3Layers.BACKGROUND);
        bg.position.set(bg.size.x/4, bg.size.y/4);
        this.nextLevel = JoeLevel2;
    }

    public updateScene(deltaT: number) {
        if (Input.isPressed(HW3Controls.LEVEL_TWO)) {
            this.sceneManager.changeToScene(MainMenu);     
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

    /**
     * I had to override this method to adjust the viewport for the first level. I screwed up 
     * when I was making the tilemap for the first level is what it boils down to.
     * 
     * - Peter
     */
    protected initializeViewport(): void {
        super.initializeViewport();
        this.viewport.setBounds(16, 16, 5000, 600);
    }
}