"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";

export default function Nav() {
	return (
		<nav className="flex items-center justify-between bg-white text-black p-4 shadow-md">
			<div className="text-xl font-bold">
				<Link href="/" onClick={() => localStorage.clear()}>
					<Image src="/logo.png" alt="Logo" width={200} height={40} />
				</Link>
			</div>
			<div className="flex gap-4">
				<Button variant="ghost">
					<Link href="/problem">Problems</Link>
				</Button>
				<Button variant="ghost">
					<Link href="/">Submission</Link>
				</Button>
				<Button variant="ghost">
					<Link href="/">Profile</Link>
				</Button>
			</div>
		</nav>
	);
}
