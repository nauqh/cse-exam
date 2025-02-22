"use client";

import { useState, useRef } from "react";
import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import Link from "next/link";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useUser } from "@clerk/nextjs";
import { Loader2, X } from "lucide-react";
import ZoomableImage from "@/components/ZoomableImage";

export default function HelpPage() {
	const { toast } = useToast();
	const { user } = useUser();
	const fileInputRef = useRef<HTMLInputElement>(null);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [images, setImages] = useState<File[]>([]);
	const [previews, setPreviews] = useState<string[]>([]);

	const [formData, setFormData] = useState({
		category: "",
		subject: "",
		description: "",
	});

	const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.files) {
			const files = Array.from(e.target.files);
			// if (images.length + files.length > 4) {
			// 	toast({
			// 		title: "Too many files",
			// 		description: "Maximum 4 files allowed",
			// 		variant: "destructive",
			// 	});
			// 	return;
			// }

			setImages((prev) => [...prev, ...files]);
			const newPreviews = files.map((file) => URL.createObjectURL(file));
			setPreviews((prev) => [...prev, ...newPreviews]);
		}
	};

	const removeImage = (index: number) => {
		setImages((prev) => prev.filter((_, i) => i !== index));
		setPreviews((prev) => {
			const newPreviews = prev.filter((_, i) => i !== index);
			URL.revokeObjectURL(prev[index]);
			return newPreviews;
		});
		// Reset file input
		if (fileInputRef.current) {
			fileInputRef.current.value = "";
		}
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsSubmitting(true);

		try {
			const imageBase64Promises = images.map(
				(image) =>
					new Promise<string>((resolve, reject) => {
						const reader = new FileReader();
						reader.onload = () => resolve(reader.result as string);
						reader.onerror = reject;
						reader.readAsDataURL(image);
					})
			);

			const imageBase64Array = await Promise.all(imageBase64Promises);

			const jsonData = {
				category: formData.category,
				subject: formData.subject,
				description: formData.description,
				userId: user?.id || "",
				images: imageBase64Array,
			};

			const response = await fetch(
				"https://cspyclient.up.railway.app/help",
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify(jsonData),
				}
			);

			if (!response.ok) {
				throw new Error("Network response was not ok");
			}

			toast({
				title: "Report Submitted",
				description: "We'll get back to you as soon as possible.",
			});

			// Reset form and images
			setFormData({
				category: "",
				subject: "",
				description: "",
			});
			setImages([]);
			setPreviews((prev) => {
				prev.forEach((url) => URL.revokeObjectURL(url));
				return [];
			});
			// Reset file input
			if (fileInputRef.current) {
				fileInputRef.current.value = "";
			}
		} catch (error) {
			toast({
				title: "Error",
				description: "Failed to submit report. Please try again.",
				variant: "destructive",
			});
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<>
			<Navigation />
			<main className="container mx-auto px-4 py-8 max-w-3xl">
				<div className="space-y-6">
					<div className="space-y-2">
						<h1 className="text-2xl font-bold tracking-tight">
							Help Center
						</h1>
						<p className="text-gray-500">
							Having issues? Fill out the form below and we'll
							help you resolve it. Alternatively, you can post a
							question on our{" "}
							<Link
								href="https://discord.com/channels/957854915194126336/1081063200377806899"
								className="text-blue-500 hover:underline"
								target="_blank"
								rel="noopener noreferrer"
							>
								Discord forum
							</Link>
							.
						</p>
					</div>

					<div className="bg-white rounded-lg border p-4 space-y-3 shadow-md">
						<h2 className="font-semibold">
							Who Should Use This Form?
						</h2>
						<ul className="list-disc list-inside space-y-2 text-gray-600">
							<li>
								Students experiencing technical difficulties
								during exams
							</li>
							<li>
								Users having trouble with account access or
								settings
							</li>
							<li>
								Students with questions about exam rules or
								procedures
							</li>
							<li>
								Users who need immediate assistance with
								platform features
							</li>
						</ul>
					</div>

					<div className="bg-white rounded-lg border p-6 space-y-6 shadow-md">
						<form onSubmit={handleSubmit} className="space-y-4">
							<div className="space-y-2">
								<label className="text-sm font-medium">
									Issue Category
								</label>
								<Select
									value={formData.category}
									onValueChange={(value) =>
										setFormData({
											...formData,
											category: value,
										})
									}
									required
								>
									<SelectTrigger>
										<SelectValue placeholder="Select category" />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="technical">
											Technical Issue
										</SelectItem>
										<SelectItem value="exam">
											Exam Related
										</SelectItem>
										<SelectItem value="account">
											Account Problem
										</SelectItem>
										<SelectItem value="billing">
											Billing Issue
										</SelectItem>
										<SelectItem value="other">
											Other
										</SelectItem>
									</SelectContent>
								</Select>
							</div>

							<div className="space-y-2">
								<label className="text-sm font-medium">
									Subject
								</label>
								<Input
									placeholder="Brief description of the issue"
									value={formData.subject}
									onChange={(e) =>
										setFormData({
											...formData,
											subject: e.target.value,
										})
									}
									required
								/>
							</div>

							<div className="space-y-2">
								<label className="text-sm font-medium">
									Description
								</label>
								<Textarea
									placeholder="Please provide as much detail as possible..."
									className="min-h-[150px]"
									value={formData.description}
									onChange={(e) =>
										setFormData({
											...formData,
											description: e.target.value,
										})
									}
									required
								/>
							</div>

							<div className="space-y-2">
								<div className="flex items-center justify-between">
									<label className="text-sm font-medium">
										Attach Images (Optional)
									</label>
									<span className="text-sm text-gray-500">
										{images.length}/4 files
									</span>
								</div>
								<Input
									ref={fileInputRef}
									type="file"
									accept="image/*"
									multiple
									onChange={handleImageUpload}
									className="cursor-pointer"
									disabled={images.length >= 4}
								/>
								{previews.length > 0 && (
									<div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
										{previews.map((preview, index) => (
											<div
												key={index}
												className="relative group"
											>
												<ZoomableImage src={preview} />
												<button
													type="button"
													onClick={() =>
														removeImage(index)
													}
													className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
												>
													<X className="h-4 w-4" />
												</button>
												<div className="text-sm text-gray-500 mt-1">
													{images[index].name} (
													{Math.round(
														images[index].size /
															1024
													)}
													KB)
												</div>
											</div>
										))}
									</div>
								)}
							</div>

							<div className="pt-4">
								<Button
									type="submit"
									className="w-full sm:w-auto"
									disabled={isSubmitting}
								>
									{isSubmitting && (
										<Loader2 className="mr-2 h-4 w-4 animate-spin" />
									)}
									{isSubmitting ? "Submitting..." : "Submit"}
								</Button>
							</div>
						</form>

						<div className="border-t pt-6">
							<h3 className="font-medium mb-2">
								Contact Information
							</h3>
							<div className="text-sm text-gray-500 space-y-1">
								<p>Email: apply@coderschool.vn</p>
								<p>Phone: 085 469 0015</p>
								<p>
									Hours: Monday - Friday, 9:00 AM - 5:00 PM
									EST
								</p>
							</div>
						</div>
					</div>
				</div>
				<div className="text-center space-y-4 m-12">
					<p>Do you need more help?</p>
					<Button
						variant="outline"
						className="px-6 rounded-full border-primary text-primary hover:bg-primary/10"
						onClick={() =>
							(window.location.href =
								"mailto:staff@coderschool.vn")
						}
					>
						Contact Coderschool Staff
					</Button>
				</div>
			</main>
		</>
	);
}
