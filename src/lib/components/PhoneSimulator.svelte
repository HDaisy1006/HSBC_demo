<script lang="ts">
	import type { Message } from '$lib/types';
	import {
		generateAlertMessage,
		createUserMessage,
		createWelcomeMessage
	} from '$lib/utils/smsUtils';
	import ChatBubble from './ChatBubble.svelte';
	import MessageInput from './MessageInput.svelte';
	import PhoneHomeScreen from './PhoneHomeScreen.svelte';
	import { onMount } from 'svelte';

	// ===== 视图状态 =====
	let view: 'home' | 'sms' = $state('home');
	let messages: Message[] = $state([createWelcomeMessage()]);
	let unreadCount = $state(0);
	let notificationBanner: { visible: boolean; message: Message | null } = $state({
		visible: false,
		message: null
	});
	let autoDismissTimeout: ReturnType<typeof setTimeout> | null = null;

	// ===== 共享状态 =====
	let chatContainer: HTMLDivElement | undefined = $state(undefined);
	let currentTime = $state('');
	let batteryLevel = $state(85);

	// ===== 外部触发：预警短信 =====
	function handleExternalAlert() {
		const alert = generateAlertMessage();
		messages = [...messages, alert];
		// 只有当前不在短信界面时才增加未读计数和显示通知横幅
		if (view !== 'sms') {
			unreadCount += 1;
			notificationBanner = { visible: true, message: alert };
		}

		if (autoDismissTimeout) clearTimeout(autoDismissTimeout);
		autoDismissTimeout = setTimeout(() => {
			notificationBanner = { visible: false, message: notificationBanner.message };
		}, 4000);
	}

	// ===== 导航 =====
	function handleNavigateToSms() {
		view = 'sms';
		unreadCount = 0;
		notificationBanner = { visible: false, message: null };
		if (autoDismissTimeout) {
			clearTimeout(autoDismissTimeout);
			autoDismissTimeout = null;
		}
	}

	function handleNavigateToHome() {
		view = 'home';
	}

	// ===== 用户发送消息 =====
	function handleUserSend(text: string) {
		const msg = createUserMessage(text);
		messages = [...messages, msg];
		scrollToBottom();
	}

	function scrollToBottom() {
		requestAnimationFrame(() => {
			if (chatContainer) {
				chatContainer.scrollTop = chatContainer.scrollHeight;
			}
		});
	}

	// ===== 生命周期 =====
	function updateTime() {
		const now = new Date();
		currentTime = now.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' });
	}

	onMount(() => {
		updateTime();
		const timer = setInterval(updateTime, 10000);
		return () => clearInterval(timer);
	});

	$effect(() => {
		// SMS 视图切换时滚动到底部
		if (view === 'sms' && chatContainer) {
			scrollToBottom();
		}
	});

	$effect(() => {
		const interval = setInterval(() => {
			batteryLevel = Math.max(75, Math.min(100, batteryLevel + (Math.random() - 0.5) * 4));
		}, 30000);
		return () => clearInterval(interval);
	});

	// 清理自动消失计时器
	$effect(() => {
		return () => {
			if (autoDismissTimeout) clearTimeout(autoDismissTimeout);
		};
	});
</script>

