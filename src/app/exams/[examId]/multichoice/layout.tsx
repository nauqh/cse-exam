"use client";
import React from "react";

export default function MultichoiceLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return <div className="rounded-lg shadow-sm border p-6">{children}</div>;
}
