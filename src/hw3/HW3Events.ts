/**
 * A set of events for HW4
 */
export const HW3Events = {
    // An event that tells the HW4 level to start. Has data: {}
    LEVEL_START: "LEVEL_START",
    // An event that tells the HW4 level to end. Has data: {}
    LEVEL_END: "LEVEL_END",

    // An event triggered when the player enters an area designated as a "level end" location. Had data: {}
    PLAYER_ENTERED_LEVEL_END: "PLAYER_ENTERED_LEVEL_END",

    /**
     * The event that gets emitted when the player's health changes
     * 
     * Has data: { curhp: number, maxhp: number }
     */
    HEALTH_CHANGE: "HEALTH_CHANGE",
    FUEL_CHANGE: "FUEL_CHANGE",
    // The event sent when a particle hits a tile in the destructible tilemap layer
    PARTICLE_HIT_DESTRUCTIBLE: "PARTICLE_HIT_DESTRUCTIBLE",

    // The event sent when the player dies. Gets sent after the player's death animation
    PLAYER_DEAD: "PLAYER_DEAD",

    // Player bounced on top of a slime
    BOUNCED_ON_SLIME: "BOUNCED_ON_SLIME",

    // Player bounced on Painful Slime
    BOUNCED_ON_PAIN: "BOUNCED_ON_PAIN",

    // AI bounced on top of a slime
    BOUNCED_ON_SLIME_AI: "BOUNCED_ON_SLIME_AI",

    // Player bounced on Painful Slime
    BOUNCED_ON_PAIN_AI: "BOUNCED_ON_PAIN",
    
    PICKED_UP_FUEL: "PICKED_UP_FUEL",

    INFINITE_FUEL_TOGGLE: "INFINITE_FUEL_TOGGLE",

    INFINITE_HEALTH_TOGGLE: "INFINITE_HEALTH_TOGGLE",

    UPDATE_AI_BASED_ON_PLAYER_POSITION: "UPDATE_AI_BASED_ON_PLAYER_POSITION",

    PARTICLE_HIT_SLUGMA: "PARTICLE_HIT_SLUGMA",
    SLUGMA_DEAD: "SLUGMA_DEAD"
} as const;
