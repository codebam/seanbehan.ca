<script lang="ts">
    const { data } = $props<{
        data: {
            title: string;
            date: string;
            html: string;
        }
    }>();
</script>

<svelte:head>
    <title>{data.title}</title>
    <meta name="description" content={data.title} />
    <meta property="og:title" content={data.title} />
    <meta property="og:description" content={data.title} />
    <meta property="og:type" content="article" />
    <meta property="article:published_time" content={data.date} />
    <link rel="stylesheet" href="https://prismjs.catppuccin.com/mocha.css" />
    <link rel="stylesheet" href="/cactus.css" type="text/css" />
</svelte:head>

<slot />