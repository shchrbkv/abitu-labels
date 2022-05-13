<script>
	import { fix_position } from 'svelte/internal';

	export let app;
	export let priority;

	let current;
	let selected = false;

	function select() {
		if (selected) {
			selected = false;
			app.priority = null;
			priority -= 1;
			return;
		}
		selected = true;
		app.priority = priority;
		current = priority;
		priority += 1;
	}
</script>

<div class:selected on:click={select} class="card">
	<div class="half">
		<p>{app.program.okso}<br /><span>Всего мест: {app.program.spots}</span></p>
	</div>
	<div class="half">
		{#if selected}
			<h4 class="priority">{current} &#9989;</h4>
		{:else}
			<h4 class="priority">{priority}</h4>
		{/if}
	</div>
	<div class="half">
		<h4>{app.stats.position.absolute}<span>/{app.program.stats.applications.total}</span></h4>
		<p>позиция</p>
	</div>
	<div class="half">
		{#if app.stats.distance < 0}
			<h4 style="color:#E6200A">{-app.stats.distance} &uarr</h4>
			<p>до черты</p>
		{:else}
			<h4 style="color:#35C41C">{app.stats.distance} &darr</h4>
			<p>до черты</p>
		{/if}
	</div>
	<div class="half">
		<h4>{app.score.total}</h4>
		<p>мой балл</p>
	</div>
	<div class="half">
		<h4>{app.program.stats.bounds.total.iqr[0]}&ndash;{app.program.stats.bounds.total.iqr[1]}</h4>
		<p>средний</p>
	</div>
	<div class="full">
		<p>{app.program.title}</p>
	</div>
</div>

<style>
	h4 {
		font-size: 1.5rem;
		font-weight: 700;
		margin: 0;
	}
	p {
		font-size: 1.25rem;
		font-weight: 400;
		margin: 0;
	}
	span {
		font-weight: 400;
		color: var(--color-secondary);
		font-size: 1rem;
	}
	.card {
		background: var(--color-card);
		min-width: 16rem;
		width: 16rem;
		margin: 0 1rem 1rem 0;
		padding: 1rem;
		display: flex;
		flex-wrap: wrap;
		align-items: flex-start;
		align-content: flex-start;
		cursor: pointer;
		border-radius: 0.5rem;
		border-width: 0.2rem;
		border-style: solid;
		border-color: var(--color-card);
	}
	.card:hover {
		border-color: var(--color-primary);
	}

	.card:hover .priority {
		opacity: 100;
	}
	.priority {
		opacity: 0;
		line-height: 1.75em;
		text-align: right;
	}
	.selected {
		border-color: var(--color-green);
	}

	.selected .priority {
		opacity: 100;
		color: var(--color-green);
	}

	.full {
		width: 100%;
		height: 4rem;
		padding-bottom: 0.5rem;
	}
	.half {
		width: 50%;
		height: 4rem;
		padding-bottom: 1rem;
	}
	@media only screen and (max-width: 30em) {
		.card {
			width: 100%;
			margin: 0 0 1rem 0;
			flex: 0 0 100%;
		}
		.full {
			padding-bottom: 0.5rem;
			height: 100%;
		}
	}
</style>
