import { LangBase } from "./langs.ts"
import {
	Type,
	TreeNode,
	FunctionNode,
	StatementNode,

	NumberLiteralNode
} from "../parse.ts"

function toType(type: Type) {
	return type.map(t => { return {
		"i32": "number",
		"f32": "number",
	}[t] }).join(" | ")
}

export class Lang extends LangBase {
	static take(node: TreeNode): string {
		if (node instanceof FunctionNode) {
			const args = node.args.map(v => v.name + ": " + toType(v.type))
			return "function " + node.name
				+ "(" + args.join(", ") + "): " + toType(node.type) + " {\n"
				+ this.indent(this.takeArr(node.children))
				+ "\n}"
		} else if (node instanceof StatementNode) {
			return node.name + " " + this.take(node.arg)
		} else if (node instanceof NumberLiteralNode) {
			return node.value
		}

		console.log("Didn't match:", node)
		return "..."
	}
}
