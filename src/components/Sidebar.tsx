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
import { BiLogIn } from "react-icons/bi";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Toaster } from "@/components/ui/toaster";
import { ReactNode } from "react";

interface NavButtonProps {
	href: string;
	icon: ReactNode;
	label: string;
	onClick?: () => void;
	className?: string;
}

const NavButton = ({
	href,
	icon,
	label,
	onClick,
	className = "",
}: NavButtonProps) => (
	<Link href={href}>
		<Button
			variant="ghost"
			onClick={onClick}
			className={`w-full justify-start text-base font-normal h-11 
			px-2 sm:px-3 transition-all
			${className}`}
		>
			<span className="mr-0 sm:mr-2 md:mr-3 text-lg sm:text-base">
				{icon}
			</span>
			<span className="hidden sm:inline text-sm md:text-base">
				{label}
			</span>
		</Button>
	</Link>
);

const navItems = {
	main: [
		{ href: "/", icon: <BsHouseDoor />, label: "Home" },
		{ href: "/profile", icon: <BsPerson />, label: "Profile" },
		{ href: "/exams", icon: <MdOutlineQuiz />, label: "Exams" },
	],
	management: [
		{ href: "/courses", icon: <BsBook />, label: "Courses" },
		{ href: "/students", icon: <BsPeople />, label: "Students" },
		{ href: "/results", icon: <BsCardChecklist />, label: "Results" },
	],
	tools: [
		{ href: "/analytics", icon: <BsGraphUp />, label: "Analytics" },
		{ href: "/settings", icon: <BsGear />, label: "Settings" },
	],
};

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
		});
		signOut();
	};

	const viewIcons = {
		history: <BsClockHistory className="h-4 w-4" />,
		settings: <BsGearFill className="h-4 w-4" />,
	};

	const renderNavSection = (title: string, items: typeof navItems.main) => (
		<div className="px-2 md:px-4 py-2">
			<h3 className="hidden md:block text-sm font-medium text-gray-500">
				{title}
			</h3>
			<div className="space-y-1 mt-2">
				{items.map((item) => (
					<NavButton key={item.href} {...item} />
				))}
			</div>
		</div>
	);

	return (
		<div
			className="h-screen w-14 sm:w-48 md:w-56 lg:w-64 border-r bg-white flex flex-col 
		transition-all duration-300 ease-in-out"
		>
			<div className="p-2 sm:p-3 md:p-4 border-b">
				<div className="flex items-center gap-2 sm:gap-3">
					<div className="w-full sm:w-auto flex justify-center sm:justify-start">
						<Link href={`/profile`}>
							<Avatar className="h-8 w-8 sm:h-10 sm:w-10">
								<AvatarImage src={user?.imageUrl} />
								<AvatarFallback>CN</AvatarFallback>
							</Avatar>
						</Link>
					</div>
					<div className="hidden sm:block text-sm">
						<p className="font-medium text-sm md:text-base truncate max-w-[120px] md:max-w-[150px]">
							{user?.fullName}
						</p>
						<p className="text-gray-500 text-xs md:text-sm truncate max-w-[120px] md:max-w-[150px]">
							{user?.primaryEmailAddress?.emailAddress}
						</p>
					</div>
				</div>
			</div>

			<div className="flex flex-col flex-1 overflow-y-auto">
				<div className="px-2 sm:px-3 md:px-4 py-3 md:py-4 border-b">
					<div className="sm:hidden flex items-center justify-center">
						{viewIcons[currentView || "history"]}
					</div>
					{setCurrentView && (
						<div className="hidden sm:block">
							<Select
								value={currentView}
								onValueChange={(
									value: "history" | "settings"
								) => setCurrentView(value)}
							>
								<SelectTrigger className="w-full h-10 md:h-11 text-sm md:text-base focus:ring-0 focus:ring-offset-0">
									<SelectValue
										placeholder={
											<div className="flex items-center">
												{
													viewIcons[
														currentView || "history"
													]
												}
												<span className="ml-2 truncate">
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
											<BsClockHistory className="h-4 w-4 mr-2 md:mr-4" />
											<span className="text-sm md:text-base">
												Exam history
											</span>
										</div>
									</SelectItem>
									<SelectItem value="settings">
										<div className="flex items-center">
											<BsGearFill className="h-4 w-4 mr-2 md:mr-4" />
											<span className="text-sm md:text-base">
												Profile settings
											</span>
										</div>
									</SelectItem>
								</SelectContent>
							</Select>
						</div>
					)}
				</div>

				{renderNavSection("Main", navItems.main)}
				{renderNavSection("Management", navItems.management)}
				{renderNavSection("Tools", navItems.tools)}

				<div className="mt-auto border-t px-1 sm:px-2 md:px-4 py-2 md:py-3">
					<NavButton
						href=""
						icon={<BiLogIn />}
						label="Sign out"
						onClick={handleSignOut}
						className="hover:bg-gray-100 text-red-600 hover:text-red-700"
					/>
				</div>
				<Toaster />
			</div>
		</div>
	);
}
