<script lang="ts">
	let { onSend }: { onSend: (text: string) => void } = $props();

	let inputText = $state('');

	function handleSend() {
		const text = inputText.trim();
		if (!text) return;
		onSend(text);
		inputText = '';
	}

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'Enter' && !e.shiftKey) {
			e.preventDefault();
			handleSend();
		}
	}
</script>

<div class="input-area">
	<input
		type="text"
		bind:value={inputText}
		onkeydown={handleKeydown}
		placeholder="输入消息..."
		class="message-input"
	/>
	<button onclick={handleSend} disabled={!inputText.trim()} class="send-btn" aria-label="发送消息">
		<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
			<line x1="22" y1="2" x2="11" y2="13"></line>
			<polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
		</svg>
	</button>
</div>

<style>
	.input-area {
		display: flex;
		gap: 0.5rem;
		padding: 0.625rem;
		background: #fff;
		border-top: 1px solid #e2e8f0;
	}
	.message-input {
		flex: 1;
		padding: 0.5rem 0.75rem;
		border-radius: 9999px;
		border: 1px solid #e2e8f0;
		background: #f8fafc;
		color: #334155;
		font-size: 0.8125rem;
		outline: none;
		transition: border-color 0.2s;
	}
	.message-input:focus {
		border-color: #3b82f6;
		background: #fff;
	}
	.message-input::placeholder {
		color: #94a3b8;
	}
	.send-btn {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 36px;
		height: 36px;
		border-radius: 50%;
		border: none;
		background: #2563eb;
		color: #fff;
		cursor: pointer;
		transition: background 0.2s;
		flex-shrink: 0;
	}
	.send-btn:hover:not(:disabled) {
		background: #1d4ed8;
	}
	.send-btn:disabled {
		opacity: 0.4;
		cursor: not-allowed;
	}
</style>
