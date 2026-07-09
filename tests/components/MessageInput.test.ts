import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/svelte';
import MessageInput from '../../src/lib/components/MessageInput.svelte';

describe('MessageInput', () => {
	it('should render an input field and send button', () => {
		const onSend = vi.fn();
		render(MessageInput, { props: { onSend } });

		expect(screen.getByPlaceholderText('输入消息...')).toBeTruthy();
		expect(screen.getByRole('button', { name: '发送消息' })).toBeTruthy();
	});

	it('should disable send button when input is empty', () => {
		const onSend = vi.fn();
		render(MessageInput, { props: { onSend } });

		const button = screen.getByRole('button', { name: '发送消息' });
		expect((button as HTMLButtonElement).disabled).toBe(true);
	});

	it('should call onSend with input text when button is clicked', async () => {
		const onSend = vi.fn();
		render(MessageInput, { props: { onSend } });

		const input = screen.getByPlaceholderText('输入消息...');
		await fireEvent.input(input, { target: { value: 'Hello!' } });

		const button = screen.getByRole('button', { name: '发送消息' });
		await fireEvent.click(button);

		expect(onSend).toHaveBeenCalledWith('Hello!');
	});

	it('should clear input after sending', async () => {
		const onSend = vi.fn();
		render(MessageInput, { props: { onSend } });

		const input = screen.getByPlaceholderText('输入消息...');
		await fireEvent.input(input, { target: { value: 'Test' } });
		await fireEvent.click(screen.getByRole('button', { name: '发送消息' }));

		expect((input as HTMLInputElement).value).toBe('');
	});

	it('should call onSend when Enter key is pressed', async () => {
		const onSend = vi.fn();
		render(MessageInput, { props: { onSend } });

		const input = screen.getByPlaceholderText('输入消息...');
		await fireEvent.input(input, { target: { value: 'Enter test' } });
		await fireEvent.keyDown(input, { key: 'Enter' });

		expect(onSend).toHaveBeenCalledWith('Enter test');
	});

	it('should not send empty message on Enter', async () => {
		const onSend = vi.fn();
		render(MessageInput, { props: { onSend } });

		const input = screen.getByPlaceholderText('输入消息...');
		await fireEvent.keyDown(input, { key: 'Enter' });

		expect(onSend).not.toHaveBeenCalled();
	});

	it('should trim whitespace from message', async () => {
		const onSend = vi.fn();
		render(MessageInput, { props: { onSend } });

		const input = screen.getByPlaceholderText('输入消息...');
		await fireEvent.input(input, { target: { value: '   trimmed   ' } });
		await fireEvent.click(screen.getByRole('button', { name: '发送消息' }));

		expect(onSend).toHaveBeenCalledWith('trimmed');
	});
});
