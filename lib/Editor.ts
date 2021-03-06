import { Glass, globalize } from "./Glass"
import { GlassNode } from "./GlassNode"

class EditorInstance {
	text = ""
	textSize = 4
	ts = 5

	openPaths: number[] = [0]
	selected = ""

	nodesLength = 0

	init() {
		// Reloads all scripts
		window.addEventListener("keydown", (k) => {
			if (k.key == "p" && (k.metaKey || k.ctrlKey))
				Glass.scene.children.forEach(c => { this.reloadScript(c) })
		})
	}

	protected reloadScript(node: GlassNode) {
		if (node.scriptSrc !== undefined) {
			import(Glass.mainPath + "/" + node.scriptSrc + "?" + Math.random()).then(i => {
				if ("setup" in i) node.setupFn = i.setup
				if ("frame" in i) node.frameFn = i.frame
			}).catch(err => {
				console.log("Error reloading script:\n", err)
			})
		}
		node.children.forEach(c => { this.reloadScript(c) })
	}

	protected renderNode(n: GlassNode, indent = 0, vertical = 0, level = 0, path = ""): number {
		const open = this.openPaths.includes(n.id) || (n.children.length == 0)
		const txt = (open ? "" : ">") + n.getName(true)

		if (this.selected == path) {
			Glass.colorf(0, 0, 0, 80)
			Glass.fillRect(indent * this.ts - 1, vertical * this.ts - 1, txt.length * this.ts, this.ts)
		}
		Glass.colorf(0, 0, 0)
		Glass.text(txt, indent * this.ts, vertical * this.ts)
		if (!open) return 0
		let added = 0
		n.children.forEach(c => {
			added++
			added += this.renderNode(c, indent + 1, vertical + added, level + 1, path + "/" + c.getName(true))
		})
		return added
	}

	public render() {
		const tr = [Glass.translation[0], Glass.translation[1]]
		Glass.translate(-Glass.translation[0], -Glass.translation[1])
		Glass.translate(this.textSize / 4, this.textSize / 4)
		this.text += Glass.events.join("")
		Glass.colorf(255, 255, 255)
		Glass.fillRect(0, 0, 128, this.nodesLength * this.ts + this.textSize / 4)

		Glass.colorf(0, 0, 0)
		Glass.translate(this.textSize / 4, this.textSize / 4)
		this.nodesLength = this.renderNode(Glass.scene, 0, 0, 0, "Root") + 1
		Glass.translate(tr[0], tr[1])
	}
}
export const Editor = new EditorInstance()
globalize({Editor})
