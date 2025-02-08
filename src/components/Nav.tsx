"use client";

import {
	SignInButton,
	SignedIn,
	SignedOut,
	UserButton,
	useUser,
} from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
const DotIcon = () => {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			viewBox="0 0 512 512"
			fill="currentColor"
		>
			<path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512z" />
		</svg>
	);
};
export default function Nav() {
	const { user } = useUser();

	return (
		<nav className="flex items-center justify-between bg-white text-black p-4 shadow-md sticky top-0 z-50">
			<div className="text-xl font-bold transition-transform hover:scale-105">
				<Link href="/" onClick={() => localStorage.clear()}>
					<Image
						src="/logo.png"
						alt="Logo"
						width={200}
						height={40}
						className="object-contain"
					/>
				</Link>
			</div>
			<div className="flex items-center gap-6">
				<Button variant="ghost">
					<Link href="/">Home</Link>
				</Button>
				<Button variant="ghost">
					<Link href="/">How to</Link>
				</Button>
				<SignedOut>
					<SignInButton>
						<Button
							variant="outline"
							className="border-red-500 text-red-500 hover:bg-red-50 hover:text-red-600"
						>
							Sign In
						</Button>
					</SignInButton>
				</SignedOut>
				<SignedIn>
					<UserButton
						userProfileMode="navigation"
						userProfileUrl={`/profile/${user?.emailAddresses}`}
						appearance={{
							elements: {
								userButtonPopoverFooter: "hidden",
							},
						}}
					></UserButton>
				</SignedIn>
			</div>
		</nav>
	);
}
