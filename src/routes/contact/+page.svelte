<script>
	import { Grid, Row, Column, ClickableTile, Button } from 'carbon-components-svelte';
	import { Email, LogoGithub, LogoLinkedin, Chat, Locked } from 'carbon-icons-svelte';
</script>

<svelte:head>
	<title>Contact</title>
</svelte:head>

<Grid>
	<Row>
		<!-- carbon's lg grid is 16 columns, so an 8-span centers at offset 4 -->
		<Column lg={{ span: 8, offset: 4 }} md={{ span: 6, offset: 1 }} sm={4}>
			<div class="mb-10 mt-4 text-center">
				<h1 class="mb-3 text-4xl font-bold tracking-tight text-[#f4f4f4]">Get in Touch</h1>
				<p class="text-lg text-[#6f6f6f]">Feel free to reach out through any of these channels</p>
			</div>

			<div class="mb-10 flex justify-center">
				<img src="/profile.webp" alt="Sean Behan" class="h-32 w-32 rounded-full border-2 border-[#4589ff]/30 object-cover shadow-lg ring-2 ring-[#4589ff]/10" />
			</div>

			<div class="grid gap-4 md:grid-cols-2">
				<a href="mailto:contact@seanbehan.ca"
					class="card-hover group flex items-center rounded-xl border border-[#393939] bg-[#1c1c1c] p-5 transition-all duration-200 hover:border-[#4589ff]/40">
					<div class="mr-4 flex h-12 w-12 items-center justify-center rounded-lg bg-[#4589ff]/10 text-[#4589ff] transition-colors group-hover:bg-[#4589ff]/20">
						<Email size={24} />
					</div>
					<div>
						<h3 class="text-base font-semibold text-[#f4f4f4]">Email</h3>
						<p class="text-sm text-[#6f6f6f]">contact@seanbehan.ca</p>
					</div>
				</a>

				<a href="https://github.com/codebam" target="_blank" rel="noopener noreferrer"
					class="card-hover group flex items-center rounded-xl border border-[#393939] bg-[#1c1c1c] p-5 transition-all duration-200 hover:border-[#4589ff]/40">
					<div class="mr-4 flex h-12 w-12 items-center justify-center rounded-lg bg-[#6f6f6f]/10 text-[#c6c6c6] transition-colors group-hover:bg-[#6f6f6f]/20">
						<LogoGithub size={24} />
					</div>
					<div>
						<h3 class="text-base font-semibold text-[#f4f4f4]">GitHub</h3>
						<p class="text-sm text-[#6f6f6f]">@codebam</p>
					</div>
				</a>

				<a href="https://www.linkedin.com/in/sean-behan" target="_blank" rel="noopener noreferrer"
					class="card-hover group flex items-center rounded-xl border border-[#393939] bg-[#1c1c1c] p-5 transition-all duration-200 hover:border-[#4589ff]/40">
					<div class="mr-4 flex h-12 w-12 items-center justify-center rounded-lg bg-[#0a66c2]/10 text-[#0a66c2] transition-colors group-hover:bg-[#0a66c2]/20">
						<LogoLinkedin size={24} />
					</div>
					<div>
						<h3 class="text-base font-semibold text-[#f4f4f4]">LinkedIn</h3>
						<p class="text-sm text-[#6f6f6f]">Sean Behan</p>
					</div>
				</a>

				<a href="https://matrix.to/#/@codebam:mozilla.org" target="_blank" rel="noopener noreferrer"
					class="card-hover group flex items-center rounded-xl border border-[#393939] bg-[#1c1c1c] p-5 transition-all duration-200 hover:border-[#4589ff]/40">
					<div class="mr-4 flex h-12 w-12 items-center justify-center rounded-lg bg-[#42be65]/10 text-[#42be65] transition-colors group-hover:bg-[#42be65]/20">
						<Chat size={24} />
					</div>
					<div>
						<h3 class="text-base font-semibold text-[#f4f4f4]">Matrix</h3>
						<p class="text-sm text-[#6f6f6f]">@codebam:mozilla.org</p>
					</div>
				</a>
			</div>

			<div class="mt-8 flex justify-center">
				<Button href="/publickey.txt" kind="tertiary" icon={Locked}>PGP Public Key</Button>
			</div>
		</Column>
	</Row>
</Grid>