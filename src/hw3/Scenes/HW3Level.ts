import AABB from "../../Wolfie2D/DataTypes/Shapes/AABB";
import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import GameEvent from "../../Wolfie2D/Events/GameEvent";
import { GameEventType } from "../../Wolfie2D/Events/GameEventType";
import Input from "../../Wolfie2D/Input/Input";
import { TweenableProperties } from "../../Wolfie2D/Nodes/GameNode";
import { GraphicType } from "../../Wolfie2D/Nodes/Graphics/GraphicTypes";
import Rect from "../../Wolfie2D/Nodes/Graphics/Rect";
import AnimatedSprite from "../../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import OrthogonalTilemap from "../../Wolfie2D/Nodes/Tilemaps/OrthogonalTilemap";
import Label from "../../Wolfie2D/Nodes/UIElements/Label";
import { UIElementType } from "../../Wolfie2D/Nodes/UIElements/UIElementTypes";
import RenderingManager from "../../Wolfie2D/Rendering/RenderingManager";
import Scene from "../../Wolfie2D/Scene/Scene";
import SceneManager from "../../Wolfie2D/Scene/SceneManager";
import Viewport from "../../Wolfie2D/SceneGraph/Viewport";
import Timer from "../../Wolfie2D/Timing/Timer";
import Color from "../../Wolfie2D/Utils/Color";
import { EaseFunctionType } from "../../Wolfie2D/Utils/EaseFunctions";
import PlayerController, { PlayerTweens } from "../Player/PlayerController";
import PlayerWeapon from "../Player/PlayerWeapon";

import { HW3Events } from "../HW3Events";
import { HW3PhysicsGroups } from "../HW3PhysicsGroups";
import HW3FactoryManager from "../Factory/HW3FactoryManager";
import MainMenu from "./MainMenu";
import Particle from "../../Wolfie2D/Nodes/Graphics/Particle";
import Sprite from "../../Wolfie2D/Nodes/Sprites/Sprite";
import SlugmaController from "../Slugma/SlugmaController";
import PlayerJetpack from "../Player/PlayerJetpack";
import { ParticleType } from "../../Wolfie2D/Rendering/Animations/ParticleSystem";

/**
 * A const object for the layer names
 */
export const HW3Layers = {
    // The background layer
    BACKGROUND: "bg",
    // The primary layer
    PRIMARY: "PRIMARY",
    // The UI layer
    UI: "UI",
} as const;

// The layers as a type
export type HW3Layer = typeof HW3Layers[keyof typeof HW3Layers]

/**
 * An abstract HW4 scene class.
 */
export default abstract class HW3Level extends Scene {

    /** Overrride the factory manager */
    public add: HW3FactoryManager;


    /** The particle system used for the player's weapon */
    protected playerWeaponSystem: PlayerWeapon
    protected playerJetpackSystem: PlayerJetpack

    /** The key for the player's animated sprite */
    protected playerSpriteKey: string;
    /** The animated sprite that is the player */
    protected player: AnimatedSprite;
    /** The player's spawn position */
    protected playerSpawn: Vec2;

    /** The key for the Slugma's animated sprite */
    protected slugmaSpriteKey: string;
    /** The animated sprite that is the slugma */
    protected slugma: AnimatedSprite;
    /** The slugma's spawn position */
    protected slugmaSpawn: Vec2;

    private healthLabel: Label;
	private healthBar: Label;
	private healthBarBg: Label;

    private jetpackLabel: Label;
    private jetpack: Label;
    private jetpackBg: Label;
    /** The end of level stuff */

    protected levelEndPosition: Vec2;
    protected levelEndHalfSize: Vec2;

    protected levelEndArea: Rect;
    protected nextLevel: new (...args: any) => Scene;
    protected levelEndTimer: Timer;
    protected levelEndLabel: Label;

    
    // Level end transition timer and graphic
    protected levelTransitionTimer: Timer;
    protected levelTransitionScreen: Rect;

