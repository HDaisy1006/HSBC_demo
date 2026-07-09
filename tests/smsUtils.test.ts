import { describe, it, expect, vi, afterEach } from 'vitest';
import {
	formatTimestamp,
	validatePhoneNumber,
	generateAlertMessage,
	createUserMessage,
	createWelcomeMessage
} from '../src/lib/utils/smsUtils';

describe('smsUtils', () => {
	describe('formatTimestamp', () => {
		it('should format date as HH:MM', () => {
			const date = new Date(2026, 6, 9, 14, 35);
			expect(formatTimestamp(date)).toBe('14:35');
		});

		it('should pad single-digit hours and minutes with zeros', () => {
			const date = new Date(2026, 6, 9, 9, 5);
			expect(formatTimestamp(date)).toBe('09:05');
		});

		it('should handle midnight', () => {
			const date = new Date(2026, 6, 9, 0, 0);
			expect(formatTimestamp(date)).toBe('00:00');
		});
	});

	describe('validatePhoneNumber', () => {
		it('should accept Chinese mobile number format', () => {
			expect(validatePhoneNumber('+86-13812345678')).toBe(true);
		});

		it('should accept plain digits', () => {
			expect(validatePhoneNumber('13812345678')).toBe(true);
		});

		it('should accept international format with spaces', () => {
			expect(validatePhoneNumber('+1 555 123 4567')).toBe(true);
		});

		it('should reject too short numbers', () => {
			expect(validatePhoneNumber('12345')).toBe(false);
		});

		it('should reject empty string', () => {
			expect(validatePhoneNumber('')).toBe(false);
		});

		it('should reject letters mixed in', () => {
			expect(validatePhoneNumber('138abc45678')).toBe(false);
		});
	});

	describe('generateAlertMessage', () => {
		it('should generate a message with system sender and alert type', () => {
			const msg = generateAlertMessage();
			expect(msg.sender).toBe('system');
			expect(msg.type).toBe('alert');
			expect(msg.text.length).toBeGreaterThan(0);
		});

		it('should generate a message with valid UUID', () => {
			const msg = generateAlertMessage();
			expect(msg.id).toBeTruthy();
			expect(msg.id.length).toBeGreaterThan(10);
		});

		it('should generate a message with Date timestamp', () => {
			const msg = generateAlertMessage();
			expect(msg.timestamp).toBeInstanceOf(Date);
		});
	});

	describe('createUserMessage', () => {
		it('should create a user message with the given text', () => {
			const msg = createUserMessage('Hello, test!');
			expect(msg.text).toBe('Hello, test!');
			expect(msg.sender).toBe('user');
			expect(msg.type).toBe('sms');
		});

		it('should create a message with valid id and timestamp', () => {
			const msg = createUserMessage('Test');
			expect(msg.id).toBeTruthy();
			expect(msg.timestamp).toBeInstanceOf(Date);
		});
	});

	describe('createWelcomeMessage', () => {
		it('should create a welcome message with info type', () => {
			const msg = createWelcomeMessage();
			expect(msg.sender).toBe('system');
			expect(msg.type).toBe('info');
			expect(msg.text).toContain('短信模拟器');
		});

		it('should create a welcome message with valid id', () => {
			const msg = createWelcomeMessage();
			expect(msg.id).toBeTruthy();
		});
	});
});
