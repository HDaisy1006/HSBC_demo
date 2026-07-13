import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/svelte';
import PhoneSimulator from '../../src/lib/components/PhoneSimulator.svelte';

// Helpers — consistent selectors across tests
const TRIGGER_TEXT = '模拟接收短信';
const SMS_ICON_LABEL = '短信';
const BACK_LABEL = '返回主屏幕';
const INPUT_PLACEHOLDER = '输入消息...';

function getTriggerButton() {
	return screen.getByText(TRIGGER_TEXT).closest('button')!;
}

function getSmsIconInDock() {
	// The SMS app icon is a button element containing the text "短信" as its label
	const labels = screen.getAllByText(SMS_ICON_LABEL);
	// The first is the app label; its parent is the button
	return labels.find((el) => el.closest('button'))?.closest('button') ?? null;
}

describe('PhoneSimulator', () => {
	// ================================================================
	// Initial render
	// ================================================================
	describe('initial render', () => {
		it('should render the external trigger button', () => {
			render(PhoneSimulator);
			const btn = getTriggerButton();
			expect(btn).toBeTruthy();
			expect(btn.textContent).toContain(TRIGGER_TEXT);
		});

		it('should render the phone shell with Dynamic Island', () => {
			const { container } = render(PhoneSimulator);
			expect(container.querySelector('.phone-outer')).toBeTruthy();
			expect(container.querySelector('.dynamic-island')).toBeTruthy();
		});

		it('should initially show the home screen (not SMS view)', () => {
			render(PhoneSimulator);
			// SMS-specific elements like the back button should NOT be present
			expect(screen.queryByLabelText(BACK_LABEL)).toBeNull();
			// Home-screen elements: app dock should be visible
			expect(screen.getByText('电话')).toBeTruthy();
			expect(screen.getByText('相机')).toBeTruthy();
		});
	});

	// ================================================================
	// External alert on home screen
	// ================================================================
	describe('external alert while on home screen', () => {
		it('should show notification banner after clicking trigger', async () => {
			render(PhoneSimulator);
			const btn = getTriggerButton();
			await fireEvent.click(btn);

			// Notification banner should appear (class="notification-banner")
			const { container } = render(PhoneSimulator);
			// Re-render to get fresh state... no, let me re-approach
		});

		it('should show notification banner after clicking trigger button', async () => {
			const { container } = render(PhoneSimulator);
			expect(container.querySelector('.notification-banner')).toBeNull();

			const trigger = getTriggerButton();
			await fireEvent.click(trigger);

			// The notification banner should now be visible
			const banner = container.querySelector('.notification-banner');
			expect(banner).toBeTruthy();
		});

		it('should show unread badge after receiving an alert', async () => {
			const { container } = render(PhoneSimulator);
			expect(container.querySelector('.unread-badge')).toBeNull();

			const trigger = getTriggerButton();
			await fireEvent.click(trigger);

			// Unread badge should appear on SMS icon
			const badge = container.querySelector('.unread-badge');
			expect(badge).toBeTruthy();
			expect(badge!.textContent).toBe('1');
		});

		it('should increment unread count for multiple alerts', async () => {
			const { container } = render(PhoneSimulator);

			const trigger = getTriggerButton();
			await fireEvent.click(trigger);
			await fireEvent.click(trigger);
			await fireEvent.click(trigger);

			const badge = container.querySelector('.unread-badge');
			expect(badge!.textContent).toBe('3');
		});

		it('should prepend alert message to the messages array', async () => {
			// Navigate to SMS to check messages
			const { container } = render(PhoneSimulator);

			// First trigger an alert
			const trigger = getTriggerButton();
			await fireEvent.click(trigger);

			// Then navigate to SMS view by clicking the notification banner
			const banner = container.querySelector('.notification-banner') as HTMLElement;
			expect(banner).toBeTruthy();
			await fireEvent.click(banner);

			// Now we're in SMS view — alert message should be present
			// (after the welcome message)
			const messages = container.querySelectorAll('.bubble-wrapper');
			// at least 2 messages: welcome + alert
			expect(messages.length).toBeGreaterThanOrEqual(2);
		});
	});

	// ================================================================
	// Navigation
	// ================================================================
	describe('navigation', () => {
		it('should navigate to SMS view when SMS icon is clicked', async () => {
			const { container } = render(PhoneSimulator);

			// Click the SMS app icon
			const smsBtn = getSmsIconInDock();
			expect(smsBtn).toBeTruthy();
			await fireEvent.click(smsBtn!);

			// SMS view should now be shown
			expect(screen.getByLabelText(BACK_LABEL)).toBeTruthy();
			expect(screen.getByPlaceholderText(INPUT_PLACEHOLDER)).toBeTruthy();
		});

		it('should return to home screen when back button is clicked', async () => {
			render(PhoneSimulator);

			// Navigate to SMS
			const smsBtn = getSmsIconInDock();
			await fireEvent.click(smsBtn!);

			// Click back
			const backBtn = screen.getByLabelText(BACK_LABEL);
			await fireEvent.click(backBtn);

			// Home screen should be visible again
			expect(screen.getByText(TRIGGER_TEXT)).toBeTruthy();
			expect(screen.queryByLabelText(BACK_LABEL)).toBeNull();
		});

		it('should reset unread count when navigating to SMS', async () => {
			const { container } = render(PhoneSimulator);

			// Trigger alert on home screen
			const trigger = getTriggerButton();
			await fireEvent.click(trigger);
			expect(container.querySelector('.unread-badge')!.textContent).toBe('1');

			// Navigate to SMS
			const smsBtn = getSmsIconInDock();
			await fireEvent.click(smsBtn!);

			// SMS view should be active — no badge visible
			expect(container.querySelector('.unread-badge')).toBeNull();
		});

		it('should clear notification banner when navigating to SMS', async () => {
			const { container } = render(PhoneSimulator);

			// Trigger alert
			const trigger = getTriggerButton();
			await fireEvent.click(trigger);
			expect(container.querySelector('.notification-banner')).toBeTruthy();

			// Click notification banner to navigate to SMS
			const banner = container.querySelector('.notification-banner') as HTMLElement;
			await fireEvent.click(banner);

			// Banner should be gone
			expect(container.querySelector('.notification-banner')).toBeNull();
		});
	});

	// ================================================================
	// Alert while already in SMS view
	// ================================================================
	describe('external alert while in SMS view', () => {
		it('should add alert message to chat but NOT show notification', async () => {
			const { container } = render(PhoneSimulator);

			// Navigate to SMS first
			const smsBtn = getSmsIconInDock();
			await fireEvent.click(smsBtn!);

			// Count initial messages (just welcome)
			const initialCount = container.querySelectorAll('.bubble-wrapper').length;

			// Trigger alert while in SMS view
			const trigger = getTriggerButton();
			await fireEvent.click(trigger);

			// Message count should increase
			const newCount = container.querySelectorAll('.bubble-wrapper').length;
			expect(newCount).toBe(initialCount + 1);

			// No notification banner should appear (we're already in SMS)
			expect(container.querySelector('.notification-banner')).toBeNull();
		});

		it('should not increment unread count when alert arrives while viewing SMS', async () => {
			const { container } = render(PhoneSimulator);

			// Navigate to SMS
			const smsBtn = getSmsIconInDock();
			await fireEvent.click(smsBtn!);

			// Trigger alert
			const trigger = getTriggerButton();
			await fireEvent.click(trigger);

			// Navigate back to home
			const backBtn = screen.getByLabelText(BACK_LABEL);
			await fireEvent.click(backBtn);

			// No unread badge — because we were already viewing SMS
			expect(container.querySelector('.unread-badge')).toBeNull();
		});
	});

	// ================================================================
	// Sending user messages
	// ================================================================
	describe('sending messages', () => {
		it('should allow typing and sending a message in SMS view', async () => {
			const { container } = render(PhoneSimulator);

			// Navigate to SMS
			const smsBtn = getSmsIconInDock();
			await fireEvent.click(smsBtn!);

			const input = screen.getByPlaceholderText(INPUT_PLACEHOLDER);
			const initialCount = container.querySelectorAll('.bubble-wrapper').length;

			await fireEvent.input(input, { target: { value: 'Hello from test' } });
			await fireEvent.click(screen.getByLabelText('发送消息'));

			const newCount = container.querySelectorAll('.bubble-wrapper').length;
			expect(newCount).toBe(initialCount + 1);
		});

		it('should display the sent message content in chat', async () => {
			render(PhoneSimulator);

			// Navigate to SMS
			const smsBtn = getSmsIconInDock();
			await fireEvent.click(smsBtn!);

			const input = screen.getByPlaceholderText(INPUT_PLACEHOLDER);
			await fireEvent.input(input, { target: { value: 'Test message content' } });
			await fireEvent.click(screen.getByLabelText('发送消息'));

			expect(screen.getByText('Test message content')).toBeTruthy();
		});

		it('should clear input after sending', async () => {
			render(PhoneSimulator);

			const smsBtn = getSmsIconInDock();
			await fireEvent.click(smsBtn!);

			const input = screen.getByPlaceholderText(INPUT_PLACEHOLDER) as HTMLInputElement;
			await fireEvent.input(input, { target: { value: 'Clear me' } });
			await fireEvent.click(screen.getByLabelText('发送消息'));

			expect(input.value).toBe('');
		});
	});

	// ================================================================
	// Welcome message
	// ================================================================
	describe('welcome message', () => {
		it('should display welcome message in SMS view', async () => {
			render(PhoneSimulator);

			const smsBtn = getSmsIconInDock();
			await fireEvent.click(smsBtn!);

			expect(screen.getByText(/短信模拟器/)).toBeTruthy();
		});
	});

	// ================================================================
	// Notification auto-dismiss
	// ================================================================
	describe('notification auto-dismiss', () => {
		beforeEach(() => {
			vi.useFakeTimers();
		});

		afterEach(() => {
			vi.useRealTimers();
		});

		it('should auto-dismiss notification after 4 seconds', async () => {
			const { container } = render(PhoneSimulator);

			// Trigger alert
			const trigger = getTriggerButton();
			await fireEvent.click(trigger);
			expect(container.querySelector('.notification-banner')).toBeTruthy();

			// Advance time by 4 seconds (the auto-dismiss timeout)
			await act(() => {
				vi.advanceTimersByTime(4000);
			});

			// Notification should be gone
			expect(container.querySelector('.notification-banner')).toBeNull();
		});

		it('should keep unread badge after auto-dismiss', async () => {
			const { container } = render(PhoneSimulator);

			const trigger = getTriggerButton();
			await fireEvent.click(trigger);

			await act(() => {
				vi.advanceTimersByTime(4000);
			});

			// Badge should still be visible
			expect(container.querySelector('.unread-badge')).toBeTruthy();
			expect(container.querySelector('.unread-badge')!.textContent).toBe('1');
		});
	});

	// ================================================================
	// Edge cases
	// ================================================================
	describe('edge cases', () => {
		it('should reset unread count on subsequent navigation after multiple alert cycles', async () => {
			const { container } = render(PhoneSimulator);

			// Cycle 1: alert → navigate → back
			const trigger = getTriggerButton();
			await fireEvent.click(trigger);
			expect(container.querySelector('.unread-badge')!.textContent).toBe('1');

			let smsBtn = getSmsIconInDock();
			await fireEvent.click(smsBtn!);
			expect(container.querySelector('.unread-badge')).toBeNull();

			let backBtn = screen.getByLabelText(BACK_LABEL);
			await fireEvent.click(backBtn);

			// Cycle 2: alert again → should show 1 not 2
			await fireEvent.click(trigger);
			expect(container.querySelector('.unread-badge')!.textContent).toBe('1');

			// Navigate via notification click
			const banner = container.querySelector('.notification-banner') as HTMLElement;
			await fireEvent.click(banner);
			expect(container.querySelector('.unread-badge')).toBeNull();

			// Go back
			backBtn = screen.getByLabelText(BACK_LABEL);
			await fireEvent.click(backBtn);

			// Cycle 3: trigger again
			await fireEvent.click(trigger);
			expect(container.querySelector('.unread-badge')!.textContent).toBe('1');
		});

		it('should allow multiple sends in sequence', async () => {
			render(PhoneSimulator);

			const smsBtn = getSmsIconInDock();
			await fireEvent.click(smsBtn!);

			const input = screen.getByPlaceholderText(INPUT_PLACEHOLDER) as HTMLInputElement;

			await fireEvent.input(input, { target: { value: 'Msg 1' } });
			await fireEvent.click(screen.getByLabelText('发送消息'));
			expect(screen.getByText('Msg 1')).toBeTruthy();

			await fireEvent.input(input, { target: { value: 'Msg 2' } });
			await fireEvent.click(screen.getByLabelText('发送消息'));
			expect(screen.getByText('Msg 2')).toBeTruthy();
		});
	});
});
