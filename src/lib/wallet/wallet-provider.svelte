<script module lang="ts">
	export interface WalletContext {
		readonly account: GetAccountReturnType<Config, Chain>;
		config: Config;
		modal: AppKit;
	}
</script>

<script lang="ts">
	import { AppKit, createAppKit } from '@reown/appkit';
	import { WagmiAdapter } from '@reown/appkit-adapter-wagmi';
	import {
		getAccount,
		reconnect,
		watchAccount,
		type Config,
		type GetAccountReturnType
	} from '@wagmi/core';
	import { setContext } from 'svelte';
	import { sepolia, type Chain } from 'viem/chains';

	const { children } = $props();

	const projectId = 'edf0e9a9365989f8817db91634a6c063';
	const networks = [sepolia] as [typeof sepolia];

	const wagmiAdapter = new WagmiAdapter({
		projectId,
		networks
	});

	const modal = createAppKit({
		adapters: [wagmiAdapter],
		networks,
		metadata: {
			name: 'pyliza',
			description: 'Pyliza',
			url: 'https://pyliza.com',
			icons: ['https://avatars.githubusercontent.com/u/190728023?s=48&v=4']
		},
		projectId
	});

	$effect(() => {
		watchAccount(wagmiAdapter.wagmiConfig, {
			onChange(newAccount) {
				account = newAccount;
			}
		});
	});

	let account = $state.raw(getAccount(wagmiAdapter.wagmiConfig));

	setContext('wallet', {
		get account() {
			return account;
		},
		config: wagmiAdapter.wagmiConfig,
		modal
	});
</script>

{@render children()}
