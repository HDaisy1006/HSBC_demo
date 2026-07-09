import type { CountryHighlight } from '$lib/types';

/**
 * 高亮国家列表 — 5 个国家，颜色区分度极高
 * 颜色方案：红 / 橙 / 绿 / 蓝 / 紫
 */
export const HIGHLIGHTED_COUNTRIES: CountryHighlight[] = [
	{ name: 'China', color: '#E53935', label: '中国' },
	{ name: 'India', color: '#FB8C00', label: '印度' },
	{ name: 'Brazil', color: '#43A047', label: '巴西' },
	{ name: 'United States of America', color: '#1E88E5', label: '美国' },
	{ name: 'Russia', color: '#8E24AA', label: '俄罗斯' }
];

/** 高亮国家名称集合 */
const HIGHLIGHTED_NAMES = new Set(HIGHLIGHTED_COUNTRIES.map((c) => c.name));

/** 世界 GeoJSON 数据地址 */
export const WORLD_GEOJSON_URL =
	'https://raw.githubusercontent.com/johan/world.geo.json/master/countries.geo.json';

// ============================================================
// 英文 → 中文 国家名称映射表（覆盖 GeoJSON 中的国家名称）
// ============================================================
const COUNTRY_NAME_ZH: Record<string, string> = {
	Afghanistan: '阿富汗',
	Albania: '阿尔巴尼亚',
	Algeria: '阿尔及利亚',
	Angola: '安哥拉',
	Antarctica: '南极洲',
	Argentina: '阿根廷',
	Armenia: '亚美尼亚',
	Australia: '澳大利亚',
	Austria: '奥地利',
	Azerbaijan: '阿塞拜疆',
	Bahamas: '巴哈马',
	Bangladesh: '孟加拉国',
	Belarus: '白俄罗斯',
	Belgium: '比利时',
	Belize: '伯利兹',
	Benin: '贝宁',
	Bhutan: '不丹',
	Bolivia: '玻利维亚',
	'Bosnia and Herzegovina': '波黑',
	Botswana: '博茨瓦纳',
	Brazil: '巴西',
	'Brunei Darussalam': '文莱',
	Bulgaria: '保加利亚',
	'Burkina Faso': '布基纳法索',
	Burundi: '布隆迪',
	Cambodia: '柬埔寨',
	Cameroon: '喀麦隆',
	Canada: '加拿大',
	'Central African Republic': '中非',
	Chad: '乍得',
	Chile: '智利',
	China: '中国',
	Colombia: '哥伦比亚',
	Congo: '刚果',
	'Costa Rica': '哥斯达黎加',
	Croatia: '克罗地亚',
	Cuba: '古巴',
	Cyprus: '塞浦路斯',
	'Czech Republic': '捷克',
	'Democratic Republic of the Congo': '刚果(金)',
	Denmark: '丹麦',
	Djibouti: '吉布提',
	'Dominican Republic': '多米尼加',
	Ecuador: '厄瓜多尔',
	Egypt: '埃及',
	'El Salvador': '萨尔瓦多',
	Eritrea: '厄立特里亚',
	Estonia: '爱沙尼亚',
	Ethiopia: '埃塞俄比亚',
	'Falkland Islands': '福克兰群岛',
	Fiji: '斐济',
	Finland: '芬兰',
	France: '法国',
	Gabon: '加蓬',
	Gambia: '冈比亚',
	Georgia: '格鲁吉亚',
	Germany: '德国',
	Ghana: '加纳',
	Greece: '希腊',
	Greenland: '格陵兰',
	Guatemala: '危地马拉',
	Guinea: '几内亚',
	'Guinea-Bissau': '几内亚比绍',
	Guyana: '圭亚那',
	Haiti: '海地',
	Honduras: '洪都拉斯',
	Hungary: '匈牙利',
	Iceland: '冰岛',
	India: '印度',
	Indonesia: '印度尼西亚',
	Iran: '伊朗',
	Iraq: '伊拉克',
	Ireland: '爱尔兰',
	Israel: '以色列',
	Italy: '意大利',
	'Côte d\'Ivoire': '科特迪瓦',
	'Ivory Coast': '科特迪瓦',
	Jamaica: '牙买加',
	Japan: '日本',
	Jordan: '约旦',
	Kazakhstan: '哈萨克斯坦',
	Kenya: '肯尼亚',
	'Korea, Republic of': '韩国',
	'South Korea': '韩国',
	Kosovo: '科索沃',
	Kuwait: '科威特',
	Kyrgyzstan: '吉尔吉斯斯坦',
	Laos: '老挝',
	Latvia: '拉脱维亚',
	Lebanon: '黎巴嫩',
	Lesotho: '莱索托',
	Liberia: '利比里亚',
	Libya: '利比亚',
	Lithuania: '立陶宛',
	Luxembourg: '卢森堡',
	Madagascar: '马达加斯加',
	Malawi: '马拉维',
	Malaysia: '马来西亚',
	Mali: '马里',
	Mauritania: '毛里塔尼亚',
	Mexico: '墨西哥',
	Moldova: '摩尔多瓦',
	Mongolia: '蒙古',
	Montenegro: '黑山',
	Morocco: '摩洛哥',
	Mozambique: '莫桑比克',
	Myanmar: '缅甸',
	Namibia: '纳米比亚',
	Nepal: '尼泊尔',
	Netherlands: '荷兰',
	'New Zealand': '新西兰',
	Nicaragua: '尼加拉瓜',
	Niger: '尼日尔',
	Nigeria: '尼日利亚',
	'North Korea': '朝鲜',
	'Korea, Democratic People\'s Republic of': '朝鲜',
	Norway: '挪威',
	Oman: '阿曼',
	Pakistan: '巴基斯坦',
	Palestine: '巴勒斯坦',
	Panama: '巴拿马',
	'Papua New Guinea': '巴布亚新几内亚',
	Paraguay: '巴拉圭',
	Peru: '秘鲁',
	Philippines: '菲律宾',
	Poland: '波兰',
	Portugal: '葡萄牙',
	'Puerto Rico': '波多黎各',
	Qatar: '卡塔尔',
	Romania: '罗马尼亚',
	Russia: '俄罗斯',
	'Russian Federation': '俄罗斯',
	Rwanda: '卢旺达',
	'Saudi Arabia': '沙特阿拉伯',
	Senegal: '塞内加尔',
	Serbia: '塞尔维亚',
	'Sierra Leone': '塞拉利昂',
	Slovakia: '斯洛伐克',
	Slovenia: '斯洛文尼亚',
	Somalia: '索马里',
	'South Africa': '南非',
	'South Sudan': '南苏丹',
	Spain: '西班牙',
	'Sri Lanka': '斯里兰卡',
	Sudan: '苏丹',
	Suriname: '苏里南',
	Swaziland: '斯威士兰',
	Sweden: '瑞典',
	Switzerland: '瑞士',
	Syria: '叙利亚',
	Taiwan: '台湾',
	Tajikistan: '塔吉克斯坦',
	Tanzania: '坦桑尼亚',
	Thailand: '泰国',
	Timor: '东帝汶',
	'East Timor': '东帝汶',
	Togo: '多哥',
	'Trinidad and Tobago': '特立尼达和多巴哥',
	Tunisia: '突尼斯',
	Turkey: '土耳其',
	Turkmenistan: '土库曼斯坦',
	Uganda: '乌干达',
	Ukraine: '乌克兰',
	'United Arab Emirates': '阿联酋',
	'United Kingdom': '英国',
	'United States of America': '美国',
	'United States': '美国',
	Uruguay: '乌拉圭',
	Uzbekistan: '乌兹别克斯坦',
	Vanuatu: '瓦努阿图',
	Venezuela: '委内瑞拉',
	Vietnam: '越南',
	'Western Sahara': '西撒哈拉',
	Yemen: '也门',
	Zambia: '赞比亚',
	Zimbabwe: '津巴布韦'
};

/** 获取国家的显示名称：中文优先，未收录时回退英文 */
export function getCountryLabel(countryName: string): string {
	return COUNTRY_NAME_ZH[countryName] ?? countryName;
}

/** 获取国家对应的高亮颜色 */
export function getCountryColor(countryName: string): string {
	const country = HIGHLIGHTED_COUNTRIES.find((c) => c.name === countryName);
	return country?.color ?? '#e8e8e8';
}

/** 判断国家是否在高亮列表中 */
export function isHighlighted(countryName: string): boolean {
	return HIGHLIGHTED_NAMES.has(countryName);
}

/** 从 GeoJSON 中提取所有国家名称 */
export function extractCountryNames(geoJson: Record<string, unknown>): string[] {
	const data = geoJson as { features?: Array<{ properties: { name: string } }> };
	if (!data.features) return [];
	return data.features.map((f) => f.properties.name);
}
