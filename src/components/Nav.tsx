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
				<Button
					variant="ghost"
					className="text-gray-800 font-medium hover:bg-red-50 hover:text-red-500"
				>
					<Link href="/problem">Login</Link>
				</Button>
				<Button
					variant="ghost"
					className="text-gray-800 hover:bg-red-50 hover:text-red-500"
				>
					<Link href="/">How to</Link>
				</Button>
				<Button
					variant="ghost"
					className="text-gray-800 hover:bg-red-50 hover:text-red-500"
				>
					<Link href="/profile/1">Profile</Link>
				</Button>
			</div>
		</nav>
	);
}
