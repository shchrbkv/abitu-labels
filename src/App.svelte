<script>
	import Card from './lib/Card.svelte';
	import { onMount } from 'svelte';
	import * as db from './lib/db.js';

	let total = +localStorage.getItem('total') || -1;
	let index = Math.floor(Math.random() * 1000);

	let abits = [];

	let abit;
	let applications = [];

	let priority;
	$: if (priority > applications.length) {
		priority = applications.length;
	}
	$: if (priority < 1) {
		priority = 1;
	}

	let completed = 0;
	async function refreshSample() {
		abits = await db.getAbitSample();
		abit = abits[0];
		applications = abit.applications;
		completed = 0;
		priority = 1;
		return true;
	}

	async function updateAbit() {
		abit = await db.updateAbitPriorities(abit);
		completed += 1;
		total += 1;
		priority = 1;
		abit = abits[completed];
		applications = abit.applications;
		if (completed == 9) await refreshSample();
		localStorage.setItem('total', '' + total);
		index = Math.floor(Math.random() * 1000);
		return true;
	}

	let pending = refreshSample();

	function handleNext() {
		if (total == -1) {
			total += 1;
			localStorage.setItem('total', '' + total);
			return;
		}
		pending = updateAbit();
	}
</script>

<main>
	{#if total < 0}
		<h2>Привет! Добро пожаловать в увлекательный...</h2>
		<h1>Лейблинг приоритетов абитуриентов &#129489;&#8205;&#127891;</h1>
		<div class="info">
			<h3>
				Тебе будут показаны заявления одного из абитуриентов ИТМО, а также его положение в конкурсных списках на
				данный момент.
				<br /><br />Сравни предложенные варианты и выбери программу, куда бы <b>ты</b> решил подать согласие.
				<br /><br />
			</h3>
		</div>
		<div class="button" on:click={() => (total += 1)}>Начать &#8594;</div>
	{:else}
		<div class="info">
			<h2>Всего {total}</h2>
			<h1>Абитуриент #{index}</h1>
			<h3>
				Нажимай на карточки в порядке возрастания приоритета. Лучший вариант &mdash; первый, худший &mdash;
				последний.
				<br /><br />Нужно выбрать не лучший вариант в принципе, а вариант куда абитуриент рассчитывал поступить.
				Например, если расстояние до черты мало, скорее всего он пытался запрыгнуть в последний вагон.
			</h3>
		</div>
		<div class="cards">
			{#each applications as app (app._id)}
				<Card bind:app bind:priority />
			{/each}
		</div>
		{#await pending}
			<div class="button inactive">Загрузка...</div>
		{:then status}
			<div class:inactive={priority !== applications.length} class="button" on:click={handleNext}>
				Сохранить и продолжить &#8594;
			</div>
		{:catch}
			<div class="button inactive">Ошибка загрузки данных, обновите страницу</div>
		{/await}
	{/if}
</main>

<style>
	:root {
		--color-primary: #1f1e1d;
		--color-secondary: #6a6865;
		--color-background: #f7f5f3;
		--color-card: #fcfbfa;
		--color-green: #35c41c;
		color: var(--color-primary);
		background: var(--color-background);
		font-family: 'Rubik';
		padding: 4rem;
	}

	h1 {
		font-size: 4rem;
		margin: 4rem 0;
		width: 60rem;
		font-weight: 700;
	}

	h2 {
		margin-top: 2.5rem;
		font-size: 1.5rem;
		font-weight: 700;
		color: var(--color-secondary);
	}

	h3 {
		font-size: 1.5rem;
		font-weight: 400;
	}

	.info {
		width: 45rem;
	}

	.cards {
		margin-top: 4rem;
		margin-left: -1rem;
		display: flex;
		justify-content: flex-start;
	}

	.button {
		padding: 1rem;
		margin: 4rem 0 0 -1rem;
		border-radius: 0.5rem;
		font-size: 1.5rem;
		background: var(--color-primary);
		cursor: pointer;
		color: var(--color-background);
		transition: all 0.5s;
	}

	.button:hover {
		padding: 2rem;
		margin: 3rem 0 0 -2rem;
		background: var(--color-green);
	}

	.inactive,
	.inactive:hover {
		transition: all 0.5s;
		pointer-events: none;
		opacity: 0.5;
		padding: 1rem;
		margin: 4rem 0 0 -1rem;
		background: var(--color-primary);
		cursor: not-allowed;
	}
	@media only screen and (max-width: 30em) {
		.cards {
			flex-wrap: wrap;
		}
		h1 {
			font-size: 2rem;
			margin: 2rem 0;
			font-weight: 700;
			width: 100%;
		}
		h2 {
			margin-top: 2rem;
			font-size: 1.5rem;
			font-weight: 700;
			color: var(--color-secondary);
		}
		h3 {
			font-size: 1.25rem;
			width: 100%;
			font-weight: 400;
		}
		main {
			width: 100%;
		}
		.info {
			width: 100%;
		}
		.cards {
			margin: 2rem 0 0 -1.25rem;
			width: 100%;
			display: flex;
			justify-content: flex-start;
		}
		:root {
			padding: 5%;
		}
		.button {
			padding: 1rem;
			margin: 1rem 0 0 -1rem;
			width: 100%;
			border-radius: 0.5rem;
			font-size: 1.25rem;
		}
	}
</style>
