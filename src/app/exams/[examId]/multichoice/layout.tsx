"use client";
import React from "react";

export default function MultichoiceLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<div className="min-h-screen flex items-center justify-center px-4 py-8 max-w[90vw] mx-auto">
			{children}
		</div>
	);
}
