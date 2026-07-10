import type { Message } from '$lib/types';

/** 格式化时间戳为可读字符串 */
export function formatTimestamp(date: Date): string {
	const hours = date.getHours().toString().padStart(2, '0');
	const minutes = date.getMinutes().toString().padStart(2, '0');
	return `${hours}:${minutes}`;
}

/** 验证是否为合法国际电话号码格式 */
export function validatePhoneNumber(phone: string): boolean {
	// 支持国际格式：+国家码-号码 或 纯数字
	const pattern = /^\+?[\d\s\-()]{7,20}$/;
	return pattern.test(phone);
}

/** 生成紧急预警消息 */
export function generateAlertMessage(): Message {
	const alerts = [
		'⚠️ 紧急预警：预计未来3小时内将有强降雨，请注意防范城市内涝和山洪灾害。',
		'🚨 地震预警：检测到轻微震感，震中距您约120公里，请保持警惕。',
		'🔥 火警提醒：附近区域发生火灾，请远离危险区域，听从消防人员指挥。',
		'🌪️ 台风预警：台风将于今晚登陆，请减少外出并做好防风准备。',
		'❄️ 寒潮预警：未来24小时气温骤降10°C以上，请注意保暖防冻。'
	];
	const randomAlert = alerts[Math.floor(Math.random() * alerts.length)];

	return {
		id: crypto.randomUUID(),
		text: randomAlert,
		sender: 'system',
		timestamp: new Date(),
		type: 'alert'
	};
}

/** 创建用户发送的消息 */
export function createUserMessage(text: string): Message {
	return {
		id: crypto.randomUUID(),
		text,
		sender: 'user',
		timestamp: new Date(),
		type: 'sms'
	};
}

/** 创建欢迎消息 */
export function createWelcomeMessage(): Message {
	return {
		id: crypto.randomUUID(),
		text: '欢迎使用短信模拟器！点击手机上方红色按钮模拟接收短信，也可以手动发送消息进行测试。',
		sender: 'system',
		timestamp: new Date(),
		type: 'info'
	};
}
