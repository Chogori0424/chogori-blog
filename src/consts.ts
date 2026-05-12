// Global site data shared by pages, layouts, RSS, and category views.

export const SITE_TITLE = 'Chogori Blog';
export const SITE_DESCRIPTION = 'Chogori Lee 的个人技术博客';
export const SITE_URL = 'https://chogori.xyz';
export const AUTHOR_NAME = 'Chogori Lee';
export const AUTHOR_AVATAR = '/images/avatar.webp';
export const SITE_IMAGE = AUTHOR_AVATAR;

export const BLOG_CATEGORIES = [
	{
		name: '网络代理',
		slug: 'network-proxy',
		description: 'Surge、Quantumult X、代理规则维护与网络调试记录。',
	},
	{
		name: '工程制造',
		slug: 'engineering-manufacturing',
		description: 'Siemens NX/UG、模具工艺、制造现场与工程经验沉淀。',
	},
	{
		name: '音频设备',
		slug: 'audio-gear',
		description: '耳机、播放器、桌面链路和个人听感记录。',
	},
	{
		name: '个人日志',
		slug: 'personal-log',
		description: '技术折腾、写作复盘和长期输出计划。',
	},
] as const;

export type BlogCategoryName = (typeof BLOG_CATEGORIES)[number]['name'];

export function getCategoryByName(name: string) {
	return BLOG_CATEGORIES.find((category) => category.name === name);
}
