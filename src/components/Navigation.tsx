"use client";

import Link from "next/link";
import { SignedIn, SignedOut, useUser, useClerk } from "@clerk/nextjs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { BiLogOut, BiBook, BiUser, BiCog } from "react-icons/bi";
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

	const handleSignOut = () => {
		toast({
			description: "Signing out...",
			duration: 3000,
		});
		signOut();
	};

	return (
		<nav className="fixed top-0 w-full bg-white/80 backdrop-blur-sm z-50">
			<div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="flex justify-between items-center h-20">
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
									<BiCog className="h-5 w-5" />
									<span>Courses</span>
								</Button>
							</Link>
						</div>

						<div className="flex items-center gap-4">
							<DropdownMenu>
								<DropdownMenuTrigger className="flex items-center gap-2 hover:bg-gray-100 rounded-full p-1 px-2 transition-colors outline-none">
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
	);
}
