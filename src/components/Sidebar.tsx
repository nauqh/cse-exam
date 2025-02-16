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
			className={`w-full justify-start text-base font-normal h-11 ${className}`}
		>
			<span className="mr-0 md:mr-3">{icon}</span>
			<span className="hidden md:inline">{label}</span>
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
			duration: 3000,
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
		<div className="h-screen w-16 md:w-[20vw] border-r bg-white flex flex-col">
			<div className="p-2 md:p-4 border-b">
				<div className="flex items-center md:gap-3">
					<div className="w-full md:w-auto flex justify-center md:justify-start">
						<Link href={`/profile`}>
							<Avatar>
								<AvatarImage src={user?.imageUrl} />
								<AvatarFallback>CN</AvatarFallback>
							</Avatar>
						</Link>
					</div>
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
											<BsClockHistory className="h-4 w-4 mr-4" />
											<span>Exam history</span>
										</div>
									</SelectItem>
									<SelectItem value="settings">
										<div className="flex items-center">
											<BsGearFill className="h-4 w-4 mr-4" />
											<span>Profile settings</span>
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

				<div className="mt-auto border-t px-2 md:px-4 py-3">
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
