import type { Project } from "@/types/projects";

// 手动编辑此文件，添加你的项目
// category: "web" | "mobile" | "desktop" | "other"
// status: "completed" | "in-progress" | "planned"
// showImage: false 可隐藏图片区域

export const projectsData: Project[] = [
	{
		id: "firefly-blog",
		title: "Firefly 博客",
		description: "基于 Astro 7 + Svelte 5 的个人博客，支持多语言、多种布局模式、丰富的 Markdown 扩展语法。",
		image: "/assets/images/firefly-banner.webp",
		category: "web",
		techStack: ["Astro", "Svelte", "TypeScript", "Tailwind CSS"],
		status: "completed",
		sourceCode: "https://github.com/cloudinwind4132/cloudinwindblog",
		liveDemo: "https://cloudinwind111.top",
		startDate: "2025-01-01",
		featured: true,
	},
	{
		id: "example-web",
		title: "示例 Web 项目",
		description: "这是一个 Web 应用的示例项目，展示了完整的前后端开发流程。",
		category: "web",
		techStack: ["React", "Node.js", "PostgreSQL"],
		status: "in-progress",
		startDate: "2024-06-01",
		sourceCode: "https://github.com",
	},
	{
		id: "example-mobile",
		title: "示例移动应用",
		description: "一款跨平台移动应用，支持 iOS 和 Android。",
		category: "mobile",
		techStack: ["Flutter", "Dart", "Firebase"],
		status: "completed",
		startDate: "2023-03-01",
		endDate: "2023-09-30",
		liveDemo: "https://example.com",
	},
	{
		id: "example-desktop",
		title: "示例桌面工具",
		description: "基于 Electron 的跨平台桌面工具。",
		category: "desktop",
		techStack: ["Electron", "Vue", "Node.js"],
		status: "completed",
		startDate: "2023-01-01",
		endDate: "2023-06-30",
		sourceCode: "https://github.com",
	},
];

export function getProjectStats() {
	const total = projectsData.length;
	const completed = projectsData.filter((p) => p.status === "completed").length;
	const inProgress = projectsData.filter((p) => p.status === "in-progress").length;
	const planned = projectsData.filter((p) => p.status === "planned").length;
	return { total, byStatus: { completed, inProgress, planned } };
}

export function getFeaturedProjects() {
	return projectsData.filter((p) => p.featured);
}
