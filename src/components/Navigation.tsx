"use client";

import Link from "next/link";
import { useState } from "react";
import { SignedIn, SignedOut, useUser, useClerk } from "@clerk/nextjs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
	BiLogOut,
	BiBook,
	BiUser,
	BiCog,
	BiChalkboard,
	BiSearch,
} from "react-icons/bi";
import { useToast } from "@/hooks/use-toast";
import Image from "next/image";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function Navigation() {
	const { user } = useUser();
	const { signOut } = useClerk();
	const { toast } = useToast();
	const [isSearchOpen, setIsSearchOpen] = useState(false);
	const [searchQuery, setSearchQuery] = useState("");

	const handleSignOut = () => {
		toast({
			description: "Signing out...",
			duration: 3000,
		});
		signOut();
	};

	const handleSearch = () => {
		if (!searchQuery.trim()) {
			toast({
				description: "Please enter a search term",
				duration: 3000,
			});
			return;
		}
		// Implement your search logic here
		setSearchQuery("");
		setIsSearchOpen(false);
	};

	return (
		<>
			<nav className="fixed top-0 w-full bg-white/80 backdrop-blur-sm z-50">
				<div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="flex justify-between items-center h-20">
						<Link href="/" className="block">
							<Image
								src="/logo.png"
								alt="eExams Logo"
								width={150}
								height={100}
								className="hover:opacity-90 transition-opacity"
							/>
						</Link>

						<div className="hidden md:flex items-center space-x-4">
							<Link href="/exams">
								<Button
									variant="ghost"
									className="flex items-center gap-2"
								>
									<BiBook className="h-5 w-5" />
									<span>Exams</span>
								</Button>
							</Link>
							<Link href="/profile">
								<Button
									variant="ghost"
									className="flex items-center gap-2"
								>
									<BiUser className="h-5 w-5" />
									<span>Profile</span>
								</Button>
							</Link>
							<Link href="/settings">
								<Button
									variant="ghost"
									className="flex items-center gap-2"
								>
									<BiChalkboard className="h-5 w-5" />
									<span>Courses</span>
								</Button>
							</Link>
							{/* Search Button */}
							<Button
								variant="ghost"
								className="p-2 hover:rotate-90 transition-transform duration-200"
								onClick={() => setIsSearchOpen(!isSearchOpen)}
							>
								<BiSearch className="h-5 w-5" />
							</Button>
						</div>

						<SignedIn>
							<div className="flex items-center gap-4">
								<DropdownMenu>
									<DropdownMenuTrigger className="flex items-center gap-2 hover:bg-gray-100 rounded-xl p-2 transition-colors outline-none">
										<Avatar className="h-8 w-8">
											<AvatarImage src={user?.imageUrl} />
											<AvatarFallback>CN</AvatarFallback>
										</Avatar>
										<span className="hidden md:inline text-sm font-medium">
											{user?.fullName}
										</span>
									</DropdownMenuTrigger>
									<DropdownMenuContent
										align="end"
										className="w-[20vw]"
									>
										<DropdownMenuLabel>
											My Account
										</DropdownMenuLabel>
										<DropdownMenuSeparator />
										<Link href="/profile">
											<DropdownMenuItem className="cursor-pointer">
												<BiUser className="mr-2 h-4 w-4" />
												Profile
											</DropdownMenuItem>
										</Link>
										<Link href="/settings">
											<DropdownMenuItem className="cursor-pointer">
												<BiCog className="mr-2 h-4 w-4" />
												Settings
											</DropdownMenuItem>
										</Link>
										<DropdownMenuSeparator />
										<DropdownMenuItem
											className="cursor-pointer text-red-600 hover:text-red-700"
											onClick={handleSignOut}
										>
											<BiLogOut className="mr-2 h-4 w-4" />
											Sign Out
										</DropdownMenuItem>
									</DropdownMenuContent>
								</DropdownMenu>
							</div>
						</SignedIn>

						<SignedOut>
							<div className="flex items-center gap-4">
								<Link href="/auth/sign-in">
									<Button className="w-[10vw] relative overflow-hidden border border-[#1d283a] bg-transparent text-[#1d283a] hover:text-white font-medium transition-colors duration-300 before:absolute before:inset-y-0 before:left-[25%] before:w-1/2 before:bg-[#1d283a] before:scale-x-0 hover:before:scale-x-[200%] before:transition-transform before:duration-500 before:ease-out before:origin-center">
										<span className="relative z-10">
											Sign in
										</span>
									</Button>
								</Link>
								<Link href="/auth/sign-up">
									<Button className="bg-[#1d283a] hover:bg-[#2a3a52] font-medium">
										Sign Up
									</Button>
								</Link>
							</div>
						</SignedOut>
					</div>
				</div>
			</nav>

			{/* Full Screen Search Overlay */}
			<div
				className={`fixed inset-0 w-full h-full bg-white/95 backdrop-blur-sm z-[60] transition-all duration-300 ease-in-out
                    ${
						isSearchOpen
							? "opacity-100 visible scale-100"
							: "opacity-0 invisible scale-95"
					}`}
				onClick={() => setIsSearchOpen(false)}
			>
				<div className="container mx-auto p-8 max-w-5xl h-full">
					<div className="max-w-2xl mx-auto mt-20">
						<div
							className="relative"
							onClick={(e) => e.stopPropagation()}
						>
							<input
								type="text"
								placeholder="Type something..."
								className="w-full p-4 rounded-lg border border-gray-300 focus:outline-none focus:border-[hsl(var(--secondary-color))] bg-white"
								autoFocus={isSearchOpen}
								value={searchQuery}
								onChange={(e) => setSearchQuery(e.target.value)}
							/>
							<button
								className="absolute right-0 top-0 h-full px-6 rounded-r-lg bg-transparent hover:bg-primary text-primary hover:text-white transition-all"
								onClick={() => {
									if (!searchQuery.trim()) {
										console.log(
											"Blank space? I'm no Taylor Swift—fill it up!"
										);
										toast({
											description:
												"Blank space? I'm no Taylor Swift—fill it up!",
											className:
												"bg-yellow-100 text-yellow-800",
											duration: 3000,
										});
									} else {
										handleSearch();
									}
								}}
							>
								Search
							</button>
						</div>
						<div
							className="mt-8"
							onClick={(e) => e.stopPropagation()}
						>
							<h3 className="font-semibold mb-4">Popular tags</h3>
							<div className="flex flex-wrap gap-3">
								{[
									"fiction",
									"short story",
									"collection",
									"poetry",
								].map((tag) => (
									<button
										key={tag}
										className="px-4 py-2 rounded-full border border-gray-200 
												 bg-white text-gray-700 text-sm font-medium
												 hover:bg-primary hover:text-white hover:border-primary
												 transform transition-all duration-200 ease-in-out
												 hover:shadow-md active:scale-95"
										onClick={() => setSearchQuery(tag)}
									>
										#{tag}
									</button>
								))}
							</div>
						</div>
					</div>
				</div>
			</div>
		</>
	);
}
