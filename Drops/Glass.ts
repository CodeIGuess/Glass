
type CallbackFunction = () => void

class Glass {
	public  scene: Scene
	private control: Control

	private initFn     : CallbackFunction = () => void 0
	private preFrameFn : CallbackFunction = () => void 0
	private frameFn    : CallbackFunction = () => void 0
	private physicsFn  : CallbackFunction = () => void 0

	/**
	 * The main Glass class!
	 * @param height Height (in pixels) of the game. The width is dynamic.
	 * @param backgroundColor Background color for when something is transparent.
	 */
	constructor(desiredSize: number, backgroundColor: [number, number, number]) {
		Surface.desiredSize = desiredSize
		Surface.backgroundColor(backgroundColor)

		this.scene = new Scene(this)
		this.control = new Control()

		// Font
		// this.fonts = {"": "20px Arial"}
		// this.nFont("std", new ImageLoader(1, `127|4|>J?[UFF9^9;[N?JH:9OR+Y^9*9[R6?$1_(_XAVF6^J1IM_JEV9N(^.$>PA[S'I]IPTBYG?^?C_"[W9W_XO_=N_^[F^SKU^K_#=")W _YG_ 1$09@#_!O]F9F%^B.<0$0!OF?8-V?P, ,  ,  G57("6U!0"220`, this.gl))
		// this.font("std")
		Surface.setup()
	}

	/**
	 * Init, runs when everything is ready; in this case, instantly.
	 * @param fn Function to be ran when everything is ready
	 */
	init(fn: CallbackFunction) {
		this.initFn = fn
		this._init()
	}

	private _init() {
		if ((!Surface.ready) || (!ImageHolder.allLoaded())) {
			setTimeout(() => {
				this._init.call(this)
			}, 10)
			return
		}

		const ph = document.getElementById("play")
		if (ph) ph.style.opacity = "0"

		this.initFn()

		// Graphics interval
		const graphicsFn = () => {
			this.doGraphics.call(this)
			window.requestAnimationFrame(graphicsFn)
		}
		window.requestAnimationFrame(graphicsFn)

		// Physics interval
		setInterval(() => {
			this.doPhysics.call(this)
		}, 4)
	}

	/**
	 * Runs this function before every frame, when sprites are about to be rendered
	 * @param fn Function to be ram
	 */
	preFrame(fn: CallbackFunction) {
		this.preFrameFn = fn
	}

	/**
	 * Runs this function at the end of every frame
	 * @param fn Function to be ran
	 */
	frame(fn: CallbackFunction) {
		this.frameFn = fn
	}
	
	/**
	 * Runs this function every physics frame
	 * @param fn Function to be ran
	 */
	physics(fn: CallbackFunction) {
		this.physicsFn = fn
	}

	/**
	 * Main loop for the game. Runs the preLoop, moves everything, and runs the normal loop functions.
	 * @private
	 */
	private doGraphics() {
		this.scene.width = Surface.texture.width
		this.scene.height = Surface.texture.height
		// Move camera towards targeted object
		// if (this.camera.following) {
		// 	if (this.camera.following instanceof PhysicsActor) {
		// 		this.camera.pos.lerp(
		// 			Math.min(this.camera._constrains.x2, Math.max(this.camera._constrains.x, (this.camera.following.pos.x - this.width  / 2) + this.camera.following.speed.x * this.camera.followFract[1].x + this.camera.following.w * this.camera.following.scale * 0.5)),
		// 			Math.min(this.camera._constrains.y2, Math.max(this.camera._constrains.y, (this.camera.following.pos.y - this.height / 2) + this.camera.following.speed.y * this.camera.followFract[1].y + this.camera.following.h * this.camera.following.scale * 0.5)),
		// 			this.camera.followFract[0])
		// 	} else {
		// 		this.camera.pos.lerp(
		// 			Math.min(this.camera._constrains.x2, Math.max(this.camera._constrains.x, (this.camera.following.pos.x - this.width  / 2) + this.camera.following.w * this.camera.following.scale * 0.5)),
		// 			Math.min(this.camera._constrains.y2, Math.max(this.camera._constrains.y, (this.camera.following.pos.y - this.height / 2) + this.camera.following.h * this.camera.following.scale * 0.5)),
		// 			this.camera.followFract[0])
		// 	}
		// }

		// Clear screen
		Surface.frameSetup()
		Surface.calculateFramerate()

		this.preFrameFn() // Call user pre-frame function

		// Draw all objects
		Surface.resetViewport()
		this.scene.draw()
		Surface.texture.resetTranslate()
		
		Surface.resetViewport()
		this.frameFn() // Call user frame function

		// Draw to second canvas if still blurry
		Surface.frameEnd()
	}

	private doPhysics() {
		this.scene.doPhysics()

		this.physicsFn()
	}

	// TODO: put this somewhere
	// /**
	//  * Creates a new font from a CImage.
	//  * @param name Font name
	//  * @param image Image to use as font
	//  */
	// nFont(name, image) {
	// 	this.fonts[name] = image
	// }

	// /**
	//  * Sets the font that's currently being used
	//  * @param name Font name
	//  */
	// font(name) {
	// 	this.currentFont = name
	// }
}