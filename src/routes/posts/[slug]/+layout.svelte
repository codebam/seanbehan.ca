<script lang="ts">
	import type { Snippet } from 'svelte';
	import { Grid, Row, Column } from 'carbon-components-svelte';

	let { children }: { children: Snippet } = $props();
</script>

<Grid>
	<Row>
		<Column lg={{ span: 8, offset: 4 }} md={{ span: 6, offset: 1 }} sm={4}>
			{@render children()}
		</Column>
	</Row>
</Grid>