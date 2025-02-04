export default function ProblemLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return <main className="flex-1 overflow-hidden">{children}</main>;
}
