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
	currentView: "history" | "settings";
	setCurrentView: (view: "history" | "settings") => void;
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
		signOut({ redirectUrl: "/auth/sign-in" });
	};

	return (
		<div className="h-screen w-[20vw] border-r bg-white flex flex-col">
			<div className="p-4 border-b">
				<div className="flex items-center gap-3">
					<Link href={`/profile`}>
						<Avatar>
							<AvatarImage src={user?.imageUrl} />
							<AvatarFallback>CN</AvatarFallback>
						</Avatar>
					</Link>
					<div className="text-sm">
						<p className="font-medium">{user?.fullName}</p>
						<p className="text-gray-500 text-xs">
							{user?.primaryEmailAddress?.emailAddress}
						</p>
					</div>
				</div>
			</div>

			<div className="flex flex-col flex-1 overflow-y-auto">
				<div className="px-4 py-4 border-b">
					<Select
						value={currentView}
						onValueChange={(value: "history" | "settings") =>
							setCurrentView(value)
						}
					>
						<SelectTrigger className="w-full focus:ring-0 focus:ring-offset-0">
							<SelectValue placeholder="Select view" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="history">
								Exam History
							</SelectItem>
							<SelectItem value="settings">
								Profile Settings
							</SelectItem>
						</SelectContent>
					</Select>
				</div>

				<div className="px-4 py-2">
					<h3 className="text-sm font-medium text-gray-500">Main</h3>
					<div className="space-y-1 mt-2">
						<Link href="/">
							<Button
								variant="ghost"
								className="w-full justify-start text-base font-normal h-11"
							>
								<BsHouseDoor className="mr-3" />
								Home
							</Button>
						</Link>
						<Link href="/profile">
							<Button
								variant="ghost"
								className="w-full justify-start text-base font-normal h-11"
							>
								<BsPerson className="mr-3" />
								Profile
							</Button>
						</Link>
						<Link href="/exams">
							<Button
								variant="ghost"
								className="w-full justify-start text-base font-normal h-11"
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
								className="w-full justify-start text-base font-normal h-11"
							>
								<BsBook className="mr-3" />
								Courses
							</Button>
						</Link>
						<Link href="/students">
							<Button
								variant="ghost"
								className="w-full justify-start text-base font-normal h-11"
							>
								<BsPeople className="mr-3" />
								Students
							</Button>
						</Link>
						<Link href="/results">
							<Button
								variant="ghost"
								className="w-full justify-start text-base font-normal h-11"
							>
								<BsCardChecklist className="mr-3" />
								Results
							</Button>
						</Link>
					</div>
				</div>

				<div className="px-4 py-2">
					<h3 className="text-sm font-medium text-gray-500">Tools</h3>
					<div className="space-y-1 mt-2">
						<Link href="/analytics">
							<Button
								variant="ghost"
								className="w-full justify-start text-base font-normal h-11"
							>
								<BsGraphUp className="mr-3" />
								Analytics
							</Button>
						</Link>
						<Link href="/settings">
							<Button
								variant="ghost"
								className="w-full justify-start text-base font-normal h-11"
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
				<Toaster />
			</div>
		</div>
	);
}
