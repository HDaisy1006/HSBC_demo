<script lang="ts">
	import WorldMap from '$lib/components/WorldMap.svelte';
	import PhoneSimulator from '$lib/components/PhoneSimulator.svelte';

	type Tab = 'map' | 'phone';
	let activeTab: Tab = $state('map');
</script>

<div class="app-layout">
	<aside class="sidebar">
		<div class="sidebar-header">
			<span class="sidebar-logo">🌍</span>
			<span class="sidebar-title">Demo</span>
		</div>

		<nav class="sidebar-nav">
			<button
				class="sidebar-item"
				class:active={activeTab === 'map'}
				onclick={() => activeTab = 'map'}
			>
				<span class="sidebar-icon">
					<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
						<circle cx="12" cy="12" r="10"></circle>
						<ellipse cx="12" cy="12" rx="10" ry="4"></ellipse>
						<line x1="2" y1="12" x2="22" y2="12"></line>
						<path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
					</svg>
				</span>
				<span class="sidebar-label">世界地图</span>
			</button>

			<button
				class="sidebar-item"
				class:active={activeTab === 'phone'}
				onclick={() => activeTab = 'phone'}
			>
				<span class="sidebar-icon">
					<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
						<rect x="5" y="2" width="14" height="20" rx="2" ry="2"></rect>
						<line x1="12" y1="18" x2="12.01" y2="18"></line>
						<path d="M8 7h8"></path>
						<path d="M8 11h6"></path>
						<path d="M8 15h4"></path>
					</svg>
				</span>
				<span class="sidebar-label">手机模拟器</span>
			</button>
		</nav>

		<div class="sidebar-footer">
			<a href="/coverage/index.html" target="_blank" class="coverage-link">
				查看单元测试覆盖率
			</a>
		</div>
	</aside>

	<main class="content-area">
		{#if activeTab === 'map'}
			<div class="content-page map-page">
				<h1 class="content-title">世界地图</h1>
				<p class="content-desc">5 个高亮国家，点击图例可切换高亮状态，支持缩放和拖拽。</p>
				<WorldMap />
			</div>
		{:else if activeTab === 'phone'}
			<div class="content-page phone-page">
				<h1 class="content-title">手机模拟器</h1>
				<p class="content-desc">模拟智能手机短信界面，体验消息的发送与接收。</p>
				<div class="phone-demo">
					<PhoneSimulator />
				</div>
			</div>
		{/if}
	</main>
</div>

<style>
	.app-layout {
		display: flex;
		min-height: 100vh;
	}

	.sidebar {
		width: 220px;
		flex-shrink: 0;
		background: #fff;
		border-right: 1px solid #e2e8f0;
		display: flex;
		flex-direction: column;
		padding: 1.25rem 0.75rem;
	}
	.sidebar-header {
		display: flex;
		align-items: center;
		gap: 0.625rem;
		padding: 0.5rem 0.75rem 1.25rem;
		border-bottom: 1px solid #e2e8f0;
		margin-bottom: 0.75rem;
	}
	.sidebar-logo { font-size: 1.5rem; }
	.sidebar-title { font-size: 1.125rem; font-weight: 700; color: #1e293b; }
	.sidebar-nav { flex: 1; display: flex; flex-direction: column; gap: 0.25rem; }
	.sidebar-item {
		display: flex; align-items: center; gap: 0.75rem;
		padding: 0.75rem 0.875rem; border-radius: 0.625rem;
		border: none; background: transparent;
		color: #64748b; cursor: pointer;
		transition: all 0.15s; text-align: left;
		font-size: 0.9375rem; width: 100%;
	}
	.sidebar-item:hover { background: #f1f5f9; color: #334155; }
	.sidebar-item.active { background: #eff6ff; color: #2563eb; font-weight: 600; }
	.sidebar-icon { display: flex; align-items: center; justify-content: center; width: 24px; height: 24px; flex-shrink: 0; }
	.sidebar-label { white-space: nowrap; }
	.sidebar-footer { padding: 0.75rem; margin-top: auto; }

	.coverage-link {
		display: flex;
		align-items: center;
		gap: 0.375rem;
		padding: 0.5rem 0.75rem;
		border-radius: 0.5rem;
		font-size: 0.8125rem;
		color: #64748b;
		text-decoration: none;
		transition: all 0.15s;
	}
	.coverage-link:hover {
		background: #f0fdf4;
		color: #16a34a;
	}

	.content-area {
		flex: 1;
		overflow-y: auto;
		padding: 1.5rem;
		background: #f8fafc;
	}
	.content-page { margin: 0 auto; }
	.map-page { max-width: none; }
	.content-title { font-size: 1.5rem; font-weight: 700; color: #1e293b; margin-bottom: 0.25rem; }
	.content-desc { font-size: 0.875rem; color: #64748b; margin-bottom: 1rem; }
	.phone-demo { display: flex; justify-content: flex-start; }
</style>
