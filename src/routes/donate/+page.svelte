<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import {
		Grid,
		Row,
		Column,
		Button,
		TextInput,
		Select,
		SelectItem,
		Tile,
		InlineNotification
	} from 'carbon-components-svelte';
	import { Currency, Locked, Checkmark, Wallet } from 'carbon-icons-svelte';

	/** Invoice returned by the payment gateway's /api/payment/create. */
	interface PaymentSession {
		payee_address: string;
		network_id: string;
		qr_code_uri: string;
	}

	/** Reply from /api/payment/verify, for both polling and explicit checks. */
	interface VerifyResponse {
		success?: boolean;
		error?: string;
		session?: { status?: string };
	}

	/** EIP-1193 wallet (MetaMask, Uniswap Wallet). Results are unknown by
	 *  design — each caller narrows to what its own method returns. */
	interface EthereumProvider {
		request(args: { method: string; params?: unknown[] }): Promise<unknown>;
	}

	interface PhantomProvider {
		isPhantom?: boolean;
		publicKey: { toString(): string };
		connect(): Promise<unknown>;
		signAndSendTransaction(transaction: SolanaTransaction): Promise<{ signature: string }>;
	}

	interface SolanaTransaction {
		add(instruction: unknown): SolanaTransaction;
		feePayer: unknown;
		recentBlockhash: string;
	}

	/** The subset of the @solana/web3.js IIFE bundle this page touches. */
	interface SolanaWeb3 {
		Connection: new (
			endpoint: string,
			commitment: string
		) => { getLatestBlockhash(): Promise<{ blockhash: string }> };
		Transaction: new () => SolanaTransaction;
		PublicKey: new (address: string) => unknown;
		SystemProgram: {
			transfer(params: { fromPubkey: unknown; toPubkey: unknown; lamports: number }): unknown;
		};
	}

	interface WalletWindow extends Window {
		ethereum?: EthereumProvider;
		solana?: PhantomProvider;
		solanaWeb3?: SolanaWeb3;
	}

	interface EvmTxParams {
		from: string;
		to: string;
		value: string;
		data?: string;
	}

	/** Wallets reject with a plain object carrying a numeric `code`, not an Error. */
	function hasCode(err: unknown): err is { code: number } {
		return (
			typeof err === 'object' &&
			err !== null &&
			typeof (err as { code?: unknown }).code === 'number'
		);
	}

	/** Mirrors the previous `err.message || err`, but without assuming a shape. */
	function messageFrom(err: unknown): string {
		if (err instanceof Error) return err.message;
		if (typeof err === 'string') return err;
		return 'Something went wrong';
	}

	let amountUsd = $state('5.00');
	let network = $state('arbitrum'); // evm, arbitrum, solana, bitcoin
	let callbackUrl = $state('');

	let loading = $state(false);
	let session = $state<PaymentSession | null>(null); // holds generated session
	let errorMsg = $state('');
	let successData = $state<VerifyResponse | null>(null);

	let checking = $state(false);
	let checkInterval: ReturnType<typeof setInterval> | null = null;

	// Auto-detect payment worker URL
	let gatewayUrl = $state('https://x402-crypto-worker.codebam.workers.dev');

	onMount(() => {
		if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
			gatewayUrl = 'https://localhost:8787';
		}
		// Dynamically load Solana web3 IIFE library into the DOM
		const script = document.createElement('script');
		script.src = 'https://unpkg.com/@solana/web3.js@1.95.3/lib/index.iife.min.js';
		document.head.appendChild(script);
	});

	onDestroy(() => {
		stopVerificationLoop();
	});

	async function requestInvoice() {
		loading = true;
		errorMsg = '';
		session = null;
		successData = null;
		stopVerificationLoop();

		try {
			const parsedAmount = parseFloat(amountUsd);
			if (isNaN(parsedAmount) || parsedAmount <= 0) {
				throw new Error('Please enter a valid amount greater than 0');
			}

			const res = await fetch(`${gatewayUrl}/api/payment/create`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					amount_usd: parsedAmount,
					network,
					callback_url: callbackUrl
				})
			});

			if (!res.ok) {
				const errText = await res.text();
				throw new Error(errText || `Server returned status ${res.status}`);
			}

			session = (await res.json()) as PaymentSession;
			startVerificationLoop();
		} catch (err) {
			errorMsg = messageFrom(err);
		} finally {
			loading = false;
		}
	}

	function startVerificationLoop() {
		checking = true;
		checkInterval = setInterval(async () => {
			if (!session) return;
			// Automatically polls the verification endpoint for BTC or self-pay addresses
			try {
				const res = await fetch(`${gatewayUrl}/api/payment/verify`, {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({
						payee_address: session.payee_address,
						transaction_hash: 'check'
					})
				});
				if (res.ok) {
					const data = (await res.json()) as VerifyResponse;
					if (data.session && data.session.status === 'paid') {
						successData = data;
						stopVerificationLoop();
						document.cookie = 'disable_ads=true; max-age=31536000; path=/';
					}
				}
			} catch {
				// silent catch during polling
			}
		}, 6000);
	}

	function stopVerificationLoop() {
		checking = false;
		if (checkInterval) {
			clearInterval(checkInterval);
			checkInterval = null;
		}
	}

	async function verifyPayment(txHash: string) {
		if (!session) return;
		try {
			loading = true;
			const res = await fetch(`${gatewayUrl}/api/payment/verify`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					payee_address: session.payee_address,
					transaction_hash: txHash
				})
			});

			if (!res.ok) {
				const err = (await res.json()) as VerifyResponse;
				throw new Error(err.error || 'Verification failed');
			}

			const verified = (await res.json()) as VerifyResponse;
			if (verified.success) {
				successData = verified;
				stopVerificationLoop();
				// Set cookie to disable ads for 1 year
				document.cookie = 'disable_ads=true; max-age=31536000; path=/';
			}
		} catch (err) {
			errorMsg = messageFrom(err);
		} finally {
			loading = false;
		}
	}

	async function payWithWeb3() {
		if (!session) return;
		errorMsg = '';
		const parsedAmount = parseFloat(amountUsd);

		const walletWindow = window as WalletWindow;

		try {
			if (network === 'solana') {
				const solana = walletWindow.solana;
				if (!solana || !solana.isPhantom) {
					throw new Error(
						'Phantom Wallet not detected! Please install Phantom to sign Solana payments.'
					);
				}
				await solana.connect();
				const userAddress = solana.publicKey.toString();

				const solanaWeb3 = walletWindow.solanaWeb3;
				if (!solanaWeb3) {
					throw new Error('Solana Web3 library is loading, please try again in a second.');
				}

				const connection = new solanaWeb3.Connection('https://api.devnet.solana.com', 'confirmed');

				// Map USD amount dynamically: $1 -> 0.01 SOL = parsedAmount * 10,000,000 lamports
				const lamports = Math.floor(parsedAmount * 10000000);

				const transaction = new solanaWeb3.Transaction().add(
					solanaWeb3.SystemProgram.transfer({
						fromPubkey: new solanaWeb3.PublicKey(userAddress),
						toPubkey: new solanaWeb3.PublicKey(session.payee_address),
						lamports: lamports
					})
				);

				transaction.feePayer = new solanaWeb3.PublicKey(userAddress);
				const { blockhash } = await connection.getLatestBlockhash();
				transaction.recentBlockhash = blockhash;

				const { signature } = await solana.signAndSendTransaction(transaction);
				await verifyPayment(signature);
			} else {
				// EVM / Arbitrum MetaMask / Uniswap Wallet
				const provider = walletWindow.ethereum;
				if (!provider) {
					throw new Error(
						'Web3 Wallet extension not detected! Please install Uniswap Wallet or MetaMask.'
					);
				}

				const accounts = (await provider.request({ method: 'eth_requestAccounts' })) as string[];
				const userAddress = accounts[0];

				// Determine target chain
				let targetHex = '0x1';
				if (session.network_id === 'eip155:11155111') {
					targetHex = '0xaa36a7';
				} else if (session.network_id === 'eip155:42161') {
					targetHex = '0xa4b1';
				} else if (session.network_id === 'eip155:421614') {
					targetHex = '0x66eee';
				}

				// Switch chain
				try {
					await provider.request({
						method: 'wallet_switchEthereumChain',
						params: [{ chainId: targetHex }]
					});
				} catch (switchError) {
					if (hasCode(switchError) && switchError.code === 4902) {
						if (session.network_id === 'eip155:42161') {
							await provider.request({
								method: 'wallet_addEthereumChain',
								params: [
									{
										chainId: '0xa4b1',
										chainName: 'Arbitrum One',
										nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
										rpcUrls: ['https://arb1.arbitrum.io/rpc'],
										blockExplorerUrls: ['https://arbiscan.io']
									}
								]
							});
						} else if (session.network_id === 'eip155:421614') {
							await provider.request({
								method: 'wallet_addEthereumChain',
								params: [
									{
										chainId: '0x66eee',
										chainName: 'Arbitrum Sepolia',
										nativeCurrency: { name: 'Arbitrum ETH', symbol: 'ETH', decimals: 18 },
										rpcUrls: ['https://sepolia-rollup.arbitrum.io/rpc'],
										blockExplorerUrls: ['https://sepolia.arbiscan.io']
									}
								]
							});
						}
					} else {
						throw switchError;
					}
				}

				// Assemble transfer parameters (ETH or USDC)
				let txParams: EvmTxParams;

				if (session.network_id === 'eip155:11155111' || session.network_id === 'eip155:421614') {
					// ETH: Map dynamic amount: parsedAmount * 10^12 Wei (0.0001 ETH per $0.10)
					const valueWei = BigInt(Math.floor(parsedAmount * 1000) * 1000000000000);
					txParams = {
						from: userAddress,
						to: session.payee_address,
						value: '0x' + valueWei.toString(16)
					};
				} else {
					// USDC contract
					const usdcContract =
						session.network_id === 'eip155:42161'
							? '0xaf88d065e77c8cC2239327C5EDb3A432268e5831' // Arbitrum USDC
							: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48'; // Ethereum USDC

					const usdcDecimals = BigInt(Math.floor(parsedAmount * 1000000));
					const cleanAddress = session.payee_address.toLowerCase().replace('0x', '');
					const paddedAddress = cleanAddress.padStart(64, '0');
					const paddedValue = usdcDecimals.toString(16).padStart(64, '0');
					const txData = '0xa9059cbb' + paddedAddress + paddedValue;

					txParams = {
						from: userAddress,
						to: usdcContract,
						data: txData,
						value: '0x0'
					};
				}

				const txHash = (await provider.request({
					method: 'eth_sendTransaction',
					params: [txParams]
				})) as string;

				await verifyPayment(txHash);
			}
		} catch (err) {
			errorMsg = messageFrom(err);
		}
	}
