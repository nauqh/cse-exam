"use client";
import { ReactNode } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { usePathname } from "next/navigation";

export default function ExamsLayout({ children }: { children: ReactNode }) {
	return (
		<div className="container mx-auto px-4 py-8">
			<div className="space-y-8">{children}</div>
		</div>
	);
}
