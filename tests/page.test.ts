import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/svelte';
import Page from '$routes/+page.svelte';

function getSidebarButtons() {
	return screen.getAllByRole('button').filter((btn) =>
		btn.classList.contains('sidebar-item')
	);
}

function clickSidebarButton(label: string) {
	const btn = getSidebarButtons().find((b) => b.textContent?.includes(label));
	if (!btn) throw new Error(`Sidebar button "${label}" not found`);
	return fireEvent.click(btn);
}

describe('+page.svelte', () => {
	// ================================================================
	// Initial render
	// ================================================================
	describe('initial render', () => {
		it('should render the sidebar with logo and title', () => {
			render(Page);
			expect(screen.getByText('🌍')).toBeTruthy();
			// "Demo" only appears in the sidebar header
			expect(screen.getByText('Demo')).toBeTruthy();
		});

		it('should render two sidebar navigation buttons', () => {
			render(Page);
			const buttons = getSidebarButtons();
			expect(buttons).toHaveLength(2);
			expect(buttons[0].textContent).toContain('世界地图');
			expect(buttons[1].textContent).toContain('手机模拟器');
		});

		it('should render the coverage link in sidebar footer', () => {
			render(Page);
			const link = screen.getByText('查看单元测试覆盖率');
			expect(link).toBeTruthy();
			expect(link.closest('a')?.getAttribute('href')).toBe('/coverage/index.html');
		});

		it('should default to world map tab (active class on sidebar)', () => {
			render(Page);
			const buttons = getSidebarButtons();
			const mapBtn = buttons.find((b) => b.textContent?.includes('世界地图'))!;
			const phoneBtn = buttons.find((b) => b.textContent?.includes('手机模拟器'))!;
			expect(mapBtn.classList.contains('active')).toBe(true);
			expect(phoneBtn.classList.contains('active')).toBe(false);
		});

		it('should show world map page description by default', () => {
			render(Page);
			expect(screen.getByText(/5 个高亮国家/)).toBeTruthy();
		});
	});

	// ================================================================
	// Tab switching
	// ================================================================
	describe('tab switching', () => {
		it('should switch to phone simulator content when clicking phone nav', async () => {
			render(Page);
			await clickSidebarButton('手机模拟器');

			// Phone-specific description should be visible
			expect(screen.getByText(/模拟智能手机短信界面/)).toBeTruthy();
		});

		it('should switch back to world map content', async () => {
			render(Page);

			await clickSidebarButton('手机模拟器');
			await clickSidebarButton('世界地图');

			// Map description should be visible again
			expect(screen.getByText(/5 个高亮国家/)).toBeTruthy();
		});

		it('should toggle active class on sidebar buttons', async () => {
			render(Page);

			const buttons = getSidebarButtons();
			const mapBtn = buttons.find((b) => b.textContent?.includes('世界地图'))!;
			const phoneBtn = buttons.find((b) => b.textContent?.includes('手机模拟器'))!;

			// Initial state: map active
			expect(mapBtn.classList.contains('active')).toBe(true);
			expect(phoneBtn.classList.contains('active')).toBe(false);

			// Switch to phone
			await fireEvent.click(phoneBtn);
			expect(mapBtn.classList.contains('active')).toBe(false);
			expect(phoneBtn.classList.contains('active')).toBe(true);

			// Switch back to map
			await fireEvent.click(mapBtn);
			expect(mapBtn.classList.contains('active')).toBe(true);
			expect(phoneBtn.classList.contains('active')).toBe(false);
		});
	});

	// ================================================================
	// Layout structure
	// ================================================================
	describe('layout structure', () => {
		it('should contain sidebar and content area', () => {
			const { container } = render(Page);
			expect(container.querySelector('.sidebar')).toBeTruthy();
			expect(container.querySelector('.sidebar-header')).toBeTruthy();
			expect(container.querySelector('.sidebar-nav')).toBeTruthy();
			expect(container.querySelector('.sidebar-footer')).toBeTruthy();
			expect(container.querySelector('.content-area')).toBeTruthy();
		});

		it('should render PhoneSimulator when phone tab is active', async () => {
			render(Page);
			await clickSidebarButton('手机模拟器');

			// PhoneSimulator renders the external trigger button
			expect(screen.getByText('模拟接收短信')).toBeTruthy();
		});
	});
});
