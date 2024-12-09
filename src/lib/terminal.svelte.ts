import { Terminal } from "@xterm/xterm";
import { WebglAddon } from "@xterm/addon-webgl"
import { FitAddon } from "@xterm/addon-fit";
import chalk from "chalk";
import type { Action } from "svelte/action";
import { command as brocli, run, type BroCliConfig } from "@drizzle-team/brocli"
import { reconnect } from "@wagmi/core";
import { truncateAddress } from "./utils/format";
import type { WalletContext } from "./wallet/wallet-provider.svelte";

const theme = {
  foreground: '#a6accd',
  background: '#1b1e28',
  selection: '#a6accd',
  black: '#1b1e28',
  brightBlack: '#a6accd',
  red: '#d0679d',
  brightRed: '#d0679d',
  green: '#5de4c7',
  brightGreen: '#5de4c7',
  yellow: '#fffac2',
  brightYellow: '#fffac2',
  blue: '#89ddff',
  brightBlue: '#add7ff',
  magenta: '#fcc5e9',
  brightMagenta: '#fae4fc',
  cyan: '#add7ff',
  brightCyan: '#89ddff',
  white: '#ffffff',
  brightWhite: '#ffffff'
}

export const terminal: Action<HTMLElement, { walletContext: WalletContext }> = (node, { walletContext }) => {
  const term = new Terminal({
    cursorBlink: true,
    fontFamily: '"Kode Mono", monospace',
    theme,
    convertEol: true
  })

  const originalLog = console.log
  const originalError = console.error
  console.log = console.error = (...args: unknown[]) => {
    term.write(args.join(" "))
  }

  const commands = [
    brocli({
      name: "wallet",
      desc: "connect and manage wallet.",
      handler: () => {
        console.log("opened wallet modal.")
        walletContext.modal.open()
      },
    }),
    brocli({
      name: "mint",
      desc: "mint an NFT.",
      handler: async () => {
        console.log("minting..")
        await new Promise((resolve) => {
          setTimeout(() => resolve(null), 2000)
        })
      }
    })
  ]

  const prompt = () => {
    term.writeln(chalk.blue(`\r\n${walletContext.account.address ? truncateAddress(walletContext.account.address) : "anon"}`))
    term.write(chalk.magenta("> "))
  }

  const runCommand = async () => {
    const args = command.trim().split(' ');
    if (args[0]?.length > 0) {
      term.writeln('')
      await run(commands, {
        argSource: ["", "", ...args],
        noExit: true,
        version: "0.0.1"
      } as BroCliConfig)
    }
    term.writeln("")
    prompt()
  }

  const fitAddon = new FitAddon()

  term.loadAddon(new WebglAddon())
  term.loadAddon(fitAddon)

  term.open(node)
  fitAddon.fit();

  term.writeln(chalk.blue("                ___                           "))
  term.writeln(chalk.blue("               /\\_ \\    __                    "))
  term.writeln(chalk.blue(" _____   __  __\\//\\ \\  /\\_\\  ____      __     "))
  term.writeln(chalk.blue("/\\ '__`\\/\\ \\/\\ \\ \\ \\ \\ \\/\\ \\/\\_ ,`\\  /'__`\\   "))
  term.writeln(chalk.blue("\\ \\ \\L\\ \\ \\ \\_\\ \\ \\_\\ \\_\\ \\ \\/_/  /_/\\ \\L\\.\\_ "))
  term.writeln(chalk.blue(" \\ \\ ,__/\\/`____ \\/\\____\\\\ \\_\\/\\____\\ \\__/.\\_\\"))
  term.writeln(chalk.blue("  \\ \\ \\/  `/___/> \\/____/ \\/_/\\/____/\\/__/\\/_/"))
  term.writeln(chalk.blue("   \\ \\_\\     /\\___/                           "))
  term.writeln(chalk.blue("    \\/_/     \\/__/                            "))
  term.writeln("")
  term.writeln(chalk.green("enter `help` to get started."))

  reconnect(walletContext.config).then(() => {
    prompt()
  })

  let command = ''

  term.onData(e => {
    switch (e) {
      case '\u0003': // Ctrl+C
        term.writeln('^C');
        prompt();
        break;
      case '\r': // Enter
        runCommand();
        command = '';
        break;
      case '\u007F': // Backspace (DEL)
        // Do not delete the prompt
        if (term.buffer.active.cursorX > 2) {
          term.write('\b \b');
          if (command.length > 0) {
            command = command.slice(0, command.length - 1);
          }
        }
        break;
      default: // Print all other characters for demo
        if (e >= String.fromCharCode(0x20) && e <= String.fromCharCode(0x7E) || e >= '\u00a0') {
          command += e;
          term.write(e);
        }
    }
  });

  $effect(() => {
    return () => {
      console.log = originalLog
      console.error = originalError
    }
  })
}