    /** The keys to the tilemap and different tilemap layers */
    protected tilemapKey: string;
    protected destructibleLayerKey: string;
    protected sleepingSlimesLayerKey: string;
    protected painfulSlimesLayerKey: string;
    protected wallsLayerKey: string;
    //protected fuelpackKey: string;
    /** The scale for the tilemap */
    protected tilemapScale: Vec2;
    /** The destrubtable layer of the tilemap */
    protected destructable: OrthogonalTilemap;
    /** The Sleeping Slimes layer of the tilemap */
    protected sleepingSlimes: OrthogonalTilemap;
    /** The Painful Slimes layer of the tilemap */
    protected painfulSlimes: OrthogonalTilemap;
    /** The wall layer of the tilemap */
    protected walls: OrthogonalTilemap;

    /** Sound and music */
    protected levelMusicKey: string;
    protected jumpAudioKey: string;
    protected portalAudioKey: string;
    protected painfulSlimeBounceAudioKey: string;
    protected slimeBounceAudioKey: string;
    protected deathAudioKey: string;
    protected fuelpackAudioKey: string;
    protected tileDestroyedAudioKey: string;
    protected fuelpackKey: string;
    //public static readonly FUELPACK_KEY = "FUELPACK"
    //public static readonly FUELPACK_PATH = "hw4_assets/fuelpack.png"
    protected fuelpacks1: Array<Sprite>;
    protected ai_characters: Array<Sprite>;
    protected lowerBoundary: number = undefined;

    public constructor(viewport: Viewport, sceneManager: SceneManager, renderingManager: RenderingManager, options: Record<string, any>) {
        super(viewport, sceneManager, renderingManager, {...options, physics: {
            groupNames: [
                HW3PhysicsGroups.GROUND, 
                HW3PhysicsGroups.PLAYER, 
                HW3PhysicsGroups.SLUGMA,
                HW3PhysicsGroups.PLAYER_WEAPON, 
                HW3PhysicsGroups.FUELPACKS
            ],
            collisions:
            [
                [0, 1, 1, 1, 1],
                [1, 0, 0, 1, 1],
                [1, 0, 0, 1, 1],
                [1, 0, 0, 1, 1],
                [1, 0, 0, 1, 1]
            ]
        }});
        this.add = new HW3FactoryManager(this, this.tilemaps);
    }

    public startScene(): void {
        // Initialize the layers
        this.initLayers();

        // Initialize the tilemaps
        this.initializeTilemap();

        // Initialize the sprite and particle system for the players weapon 
        this.initializeWeaponSystem();

        // Initialize the player 
        this.initializePlayer(this.playerSpriteKey);

        // Initialize the viewport - this must come after the player has been initialized
        this.initializeViewport();
        this.subscribeToEvents();
        this.initializeUI();
        

        // Initialize the ends of the levels - must be initialized after the primary layer has been added
        this.initializeLevelEnds();

        this.levelTransitionTimer = new Timer(500);
        this.levelEndTimer = new Timer(1500, () => {
            // After the level end timer ends, fade to black and then go to the next scene
            this.levelTransitionScreen.tweens.play("fadeIn");
        });


        

        // Initially disable player movement
        Input.disableInput();

        // Start the black screen fade out
        this.levelTransitionScreen.tweens.play("fadeOut");

        // Start playing the level music for the HW4 level
        this.emitter.fireEvent(GameEventType.PLAY_SOUND, {key: this.levelMusicKey, loop: true, holdReference: true});
    }

    /* Update method for the scene */

    public updateScene(deltaT: number) {
        // Handle all game events
        while (this.receiver.hasNextEvent()) {
            this.handleEvent(this.receiver.getNextEvent());
        }
    }

