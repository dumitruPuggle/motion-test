import React from "react";
import {
	useCurrentFrame,
	useVideoConfig,
	AbsoluteFill,
	interpolate,
	spring,
	Sequence,
} from "remotion";
import { Img } from "remotion";

export const MyAnimation = () => {
	/*
		Recreates the referenced UI animation by layering three provided screenshots and choreographing
		a zoom-in + parallax entrance, then a wide white canvas expansion, and finally a clean settle state.
		The motion combines spring-based positional/scale movement with linear opacity/blur and a subtle
		draw-on accent stroke to match the polished product-demo feel.
	*/

	const frame = useCurrentFrame();
	const { fps, width, height } = useVideoConfig();

	const COLOR_BG = "#0B7A45";
	const COLOR_WHITE = "#FFFFFF";
	const COLOR_ACCENT = "rgba(255,255,255,0.9)";
	const COLOR_SHADOW = "rgba(0,0,0,0.18)";

	const HERO_IMAGE_1 = (globalThis as any).AttachedImages?.[0];
	const HERO_IMAGE_2 = (globalThis as any).AttachedImages?.[1];
	const HERO_IMAGE_3 = (globalThis as any).AttachedImages?.[2];

	const INTRO_START = 0;
	const INTRO_DURATION = 55;

	const EXPAND_START = 38;
	const EXPAND_DURATION = 60;

	const FINAL_START = 92;
	const FINAL_DURATION = 80;

	const OUTRO_START = 170;
	const OUTRO_DURATION = 18;

	const PADDING_X = Math.max(36, Math.round(width * 0.06));
	const PADDING_Y = Math.max(36, Math.round(height * 0.06));
	const CARD_RADIUS = Math.max(18, Math.round(width * 0.02));
	const CARD_SHADOW_BLUR = Math.max(18, Math.round(width * 0.02));

	const STAGE_W = width - PADDING_X * 2;
	const STAGE_H = height - PADDING_Y * 2;

	const HERO_MAX_W = Math.max(900, Math.round(width * 0.92));
	const HERO_MAX_H = Math.max(520, Math.round(height * 0.8));

	const imageCommonStyle: React.CSSProperties = {
		width: HERO_MAX_W,
		height: "auto",
		maxHeight: HERO_MAX_H,
		objectFit: "contain",
		display: "block",
	};

	const introIn = spring({
		fps,
		frame: frame - INTRO_START,
		config: { damping: 16, mass: 0.9, stiffness: 120 },
	});

	const expandSpring = spring({
		fps,
		frame: frame - EXPAND_START,
		config: { damping: 18, mass: 0.9, stiffness: 130 },
	});

	const finalSettle = spring({
		fps,
		frame: frame - FINAL_START,
		config: { damping: 22, mass: 0.9, stiffness: 140 },
	});

	const outroFade = interpolate(
		frame,
		[OUTRO_START, OUTRO_START + OUTRO_DURATION],
		[1, 0],
		{ extrapolateLeft: "clamp", extrapolateRight: "clamp" }
	);

	const bgParallaxX = interpolate(frame, [0, 120], [0, -Math.round(width * 0.03)], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
	});
	const bgParallaxY = interpolate(frame, [0, 120], [0, Math.round(height * 0.02)], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
	});

	const hero1Opacity = interpolate(frame, [0, 26, 52], [0, 1, 0], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
	});
	const hero2Opacity = interpolate(frame, [34, 56, 108], [0, 1, 0], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
	});
	const hero3Opacity = interpolate(frame, [88, 110, 220], [0, 1, 1], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
	});

	const hero1Scale = 1.06 - introIn * 0.06;
	const hero1X = interpolate(introIn, [0, 1], [Math.round(width * 0.06), 0], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
	});
	const hero1Y = interpolate(introIn, [0, 1], [Math.round(height * 0.06), 0], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
	});

	const hero2Scale = 1 + expandSpring * 0.01;
	const hero2X = interpolate(
		frame,
		[EXPAND_START - 10, EXPAND_START + 24],
		[Math.round(width * 0.02), 0],
		{ extrapolateLeft: "clamp", extrapolateRight: "clamp" }
	);
	const hero2Y = interpolate(
		frame,
		[EXPAND_START - 10, EXPAND_START + 24],
		[Math.round(height * 0.01), 0],
		{ extrapolateLeft: "clamp", extrapolateRight: "clamp" }
	);

	const hero3Scale = 1 - (1 - finalSettle) * 0.01;
	const hero3X = interpolate(finalSettle, [0, 1], [Math.round(width * 0.02), 0], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
	});
	const hero3Y = interpolate(finalSettle, [0, 1], [Math.round(height * 0.02), 0], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
	});

	const blur1 = interpolate(frame, [34, 55], [0, 6], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
	});
	const blur2 = interpolate(frame, [86, 104], [0, 7], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
	});
	const blur3 = interpolate(frame, [88, 110], [6, 0], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
	});

	const whitePanelW = interpolate(expandSpring, [0, 1], [Math.round(STAGE_W * 0.28), STAGE_W], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
	});
	const whitePanelH = interpolate(expandSpring, [0, 1], [Math.round(STAGE_H * 0.78), STAGE_H], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
	});
	const whitePanelX = interpolate(expandSpring, [0, 1], [Math.round(STAGE_W * 0.16), 0], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
	});
	const whitePanelY = interpolate(expandSpring, [0, 1], [Math.round(STAGE_H * 0.06), 0], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
	});
	const whitePanelOpacity = interpolate(frame, [EXPAND_START - 6, EXPAND_START + 8], [0, 1], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
	});

	const accentDraw = interpolate(frame, [16, 70], [0, 1], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
	});
	const accentOpacity = interpolate(frame, [10, 26, 94], [0, 1, 0.35], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
	});

	const accentDashArray = 1200;
	const accentDashOffset = (1 - accentDraw) * accentDashArray;

	const vignetteOpacity = interpolate(frame, [0, 30, 160, 220], [0.25, 0.18, 0.18, 0.22], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
	});

	return (
		<AbsoluteFill style={{ backgroundColor: COLOR_BG, fontFamily: "Inter, sans-serif" }}>
			{/* Soft parallax glow blobs */}
			<div
				style={{
					position: "absolute",
					inset: -Math.round(Math.max(width, height) * 0.2),
					transform: `translate(${bgParallaxX}px, ${bgParallaxY}px)`,
					opacity: 0.95,
					filter: `blur(${Math.max(18, Math.round(width * 0.02))}px)`,
					background:
						"radial-gradient(circle at 18% 52%, rgba(178, 255, 170, 0.70) 0%, rgba(178, 255, 170, 0.00) 46%), radial-gradient(circle at 72% 64%, rgba(110, 255, 208, 0.40) 0%, rgba(110, 255, 208, 0.00) 44%), radial-gradient(circle at 40% 18%, rgba(210, 255, 190, 0.22) 0%, rgba(210, 255, 190, 0.00) 40%)",
				}}
			/>

			{/* Accent stroke (draw-on) */}
			<svg
				width={width}
				height={height}
				viewBox={`0 0 ${width} ${height}`}
				style={{
					position: "absolute",
					inset: 0,
					opacity: accentOpacity,
				}}
			>
				<path
					d={`M ${Math.round(width * 0.06)} ${Math.round(height * 0.62)}
            C ${Math.round(width * 0.15)} ${Math.round(height * 0.2)},
              ${Math.round(width * 0.55)} ${Math.round(height * 0.1)},
              ${Math.round(width * 0.72)} ${Math.round(height * 0.46)}
            S ${Math.round(width * 0.92)} ${Math.round(height * 0.86)},
              ${Math.round(width * 0.96)} ${Math.round(height * 0.54)}`}
					fill="none"
					stroke={COLOR_ACCENT}
					strokeWidth={Math.max(4, Math.round(width * 0.004))}
					strokeLinecap="round"
					strokeDasharray={accentDashArray}
					strokeDashoffset={accentDashOffset}
				/>
			</svg>

			{/* Stage container uses full width with padding (no small centered box) */}
			<div
				style={{
					position: "absolute",
					left: PADDING_X,
					top: PADDING_Y,
					width: STAGE_W,
					height: STAGE_H,
				}}
			>
				{/* Expanding white panel behind assets (matches screenshot 2/3 wide canvas) */}
				<div
					style={{
						position: "absolute",
						left: whitePanelX,
						top: whitePanelY,
						width: whitePanelW,
						height: whitePanelH,
						backgroundColor: COLOR_WHITE,
						borderRadius: CARD_RADIUS,
						boxShadow: `0 ${Math.round(height * 0.03)}px ${CARD_SHADOW_BLUR}px ${COLOR_SHADOW}`,
						opacity: whitePanelOpacity,
						transform: `translateZ(0)`,
					}}
				/>

				{/* Image 1: initial close framing */}
				{HERO_IMAGE_1 ? (
					<div
						style={{
							position: "absolute",
							inset: 0,
							display: "flex",
							alignItems: "center",
							justifyContent: "center",
							opacity: hero1Opacity * outroFade,
							filter: `blur(${blur1}px)`,
							transform: `translate(${hero1X}px, ${hero1Y}px) scale(${hero1Scale})`,
						}}
					>
						<Img src={HERO_IMAGE_1} style={imageCommonStyle} />
					</div>
				) : null}

				{/* Image 2: transition state with big white area */}
				{HERO_IMAGE_2 ? (
					<div
						style={{
							position: "absolute",
							inset: 0,
							display: "flex",
							alignItems: "center",
							justifyContent: "center",
							opacity: hero2Opacity * outroFade,
							filter: `blur(${blur2}px)`,
							transform: `translate(${hero2X}px, ${hero2Y}px) scale(${hero2Scale})`,
						}}
					>
						<Img src={HERO_IMAGE_2} style={imageCommonStyle} />
					</div>
				) : null}

				{/* Image 3: final wide layout */}
				{HERO_IMAGE_3 ? (
					<div
						style={{
							position: "absolute",
							inset: 0,
							display: "flex",
							alignItems: "center",
							justifyContent: "center",
							opacity: hero3Opacity * outroFade,
							filter: `blur(${blur3}px)`,
							transform: `translate(${hero3X}px, ${hero3Y}px) scale(${hero3Scale})`,
						}}
					>
						<Img src={HERO_IMAGE_3} style={imageCommonStyle} />
					</div>
				) : null}

				{/* Micro: subtle highlight sweep on the white panel */}
				<div
					style={{
						position: "absolute",
						left: 0,
						top: 0,
						width: STAGE_W,
						height: STAGE_H,
						borderRadius: CARD_RADIUS,
						overflow: "hidden",
						opacity:
							interpolate(frame, [EXPAND_START + 10, EXPAND_START + 26, EXPAND_START + 56], [0, 0.55, 0], {
								extrapolateLeft: "clamp",
								extrapolateRight: "clamp",
							}) * outroFade,
						pointerEvents: "none",
					}}
				>
					<div
						style={{
							position: "absolute",
							top: -Math.round(STAGE_H * 0.2),
							left: interpolate(frame, [EXPAND_START + 10, EXPAND_START + 56], [-Math.round(STAGE_W * 0.6), STAGE_W], {
								extrapolateLeft: "clamp",
								extrapolateRight: "clamp",
							}),
							width: Math.round(STAGE_W * 0.5),
							height: Math.round(STAGE_H * 1.4),
							transform: `rotate(18deg)`,
							background:
								"linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.55) 50%, rgba(255,255,255,0) 100%)",
							filter: `blur(${Math.max(8, Math.round(width * 0.008))}px)`,
						}}
					/>
				</div>
			</div>

			{/* Vignette for depth */}
			<div
				style={{
					position: "absolute",
					inset: 0,
					background:
						"radial-gradient(circle at 50% 50%, rgba(0,0,0,0) 52%, rgba(0,0,0,0.28) 100%)",
					opacity: vignetteOpacity * outroFade,
				}}
			/>
		</AbsoluteFill>
	);
};