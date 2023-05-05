import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import GameEvent from "../../Wolfie2D/Events/GameEvent";
import { GameEventType } from "../../Wolfie2D/Events/GameEventType";
import Button from "../../Wolfie2D/Nodes/UIElements/Button";
import Label from "../../Wolfie2D/Nodes/UIElements/Label";
import { UIElementType } from "../../Wolfie2D/Nodes/UIElements/UIElementTypes";
import Layer from "../../Wolfie2D/Scene/Layer";
import Scene from "../../Wolfie2D/Scene/Scene";
import Color from "../../Wolfie2D/Utils/Color";
import Level1 from "./HW3Level1";
import Level2 from "./JoeLevel1";
import SamLevel1 from "./SamLevel1";


// Need to start adding layers
const MainMenuLayer = {
    MAIN_MENU: "MAIN_MENU",
    LEVELS: "LEVELS",
    CONTROLS: "CONTROLS",
    HELP: "HELP",
    BACKSTORY: "BACKSTORY",
    CHEATCODES: "CHEATCODES"
} as const

// Events triggered in the main menu
const MainMenuEvent = {
    PLAY_GAME: "PLAY_GAME",
    MENU: "MAIN_MENU",
    LEVELS: "LEVELS",
    CONTROLS: "CONTROLS",
    HELP: "HELP",
    BACKSTORY: "BACKSTORY",
    CHEATCODES: "CHEATCODES",
    BACKTOHELP: "BACKTOHELP"
} as const

export default class MainMenu extends Scene {
    // Layers for the different 
    private controlsScreen: Layer;
    private mainMenuScreen: Layer;
    private helpScreen: Layer;
    private levelsScreen: Layer;
    private cheatCodesScreen: Layer;
    private backstoryScreen: Layer;
    private currenLevelNumber: number = 1;
    public static readonly MUSIC_KEY = "MAIN_MENU_MUSIC";
    public static readonly MUSIC_PATH = "hw4_assets/music/BackgroundMusic.wav";
    

    public loadScene(): void {
        // Load the menu song
        this.load.audio(MainMenu.MUSIC_KEY, MainMenu.MUSIC_PATH);

        // Load the background image
        this.load.image("background", "hw4_assets/Background.png");
    }

    public startScene(): void {
        // Center the viewport
        let size = this.viewport.getHalfSize();
        this.viewport.setFocus(size);
        this.viewport.setZoomLevel(1);
        this.viewport.setBounds(0, 0, 1200, 1200);

        // Main Menu Screen
        this.mainMenuScreen = this.addUILayer(MainMenuLayer.MAIN_MENU);

        // Background 
        let bg = this.add.sprite("background", MainMenuLayer.MAIN_MENU);
        let widthForBackground = size.x;
        let heightForBackground = size.y;
        bg.position.set(widthForBackground, heightForBackground - 100);

        // Levels Screen
        this.levelsScreen = this.addUILayer(MainMenuLayer.LEVELS);
        this.levelsScreen.setHidden(true);

        // Background2
        let bg2 = this.add.sprite("background", MainMenuLayer.LEVELS);
        bg2.position.set(widthForBackground, heightForBackground - 100);

        // Controls Screen
        this.controlsScreen = this.addUILayer(MainMenuLayer.CONTROLS);
        this.controlsScreen.setHidden(true);

        // Background3
        let bg3 = this.add.sprite("background", MainMenuLayer.CONTROLS);
        bg3.position.set(widthForBackground, heightForBackground - 100);

        // Help Screen
        this.helpScreen = this.addUILayer(MainMenuLayer.HELP);
        this.helpScreen.setHidden(true);

        // Background4
        let bg4 = this.add.sprite("background", MainMenuLayer.HELP);
        bg4.position.set(widthForBackground, heightForBackground - 100);

        // Backstory Screen
        this.backstoryScreen = this.addUILayer(MainMenuLayer.BACKSTORY);
        this.backstoryScreen.setHidden(true);

        // Background5
        let bg5 = this.add.sprite("background", MainMenuLayer.BACKSTORY);
        bg5.position.set(widthForBackground, heightForBackground - 100);

        // Cheatcodes Screen
        this.cheatCodesScreen = this.addUILayer(MainMenuLayer.CHEATCODES);
        this.cheatCodesScreen.setHidden(true);

        // Background5
        let bg6 = this.add.sprite("background", MainMenuLayer.CHEATCODES);
        bg6.position.set(widthForBackground, heightForBackground - 100);

        // Main Menu Page
        this.setupMainMenuScreen(size);

        size.y -= 100;

        // Controls Page
        this.setupControlsPage(size);

        // Levels Page
        this.setupLevelsScreen(size);

        // Help Page
        this.setupHelpPage(size);

        // Cheat Codes Page
        this.setupCheatCodesPage(size);

        // Backstory Page
        this.setupBackstoryPage(size);

        // Subscribe the the Button Events
        // Subscribe to the button events
        this.receiver.subscribe(MainMenuEvent.PLAY_GAME);
        this.receiver.subscribe(MainMenuEvent.CONTROLS);
        this.receiver.subscribe(MainMenuEvent.LEVELS);
        this.receiver.subscribe(MainMenuEvent.MENU);
        this.receiver.subscribe(MainMenuEvent.HELP);
        this.receiver.subscribe(MainMenuEvent.BACKSTORY);
        this.receiver.subscribe(MainMenuEvent.CHEATCODES);
        this.receiver.subscribe(MainMenuEvent.BACKTOHELP);
        // Scene has started, so start playing music
        this.emitter.fireEvent(GameEventType.PLAY_SOUND, {key: MainMenu.MUSIC_KEY, loop: true, holdReference: true});
    }
    public updateScene(deltaT: number): void {
        while(this.receiver.hasNextEvent()){
            this.handleEvent(this.receiver.getNextEvent());
        }
    }
    public unloadScene(): void {
        // The scene is being destroyed, so we can stop playing the song
        this.emitter.fireEvent(GameEventType.STOP_SOUND, {key: MainMenu.MUSIC_KEY});
    }

