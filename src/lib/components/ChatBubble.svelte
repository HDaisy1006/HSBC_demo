<script lang="ts">
	import type { Message } from '$lib/types';
	import { formatTimestamp } from '$lib/utils/smsUtils';

	let { message }: { message: Message } = $props();
</script>

{#if message}
	{@const isUser = message.sender === 'user'}
	<div class="bubble-wrapper" class:user={isUser} class:system={!isUser}>
		<div class="bubble" class:user-bg={isUser} class:sys-bg={!isUser}>
			{#if message.type === 'alert'}
				<span class="badge">🚨 紧急通知</span>
			{/if}
			<p class="text-sm leading-relaxed">{message.text}</p>
			<span class="timestamp">{formatTimestamp(message.timestamp)}</span>
		</div>
	</div>
{/if}

<style>
	.bubble-wrapper {
		display: flex;
		margin-bottom: 0.75rem;
	}
	.bubble-wrapper.user {
		justify-content: flex-end;
	}
	.bubble-wrapper.system {
		justify-content: flex-start;
	}
	.bubble {
		max-width: 80%;
		padding: 0.625rem 0.875rem;
		border-radius: 1rem;
		position: relative;
	}
	.user-bg {
		background: #2563eb;
		color: #fff;
		border-bottom-right-radius: 0.25rem;
	}
	.sys-bg {
		background: #fff;
		color: #334155;
		border-bottom-left-radius: 0.25rem;
		border: 1px solid #e2e8f0;
	}
	.badge {
		display: inline-block;
		font-size: 0.6875rem;
		font-weight: 600;
		color: #d97706;
		margin-bottom: 0.25rem;
	}
	.timestamp {
		display: block;
		text-align: right;
		font-size: 0.625rem;
		opacity: 0.5;
		margin-top: 0.25rem;
	}
	.user-bg .timestamp {
		color: rgba(255,255,255,0.7);
	}
	.sys-bg .timestamp {
		color: #94a3b8;
	}
</style>
