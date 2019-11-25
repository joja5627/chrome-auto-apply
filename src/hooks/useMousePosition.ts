import React, { useState, useEffect } from "react";


export default function useMousePosition() {
	const [position, setMousePosition] = React.useState({ x: 0, y: 0 });

	function handleMouseMove(e: MouseEvent) {
		setMousePosition({ x: e.clientX, y: e.clientY });
	}

	React.useEffect(() => {
		// lifecycle: cDM cDU
		window.addEventListener('mousemove', handleMouseMove);

		// lifecycle: cWU
		return () => {
			window.removeEventListener('mousemove', handleMouseMove);
		};
	}, []);

	return position;
}

