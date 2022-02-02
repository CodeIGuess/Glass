class Scene {
	parent: Glass
	objects: Array<Sprite> = []
	maxSortPerFrame = 1
	sortIdx = 0

	pos: Vec2 = new Vec2(0, 0)
	width = -1
	height = -1

	gravity: Vec2 = new Vec2(0.0, 0.015)
	friction: Vec2 = new Vec2(0.9, 0.997)
	groundFriction: Vec2 = new Vec2(0.9, 0.997)

	// TODO: Implement different collision types
	// Bits:
	//   0: Physics loop (Inertia and friction)
	//   1: Soft (Pushing things around)
	//   2: Hard (Normal physics)
	enable = 3

	constructor(parent: Glass) {
		this.parent = parent
	}

	draw() {
		Surface.viewport(this.pos.x, this.pos.y, this.width, this.height)
		// Sort objects
		if (this.objects.length > 1) {
			if (this.maxSortPerFrame < 0) {
				this.objects.sort((a, b) => a._layer - b._layer)
			} else {
				for (let cso = 0; cso < this.maxSortPerFrame; cso++) {
					if (++this.sortIdx == this.objects.length - 1) this.sortIdx = 0
					if (this.objects[this.sortIdx]._layer > this.objects[this.sortIdx + 1]._layer) {
						const tmp = this.objects[this.sortIdx]
						this.objects[this.sortIdx] = this.objects[this.sortIdx + 1]
						this.objects[this.sortIdx + 1] = tmp
					}
				}
			}
		}

		for (let o = 0; o < this.objects.length; o++)
			this.objects[o].draw()
		
		Surface.resetViewport()
	}

	doPhysics() {
		// Loop through all objects, and then again for PhysicsActors
		for (let o = 0; o < this.objects.length; o++) {
			// TODO: physics
			// if (this.objects[o] instanceof PhysicsActor) {
			// 	this.objects[o].collided = false
			// 	this.objects[o].onGround = false
			// 	this.objects[o].physics()
			// }
		}
	}

	/**
	 * Adds an object to the scene.
	 * @param obj Object to be added. Can be of any library type, such as a Sprite, PhysicsActor, Tile, TileMap, ect.
	 * @returns The added object.
	 */
	nObj(obj: Sprite): Sprite {
		// TODO: tilemaps
		// if (obj instanceof TileMap)
		// 	return this.objects[this.objects.push(obj) - 1]
		// else
		obj.parent = this
		return this.objects[this.objects.push(obj) - 1]
	}

	/**
	 * Removes an object from the scene.
	 * Doesn't remove any image elements or sources.
	 * @param obj Object to be removed
	 * @returns The removed object
	 */
	rObj(obj: Sprite) {
		return this.rObjIdx(this.objects.indexOf(obj))
	}

	/**
	 * Removes an object by its index in the `this.objects` list.
	 * @param idx Index to remove
	 * @returns The removed object
	 */
	rObjIdx(idx: number) {
		return this.objects.splice(idx, 1)
	}

	shiftObjects(x: number, y: number) {
		// TODO: camera
		// this.camera.pos.x += x
		// this.camera.pos.y += y
		for (let o = 0; o < this.objects.length; o++) {
			this.objects[o].pos.x += x
			this.objects[o].pos.y += y
		}
	}
}
