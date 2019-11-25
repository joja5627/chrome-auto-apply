
import React from "react";

import useMousePosition from "../hooks/useMousePosition"
export default function MouseRender() {
	const mouse = useMousePosition();

	return (
		<span>
			Hooks Mouse(X, Y): {mouse.x}, {mouse.y}
		</span>
	);
}