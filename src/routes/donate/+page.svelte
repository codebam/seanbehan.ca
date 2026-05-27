<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { Grid, Row, Column, Button, TextInput, Select, SelectItem, Tile, InlineNotification } from 'carbon-components-svelte';
	import { Currency, Locked, Checkmark, Wallet } from 'carbon-icons-svelte';

	let amountUsd = $state("5.00");
	let network = $state("arbitrum"); // evm, arbitrum, solana, bitcoin
	let callbackUrl = $state("");

	let loading = $state(false);
	let session = $state<any>(null); // holds generated session
	let errorMsg = $state("");
	let successData = $state<any>(null);

	let checking = $state(false);
	let checkInterval: any = null;
	let simulated = $state(false);

	// Auto-detect payment worker URL
	let gatewayUrl = $state("https://x402-crypto-worker.codebam.workers.dev");

	onMount(() => {
		if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
			gatewayUrl = "https://localhost:8787";
		}
		// Dynamically load Solana web3 IIFE library into the DOM
		const script = document.createElement('script');
		script.src = "https://unpkg.com/@solana/web3.js@1.95.3/lib/index.iife.min.js";
		document.head.appendChild(script);
	});

	onDestroy(() => {
		stopVerificationLoop();
	});

	async function requestInvoice() {
		loading = true;
		errorMsg = "";
		session = null;
		successData = null;
		simulated = false;
		stopVerificationLoop();

		try {
			const parsedAmount = parseFloat(amountUsd);
			if (isNaN(parsedAmount) || parsedAmount <= 0) {
				throw new Error("Please enter a valid amount greater than 0");
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

			session = await res.json();
			startVerificationLoop();
		} catch (err: any) {
			errorMsg = err.message || err;
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
						transaction_hash: "check"
					})
				});
				if (res.ok) {
					const data = (await res.json()) as any;
					if (data.session && data.session.status === 'paid') {
						successData = data;
						stopVerificationLoop();
						document.cookie = "disable_ads=true; max-age=31536000; path=/";
					}
				}
			} catch (e) {
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
				const err = (await res.json()) as any;
				throw new Error(err.error || "Verification failed");
			}

			const verified = (await res.json()) as any;
			if (verified.success) {
				successData = verified;
				stopVerificationLoop();
				// Set cookie to disable ads for 1 year
				document.cookie = "disable_ads=true; max-age=31536000; path=/";
			}
		} catch (err: any) {
			errorMsg = err.message || err;
		} finally {
			loading = false;
		}
	}

	async function simulatePayment() {
		if (!session) return;
		simulated = true;
		const mockHash = "mock_" + Array.from({length: 60}, () => Math.floor(Math.random()*16).toString(16)).join('');
		await verifyPayment(mockHash);
	}

	async function payWithWeb3() {
		if (!session) return;
		errorMsg = "";
		const parsedAmount = parseFloat(amountUsd);

		try {
			if (network === 'solana') {
				const solana = (window as any).solana;
				if (!solana || !solana.isPhantom) {
					throw new Error("Phantom Wallet not detected! Please install Phantom to sign Solana payments.");
				}
				await solana.connect();
				const userAddress = solana.publicKey.toString();

				const solanaWeb3 = (window as any).solanaWeb3;
				if (!solanaWeb3) {
					throw new Error("Solana Web3 library is loading, please try again in a second.");
				}
				
				const connection = new solanaWeb3.Connection("https://api.devnet.solana.com", "confirmed");
				
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
				const provider = (window as any).ethereum;
				if (!provider) {
					throw new Error("Web3 Wallet extension not detected! Please install Uniswap Wallet or MetaMask.");
				}

				const accounts = await provider.request({ method: 'eth_requestAccounts' });
				const userAddress = accounts[0];

				// Determine target chain
				let targetHex = '0x1';
				let targetName = 'Ethereum Mainnet';
				if (session.network_id === 'eip155:11155111') {
					targetHex = '0xaa36a7';
					targetName = 'Sepolia';
				} else if (session.network_id === 'eip155:42161') {
					targetHex = '0xa4b1';
					targetName = 'Arbitrum One';
				} else if (session.network_id === 'eip155:421614') {
					targetHex = '0x66eee';
					targetName = 'Arbitrum Sepolia';
				}

				// Switch chain
				try {
					await provider.request({
						method: 'wallet_switchEthereumChain',
						params: [{ chainId: targetHex }]
					});
				} catch (switchError: any) {
					if (switchError.code === 4902) {
						if (session.network_id === 'eip155:42161') {
							await provider.request({
								method: 'wallet_addEthereumChain',
								params: [{
									chainId: '0xa4b1',
									chainName: 'Arbitrum One',
									nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
									rpcUrls: ['https://arb1.arbitrum.io/rpc'],
									blockExplorerUrls: ['https://arbiscan.io']
								}]
							});
						} else if (session.network_id === 'eip155:421614') {
							await provider.request({
								method: 'wallet_addEthereumChain',
								params: [{
									chainId: '0x66eee',
									chainName: 'Arbitrum Sepolia',
									nativeCurrency: { name: 'Arbitrum ETH', symbol: 'ETH', decimals: 18 },
									rpcUrls: ['https://sepolia-rollup.arbitrum.io/rpc'],
									blockExplorerUrls: ['https://sepolia.arbiscan.io']
								}]
							});
						}
					} else {
						throw switchError;
					}
				}

				// Assemble transfer parameters (ETH or USDC)
				let txParams: any = {};

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
					const usdcContract = session.network_id === 'eip155:42161'
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

				const txHash = await provider.request({
					method: 'eth_sendTransaction',
					params: [txParams]
				});

				await verifyPayment(txHash);
			}
		} catch (err: any) {
			errorMsg = err.message || err;
		}
	}
