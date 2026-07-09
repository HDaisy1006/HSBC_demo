/** SMS 消息类型 */
export interface Message {
	id: string;
	text: string;
	sender: 'user' | 'system';
	timestamp: Date;
	type: 'sms' | 'alert' | 'info';
}

/** 高亮国家配置 */
export interface CountryHighlight {
	name: string;
	color: string;
	label: string;
}