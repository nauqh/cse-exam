"use client";
import React from "react";

export default function MultichoiceLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<div className="min-h-screen flex items-center justify-center px-4 py-8">
			<div className="w-full max-w-7xl rounded-lg shadow-sm border p-6">
				{children}
			</div>
		</div>
	);
}