<div class="simulator-wrapper">
	<!-- 外部触发按钮：位于手机上方 -->
	<button class="external-trigger" onclick={handleExternalAlert}>
		<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
			<path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
			<polyline points="22,6 12,13 2,6"></polyline>
		</svg>
		<span>模拟接收短信</span>
	</button>

	<!-- 手机外壳 -->
	<div class="phone-outer">
		<div class="side-btn top-btn"></div>
		<div class="side-btn vol-up"></div>
		<div class="side-btn vol-down"></div>
		<div class="side-btn power-btn"></div>

		<div class="notch-area">
			<div class="dynamic-island"></div>
		</div>

		<div class="phone-screen">
			<!-- 状态栏 -->
			<div class="status-bar">
				<span class="time-text">{currentTime || '9:41'}</span>
				<div class="status-right">
					<svg class="signal-icon" width="15" height="11" viewBox="0 0 16 12" fill="currentColor">
						<rect x="0" y="8" width="3" height="4" rx="0.5" />
						<rect x="4" y="5" width="3" height="7" rx="0.5" />
						<rect x="8" y="2" width="3" height="10" rx="0.5" />
						<rect x="12" y="0" width="3" height="12" rx="0.5" />
					</svg>
					<svg class="wifi-icon" width="14" height="11" viewBox="0 0 15 12" fill="none" stroke="currentColor" stroke-width="1.5">
						<path d="M7.5 10.5a.75.75 0 0 1 0 1.5" stroke-linecap="round" />
						<path d="M5.2 8.4a3.25 3.25 0 0 1 4.6 0" />
						<path d="M2.8 6a6.63 6.63 0 0 1 9.4 0" />
						<path d="M0.4 3.6a10 10 0 0 1 14.2 0" />
					</svg>
					<svg class="battery-icon" width="23" height="11" viewBox="0 0 24 12" fill="none">
						<rect x="0" y="0" width="21" height="12" rx="2.5" stroke="currentColor" stroke-width="1" />
						<rect x="1.5" y="1.5" width="{Math.round(batteryLevel * 0.18)}" height="9" rx="1" fill="currentColor" opacity="0.8" />
						<rect x="21.5" y="3.5" width="2" height="5" rx="1" fill="currentColor" opacity="0.6" />
					</svg>
				</div>
			</div>

			{#if view === 'home'}
				<!-- 主屏幕 -->
				<PhoneHomeScreen
					{notificationBanner}
					{unreadCount}
					{currentTime}
					onNotificationClick={handleNavigateToSms}
					onSmsIconClick={handleNavigateToSms}
				/>
			{:else}
				<!-- SMS 短信详情 -->
				<div class="title-bar">
					<button class="back-btn" onclick={handleNavigateToHome} aria-label="返回主屏幕">
						<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
							<polyline points="15 18 9 12 15 6"></polyline>
						</svg>
						<span>返回</span>
					</button>
					<span class="title-text">短信</span>
					<div class="title-spacer"></div>
				</div>

				<div bind:this={chatContainer} class="chat-area">
					{#each messages as msg (msg.id)}
						<ChatBubble message={msg} />
					{/each}
				</div>

				<MessageInput onSend={handleUserSend} />
			{/if}
		</div>

		<div class="home-bar">
			<div class="home-indicator"></div>
		</div>
	</div>
</div>

<style>
	/* ===== 外层容器 ===== */
	.simulator-wrapper {
		margin: 0 auto;
	}

	/* ===== 外部触发按钮 ===== */
	.external-trigger {
		display: inline-flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.625rem 1.5rem;
		margin: 0 auto 0.75rem;
		background: #DB0011;
		color: #fff;
		border: none;
		border-radius: 999px;
		font-size: 0.875rem;
		font-weight: 600;
		cursor: pointer;
		box-shadow: 0 4px 14px rgba(219, 0, 17, 0.35);
		transition: all 0.2s;
		width: 100%;
		justify-content: center;
	}
	.external-trigger:hover {
		background: #b8000e;
		box-shadow: 0 6px 20px rgba(219, 0, 17, 0.45);
		transform: translateY(-1px);
	}
	.external-trigger:active {
		transform: translateY(0);
		box-shadow: 0 2px 8px rgba(219, 0, 17, 0.3);
	}

	/* ===== 手机外壳 ===== */
	.phone-outer {
		width: 390px;
		height: 700px;
		background: linear-gradient(180deg, #2c2c2e 0%, #1c1c1e 100%);
		border-radius: 2.75rem;
		padding: 0;
		box-shadow:
			0 0 0 2px #3a3a3c,
			0 0 0 4px #1c1c1e,
			0 0 0 5px #2c2c2e,
			0 20px 60px rgba(0,0,0,0.35);
		position: relative;
		margin: 0 auto;
		overflow: hidden;
		display: flex;
		flex-direction: column;
	}

	/* 侧边按钮 */
	.side-btn {
		position: absolute;
		left: -2px;
		background: #3a3a3c;
		border-radius: 0 2px 2px 0;
		z-index: 2;
	}
	.top-btn    { top: 120px; width: 2px; height: 28px; }
	.vol-up     { top: 168px; width: 2px; height: 42px; }
	.vol-down   { top: 220px; width: 2px; height: 42px; }
	.power-btn  {
		right: -2px; left: auto; top: 175px;
		width: 2px; height: 48px;
		border-radius: 2px 0 0 2px;
	}

	/* 刘海区域 */
	.notch-area {
		display: flex;
		justify-content: center;
		padding: 0.15rem 0 0.05rem;
	}
	.dynamic-island {
		width: 96px;
		height: 20px;
		background: #000;
		border-radius: 999px;
	}

	/* 屏幕 */
	.phone-screen {
		flex: 1;
		background: #f8fafc;
		margin: 0 2px;
		border-radius: 2.25rem;
		overflow: hidden;
		display: flex;
		flex-direction: column;
	}

	.status-bar {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 0.375rem 1.25rem 0.125rem;
		font-size: 0.75rem;
		font-weight: 600;
		color: #334155;
		background: #f8fafc;
		position: relative;
		z-index: 10;
	}
	.time-text { width: 40px; text-align: left; }
	.status-right {
		display: flex;
		align-items: center;
		gap: 5px;
		color: #334155;
	}
	.signal-icon, .wifi-icon, .battery-icon { display: block; }

	/* ===== SMS 视图：标题栏 ===== */
	.title-bar {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 0.25rem 0.75rem;
		background: #fff;
		border-bottom: 1px solid #f1f5f9;
	}
	.title-text {
		font-size: 0.9375rem;
		font-weight: 700;
		color: #1e293b;
	}
	.title-spacer {
		width: 50px;
	}
	.back-btn {
		display: flex;
		align-items: center;
		gap: 0.125rem;
		font-size: 0.8125rem;
		font-weight: 500;
		color: #007AFF;
		background: none;
		border: none;
		cursor: pointer;
		padding: 0.25rem 0;
	}
	.back-btn:hover {
		color: #0056CC;
	}

	/* ===== SMS 视图：聊天区域 ===== */
	.chat-area {
		flex: 1;
		overflow-y: auto;
		padding: 0.625rem 0.75rem;
		scroll-behavior: smooth;
		background: #f8fafc;
	}
	.chat-area::-webkit-scrollbar { width: 3px; }
	.chat-area::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 2px; }

	/* ===== 底部 Home 指示器 ===== */
	.home-bar {
		display: flex;
		justify-content: center;
		padding: 0.125rem 0;
	}
	.home-indicator {
		width: 120px;
		height: 4px;
		background: rgba(255,255,255,0.25);
		border-radius: 999px;
	}
</style>