    public setupMainMenuScreen(size: Vec2) {
        // Create a play button
        let playBtn = <Button>this.add.uiElement(UIElementType.BUTTON, MainMenuLayer.MAIN_MENU, {position: new Vec2(size.x, size.y - 200), text: "Start"});

        // PlayBtn
        playBtn.backgroundColor = Color.BLACK;
        playBtn.borderColor = Color.WHITE;
        playBtn.borderRadius = 0;
        playBtn.setPadding(new Vec2(50, 10));
        playBtn.font = "PixelSimple";
        playBtn.onClickEventId = MainMenuEvent.PLAY_GAME;

        // Add Levels Button
        const levels = <Button>this.add.uiElement(UIElementType.BUTTON, MainMenuLayer.MAIN_MENU, {position: new Vec2(size.x, size.y - 100), text: "Levels"});
        levels.backgroundColor = Color.BLACK;
        levels.borderColor = Color.WHITE;
        levels.borderRadius = 0;
        levels.setPadding(new Vec2(50, 10));
        levels.font = "PixelSimple";
        levels.onClickEventId = MainMenuEvent.LEVELS;

        // Add Controls Button
        const controls = <Button>this.add.uiElement(UIElementType.BUTTON, MainMenuLayer.MAIN_MENU, {position: new Vec2(size.x, size.y), text: "Controls"});
        controls.backgroundColor = Color.BLACK;
        controls.borderColor = Color.WHITE;
        controls.borderRadius = 0;
        controls.setPadding(new Vec2(50, 10));
        controls.font = "PixelSimple";
        controls.onClickEventId = MainMenuEvent.CONTROLS; 

        // Add Help Button
        const help = <Button>this.add.uiElement(UIElementType.BUTTON, MainMenuLayer.MAIN_MENU, {position: new Vec2(size.x, size.y + 100), text: "Help"});
        help.backgroundColor = Color.BLACK;
        help.borderColor = Color.WHITE;
        help.borderRadius = 0;
        help.setPadding(new Vec2(50, 10));
        help.font = "PixelSimple";
        help.onClickEventId = MainMenuEvent.HELP; 
    }

