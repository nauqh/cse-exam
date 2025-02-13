"use client";

import Link from "next/link";
import { SignedIn, SignedOut, useUser, useClerk } from "@clerk/nextjs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { BiLogOut } from "react-icons/bi";
import { useToast } from "@/hooks/use-toast";
import Image from "next/image";

export default function Navigation() {
	const { user } = useUser();
	const { signOut } = useClerk();
	const { toast } = useToast();

	const handleSignOut = () => {
		toast({
			description: "Signing out...",
			duration: 3000,
		});
		signOut();
	};

	return (
		<nav className="fixed top-0 w-full bg-white/80 backdrop-blur-sm border-b z-50">
			<div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="flex justify-between items-center h-16">
					<Link href="/" className="block">
						<Image
							src="/logo.png"
							alt="eExams Logo"
							width={200}
							height={100}
							className="hover:opacity-90 transition-opacity"
						/>
					</Link>

					<SignedIn>
						<div className="hidden md:flex items-center space-x-6">
							<Link href="/exams">
								<Button variant="ghost">Exams</Button>
							</Link>
							<Link href="/analytics">
								<Button variant="ghost">Analytics</Button>
							</Link>
							<Link href="/settings">
								<Button variant="ghost">Settings</Button>
							</Link>
						</div>

						<div className="flex items-center gap-4">
							<Link
								href="/profile"
								className="flex items-center gap-2"
							>
								<Avatar className="h-8 w-8">
									<AvatarImage src={user?.imageUrl} />
									<AvatarFallback>CN</AvatarFallback>
								</Avatar>
								<span className="hidden md:inline text-sm font-medium">
									{user?.fullName}
								</span>
							</Link>
							<Button
								variant="ghost"
								size="icon"
								onClick={handleSignOut}
								className="text-red-600 hover:text-red-700"
							>
								<BiLogOut className="h-5 w-5" />
							</Button>
						</div>
					</SignedIn>

					<SignedOut>
						<div className="flex items-center gap-4">
							<Link href="/auth/sign-in">
								<Button variant="ghost">Sign In</Button>
							</Link>
							<Link href="/auth/sign-up">
								<Button className="bg-[#1d283a] hover:bg-[#2a3a52]">
									Sign Up
								</Button>
							</Link>
						</div>
					</SignedOut>
				</div>
			</div>
		</nav>
	);
}
