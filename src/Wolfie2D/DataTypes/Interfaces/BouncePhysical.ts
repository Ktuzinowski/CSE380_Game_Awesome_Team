import Shape from "../Shapes/Shape";
import Vec2 from "../Vec2";
import Physical from "./Physical";

/**
 * Give an object momentum based physics.
 */
export default interface BouncePhysical extends Physical{

    mass: number;

    addPhysics(collisionShape?: Shape, colliderOffset?: Vec2, isCollidable?: boolean, isStatic?: boolean, mass?: number): void;
    getMomentum(): Vec2;
}