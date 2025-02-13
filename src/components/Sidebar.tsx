"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useUser, useClerk } from "@clerk/nextjs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
	BsBook,
	BsCardChecklist,
	BsPeople,
	BsHouseDoor,
	BsGraphUp,
	BsGear,
	BsPerson,
	BsClockHistory,
	BsGearFill,
} from "react-icons/bs";
import { MdOutlineQuiz } from "react-icons/md";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { BiLogOut } from "react-icons/bi";
import { useToast } from "@/hooks/use-toast";
import { Toaster } from "@/components/ui/toaster";

interface SidebarProps {
	currentView?: "history" | "settings";
	setCurrentView?: (view: "history" | "settings") => void;
}

export default function Sidebar({ currentView, setCurrentView }: SidebarProps) {
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

	const viewIcons = {
		history: <BsClockHistory className="h-4 w-4" />,
		settings: <BsGearFill className="h-4 w-4" />,
	};

	return (
		<div className="h-screen w-16 md:w-[20vw] border-r bg-white flex flex-col">
			<div className="p-2 md:p-4 border-b">
				<div className="flex items-center gap-3">
					<Link href={`/profile`}>
						<Avatar>
							<AvatarImage src={user?.imageUrl} />
							<AvatarFallback>CN</AvatarFallback>
						</Avatar>
					</Link>
					<div className="hidden md:block text-sm">
						<p className="font-medium">{user?.fullName}</p>
						<p className="text-gray-500 text-xs">
							{user?.primaryEmailAddress?.emailAddress}
						</p>
					</div>
				</div>
			</div>

			<div className="flex flex-col flex-1 overflow-y-auto">
				<div className="px-2 md:px-4 py-4 border-b">
					<div className="md:hidden flex items-center justify-center">
						<BsClockHistory className="h-4 w-4 text-gray-500" />
					</div>
					{setCurrentView && (
						<div className="hidden md:block">
							<Select
								value={currentView}
								onValueChange={(
									value: "history" | "settings"
								) => setCurrentView(value)}
							>
								<SelectTrigger className="w-full h-11 focus:ring-0 focus:ring-offset-0">
									<SelectValue
										placeholder={
											<div className="flex items-center">
												{
													viewIcons[
														currentView || "history"
													]
												}
												<span className="ml-2">
													{currentView === "history"
														? "Exam History"
														: "Profile Settings"}
												</span>
											</div>
										}
									/>
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="history">
										<div className="flex items-center">
											<BsClockHistory className="h-4 w-4 mr-2" />
											<span>Exam History</span>
										</div>
									</SelectItem>
									<SelectItem value="settings">
										<div className="flex items-center">
											<BsGearFill className="h-4 w-4 mr-2" />
											<span>Profile Settings</span>
										</div>
									</SelectItem>
								</SelectContent>
							</Select>
						</div>
					)}
				</div>

				<div className="px-2 md:px-4 py-2">
					<h3 className="hidden md:block text-sm font-medium text-gray-500">
						Main
					</h3>
					<div className="space-y-1 mt-2">
						<Link href="/">
							<Button
								variant="ghost"
								className="w-full justify-start text-base font-normal h-11"
							>
								<BsHouseDoor className="mr-0 md:mr-3" />
								<span className="hidden md:inline">Home</span>
							</Button>
						</Link>
						<Link href="/profile">
							<Button
								variant="ghost"
								className="w-full justify-start text-base font-normal h-11"
							>
								<BsPerson className="mr-0 md:mr-3" />
								<span className="hidden md:inline">
									Profile
								</span>
							</Button>
						</Link>
						<Link href="/exams">
							<Button
								variant="ghost"
								className="w-full justify-start text-base font-normal h-11"
							>
								<MdOutlineQuiz className="mr-0 md:mr-3" />
								<span className="hidden md:inline">Exams</span>
							</Button>
						</Link>
					</div>
				</div>

				<div className="px-2 md:px-4 py-2">
					<h3 className="hidden md:block text-sm font-medium text-gray-500">
						Management
					</h3>
					<div className="space-y-1 mt-2">
						<Link href="/courses">
							<Button
								variant="ghost"
								className="w-full justify-start text-base font-normal h-11"
							>
								<BsBook className="mr-0 md:mr-3" />
								<span className="hidden md:inline">
									Courses
								</span>
							</Button>
						</Link>
						<Link href="/students">
							<Button
								variant="ghost"
								className="w-full justify-start text-base font-normal h-11"
							>
								<BsPeople className="mr-0 md:mr-3" />
								<span className="hidden md:inline">
									Students
								</span>
							</Button>
						</Link>
						<Link href="/results">
							<Button
								variant="ghost"
								className="w-full justify-start text-base font-normal h-11"
							>
								<BsCardChecklist className="mr-0 md:mr-3" />
								<span className="hidden md:inline">
									Results
								</span>
							</Button>
						</Link>
					</div>
				</div>

				<div className="px-2 md:px-4 py-2">
					<h3 className="hidden md:block text-sm font-medium text-gray-500">
						Tools
					</h3>
					<div className="space-y-1 mt-2">
						<Link href="/analytics">
							<Button
								variant="ghost"
								className="w-full justify-start text-base font-normal h-11"
							>
								<BsGraphUp className="mr-0 md:mr-3" />
								<span className="hidden md:inline">
									Analytics
								</span>
							</Button>
						</Link>
						<Link href="/settings">
							<Button
								variant="ghost"
								className="w-full justify-start text-base font-normal h-11"
							>
								<BsGear className="mr-0 md:mr-3" />
								<span className="hidden md:inline">
									Settings
								</span>
							</Button>
						</Link>
					</div>
				</div>

				<div className="mt-auto border-t px-2 md:px-4 py-3">
					<Button
						variant="ghost"
						onClick={handleSignOut}
						className="w-full justify-start text-base font-normal h-11 hover:bg-gray-100 text-red-600 hover:text-red-700"
					>
						<BiLogOut className="mr-0 md:mr-3" />
						<span className="hidden md:inline">Sign Out</span>
					</Button>
				</div>
				<Toaster />
			</div>
		</div>
	);
}