    public setupLevelsScreen(size: Vec2) {
        // Add Levels Button
        const levelOne = <Button>this.add.uiElement(UIElementType.BUTTON, MainMenuLayer.LEVELS, {position: new Vec2(size.x - 300, size.y - 100), text: "LVL 1"});
        levelOne.backgroundColor = Color.BLACK;
        levelOne.borderColor = Color.WHITE;
        levelOne.borderRadius = 0;
        levelOne.setPadding(new Vec2(50, 10));
        levelOne.font = "PixelSimple";
        levelOne.onClickEventId = MainMenuEvent.PLAY_GAME;
        levelOne.onClick = () => {
            this.currenLevelNumber = 1;
        }

        const levelTwo = <Button>this.add.uiElement(UIElementType.BUTTON, MainMenuLayer.LEVELS, {position: new Vec2(size.x, size.y - 100), text: "LVL 2"});
        levelTwo.backgroundColor = Color.BLACK;
        levelTwo.borderColor = Color.WHITE;
        levelTwo.borderRadius = 0;
        levelTwo.setPadding(new Vec2(50, 10));
        levelTwo.font = "PixelSimple";
        levelTwo.onClickEventId = MainMenuEvent.PLAY_GAME;
        levelTwo.onClick = () => {
            this.currenLevelNumber = 2;
        }

        const level3 = <Button>this.add.uiElement(UIElementType.BUTTON, MainMenuLayer.LEVELS, {position: new Vec2(size.x + 300, size.y - 100), text: "LVL 3"});
        level3.backgroundColor = Color.BLACK;
        level3.borderColor = Color.WHITE;
        level3.borderRadius = 0;
        level3.setPadding(new Vec2(50, 10));
        level3.font = "PixelSimple";
        level3.onClickEventId = MainMenuEvent.PLAY_GAME;
        level3.onClick = () => {
            this.currenLevelNumber = 3;
        }

        const level4 = <Button>this.add.uiElement(UIElementType.BUTTON, MainMenuLayer.LEVELS, {position: new Vec2(size.x - 300, size.y), text: "LVL 4"});
        level4.backgroundColor = Color.BLACK;
        level4.borderColor = Color.WHITE;
        level4.borderRadius = 0;
        level4.setPadding(new Vec2(50, 10));
        level4.font = "PixelSimple";
        level4.onClickEventId = MainMenuEvent.PLAY_GAME;

        const level5 = <Button>this.add.uiElement(UIElementType.BUTTON, MainMenuLayer.LEVELS, {position: new Vec2(size.x, size.y), text: "LVL 5"});
        level5.backgroundColor = Color.BLACK;
        level5.borderColor = Color.WHITE;
        level5.borderRadius = 0;
        level5.setPadding(new Vec2(50, 10));
        level5.font = "PixelSimple";
        level5.onClickEventId = MainMenuEvent.PLAY_GAME;
        level5.onClick = () => {
            this.currenLevelNumber = 5;
        }

        const level6 = <Button>this.add.uiElement(UIElementType.BUTTON, MainMenuLayer.LEVELS, {position: new Vec2(size.x + 300, size.y), text: "LVL 6"});
        level6.backgroundColor = Color.BLACK;
        level6.borderColor = Color.WHITE;
        level6.borderRadius = 0;
        level6.setPadding(new Vec2(50, 10));
        level6.font = "PixelSimple";
        level6.onClickEventId = MainMenuEvent.PLAY_GAME;
        level6.onClick = () => {
            this.currenLevelNumber = 6;
        }


        const back = this.add.uiElement(UIElementType.BUTTON, MainMenuLayer.LEVELS, {position: new Vec2(size.x, size.y + 200), text: "Back"});
        back.size.set(200, 50);
        back.borderWidth = 2;
        back.borderColor = Color.WHITE;
        back.backgroundColor = Color.BLACK;
        back.onClickEventId = MainMenuEvent.MENU;
    }

    public setupControlsPage(center: Vec2) {
        const header = <Label>this.add.uiElement(UIElementType.LABEL, MainMenuLayer.CONTROLS, {position: new Vec2(center.x, center.y - 150), text: "Controls"});
        header.padding.add(new Vec2(50, 50))
        header.textColor = Color.WHITE;
        header.backgroundColor = Color.BLACK;

        const jumpW = <Label>this.add.uiElement(UIElementType.LABEL, MainMenuLayer.CONTROLS, {position: new Vec2(center.x, center.y - 50), text: "Jump - W, Space"});
        jumpW.textColor = Color.WHITE;
        const moveLeft = <Label>this.add.uiElement(UIElementType.LABEL, MainMenuLayer.CONTROLS, {position: new Vec2(center.x, center.y), text: "Move Left - A"});
        moveLeft.textColor = Color.WHITE;
        const moveRight = <Label>this.add.uiElement(UIElementType.LABEL, MainMenuLayer.CONTROLS, {position: new Vec2(center.x, center.y + 50), text: "Move Right - D"});
        moveRight.textColor = Color.WHITE;
        const upAirW = <Label>this.add.uiElement(UIElementType.LABEL, MainMenuLayer.CONTROLS, {position: new Vec2(center.x, center.y + 100), text: "Move Up (mid air) - W"});
        upAirW.textColor = Color.WHITE
        const downAirS = <Label>this.add.uiElement(UIElementType.LABEL, MainMenuLayer.CONTROLS, {position: new Vec2(center.x, center.y + 150), text: "Move Down (mid air) - S"});
        downAirS.textColor = Color.WHITE;
        const escape = <Label>this.add.uiElement(UIElementType.LABEL, MainMenuLayer.CONTROLS, {position: new Vec2(center.x, center.y + 200), text: "Pause - ESC"});
        escape.textColor = Color.WHITE;

        const back = this.add.uiElement(UIElementType.BUTTON, MainMenuLayer.CONTROLS, {position: new Vec2(center.x, center.y + 300), text: "Back"});
        back.size.set(200, 50);
        back.borderWidth = 2;
        back.borderColor = Color.WHITE;
        back.backgroundColor = Color.BLACK;
        back.onClickEventId = MainMenuEvent.MENU;
    }