    /**
     * Handle game events. 
     * @param event the game event
     */
    protected handleEvent(event: GameEvent): void {
        switch (event.type) {
            case HW3Events.PLAYER_ENTERED_LEVEL_END: {
                this.handleEnteredLevelEnd();
                break;
            }
            // When the level starts, reenable user input
            case HW3Events.LEVEL_START: {
                Input.enableInput();
                break;
            }
            // When the level ends, change the scene to the next level
            case HW3Events.LEVEL_END: {
                this.emitter.fireEvent(GameEventType.STOP_SOUND, {key: this.levelMusicKey});
                this.sceneManager.changeToScene(this.nextLevel);
                break;
            }
            case HW3Events.PARTICLE_HIT_DESTRUCTIBLE: {
                this.handleParticleHit(event.data.get("node"));
                break;
            }
            case HW3Events.HEALTH_CHANGE: {
                this.handleHealthChange(event.data.get("curhp"), event.data.get("maxhp"));
                break;
            }
            case HW3Events.FUEL_CHANGE: {
                this.handleJetpackChange(event.data.get("curfuel"), event.data.get("maxfuel"));
                break;
            }

            case HW3Events.PLAYER_DEAD: {
                this.emitter.fireEvent(GameEventType.STOP_SOUND, {key: this.levelMusicKey});
                this.sceneManager.changeToScene(MainMenu);
                break;
            }
            case HW3Events.PICKED_UP_FUEL: {
                console.log("i picked up fuel") 
                console.log(event.data.get("other"))
                let fuelpack = this.fuelpacks1.find(fuelpack=> fuelpack.id === event.data.get("other"))
                if(fuelpack !== undefined) {
                    console.log("do you get here")
                    fuelpack.visible = false;
                    fuelpack.removePhysics();
                }
                break;
            }
            // Default: Throw an error! No unhandled events allowed.
            default: {
                throw new Error(`Unhandled event caught in scene with type ${event.type}`)
            }
        }
    }
    /* Handlers for the different events the scene is subscribed to */

    /**
     * Handle particle hit events
     * @param particleId the id of the particle
     */
    protected handleParticleHit(particleId: number): void {
        let particles = this.playerWeaponSystem.getPool();

        let particle = particles.find(particle => particle.id === particleId);
        if (particle !== undefined) {
            // Get the destructable tilemap
            let tilemap = this.destructable;

            let min = new Vec2(particle.sweptRect.left, particle.sweptRect.top);
            let max = new Vec2(particle.sweptRect.right, particle.sweptRect.bottom);

            // Convert the min/max x/y to the min and max row/col in the tilemap array
            let minIndex = tilemap.getColRowAt(min);
            let maxIndex = tilemap.getColRowAt(max);

            // Loop over all possible tiles the particle could be colliding with 
            for(let col = minIndex.x; col <= maxIndex.x; col++){
                for(let row = minIndex.y; row <= maxIndex.y; row++){
                    // If the tile is collideable -> check if this particle is colliding with the tile
                    if(tilemap.isTileCollidable(col, row) && this.particleHitTile(tilemap, particle, col, row)){
                        // We had a collision - delete the tile in the tilemap
                        tilemap.setTileAtRowCol(new Vec2(col, row), 0);
                        // Play a sound when we destroy the tile
                        this.emitter.fireEvent(GameEventType.PLAY_SOUND, { key: this.tileDestroyedAudioKey, loop: false, holdReference: false });
                    }
                }
            }
        }
    }

    protected particleHitTile(tilemap: OrthogonalTilemap, particle: Particle, col: number, row: number): boolean {
        let tileSize = tilemap.getTileSize();
        // Get the position of this tile
        let tilePos = new Vec2(col * tileSize.x + tileSize.x/2, row * tileSize.y + tileSize.y/2);
        // Create a new collider for this tile
        let collider = new AABB(tilePos, tileSize.scaled(1/2));
        // Calculate collision area between the node and the tile
        return particle.sweptRect.overlapArea(collider) > 0;
    }

