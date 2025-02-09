"use client";

import { SignedIn, useUser, useClerk } from "@clerk/nextjs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useState } from "react";
import { AiOutlineLoading } from "react-icons/ai";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { GiHamburgerMenu } from "react-icons/gi";
import {
	Sheet,
	SheetContent,
	SheetTrigger,
	SheetHeader,
	SheetTitle,
} from "@/components/ui/sheet";

export default function MenuSheet() {
	const { user } = useUser();
	const [isSigningOut, setIsSigningOut] = useState(false);
	const { signOut } = useClerk();

	const handleSignOut = async () => {
		setIsSigningOut(true);
		await signOut();
		setIsSigningOut(false);
	};

	return (
		<div className="absolute top-4 right-4">
			<Sheet>
				<SheetTrigger asChild>
					<Button variant="ghost" className="hover:bg-gray-100">
						<GiHamburgerMenu />
					</Button>
				</SheetTrigger>
				<SheetContent className="w-[280px]">
					<SheetHeader className="text-left pb-6 border-b">
						<SheetTitle className="text-xl">Menu</SheetTitle>
					</SheetHeader>

					<div className="flex flex-col py-6">
						<Link href="/">
							<Button
								variant="ghost"
								className="w-full justify-start text-base font-normal h-11"
							>
								Home
							</Button>
						</Link>
						<Link href="/">
							<Button
								variant="ghost"
								className="w-full justify-start text-base font-normal h-11"
							>
								How to
							</Button>
						</Link>
					</div>

					<div className="border-t absolute bottom-0 left-0 right-0 p-6 bg-gray-50">
						<SignedIn>
							<div className="flex flex-col gap-4">
								<div className="flex items-center gap-4">
									<Link
										href={`/profile/${user?.emailAddresses}`}
									>
										<Avatar>
											<AvatarImage src={user?.imageUrl} />
											<AvatarFallback>CN</AvatarFallback>
										</Avatar>
									</Link>
									<div className="text-xs">
										<p className="font-medium">
											{user?.fullName}
										</p>
										<p className="text-gray-500">
											{
												user?.primaryEmailAddress
													?.emailAddress
											}
										</p>
									</div>
								</div>
								<Button
									variant="outline"
									onClick={handleSignOut}
									disabled={isSigningOut}
									className="relative"
								>
									{isSigningOut ? (
										<AiOutlineLoading className="animate-spin mx-auto" />
									) : (
										"Sign Out"
									)}
								</Button>
							</div>
						</SignedIn>
					</div>
				</SheetContent>
			</Sheet>
		</div>
	);
}
