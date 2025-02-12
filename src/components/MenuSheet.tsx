"use client";

import { useState } from "react";
import { SignedIn, useUser, useClerk } from "@clerk/nextjs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { GiHamburgerMenu } from "react-icons/gi";
import { BiLogOut } from "react-icons/bi";
import {
	BsBook,
	BsCardChecklist,
	BsPeople,
	BsHouseDoor,
	BsGraphUp,
	BsGear,
} from "react-icons/bs";
import { MdOutlineQuiz } from "react-icons/md";
import {
	Sheet,
	SheetContent,
	SheetTrigger,
	SheetHeader,
	SheetTitle,
} from "@/components/ui/sheet";
import { useToast } from "@/hooks/use-toast";
import { Toaster } from "@/components/ui/toaster";

export default function MenuSheet() {
	// Use state to control the open/close toggle of the sheet.
	const [open, setOpen] = useState(false);
	const { toast } = useToast();
	const { user } = useUser();
	const { signOut } = useClerk();

	const handleSignOut = () => {
		toast({
			description: "Signing out...",
			duration: 3000,
		});
		signOut({ redirectUrl: "/auth/sign-in" });
	};

	return (
		<>
			<SignedIn>
				<div className="absolute top-4 right-4">
					{/* Pass open and onOpenChange to control the toggle state.
              Setting modal={false} ensures no overlay is rendered so the background remains visible. */}
					<Sheet open={open} onOpenChange={setOpen} modal={false}>
						<SheetTrigger asChild>
							<Button
								variant="outline"
								size="icon"
								className="rounded-full w-12 h-12 bg-white/80 backdrop-blur-sm border-white/30 shadow-lg hover:bg-white/90 transition-all"
							>
								<GiHamburgerMenu className="h-5 w-5" />
							</Button>
						</SheetTrigger>
						<SheetContent className="w-[300px] p-0 rounded-lg shadow-lg">
							<SheetHeader className="p-4 border-b">
								<SheetTitle>
									<div className="flex items-center gap-3">
										<Link href={`/profile`}>
											<Avatar>
												<AvatarImage
													src={user?.imageUrl}
												/>
												<AvatarFallback>
													CN
												</AvatarFallback>
											</Avatar>
										</Link>
										<div className="text-sm">
											<p className="font-medium">
												{user?.fullName}
											</p>
											<p className="text-gray-500 text-xs">
												{
													user?.primaryEmailAddress
														?.emailAddress
												}
											</p>
										</div>
									</div>
								</SheetTitle>
							</SheetHeader>

							<div className="flex flex-col max-h-[80vh] overflow-y-auto">
								<div className="px-4 py-2">
									<h3 className="text-sm font-medium text-gray-500">
										Main
									</h3>
									<div className="space-y-1 mt-2">
										<Link href="/">
											<Button
												variant="ghost"
												className="w-full justify-start text-base font-normal h-11 hover:bg-gray-100"
											>
												<BsHouseDoor className="mr-3" />
												Home
											</Button>
										</Link>
										<Link href="/exams">
											<Button
												variant="ghost"
												className="w-full justify-start text-base font-normal h-11 hover:bg-gray-100"
											>
												<MdOutlineQuiz className="mr-3" />
												Exams
											</Button>
										</Link>
									</div>
								</div>

								<div className="px-4 py-2">
									<h3 className="text-sm font-medium text-gray-500">
										Management
									</h3>
									<div className="space-y-1 mt-2">
										<Link href="/courses">
											<Button
												variant="ghost"
												className="w-full justify-start text-base font-normal h-11 hover:bg-gray-100"
											>
												<BsBook className="mr-3" />
												Courses
											</Button>
										</Link>
										<Link href="/students">
											<Button
												variant="ghost"
												className="w-full justify-start text-base font-normal h-11 hover:bg-gray-100"
											>
												<BsPeople className="mr-3" />
												Students
											</Button>
										</Link>
										<Link href="/results">
											<Button
												variant="ghost"
												className="w-full justify-start text-base font-normal h-11 hover:bg-gray-100"
											>
												<BsCardChecklist className="mr-3" />
												Results
											</Button>
										</Link>
									</div>
								</div>

								<div className="px-4 py-2">
									<h3 className="text-sm font-medium text-gray-500">
										Tools
									</h3>
									<div className="space-y-1 mt-2">
										<Link href="/analytics">
											<Button
												variant="ghost"
												className="w-full justify-start text-base font-normal h-11 hover:bg-gray-100"
											>
												<BsGraphUp className="mr-3" />
												Analytics
											</Button>
										</Link>
										<Link href="/settings">
											<Button
												variant="ghost"
												className="w-full justify-start text-base font-normal h-11 hover:bg-gray-100"
											>
												<BsGear className="mr-3" />
												Settings
											</Button>
										</Link>
									</div>
								</div>

								<div className="mt-auto border-t px-4 py-3">
									<Button
										variant="ghost"
										onClick={handleSignOut}
										className="w-full justify-start text-base font-normal h-11 hover:bg-gray-100 text-red-600 hover:text-red-700"
									>
										<BiLogOut className="mr-3" />
										Sign Out
									</Button>
								</div>
							</div>
						</SheetContent>
					</Sheet>
				</div>
			</SignedIn>
			<Toaster />
		</>
	);
}
