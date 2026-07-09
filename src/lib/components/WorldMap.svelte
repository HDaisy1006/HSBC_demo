<script lang="ts">
	import * as echarts from 'echarts';
	import { onMount } from 'svelte';
	import { HIGHLIGHTED_COUNTRIES, WORLD_GEOJSON_URL, getCountryLabel } from '$lib/utils/mapUtils';

	let container: HTMLDivElement;
	let chart: echarts.ECharts | undefined;
	let loading = $state(true);
	let error = $state('');
	let allCountryNames: string[] = $state([]);

	/** 当前激活的高亮国家集合 — 初始全部激活 */
	let activeSet: Set<string> = $state(new Set(HIGHLIGHTED_COUNTRIES.map((c) => c.name)));

	onMount(() => {
		initChart();
		return () => {
			chart?.dispose();
			window.removeEventListener('resize', handleResize);
		};
	});

	function handleResize() {
		chart?.resize();
	}

	function buildData() {
		return allCountryNames.map((name) => ({
			name,
			itemStyle: {
				areaColor:
					activeSet.has(name)
						? (HIGHLIGHTED_COUNTRIES.find((c) => c.name === name)?.color ?? '#e8e8e8')
						: '#e8e8e8'
			}
		}));
	}

	function refreshChart() {
		if (!chart) return;
		chart.setOption({
			series: [{ data: buildData() }]
		});
	}

	function toggleCountry(name: string) {
		const next = new Set(activeSet);
		if (next.has(name)) {
			next.delete(name);
		} else {
			next.add(name);
		}
		activeSet = next;
		refreshChart();
	}

	async function initChart() {
		try {
			const response = await fetch(WORLD_GEOJSON_URL);
			if (!response.ok) throw new Error(`HTTP ${response.status}`);
			const geoJson = await response.json();

			echarts.registerMap('world', geoJson);
			chart = echarts.init(container);
			window.addEventListener('resize', handleResize);

			allCountryNames = geoJson.features.map(
				(f: { properties: { name: string } }) => f.properties.name
			);

			const option: echarts.EChartsOption = {
				tooltip: {
					trigger: 'item',
					formatter: (params: unknown) => {
						const p = params as { name: string };
						const label = getCountryLabel(p.name);
						const active = activeSet.has(p.name);
						return `${label}`;
					}
				},
				series: [
					{
						type: 'map',
						map: 'world',
						roam: true,
						zoom: 1.2,
						center: [15, 20],
						scaleLimit: { min: 1, max: 8 },
						itemStyle: {
							areaColor: '#e8e8e8',
							borderColor: '#ffffff',
							borderWidth: 1
						},
						emphasis: {
							label: { show: true, fontSize: 12, color: '#333' },
							itemStyle: { areaColor: '#ffcc00' }
						},
						data: buildData()
					}
				]
			};

			chart.setOption(option);
			loading = false;
		} catch (err) {
			error = `地图加载失败: ${err instanceof Error ? err.message : String(err)}`;
			loading = false;
		}
	}
</script>

<div class="map-wrapper">
	{#if loading}
		<div class="map-status">
			<div class="spinner"></div>
			<p>正在加载世界地图数据...</p>
		</div>
	{/if}
	{#if error}
		<div class="map-status text-red-500">
			<p>{error}</p>
			<button onclick={() => { error = ''; loading = true; initChart(); }}
				class="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition">
				重试
			</button>
		</div>
	{/if}
	<div bind:this={container} class="map-container" class:invisible={loading || !!error}></div>
</div>

<div class="legend">
	<p class="legend-title">图例（点击切换高亮）</p>
	<div class="legend-items">
		{#each HIGHLIGHTED_COUNTRIES as country}
			{@const isActive = activeSet.has(country.name)}
			<button class="legend-item" class:dimmed={!isActive} onclick={() => toggleCountry(country.name)}>
				<span class="legend-swatch" style="background-color: {isActive ? country.color : '#cbd5e1'};"></span>
				<span class="legend-label">{country.label}</span>
				{#if isActive}
					<span class="legend-check">✓</span>
				{:else}
					<span class="legend-check off">—</span>
				{/if}
			</button>
		{/each}
	</div>
</div>

<style>
	.map-wrapper {
		position: relative;
		width: 100%;
		height: calc(100vh - 220px);
		min-height: 420px;
		background: #fff;
		border-radius: 0.75rem;
		overflow: hidden;
		border: 1px solid #e2e8f0;
		box-shadow: 0 1px 3px rgba(0,0,0,0.06);
	}
	.map-container {
		width: 100%;
		height: 100%;
	}
	.map-container.invisible {
		visibility: hidden;
		position: absolute;
	}
	.map-status {
		position: absolute;
		inset: 0;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		z-index: 10;
		color: #94a3b8;
	}
	.spinner {
		width: 40px;
		height: 40px;
		border: 3px solid #e2e8f0;
		border-top-color: #3b82f6;
		border-radius: 50%;
		animation: spin 0.8s linear infinite;
		margin-bottom: 1rem;
	}
	@keyframes spin {
		to { transform: rotate(360deg); }
	}

	/* === 图例 === */
	.legend {
		margin-top: 0.75rem;
		padding: 0.625rem 0.875rem;
		background: #fff;
		border-radius: 0.625rem;
		border: 1px solid #e2e8f0;
		box-shadow: 0 1px 2px rgba(0,0,0,0.04);
	}
	.legend-title {
		font-size: 0.75rem;
		color: #94a3b8;
		margin-bottom: 0.5rem;
	}
	.legend-items {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
	}
	.legend-item {
		display: flex;
		align-items: center;
		gap: 0.375rem;
		padding: 0.25rem 0.625rem;
		border-radius: 0.375rem;
		border: 1px solid #e2e8f0;
		background: #f8fafc;
		cursor: pointer;
		transition: all 0.15s;
		font-size: 0.8125rem;
	}
	.legend-item:hover {
		background: #f1f5f9;
		border-color: #cbd5e1;
	}
	.legend-item.dimmed {
		opacity: 0.5;
	}
	.legend-swatch {
		width: 14px;
		height: 14px;
		border-radius: 3px;
		flex-shrink: 0;
		transition: background-color 0.2s;
	}
	.legend-label {
		font-size: 0.8125rem;
		color: #334155;
	}
	.legend-check {
		font-size: 0.6875rem;
		font-weight: 700;
		color: #22c55e;
		width: 12px;
		text-align: center;
	}
	.legend-check.off {
		color: #94a3b8;
	}
</style>
