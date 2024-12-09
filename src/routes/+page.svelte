<script lang="ts">
	import '@xterm/xterm/css/xterm.css';
	import { terminal } from '$lib/terminal.svelte';
	import { getContext } from 'svelte';
	import type { WalletContext } from '$lib/wallet/wallet-provider.svelte';

	const walletContext = getContext<WalletContext>('wallet');
</script>

<div class="h-svh w-full bg-[#1b1e28] px-8 py-4">
	<div class="h-full w-full" use:terminal={{ walletContext }}></div>
</div>
