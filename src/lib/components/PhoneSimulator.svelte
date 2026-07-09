<script lang="ts">
	import type { Message } from '$lib/types';
	import {
		generateAlertMessage,
		createUserMessage,
		createWelcomeMessage
	} from '$lib/utils/smsUtils';
	import ChatBubble from './ChatBubble.svelte';
	import MessageInput from './MessageInput.svelte';
	import { onMount } from 'svelte';

	let messages: Message[] = $state([createWelcomeMessage()]);
	let chatContainer: HTMLDivElement;
	let currentTime = $state('');
	let batteryLevel = $state(85);

	function addMessage(msg: Message) {
		messages = [...messages, msg];
	}

	function scrollToBottom() {
		requestAnimationFrame(() => {
			if (chatContainer) {
				chatContainer.scrollTop = chatContainer.scrollHeight;
			}
		});
	}

	function handleSendAlert() {
		const alert = generateAlertMessage();
		addMessage(alert);
		scrollToBottom();
	}

	function handleUserSend(text: string) {
		const msg = createUserMessage(text);
		addMessage(msg);
		scrollToBottom();
	}

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
		if (chatContainer) {
			chatContainer.scrollTop = chatContainer.scrollHeight;
		}
	});

	$effect(() => {
		const interval = setInterval(() => {
			batteryLevel = Math.max(75, Math.min(100, batteryLevel + (Math.random() - 0.5) * 4));
		}, 30000);
		return () => clearInterval(interval);
	});
</script>

<div class="phone-outer">
	<div class="side-btn top-btn"></div>
	<div class="side-btn vol-up"></div>
	<div class="side-btn vol-down"></div>
	<div class="side-btn power-btn"></div>

	<div class="notch-area">
		<div class="dynamic-island"></div>
	</div>

	<div class="phone-screen">
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

		<div class="title-bar">
			<span class="title-text">短信</span>
			<button class="alert-btn" onclick={handleSendAlert}>紧急通知</button>
		</div>

		<div bind:this={chatContainer} class="chat-area">
			{#each messages as msg (msg.id)}
				<ChatBubble message={msg} />
			{/each}
		</div>

		<MessageInput onSend={handleUserSend} />
	</div>

	<div class="home-bar">
		<div class="home-indicator"></div>
	</div>
</div>

<style>
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

	/* 刘海区域 — 紧贴顶部 */
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

	/* 屏幕 — 几乎无边距，紧贴外壳内壁 */
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
	}
	.time-text { width: 40px; text-align: left; }
	.status-right {
		display: flex;
		align-items: center;
		gap: 5px;
		color: #334155;
	}
	.signal-icon, .wifi-icon, .battery-icon { display: block; }

	.title-bar {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 0.25rem 1.125rem;
		background: #fff;
		border-bottom: 1px solid #f1f5f9;
	}
	.title-text {
		font-size: 0.9375rem;
		font-weight: 700;
		color: #1e293b;
	}
	.alert-btn {
		font-size: 0.6875rem;
		font-weight: 500;
		padding: 0.3125rem 0.6875rem;
		border-radius: 999px;
		border: 1px solid #f59e0b;
		background: #fffbeb;
		color: #b45309;
		cursor: pointer;
		transition: all 0.15s;
		white-space: nowrap;
	}
	.alert-btn:hover {
		background: #fef3c7;
		border-color: #d97706;
	}

	.chat-area {
		flex: 1;
		overflow-y: auto;
		padding: 0.625rem 0.75rem;
		scroll-behavior: smooth;
		background: #f8fafc;
	}
	.chat-area::-webkit-scrollbar { width: 3px; }
	.chat-area::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 2px; }

	/* 底部 — 紧贴外壳 */
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