    protected setupHelpPage(size: Vec2) {
        const offsetForY = -100;
        const levelTwo = <Button>this.add.uiElement(UIElementType.BUTTON, MainMenuLayer.HELP, {position: new Vec2(size.x, size.y + offsetForY), text: "Backstory"});
        levelTwo.backgroundColor = Color.BLACK;
        levelTwo.borderColor = Color.WHITE;
        levelTwo.borderRadius = 0;
        levelTwo.setPadding(new Vec2(50, 10));
        levelTwo.font = "PixelSimple";
        levelTwo.onClickEventId = MainMenuEvent.BACKSTORY;

        const level3 = <Button>this.add.uiElement(UIElementType.BUTTON, MainMenuLayer.HELP, {position: new Vec2(size.x, size.y + 150 + offsetForY), text: "Cheat Codes"});
        level3.backgroundColor = Color.BLACK;
        level3.borderColor = Color.WHITE;
        level3.borderRadius = 0;
        level3.setPadding(new Vec2(50, 10));
        level3.font = "PixelSimple";
        level3.onClickEventId = MainMenuEvent.CHEATCODES;

        const back = this.add.uiElement(UIElementType.BUTTON, MainMenuLayer.HELP, {position: new Vec2(size.x, size.y + 300 + offsetForY), text: "Back"});
        back.size.set(200, 50);
        back.borderWidth = 2;
        back.borderColor = Color.WHITE;
        back.backgroundColor = Color.BLACK;
        back.onClickEventId = MainMenuEvent.MENU;
    }

    protected setupBackstoryPage(size: Vec2) {
        const header = <Label>this.add.uiElement(UIElementType.LABEL, MainMenuLayer.BACKSTORY, {position: new Vec2(size.x, size.y - 150), text: "Backstory"});
        header.textColor = Color.WHITE;

        const backgroundText = <Label>this.add.uiElement(UIElementType.LABEL, MainMenuLayer.BACKSTORY, {position: new Vec2(size.x, size.y - 80), text: `You are an intern at Nasa. You have been waiting your whole life to finally work with top `});
        backgroundText.textColor = Color.WHITE;
        backgroundText.font = "PixelSimple";

        const b2 = <Label>this.add.uiElement(UIElementType.LABEL, MainMenuLayer.BACKSTORY, {position: new Vec2(size.x, size.y - 40), text: `scientists discovering how to transport objects, and eventually people, through wormholes. `});
        b2.textColor = Color.WHITE;
        b2.font = "PixelSimple";

        const b4 = <Label>this.add.uiElement(UIElementType.LABEL, MainMenuLayer.BACKSTORY, {position: new Vec2(size.x, size.y + 40), text: `Upon testing the wormholes, you are sucked into one accidentally and are transported`});
        b4.textColor = Color.WHITE;
        b4.font = "PixelSimple";

        const b5 = <Label>this.add.uiElement(UIElementType.LABEL, MainMenuLayer.BACKSTORY, {position: new Vec2(size.x, size.y + 80), text: ` to an alien world filled with slimes. Using the slimes you bounce off of them and try to reach`});
        b5.textColor = Color.WHITE;
        b5.font = "PixelSimple";

        const b6 = <Label>this.add.uiElement(UIElementType.LABEL, MainMenuLayer.BACKSTORY, {position: new Vec2(size.x, size.y + 120), text: ` new wormholes to eventually find one to take you back home and off this cursed planet.`});
        b6.textColor = Color.WHITE;
        b6.font = "PixelSimple";

        // Upon testing the wormholes, you are sucked into one accidentally and are transported to an alien world filled with slimes. Using the slimes you bounce off of them and try to reach new wormholes to eventually find one to take you back home and off this cursed planet.
        const back = this.add.uiElement(UIElementType.BUTTON, MainMenuLayer.BACKSTORY, {position: new Vec2(size.x, size.y + 300), text: "Back"});
        back.size.set(200, 50);
        back.borderWidth = 2;
        back.borderColor = Color.WHITE;
        back.backgroundColor = Color.BLACK;
        back.onClickEventId = MainMenuEvent.BACKTOHELP;
    }