</script>

<svelte:head>
	<title>Support & Donate | Sean Behan</title>
</svelte:head>

<Grid class="py-12">
	<Row>
		<!-- carbon's lg grid is 16 columns, so an 8-span centers at offset 4 -->
		<Column lg={{ span: 8, offset: 4 }} md={{ span: 6, offset: 1 }} sm={4}>
			<div class="mt-8 mb-8 space-y-2 text-center">
				<h1
					class="bg-gradient-to-r from-[var(--accent-blue)] via-[var(--accent-blue-light)] to-[var(--accent-magenta)] bg-clip-text text-4xl font-extrabold tracking-tight text-transparent"
				>
					Support Sean Behan
				</h1>
				<p class="text-lg text-gray-400">
					Donate any amount on any network to bypass and disable AdSense ads globally.
				</p>
			</div>

			{#if errorMsg}
				<div class="mb-6">
					<InlineNotification
						kind="error"
						title="Payment Error"
						subtitle={errorMsg}
						hideCloseButton
					/>
				</div>
			{/if}

			{#if successData}
				<Tile
					class="space-y-6 rounded-2xl border border-[var(--accent-green)]/40 bg-[var(--accent-green)]/20 p-6 text-center"
				>
					<div
						class="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-[var(--accent-green)]/50 bg-[var(--accent-green)]/30 text-[var(--accent-green)] shadow-lg"
					>
						<Checkmark size={32} />
					</div>
					<div class="space-y-1">
						<h2 class="text-2xl font-bold text-[var(--text-primary)]">
							Donation Cleared successfully!
						</h2>
						<p class="text-sm text-[var(--text-tertiary)]">
							Thank you so much for your support! Secure ad-bypass cookie has been set. Ads are now
							disabled globally.
						</p>
					</div>
					<div class="pt-4">
						<Button href="/" kind="primary">Return Home</Button>
					</div>
				</Tile>
			{:else}
				<div class="grid gap-8 md:grid-cols-12">
					<!-- Left Column: Controls -->
					<div class="space-y-6 md:col-span-6">
						<Tile
							class="space-y-6 rounded-2xl border border-gray-800/60 bg-gray-900/40 p-6 shadow-xl"
						>
							<h3 class="flex items-center gap-2 text-xl font-bold text-gray-200">
								<Currency size={20} class="text-indigo-400" />
								Configure Donation
							</h3>

							<div class="space-y-4">
								<TextInput
									labelText="Donation Amount (USD)"
									placeholder="5.00"
									bind:value={amountUsd}
									type="text"
								/>

								<Select labelText="Select Blockchain Network" bind:selected={network}>
									<SelectItem value="arbitrum" text="Arbitrum One (L2 EVM)" />
									<SelectItem value="evm" text="Ethereum / Sepolia" />
									<SelectItem value="solana" text="Solana Devnet / Mainnet" />
									<SelectItem value="bitcoin" text="Bitcoin Testnet / Mainnet" />
								</Select>
							</div>

							<div class="pt-4">
								<Button
									onclick={requestInvoice}
									disabled={loading}
									class="w-full rounded-xl bg-gradient-to-r from-blue-500 to-indigo-500 py-3 font-semibold text-white transition hover:from-blue-400 hover:to-indigo-400"
								>
									{loading ? 'Generating Paywall...' : 'Request Invoice'}
								</Button>
							</div>
						</Tile>
					</div>

					<!-- Right Column: Invoice challenge -->
					<div class="flex flex-col justify-stretch md:col-span-6">
						{#if session}
							<Tile
								class="flex flex-1 flex-col items-center justify-center space-y-6 rounded-2xl border border-[var(--border-subtle)]/60 bg-gradient-to-br from-[var(--surface-card)] to-[var(--surface-card-alt)] p-6 text-center shadow-xl"
							>
								<div class="space-y-1">
									<span
										class="rounded border border-rose-800/30 bg-rose-950/40 px-2.5 py-0.5 text-[10px] font-bold tracking-widest text-rose-400 uppercase"
									>
										Unpaid Invoice
									</span>
									<h4 class="mt-2 text-lg font-bold text-[var(--text-primary)]">
										Dynamic Multi-Chain Paywall
									</h4>
								</div>

								<!-- QR Image -->
								<div
									class="flex h-44 w-44 items-center justify-center rounded-2xl bg-white p-3 shadow-xl"
								>
									<img src={session.qr_code_uri} alt="Donation QR Code" class="h-full w-full" />
								</div>

								<!-- Payee Address Detail -->
								<div class="w-full space-y-1 text-left">
									<!-- A caption over a read-only value, not a form control, so it is a
									     span like the sibling captions below rather than a <label>. -->
									<span class="block text-[10px] font-bold tracking-wider text-gray-500 uppercase"
										>Donation payee Address</span
									>
									<div
										class="truncate rounded-xl border border-[var(--border-subtle)]/50 bg-[var(--surface-base)]/60 px-3 py-2.5 font-mono text-xs text-[var(--text-tertiary)] select-all"
									>
										{session.payee_address}
									</div>
								</div>

								<!-- Invoice specs -->
								<div class="rounded-xl border border-gray-800/50 bg-gray-950/60 p-3">
									<span class="block text-[9px] font-bold tracking-wider text-gray-500 uppercase"
										>Amount</span
									>
									<span class="font-bold text-gray-200">${amountUsd} USD</span>
								</div>
								<div class="rounded-xl border border-gray-800/50 bg-gray-950/60 p-3">
									<span class="block text-[9px] font-bold tracking-wider text-gray-500 uppercase"
										>Network</span
									>
									<span class="font-bold text-gray-200 capitalize">{network}</span>
								</div>

								<!-- Signing triggers -->
								<div class="w-full space-y-3 pt-2">
									{#if network !== 'bitcoin'}
										<Button
											onclick={payWithWeb3}
											class="flex w-full items-center justify-center gap-2"
											kind="secondary"
										>
											<Wallet size={16} />
											Pay with Web3 Wallet
										</Button>
									{/if}
								</div>

								{#if checking}
									<div class="animate-pulse text-[10px] text-gray-500 italic">
										Monitoring on-chain address for deposits...
									</div>
								{/if}
							</Tile>
						{:else}
							<Tile
								class="flex min-h-[300px] flex-1 flex-col items-center justify-center space-y-4 rounded-2xl border border-[var(--border-subtle)]/60 bg-gradient-to-br from-[var(--surface-card)] to-[var(--surface-card-alt)] p-6 text-center shadow-xl"
							>
								<div
									class="mx-auto flex h-12 w-12 items-center justify-center rounded-full border border-[var(--border-subtle)]/50 bg-[var(--surface-base)]/60 text-[var(--text-tertiary)]"
								>
									<Locked size={24} />
								</div>
								<div class="space-y-1">
									<h4 class="text-md font-semibold text-[var(--text-secondary)]">
										Invoice Generation Locked
									</h4>
									<p class="mx-auto max-w-[200px] text-xs text-[var(--text-tertiary)]">
										Enter your donation details and click "Request Invoice" to unlock checkout
										tools.
									</p>
								</div>
							</Tile>
						{/if}
					</div>
				</div>
			{/if}
		</Column>
	</Row>
</Grid>
