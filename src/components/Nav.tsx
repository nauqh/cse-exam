import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Nav() {
	return (
		<nav className="flex items-center justify-between bg-black text-white p-4 shadow-sm">
			<div className="text-xl font-bold">
				<Link href="/">Exam Platform</Link>
			</div>
			<div className="flex gap-4">
				<Button variant="ghost">
					<Link href="/problem">Problems</Link>
				</Button>
				<Button variant="ghost">
					<Link href="/">Submission</Link>
				</Button>
				<Button variant="ghost">
					<Link href="/">Profile</Link>
				</Button>
			</div>
		</nav>
	);
}