    /**
     * Handle the event when the player enters the level end area.
     */
    protected handleEnteredLevelEnd(): void {
        // If the timer hasn't run yet, start the end level animation
        if (!this.levelEndTimer.hasRun() && this.levelEndTimer.isStopped()) {
            this.emitter.fireEvent(GameEventType.PLAY_SOUND, {key: this.portalAudioKey, loop: false, holdReference: false});
            this.levelEndTimer.start();
            this.levelEndLabel.tweens.play("slideIn");
        }
    }
    /**
     * This is the same healthbar I used for hw2. I've adapted it slightly to account for the zoom factor. Other than that, the
     * code is basically the same.
     * 
     * @param currentHealth the current health of the player
     * @param maxHealth the maximum health of the player
     */
    protected handleHealthChange(currentHealth: number, maxHealth: number): void {
        console.log("This is calling handle health change " + currentHealth +  ' ' + maxHealth);
        if (currentHealth === undefined || maxHealth === undefined) {
            currentHealth = 10;
            maxHealth = 10;
        }
		let unit = this.healthBarBg.size.x / maxHealth;
        
		this.healthBar.size.set(this.healthBarBg.size.x - unit * (maxHealth - currentHealth), this.healthBarBg.size.y);
		this.healthBar.position.set(this.healthBarBg.position.x - (unit / 2 / this.getViewScale()) * (maxHealth - currentHealth), this.healthBarBg.position.y);

		this.healthBar.backgroundColor = currentHealth < maxHealth * 1/4 ? Color.RED: currentHealth < maxHealth * 3/4 ? Color.YELLOW : Color.GREEN;
	}




    protected handleJetpackChange(currentFuel: number, maxFuel: number): void {
        /// need to implement
        let unit = this.jetpackBg.size.x/ maxFuel;
        this.jetpack.size.set(this.jetpackBg.size.x - unit * (maxFuel - currentFuel), this.jetpackBg.size.y);
        this.jetpack.position.set(this.jetpackBg.position.x - (unit / 2 / this.getViewScale()) * (maxFuel - currentFuel), this.jetpackBg.position.y);
        this.jetpack.backgroundColor = currentFuel < maxFuel * 1/4 ? Color.BLACK: currentFuel < maxFuel * 3/4 ? Color.YELLOW: Color.ORANGE;
      
    }
    /* Initialization methods for everything in the scene */