</script>

<svelte:head>
	<title>Support & Donate | Sean Behan</title>
</svelte:head>

<Grid class="py-12">
	<Row>
		<Column lg={{ span: 8, offset: 2 }} md={{ span: 6, offset: 1 }} sm={4}>
			
			<div class="mt-8 mb-8 text-center space-y-2">
				<h1 class="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent">
					Support Sean Behan
				</h1>
				<p class="text-lg text-gray-400">
					Donate any amount on any network to bypass and disable AdSense ads globally.
				</p>
			</div>

			{#if errorMsg}
				<div class="mb-6">
					<InlineNotification kind="error" title="Payment Error" subtitle={errorMsg} hideCloseButton />
				</div>
			{/if}

			{#if successData}
				<Tile class="bg-green-950/20 border border-green-800/40 rounded-2xl p-6 text-center space-y-6">
					<div class="w-16 h-16 rounded-full bg-green-900/30 border border-green-700/50 flex items-center justify-center mx-auto text-green-400 shadow-lg">
						<Checkmark size={32} />
					</div>
					<div class="space-y-1">
						<h2 class="text-2xl font-bold text-white">Donation Cleared successfully!</h2>
						<p class="text-sm text-gray-400">
							Thank you so much for your support! Secure ad-bypass cookie has been set. Ads are now disabled globally.
						</p>
					</div>
					<div class="pt-4">
						<Button href="/" kind="primary">Return Home</Button>
					</div>
				</Tile>
			{:else}
				<div class="grid gap-8 md:grid-cols-12">
					
					<!-- Left Column: Controls -->
					<div class="md:col-span-6 space-y-6">
						<Tile class="bg-gray-900/40 border border-gray-800/60 rounded-2xl p-6 space-y-6 shadow-xl">
							<h3 class="text-xl font-bold text-gray-200 flex items-center gap-2">
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
									class="w-full bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-400 hover:to-indigo-400 text-white font-semibold py-3 rounded-xl transition"
								>
									{loading ? "Generating Paywall..." : "Request Invoice"}
								</Button>
							</div>
						</Tile>
					</div>

					<!-- Right Column: Invoice challenge -->
					<div class="md:col-span-6 flex flex-col justify-stretch">
						{#if session}
							<Tile class="bg-gray-900/40 border border-gray-800/60 rounded-2xl p-6 flex flex-col items-center justify-center text-center space-y-6 shadow-xl flex-1">
								<div class="space-y-1">
									<span class="px-2.5 py-0.5 text-[10px] uppercase font-bold tracking-widest rounded bg-rose-950/40 text-rose-400 border border-rose-800/30">
										Unpaid Invoice
									</span>
									<h4 class="text-lg font-bold text-white mt-2">Dynamic Multi-Chain Paywall</h4>
								</div>

								<!-- QR Image -->
								<div class="bg-white p-3 rounded-2xl shadow-xl w-44 h-44 flex items-center justify-center">
									<img src={session.qr_code_uri} alt="Donation QR Code" class="w-full h-full" />
								</div>

								<!-- Payee Address Detail -->
								<div class="space-y-1 w-full text-left">
									<label class="text-[10px] uppercase font-bold text-gray-500 tracking-wider">Donation payee Address</label>
									<div class="px-3 py-2.5 bg-gray-950/60 rounded-xl border border-gray-800/50 font-mono text-xs text-gray-300 truncate select-all">
										{session.payee_address}
									</div>
								</div>

								<!-- Invoice specs -->
								<div class="grid grid-cols-2 gap-4 w-full text-left text-xs">
									<div class="bg-gray-950/60 p-3 rounded-xl border border-gray-800/50">
										<span class="block text-gray-500 text-[9px] uppercase font-bold tracking-wider">Amount</span>
										<span class="font-bold text-gray-200">${amountUsd} USD</span>
									</div>
									<div class="bg-gray-950/60 p-3 rounded-xl border border-gray-800/50">
										<span class="block text-gray-500 text-[9px] uppercase font-bold tracking-wider">Network</span>
										<span class="font-bold text-gray-200 capitalize">{network}</span>
									</div>
								</div>

								<!-- Signing triggers -->
								<div class="w-full space-y-3 pt-2">
									{#if network !== 'bitcoin'}
										<Button onclick={payWithWeb3} class="w-full flex items-center justify-center gap-2" kind="secondary">
											<Wallet size={16} />
											Pay with Web3 Wallet
										</Button>
									{/if}
								</div>

								{#if checking}
									<div class="text-[10px] text-gray-500 italic animate-pulse">
										Monitoring on-chain address for deposits...
									</div>
								{/if}
							</Tile>
						{:else}
							<Tile class="bg-gray-900/40 border border-gray-800/60 rounded-2xl p-6 flex flex-col items-center justify-center text-center space-y-4 shadow-xl flex-1 min-h-[300px]">
								<div class="w-12 h-12 rounded-full bg-gray-950/60 border border-gray-800/50 flex items-center justify-center mx-auto text-gray-400">
									<Locked size={24} />
								</div>
								<div class="space-y-1">
									<h4 class="text-md font-semibold text-gray-300">Invoice Generation Locked</h4>
									<p class="text-xs text-gray-500 max-w-[200px] mx-auto">
										Enter your donation details and click "Request Invoice" to unlock checkout tools.
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
