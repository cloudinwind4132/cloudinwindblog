import type { TimelineItem } from "../types/timeline";

// 手动编辑此文件，添加你的个人时间线条目
// 支持 type: "education" | "work" | "project" | "achievement"
// 不填 endDate 表示"进行中"，节点会有绿色脉冲动画

export const timelineData: TimelineItem[] = [
	{
		id: "example-1",
		title: "示例：当前工作/学习",
		description: "这是一条进行中的示例条目，没有 endDate 会显示为'进行中'状态并有脉冲动画。",
		type: "work",
		startDate: "2024-01-01",
		organization: "示例公司",
		position: "软件工程师",
		skills: ["TypeScript", "React", "Node.js"],
		achievements: ["完成了 XX 项目", "获得了 XX 认证"],
		icon: "material-symbols:work",
		color: "#059669",
		featured: true,
	},
	{
		id: "example-2",
		title: "示例：已完成的项目",
		description: "这是一条已完成的示例条目，有明确的起止日期。",
		type: "project",
		startDate: "2023-06-01",
		endDate: "2023-12-31",
		skills: ["Astro", "Tailwind CSS", "Svelte"],
		achievements: ["完成博客搭建", "上线个人主页"],
		links: [
			{ name: "GitHub", url: "https://github.com", type: "project" },
			{ name: "演示地址", url: "https://example.com", type: "website" },
		],
		icon: "material-symbols:code",
		color: "#7C3AED",
		featured: true,
	},
	{
		id: "example-3",
		title: "示例：教育经历",
		description: "教育相关的经历条目。",
		type: "education",
		startDate: "2020-09-01",
		endDate: "2024-06-30",
		location: "北京",
		organization: "示例大学",
		skills: ["计算机科学", "软件工程"],
		achievements: ["获得学士学位", "GPA 3.8/4.0"],
		icon: "material-symbols:school",
		color: "#2563EB",
	},
	{
		id: "example-4",
		title: "示例：个人成就",
		description: "个人成就或里程碑条目。",
		type: "achievement",
		startDate: "2023-10-15",
		organization: "某竞赛",
		skills: ["算法", "数据结构"],
		achievements: ["获得三等奖", "提升了编程能力"],
		icon: "material-symbols:emoji-events",
		color: "#EA580C",
	},
];
