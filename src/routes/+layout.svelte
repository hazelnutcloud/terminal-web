<script lang="ts">
	import WalletProvider from '$lib/wallet/wallet-provider.svelte';
	import '../app.css';
	let { children } = $props();
</script>

<WalletProvider>
	{@render children()}
</WalletProvider>