    /**
     * Initialzes the layers
     */
    protected initLayers(): void {
        // Add a layer for UI
        this.addUILayer(HW3Layers.UI);
        // Add a layer for players and enemies
        this.addLayer(HW3Layers.PRIMARY);
    }
    /**
     * Initializes the tilemaps
     * @param key the key for the tilemap data
     * @param scale the scale factor for the tilemap
     */
    protected initializeTilemap(): void {
        if (this.tilemapKey === undefined || this.tilemapScale === undefined) {
            throw new Error("Cannot add the homework 4 tilemap unless the tilemap key and scale are set.");
        }
        // Add the tilemap to the scene
        this.add.tilemap(this.tilemapKey, this.tilemapScale);

        if (this.destructibleLayerKey === undefined || this.wallsLayerKey === undefined) {
            throw new Error("Make sure the keys for the destuctible layer and wall layer are both set");
        } else if (this.sleepingSlimesLayerKey === undefined || this.painfulSlimesLayerKey === undefined) {
            throw new Error("Make sure the keys for the Sleeping Slimes layer and Painful Slimes layer are both set")
        }
        //else if (this.fuelpackKey === undefined) {
        //    throw new Error("make sure the key for fuelpacks layer is set")
        //}

        // Get the wall and destructible layers 
        this.walls = this.getTilemap(this.wallsLayerKey) as OrthogonalTilemap;
        this.destructable = this.getTilemap(this.destructibleLayerKey) as OrthogonalTilemap;
        this.sleepingSlimes = this.getTilemap(this.sleepingSlimesLayerKey) as OrthogonalTilemap;
        this.painfulSlimes = this.getTilemap(this.painfulSlimesLayerKey) as OrthogonalTilemap;


        // Add physics to the destructible layer of the tilemap
        // this.destructable.addPhysics();
        // this.destructable.setGroup(HW3PhysicsGroups.DESTRUCTABLE);
        // this.destructable.setTrigger(HW3PhysicsGroups.PLAYER_WEAPON, HW3Events.PARTICLE_HIT_DESTRUCTIBLE, null);
        console.log(this.walls);
        console.log(this.painfulSlimes);
        if(this.painfulSlimes !== null) {
            
        this.painfulSlimes.setGroup(HW3PhysicsGroups.PAINFUL)
        this.painfulSlimes.addPhysics()
        this.sleepingSlimes.setGroup(HW3PhysicsGroups.BOUNCABLE)
        this.sleepingSlimes.addPhysics()
        
        // bouncing on painful slimes
        this.painfulSlimes.setTrigger(HW3PhysicsGroups.PLAYER, HW3Events.BOUNCED_ON_PAIN, null)
        }

        // bouncing on sleepy slimes
        this.sleepingSlimes.setTrigger(HW3PhysicsGroups.SLUGMA, HW3Events.BOUNCED_ON_SLIME_AI, null)
        this.sleepingSlimes.setTrigger(HW3PhysicsGroups.PLAYER, HW3Events.BOUNCED_ON_SLIME, null)
    }
    /**
     * Handles all subscriptions to events
     */
    protected subscribeToEvents(): void {
        this.receiver.subscribe(HW3Events.PLAYER_ENTERED_LEVEL_END);
        this.receiver.subscribe(HW3Events.LEVEL_START);
        this.receiver.subscribe(HW3Events.LEVEL_END);
        this.receiver.subscribe(HW3Events.PARTICLE_HIT_DESTRUCTIBLE);
        this.receiver.subscribe(HW3Events.HEALTH_CHANGE);
        this.receiver.subscribe(HW3Events.PLAYER_DEAD);
        this.receiver.subscribe(HW3Events.FUEL_CHANGE);
        this.receiver.subscribe(HW3Events.PICKED_UP_FUEL);
    }
    /**
     * Adds in any necessary UI to the game
     */
    protected initializeUI(): void {
        // HP Label
		this.healthLabel = <Label>this.add.uiElement(UIElementType.LABEL, HW3Layers.UI, {position: new Vec2(208, 20), text: "HP "});
		this.healthLabel.size.set(50, 30);
		this.healthLabel.fontSize = 24;
		this.healthLabel.font = "Courier";
        this.healthLabel.textColor = Color.WHITE
        this.healthLabel.backgroundColor = Color.BLACK;

        // HealthBar
		this.healthBar = <Label>this.add.uiElement(UIElementType.LABEL, HW3Layers.UI, {position: new Vec2(250, 20), text: ""});
		this.healthBar.size = new Vec2(300, 25);
		this.healthBar.backgroundColor = Color.GREEN;

        // HealthBar Border
		this.healthBarBg = <Label>this.add.uiElement(UIElementType.LABEL, HW3Layers.UI, {position: new Vec2(250, 20), text: ""});
		this.healthBarBg.size = new Vec2(300, 25);
		this.healthBarBg.borderColor = Color.BLACK;
        
        //jetpack label
		this.jetpackLabel = <Label>this.add.uiElement(UIElementType.LABEL, HW3Layers.UI, {position: new Vec2(205, 30), text: "Fuel "});
		this.jetpackLabel.size.set(80, 30);
		this.jetpackLabel.fontSize = 24;
		this.jetpackLabel.font = "Courier";
        this.jetpackLabel.textColor = Color.WHITE
        this.jetpackLabel.backgroundColor = Color.BLACK;

        // jetpack
		this.jetpack = <Label>this.add.uiElement(UIElementType.LABEL, HW3Layers.UI, {position: new Vec2(250, 30), text: ""});
		this.jetpack.size = new Vec2(300, 25);
		this.jetpack.backgroundColor = Color.ORANGE;
        
        // jetpack Border
		this.jetpackBg = <Label>this.add.uiElement(UIElementType.LABEL, HW3Layers.UI, {position: new Vec2(250, 30), text: ""});
		this.jetpackBg.size = new Vec2(300, 25);
		this.jetpackBg.borderColor = Color.BLACK;


        // End of level label (start off screen)
        this.levelEndLabel = <Label>this.add.uiElement(UIElementType.LABEL, HW3Layers.UI, { position: new Vec2(-300, 100), text: "Level Complete" });
        this.levelEndLabel.size.set(1200, 60);
        this.levelEndLabel.borderRadius = 0;
        this.levelEndLabel.backgroundColor = new Color(34, 32, 52);
        this.levelEndLabel.textColor = Color.WHITE;
        this.levelEndLabel.fontSize = 48;
        this.levelEndLabel.font = "PixelSimple";

        // Add a tween to move the label on screen
        this.levelEndLabel.tweens.add("slideIn", {
            startDelay: 0,
            duration: 1000,
            effects: [
                {
                    property: TweenableProperties.posX,
                    start: -300,
                    end: 300,
                    ease: EaseFunctionType.OUT_SINE
                }
            ]
        });

        this.levelTransitionScreen = <Rect>this.add.graphic(GraphicType.RECT, HW3Layers.UI, { position: new Vec2(300, 200), size: new Vec2(600, 400) });
        this.levelTransitionScreen.color = new Color(34, 32, 52);
        this.levelTransitionScreen.alpha = 1;

        this.levelTransitionScreen.tweens.add("fadeIn", {
            startDelay: 0,
            duration: 1000,
            effects: [
                {
                    property: TweenableProperties.alpha,
                    start: 0,
                    end: 1,
                    ease: EaseFunctionType.IN_OUT_QUAD
                }
            ],
            onEnd: HW3Events.LEVEL_END
        });

        /*
             Adds a tween to fade in the start of the level. After the tween has
             finished playing, a level start event gets sent to the EventQueue.
        */
        this.levelTransitionScreen.tweens.add("fadeOut", {
            startDelay: 0,
            duration: 1000,
            effects: [
                {
                    property: TweenableProperties.alpha,
                    start: 1,
                    end: 0,
                    ease: EaseFunctionType.IN_OUT_QUAD
                }
            ],
            onEnd: HW3Events.LEVEL_START
        });
    }
    /**
     * Initializes the particles system used by the player's weapon.
     */
    protected initializeWeaponSystem(): void {
        this.playerWeaponSystem = new PlayerWeapon(50, Vec2.ZERO, 1000, 3, 0, 50, ParticleType.WEAPON);

        this.playerWeaponSystem.initializePool(this, HW3Layers.PRIMARY);
        
        this.playerJetpackSystem = new PlayerJetpack(40,Vec2.ZERO,1000,3,0,50, ParticleType.JETPACK);
        this.playerJetpackSystem.initializePool(this,HW3Layers.PRIMARY)
    }
    /**
     * Initializes the player, setting the player's initial position to the given position.
     * @param position the player's spawn position
     */
    protected initializePlayer(key: string): void {
        if (this.playerWeaponSystem === undefined) {
            throw new Error("Player weapon system must be initialized before initializing the player!");
        }
        if(this.playerJetpackSystem === undefined) {
            throw new Error("jetpack system must be initialized before initializing the player!");
        }
        if (this.playerSpawn === undefined) {
            throw new Error("Player spawn must be set before initializing the player!");
        }

        // Add the player to the scene
        console.log("This is before the add animated sprite shit")
        console.log(key);
        this.player = this.add.animatedSprite(key, HW3Layers.PRIMARY);
        console.log("This is a player that is running around")
        this.player.scale.set(0.25, 0.25);
        this.player.position.copy(this.playerSpawn);
        
        // Give the player physics and setup collision groups and triggers for the player
        this.player.addPhysics(new AABB(this.player.position.clone(), this.player.boundary.getHalfSize().clone()));
        this.player.setGroup(HW3PhysicsGroups.PLAYER);

        // Give the player a flip animation
        this.player.tweens.add(PlayerTweens.FLIP, {
            startDelay: 0,
            duration: 500,
            effects: [
                {
                    property: "rotation",
                    start: 0,
                    end: 2*Math.PI,
                    ease: EaseFunctionType.IN_OUT_QUAD
                }
            ]
        });

        this.player.addAI(PlayerController, { 
            lowerBoundary: this.lowerBoundary,
            weaponSystem: this.playerWeaponSystem,
            jetpackSystem: this.playerJetpackSystem,
            tilemap: "Sleeping Slimes" 
        });
        this.player.setScene(this);
    }
    /**
     * Initializes the player, setting the player's initial position to the given position.
     * @param position the player's spawn position
     */
    public initializeSlugma(slugmaSpawnPoint: Vec2, slugmaAnimatedSprite: AnimatedSprite): AnimatedSprite {
        // if (this.playerWeaponSystem === undefined) {
        //     throw new Error("Player weapon system must be initialized before initializing the player!");
        // }
        // if (this.slugmaSpawn === undefined) {
        //     throw new Error("Player spawn must be set before initializing the player!");
        // }

        // Add the slugma to the scene
        slugmaAnimatedSprite.scale.set(0.25, 0.25);
        slugmaAnimatedSprite.position.copy(slugmaSpawnPoint);
        
        // Give the player physics and setup collision groups and triggers for the player
        slugmaAnimatedSprite.addPhysics(new AABB(slugmaAnimatedSprite.position.clone(), slugmaAnimatedSprite.boundary.getHalfSize().clone()));
        slugmaAnimatedSprite.setGroup(HW3PhysicsGroups.SLUGMA);

        // Give the player a flip animation
        slugmaAnimatedSprite.tweens.add(PlayerTweens.FLIP, {
            startDelay: 0,
            duration: 500,
            effects: [
                {
                    property: "rotation",
                    start: 0,
                    end: 2*Math.PI,
                    ease: EaseFunctionType.IN_OUT_QUAD
                }
            ]
        });

        slugmaAnimatedSprite.addAI(SlugmaController, {
            tilemap: "Sleeping Slimes",
            player: this.player
        })
        slugmaAnimatedSprite.setScene(this);
        slugmaAnimatedSprite.setTrigger(HW3PhysicsGroups.PLAYER, HW3Events.BOUNCED_ON_PAIN,null);

        return slugmaAnimatedSprite
    }
    /**
     * Initializes the viewport
     */
    protected initializeViewport(): void {
        if (this.player === undefined) {
            throw new Error("Player must be initialized before setting the viewport to folow the player");
        }
        this.viewport.follow(this.player);
        this.viewport.setZoomLevel(4);
        this.viewport.setBounds(0, 0, 512, 512);
    }
    /**
     * Initializes the level end area
     */
    protected initializeLevelEnds(): void {
        if (!this.layers.has(HW3Layers.PRIMARY)) {
            throw new Error("Can't initialize the level ends until the primary layer has been added to the scene!");
        }
        
        this.levelEndArea = <Rect>this.add.graphic(GraphicType.RECT, HW3Layers.PRIMARY, { position: this.levelEndPosition, size: this.levelEndHalfSize });
        this.levelEndArea.addPhysics(undefined, undefined, false, true);
        this.levelEndArea.setTrigger(HW3PhysicsGroups.PLAYER, HW3Events.PLAYER_ENTERED_LEVEL_END, null);
        this.levelEndArea.color = new Color(255, 0, 255, .20);
        
    }

    /* Misc methods */

    // Get the key of the player's jump audio file
    public getJumpAudioKey(): string {
        return this.jumpAudioKey
    }

    // Get the key of the portal audio file
    public getPortalAudioKey(): string {
        return this.portalAudioKey;
    }

    // Get the key of the Painful Slime Bounce Audio Key
    public getPainfulSlimeBounceAudioKey(): string {
        return this.painfulSlimeBounceAudioKey;
    }

    // Get the key of the Slime Bounce Audio Key
    public getSlimeBounceAudioKey(): string {
        return this.slimeBounceAudioKey;
    }

    // Get the key for the Death Audio
    public getDeathAudioKey(): string {
        return this.deathAudioKey;
    }

    // Get the key for the Fuelpack Audio
    public getFuelpackAudio(): string {
        return this.fuelpackAudioKey;
    }
}