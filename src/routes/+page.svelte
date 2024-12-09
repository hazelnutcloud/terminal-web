<script lang="ts">
	import '@xterm/xterm/css/xterm.css';
	import { terminal } from '$lib/terminal';
</script>

<div class="h-svh w-full py-4 px-8 bg-[#1b1e28]">
	<div class="h-full w-full" use:terminal></div>
</div>
