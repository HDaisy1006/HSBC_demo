<script lang="ts">
	import type { Message } from '$lib/types';
	import { formatTimestamp } from '$lib/utils/smsUtils';

	let {
		notificationBanner = { visible: false, message: null },
		unreadCount = 0,
		currentTime = '9:41',
		onNotificationClick = () => {},
		onSmsIconClick = () => {}
	}: {
		notificationBanner: { visible: boolean; message: Message | null };
		unreadCount: number;
		currentTime: string;
		onNotificationClick: () => void;
		onSmsIconClick: () => void;
	} = $props();

	let todayDate = $state('');

	$effect(() => {
		const now = new Date();
		const weekDays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
		todayDate = `${now.getFullYear()}年${now.getMonth() + 1}月${now.getDate()}日 ${weekDays[now.getDay()]}`;
	});
</script>

<div class="home-screen">
	<!-- 旷野真实风景照背景 -->
	<div class="landscape-bg"></div>

	<!-- 内容层 -->
	<div class="home-content">
		<!-- 通知横幅（绝对定位，不影响布局） -->
		{#if notificationBanner.visible && notificationBanner.message}
			<button class="notification-banner" onclick={onNotificationClick}>
				<div class="banner-left">
					<div class="banner-app-icon">
						<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
							<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
						</svg>
					</div>
				</div>
				<div class="banner-body">
					<div class="banner-title">
						<span class="banner-app-name">短信</span>
						<span class="banner-time-label">刚刚</span>
					</div>
					<div class="banner-text">{notificationBanner.message.text.slice(0, 40)}...</div>
				</div>
				<div class="banner-chevron">
					<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
						<polyline points="9 18 15 12 9 6"></polyline>
					</svg>
				</div>
			</button>
		{/if}

		<!-- 时钟区域（黄金分割点 ~38% 靠上） -->
		<div class="clock-area">
			<div class="clock-time">{currentTime}</div>
			<div class="clock-date">{todayDate}</div>
		</div>

		<!-- 留白，把图标推到底部 -->
		<div class="spacer"></div>

		<!-- 应用图标栏：底部一排 -->
		<div class="app-dock">
			<div class="app-item">
				<div class="app-icon-wrapper green">
					<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
						<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
					</svg>
				</div>
				<span class="app-label">电话</span>
			</div>

			<button class="app-item app-item-btn" onclick={onSmsIconClick}>
				<div class="app-icon-wrapper blue">
					<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
						<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
						<line x1="8" y1="9" x2="16" y2="9"></line>
						<line x1="8" y1="13" x2="14" y2="13"></line>
					</svg>
					{#if unreadCount > 0}
						<span class="unread-badge">{unreadCount > 99 ? '99+' : unreadCount}</span>
					{/if}
				</div>
				<span class="app-label">短信</span>
			</button>

			<div class="app-item">
				<div class="app-icon-wrapper orange">
					<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
						<path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path>
						<circle cx="12" cy="13" r="4"></circle>
					</svg>
				</div>
				<span class="app-label">相机</span>
			</div>

			<div class="app-item">
				<div class="app-icon-wrapper wechat">
					<svg width="28" height="28" viewBox="0 0 48 48" fill="none">
						<path d="M16 8C8.268 8 2 13.373 2 20c0 3.7 2.01 7.04 5.18 9.2l-1.92 4.8L10 31.8c1.8.8 3.86 1.2 6 1.2.47 0 .93-.03 1.39-.08C18.78 36.36 22 41 26 41c3.24 0 6.2-1.04 8.5-2.8l4.3 1.6-1.4-3.8C40.1 33.8 42 30.8 42 27.5c0-6.08-5.37-11-12-11-.5 0-1 .03-1.5.08C28.88 13.26 24.8 8 16 8z" fill="white"/>
						<ellipse cx="11" cy="18" rx="2" ry="2.8" fill="#07C160"/>
						<ellipse cx="21" cy="18" rx="2" ry="2.8" fill="#07C160"/>
						<path d="M13 24c1.5 1.5 4 2 6 0" stroke="#07C160" stroke-width="1.2" stroke-linecap="round" fill="none"/>
					</svg>
				</div>
				<span class="app-label">微信</span>
			</div>
		</div>

		<div class="home-bar-area">
			<div class="home-bar-line"></div>
		</div>
	</div>
</div>

<style>
	.home-screen {
		flex: 1;
		position: relative;
		overflow: hidden;
		display: flex;
		flex-direction: column;
	}

	/* ===== 旷野真实风景照 ===== */
	.landscape-bg {
		position: absolute;
		inset: 0;
		background:
			linear-gradient(180deg, rgba(0,0,0,0.05) 0%, rgba(0,0,0,0) 45%, rgba(0,0,0,0.15) 100%),
			url('https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=95')
			center 40% / cover no-repeat;
		background-color: #4a5a3a;
	}

	/* ===== 内容层 ===== */
	.home-content {
		position: relative;
		z-index: 1;
		flex: 1;
		display: flex;
		flex-direction: column;
		padding: 0 1.25rem;
	}

	/* ===== 通知横幅（绝对定位，不挤压布局） ===== */
	.notification-banner {
		position: absolute;
		top: 0.5rem;
		left: 1rem;
		right: 1rem;
		z-index: 20;
		display: flex;
		align-items: center;
		gap: 0.625rem;
		padding: 0.75rem;
		background: rgba(255, 255, 255, 0.94);
		backdrop-filter: blur(16px);
		-webkit-backdrop-filter: blur(16px);
		border-radius: 1rem;
		border: 1px solid rgba(0, 0, 0, 0.06);
		box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
		cursor: pointer;
		text-align: left;
		font-family: inherit;
		animation: slideDown 0.35s cubic-bezier(0.2, 0.9, 0.3, 1.1);
	}

	@keyframes slideDown {
		from { transform: translateY(-120%); opacity: 0; }
		to   { transform: translateY(0);    opacity: 1; }
	}

	.banner-left { flex-shrink: 0; }
	.banner-app-icon {
		width: 36px; height: 36px;
		background: #007AFF;
		border-radius: 0.625rem;
		display: flex; align-items: center; justify-content: center;
	}
	.banner-body { flex: 1; min-width: 0; }
	.banner-title {
		display: flex; align-items: center; justify-content: space-between;
		margin-bottom: 0.125rem;
	}
	.banner-app-name  { font-size: 0.8125rem; font-weight: 700; color: #1e293b; }
	.banner-time-label { font-size: 0.625rem;  color: #94a3b8; }
	.banner-text {
		font-size: 0.75rem; color: #64748b;
		overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
	}
	.banner-chevron { flex-shrink: 0; }

	/* ===== 时钟（黄金分割点 38%） ===== */
	.clock-area {
		text-align: center;
		padding-top: 38%;
	}
	.clock-time {
		font-size: 3.75rem;
		font-weight: 200;
		color: rgba(255, 255, 255, 0.92);
		line-height: 1;
		letter-spacing: -2px;
		text-shadow: 0 1px 8px rgba(0, 0, 0, 0.35);
	}
	.clock-date {
		font-size: 0.8rem;
		color: rgba(255, 255, 255, 0.78);
		margin-top: 0.375rem;
		text-shadow: 0 1px 6px rgba(0, 0, 0, 0.3);
	}

	.spacer { flex: 1; }

	/* ===== 底部图标栏 ===== */
	.app-dock {
		display: flex;
		justify-content: space-around;
		align-items: flex-start;
		padding: 0.5rem 0.25rem;
	}
	.app-item {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.375rem;
	}
	.app-item-btn {
		background: none; border: none; cursor: pointer;
		font-family: inherit; padding: 0; position: relative;
	}
	.app-icon-wrapper {
		width: 54px; height: 54px;
		border-radius: 0.8rem;
		display: flex; align-items: center; justify-content: center;
		position: relative;
		box-shadow: 0 3px 8px rgba(0, 0, 0, 0.15);
		transition: transform 0.15s;
	}
	.app-item-btn:hover .app-icon-wrapper { transform: scale(1.08); }
	.app-item-btn:active .app-icon-wrapper { transform: scale(0.95); }

	.app-icon-wrapper.green  { background: linear-gradient(135deg, #34C759, #28A745); }
	.app-icon-wrapper.blue   { background: linear-gradient(135deg, #007AFF, #0056CC); }
	.app-icon-wrapper.orange { background: linear-gradient(135deg, #FF9500, #E68600); }
	.app-icon-wrapper.wechat { background: linear-gradient(135deg, #07C160, #06AD56); }

	.app-label {
		font-size: 0.7rem;
		color: rgba(255, 255, 255, 0.85);
		font-weight: 500;
		text-shadow: 0 1px 3px rgba(0, 0, 0, 0.4);
	}

	/* 未读角标 */
	.unread-badge {
		position: absolute;
		top: -6px; right: -6px;
		min-width: 19px; height: 19px;
		background: #FF3B30; color: #fff;
		font-size: 0.65rem; font-weight: 700;
		border-radius: 999px;
		display: flex; align-items: center; justify-content: center;
		padding: 0 5px;
		box-shadow: 0 2px 6px rgba(255, 59, 48, 0.4);
		line-height: 1;
	}

	/* 底部指示条 */
	.home-bar-area {
		display: flex; justify-content: center;
		padding: 0.5rem 0 0.25rem;
	}
	.home-bar-line {
		width: 100px; height: 4px;
		background: rgba(255, 255, 255, 0.3);
		border-radius: 999px;
	}
</style>
