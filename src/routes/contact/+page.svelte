<script>
	import { Grid, Row, Column, ClickableTile, Button } from 'carbon-components-svelte';
	import { Email, LogoGithub, LogoLinkedin, Chat, Locked } from 'carbon-icons-svelte';
</script>

<svelte:head>
	<title>Contact</title>
</svelte:head>

<Grid>
	<Row>
		<Column lg={{ span: 8, offset: 2 }} md={{ span: 6, offset: 1 }} sm={4}>
			<div class="mb-8 text-center mt-8">
				<h1 class="mb-4 text-4xl font-bold">Get in Touch</h1>
				<p class="text-gray-500 text-lg">
					Feel free to reach out through any of these channels
				</p>
			</div>
			
			<div class="mb-8 flex justify-center">
				<img src="/profile.webp" alt="Sean Behan profile photo" class="w-32 h-32 rounded-full" />
			</div>

			<div class="grid gap-4 md:grid-cols-2">
				<ClickableTile href="mailto:contact@seanbehan.ca">
					<div class="flex items-center">
						<div class="mr-4 text-blue-600">
							<Email size={32} />
						</div>
						<div>
							<h3 class="text-lg font-semibold">Email</h3>
							<p>contact@seanbehan.ca</p>
						</div>
					</div>
				</ClickableTile>

				<ClickableTile href="https://github.com/codebam">
					<div class="flex items-center">
						<div class="mr-4">
							<LogoGithub size={32} />
						</div>
						<div>
							<h3 class="text-lg font-semibold">GitHub</h3>
							<p>@codebam</p>
						</div>
					</div>
				</ClickableTile>

				<ClickableTile href="https://www.linkedin.com/in/sean-behan">
					<div class="flex items-center">
						<div class="mr-4 text-blue-700">
							<LogoLinkedin size={32} />
						</div>
						<div>
							<h3 class="text-lg font-semibold">LinkedIn</h3>
							<p>Sean Behan</p>
						</div>
					</div>
				</ClickableTile>

				<ClickableTile href="https://matrix.to/#/@codebam:envs.net">
					<div class="flex items-center">
						<div class="mr-4 text-green-600">
							<Chat size={32} />
						</div>
						<div>
							<h3 class="text-lg font-semibold">Matrix</h3>
							<p>@codebam:envs.net</p>
						</div>
					</div>
				</ClickableTile>
			</div>

			<div class="mt-8 text-center flex justify-center">
				<Button href="/publickey.txt" kind="tertiary" icon={Locked}>
					PGP Public Key
				</Button>
			</div>
		</Column>
	</Row>
</Grid>
