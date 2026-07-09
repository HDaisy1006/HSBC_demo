<script lang="ts">
	import './layout.css';

	let { children } = $props();
</script>

<div class="min-h-screen bg-gray-50 text-gray-800">
	{@render children()}
</div>
