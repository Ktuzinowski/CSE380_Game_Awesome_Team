/**
 * An enum with all of the physics groups for HW4
 */
export const HW3PhysicsGroups = {
    // Physics groups for the player and the player's weapon
    PLAYER: "PLAYER",
    PLAYER_WEAPON: "WEAPON",
    /* 
        Physics groups for the different tilemap layers. Physics groups for tilemaps are
        embedded in the tilemap layer data by a property called "Group". This lets you
        set the physics group for a particular tilemap layer.
    */
    GROUND: "GROUND",
    DESTRUCTABLE: "DESTRUCTABLE",
    BOUNCABLE: "BOUNCABLE",
    PAINFUL: "PAINFUL",
    FUELPACKS: "FUELPACKS",
    SLUGMA: "SLUGMA",
    SLUGMA_WEAPON: "SLUGMA_WEAPON",
    SLUGMA_JETPACK: "SLUGMA_JETPACK"
} as const;