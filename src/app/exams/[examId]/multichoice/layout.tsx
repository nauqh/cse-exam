"use client";
import React from "react";

export default function MultichoiceLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<div className="container mx-auto px-4 py-8">
			<div className="rounded-lg shadow-sm border p-6">{children}</div>
		</div>
	);
}
