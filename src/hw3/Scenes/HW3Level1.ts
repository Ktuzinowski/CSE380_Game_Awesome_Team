import AABB from "../../Wolfie2D/DataTypes/Shapes/AABB";
import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import HW3Level, { HW3Layers } from "./HW3Level";
import RenderingManager from "../../Wolfie2D/Rendering/RenderingManager";
import SceneManager from "../../Wolfie2D/Scene/SceneManager";
import Viewport from "../../Wolfie2D/SceneGraph/Viewport";
import JoeLevel1 from "./JoeLevel1";
import Input from "../../Wolfie2D/Input/Input";
import { HW3Controls } from "../HW3Controls";
import { HW3Events } from "../HW3Events";

/**
 * The first level for HW4 - should be the one with the grass and the clouds.
 */
export default class Level1 extends HW3Level {

    public static readonly PLAYER_SPAWN = new Vec2(64,120);
    public static readonly PLAYER_SPRITE_KEY = "PLAYER_SPRITE_KEY";
    public static readonly PLAYER_SPRITE_PATH = "hw4_assets/spritesheets/Intern.json";

    public static readonly SLUGMA_SPAWN = new Vec2(88,120);
    public static readonly SLUGMA_SPRITE_KEY = "SLUGMA_SPRITE_KEY";
    public static readonly SLUGMA_SPRITE_PATH = "hw4_assets/spritesheets/Intern2.json"

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


    public static readonly TILE_DESTROYED_KEY = "TILE_DESTROYED";
    public static readonly TILE_DESTROYED_PATH = "hw4_assets/sounds/switch.wav";
    //public static readonly FUELPACK_KEY = "FUELPACK"
    //public static readonly FUELPACK_PATH = "hw4_assets/fuelpack.png"

    public static readonly LEVEL_END = new AABB(new Vec2(224, 232), new Vec2(1400, 16));

    public constructor(viewport: Viewport, sceneManager: SceneManager, renderingManager: RenderingManager, options: Record<string, any>) {
        super(viewport, sceneManager, renderingManager, options);

        // Set the keys for the different layers of the tilemap
        this.tilemapKey = Level1.TILEMAP_KEY;
        this.tilemapScale = Level1.TILEMAP_SCALE;
        this.destructibleLayerKey = Level1.DESTRUCTIBLE_LAYER_KEY;
        this.sleepingSlimesLayerKey = Level1.SLEEPING_SLIMES_LAYER_KEY;
        this.painfulSlimesLayerKey = Level1.PAINFUL_SLIMES_LAYER_KEY;
        //this.fuelpackKey = Level1.FUELPACK_KEY;
        this.wallsLayerKey = Level1.WALLS_LAYER_KEY;
        console.log(this.painfulSlimes);
        // Set the key for the player's sprite
        this.playerSpriteKey = Level1.PLAYER_SPRITE_KEY;
        // Set the player's spawn
        this.playerSpawn = Level1.PLAYER_SPAWN;

        // Set the slugma's spawn
        this.slugmaSpawn = Level1.SLUGMA_SPAWN;
        // Set the key for the player's sprite
        this.slugmaSpriteKey = Level1.SLUGMA_SPRITE_KEY;


        // Music and sound
        this.levelMusicKey = Level1.LEVEL_MUSIC_KEY
        this.jumpAudioKey = Level1.JUMP_AUDIO_KEY;
        this.portalAudioKey = Level1.PORTAL_AUDIO_KEY;
        this.painfulSlimeBounceAudioKey = Level1.PAINFUL_SLIME_BOUNCE_AUDIO_KEY;
        this.slimeBounceAudioKey = Level1.SLIME_BOUNCE_AUDIO_KEY;
        this.deathAudioKey = Level1.DEATH_AUDIO_KEY;
        this.fuelpackAudioKey = Level1.FUEL_PACK_KEY;
        this.tileDestroyedAudioKey = Level1.TILE_DESTROYED_KEY;

        // Level end size and position
        this.levelEndPosition = new Vec2(1600, 64).mult(this.tilemapScale);
        this.levelEndHalfSize = new Vec2(32, 32).mult(this.tilemapScale);
    }

    /**
     * Load in our resources for level 1
     */
    public loadScene(): void {
        this.load.image("background", "hw4_assets/KeeshaBackground.jpg");
        // Load in the tilemap
        this.load.tilemap(this.tilemapKey, Level1.TILEMAP_PATH);
        // Load in the player's sprite
        this.load.spritesheet(this.playerSpriteKey, Level1.PLAYER_SPRITE_PATH);
        // Load in the slugma's sprite
        this.load.spritesheet(this.slugmaSpriteKey, Level1.SLUGMA_SPRITE_PATH);
        // Audio and music
        this.load.audio(this.levelMusicKey, Level1.LEVEL_MUSIC_PATH);
        this.load.audio(this.jumpAudioKey, Level1.JUMP_AUDIO_PATH);
        this.load.audio(this.portalAudioKey, Level1.PORTAL_AUDIO_PATH);
        this.load.audio(this.painfulSlimeBounceAudioKey, Level1.PAINFUL_SLIME_BOUNCE_AUDIO_PATH);
        this.load.audio(this.slimeBounceAudioKey, Level1.SLIME_BOUNCE_AUDIO_PATH);
        this.load.audio(this.deathAudioKey, Level1.DEATH_AUDIO_PATH);
        this.load.audio(this.fuelpackAudioKey, Level1.FUEL_PACK_PATH);
        this.load.audio(this.tileDestroyedAudioKey, Level1.TILE_DESTROYED_PATH);
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
        // Set the next level to be Level2
        // Add a background to the scene
        this.addParallaxLayer("bg", new Vec2(0.5, 1), -1);
        let bg = this.add.sprite("background", HW3Layers.BACKGROUND);
        bg.position.set(bg.size.x/2, bg.size.y/2);
        this.nextLevel = JoeLevel1;
    }

    public updateScene(deltaT: number) {
        if (Input.isPressed(HW3Controls.LEVEL_TWO)) {
            this.sceneManager.changeToScene(JoeLevel1);     
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