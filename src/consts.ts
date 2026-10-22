// Global site data shared by pages, layouts, RSS, and category views.

export const SITE_TITLE = 'Chogori Blog';
export const SITE_DESCRIPTION = 'Chogori Lee 的个人技术博客';
export const SITE_TAGLINE = '把零散的折腾，整理成能长期复用的资料。';
export const SITE_URL = 'https://chogori.xyz';
export const AUTHOR_NAME = 'Chogori Lee';
export const AUTHOR_ROLE = '模具注塑工艺工程师';
export const AUTHOR_AVATAR = '/images/avatar.webp';
export const SITE_IMAGE = AUTHOR_AVATAR;
/**
 * 首页首屏背景照片（雪山实拍），放到 public/images/ 下后填路径，如 '/images/hero-mountain.webp'。
 * 留空时使用内置的雪山插画（自动区分浅色/暗色）。
 */
export const HERO_IMAGE = '/images/hero-mountain.webp';
/** 手机端竖图（可选），屏宽 760px 以下使用；留空则手机也用 HERO_IMAGE */
export const HERO_IMAGE_MOBILE = '/images/hero-mountain-mobile.webp';

/**
 * 分类定义。
 * - icon：对应 CategoryIcon.astro 里的图标名。
 * - gradient：分类图标、封面占位和标签使用的两段渐变色（浅色起点、深色终点）。
 */
export const BLOG_CATEGORIES = [
	{
		name: '家庭服务器',
		slug: 'home-server',
		description: 'SV7、Docker、媒体库自动化和远程访问的部署记录。',
		icon: 'server',
		gradient: ['#5ac8fa', '#0a84ff'],
	},
	{
		name: '网络代理',
		slug: 'network-proxy',
		description: 'Surge、Quantumult X、代理规则维护与网络调试记录。',
		icon: 'globe',
		gradient: ['#64d2ff', '#30b0c7'],
	},
	{
		name: '工程制造',
		slug: 'engineering-manufacturing',
		description: 'Siemens NX/UG、模具工艺、制造现场与工程经验沉淀。',
		icon: 'gear',
		gradient: ['#ffb340', '#ff8a00'],
	},
	{
		name: '音频设备',
		slug: 'audio-gear',
		description: '耳机、播放器、桌面链路和个人听感记录。',
		icon: 'headphones',
		gradient: ['#ff6482', '#ff2d55'],
	},
	{
		name: 'AI 工具',
		slug: 'ai-tools',
		description: 'NotebookLM、AI 编程、智能体学习和个人知识工作流。',
		icon: 'sparkle',
		gradient: ['#bf5af2', '#7d4df0'],
	},
	{
		name: '个人日志',
		slug: 'personal-log',
		description: '技术折腾、写作复盘、旅行和长期输出计划。',
		icon: 'notebook',
		gradient: ['#30d158', '#248a3d'],
	},
] as const;

export type BlogCategory = (typeof BLOG_CATEGORIES)[number];
export type BlogCategoryName = BlogCategory['name'];

export function getCategoryByName(name: string) {
	return BLOG_CATEGORIES.find((category) => category.name === name);
}

/** 中文按每分钟约 400 字估算阅读时长，至少 1 分钟。 */
export function getReadingMinutes(body = '') {
	const text = body
		.replace(/```[\s\S]*?```/g, ' ')
		.replace(/<[^>]+>/g, ' ')
		.replace(/[#>*_`\[\]()!-]/g, ' ');
	const cjk = (text.match(/[一-鿿]/g) ?? []).length;
	const words = (text.replace(/[一-鿿]/g, ' ').match(/[A-Za-z0-9]+/g) ?? []).length;
	return Math.max(1, Math.round(cjk / 400 + words / 200));
}
