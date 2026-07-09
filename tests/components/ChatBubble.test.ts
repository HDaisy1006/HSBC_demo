import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/svelte';
import ChatBubble from '../../src/lib/components/ChatBubble.svelte';
import type { Message } from '../../src/lib/types';

function createMessage(overrides: Partial<Message> = {}): Message {
	return {
		id: 'test-1',
		text: 'Hello, world!',
		sender: 'user',
		timestamp: new Date(2026, 6, 9, 14, 30),
		type: 'sms',
		...overrides
	};
}

describe('ChatBubble', () => {
	it('should render the message text', () => {
		const msg = createMessage({ text: '这是一条测试消息' });
		render(ChatBubble, { props: { message: msg } });
		expect(screen.getByText('这是一条测试消息')).toBeTruthy();
	});

	it('should render the formatted timestamp', () => {
		const msg = createMessage({ text: 'Test' });
		render(ChatBubble, { props: { message: msg } });
		expect(screen.getByText('14:30')).toBeTruthy();
	});

	it('should apply user class for user messages', () => {
		const msg = createMessage({ sender: 'user' });
		const { container } = render(ChatBubble, { props: { message: msg } });
		const wrapper = container.querySelector('.bubble-wrapper');
		expect(wrapper?.classList.contains('user')).toBe(true);
		expect(wrapper?.classList.contains('system')).toBe(false);
	});

	it('should apply system class for system messages', () => {
		const msg = createMessage({ sender: 'system' });
		const { container } = render(ChatBubble, { props: { message: msg } });
		const wrapper = container.querySelector('.bubble-wrapper');
		expect(wrapper?.classList.contains('system')).toBe(true);
		expect(wrapper?.classList.contains('user')).toBe(false);
	});

	it('should show alert badge for alert type messages', () => {
		const msg = createMessage({ sender: 'system', type: 'alert', text: '⚠️ 紧急通知' });
		render(ChatBubble, { props: { message: msg } });
		expect(screen.getByText('🚨 紧急通知')).toBeTruthy();
	});

	it('should not show alert badge for sms type messages', () => {
		const msg = createMessage({ sender: 'user', type: 'sms', text: '普通消息' });
		render(ChatBubble, { props: { message: msg } });
		expect(screen.queryByText('🚨 紧急通知')).toBeNull();
	});

	it('should render different bubble styles for user vs system', () => {
		const userMsg = createMessage({ sender: 'user', text: '用户消息' });
		const sysMsg = createMessage({ sender: 'system', text: '系统消息' });

		const { container: userContainer } = render(ChatBubble, {
			props: { message: userMsg }
		});
		const userBubble = userContainer.querySelector('.bubble');
		expect(userBubble?.classList.contains('user-bg')).toBe(true);

		const { container: sysContainer } = render(ChatBubble, {
			props: { message: sysMsg }
		});
		const sysBubble = sysContainer.querySelector('.bubble');
		expect(sysBubble?.classList.contains('sys-bg')).toBe(true);
	});
});