    protected setupCheatCodesPage(size: Vec2) {
        const header = <Label>this.add.uiElement(UIElementType.LABEL, MainMenuLayer.CHEATCODES, {position: new Vec2(size.x, size.y - 150), text: "Cheat Codes"});
        header.textColor = Color.WHITE;

        const b2 = <Label>this.add.uiElement(UIElementType.LABEL, MainMenuLayer.CHEATCODES, {position: new Vec2(size.x, size.y - 40), text: `Cheat Codes are initialized while playing the game. Every new level, they get reset.`});
        b2.textColor = Color.WHITE;
        b2.font = "PixelSimple";

        const b4 = <Label>this.add.uiElement(UIElementType.LABEL, MainMenuLayer.CHEATCODES, {position: new Vec2(size.x, size.y), text: `Below are a list of commands.`});
        b4.textColor = Color.WHITE;
        b4.font = "PixelSimple";

        const b5 = <Label>this.add.uiElement(UIElementType.LABEL, MainMenuLayer.CHEATCODES, {position: new Vec2(size.x, size.y + 60), text: `# f - Infinite Jetpack Fuel`});
        b5.textColor = Color.WHITE;
        b5.font = "PixelSimple";

        const b6 = <Label>this.add.uiElement(UIElementType.LABEL, MainMenuLayer.CHEATCODES, {position: new Vec2(size.x, size.y + 105), text: `# h - Infinite Health`});
        b6.textColor = Color.WHITE;
        b6.font = "PixelSimple";

        const b7 = <Label>this.add.uiElement(UIElementType.LABEL, MainMenuLayer.CHEATCODES, {position: new Vec2(size.x, size.y + 150), text: `# 1-6 - Numbers for navigating to different levels`});
        b7.textColor = Color.WHITE;
        b7.font = "PixelSimple";

        const back = this.add.uiElement(UIElementType.BUTTON, MainMenuLayer.CHEATCODES, {position: new Vec2(size.x, size.y + 300), text: "Back"});
        back.size.set(200, 50);
        back.borderWidth = 2;
        back.borderColor = Color.WHITE;
        back.backgroundColor = Color.BLACK;
        back.onClickEventId = MainMenuEvent.BACKTOHELP;
    }

    protected handleEvent(event: GameEvent): void {
        switch(event.type) {
            case MainMenuEvent.PLAY_GAME: {
                console.log(event);
                switch (this.currenLevelNumber) {
                    case 1:
                        this.sceneManager.changeToScene(Level1);
                        break;
                    case 2:
                        this.sceneManager.changeToScene(Level2);
                        break;
                    case 3:
                        this.sceneManager.changeToScene(SamLevel1);
                        break;
                    default: 
                    this.sceneManager.changeToScene(Level1);
                    }
                break;
            }
            case MainMenuEvent.LEVELS: {
                this.mainMenuScreen.setHidden(true);
                this.levelsScreen.setHidden(false);
                break;
            }
            case MainMenuEvent.CONTROLS: {
                console.log("Navigating to controls")
                this.mainMenuScreen.setHidden(true);
                this.controlsScreen.setHidden(false);
                break;
            }
            case MainMenuEvent.HELP: {
                this.mainMenuScreen.setHidden(true);
                this.helpScreen.setHidden(false);
                break;
            }
            case MainMenuEvent.MENU: {
                this.mainMenuScreen.setHidden(false);
                this.helpScreen.setHidden(true);
                this.controlsScreen.setHidden(true);
                this.levelsScreen.setHidden(true);
                break;
            }
            case MainMenuEvent.BACKSTORY: {
                this.helpScreen.setHidden(true);
                this.backstoryScreen.setHidden(false);
                break;
            }
            case MainMenuEvent.CHEATCODES: {
                this.helpScreen.setHidden(true);
                this.cheatCodesScreen.setHidden(false);
                break;
            }
            case MainMenuEvent.BACKTOHELP: {
                this.cheatCodesScreen.setHidden(true);
                this.backstoryScreen.setHidden(true);
                this.helpScreen.setHidden(false);
                break;
            }
            default: {
                throw new Error(`Unhandled event caught in MainMenu: "${event.type}"`);
            }
        }
    }
}

