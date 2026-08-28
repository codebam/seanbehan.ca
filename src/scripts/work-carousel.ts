const section = document.querySelector<HTMLElement>('[data-work-carousel]');

if (section && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
	const slides = [...section.querySelectorAll<HTMLElement>('.work-row')];
	const current = section.querySelector<HTMLElement>('[data-carousel-current]');
	const progressBar = section.querySelector<HTMLElement>('[data-carousel-progress]');
	let frame = 0;
	let snapTimer = 0;

	const render = () => {
		frame = 0;
		const distance = Math.max(section.offsetHeight - window.innerHeight, 1);
		const progress = Math.min(Math.max(-section.getBoundingClientRect().top / distance, 0), 1);
		const position = progress * (slides.length - 1);
		const active = Math.round(position);

		slides.forEach((slide, index) => {
			const offset = index - position;
			const distanceFromView = Math.abs(offset);
			slide.style.setProperty('--slide-x', `${offset * 92}%`);
			slide.style.setProperty('--slide-opacity', String(Math.max(1 - distanceFromView * 1.1, 0)));
			slide.style.setProperty(
				'--slide-scale',
				String(1 - Math.min(distanceFromView * 0.025, 0.025))
			);
			slide.toggleAttribute('inert', index !== active);
			slide.setAttribute('aria-hidden', String(index !== active));
		});

		if (current) current.textContent = String(active + 1).padStart(2, '0');
		progressBar?.style.setProperty('--carousel-progress', String(progress));
	};

	const requestRender = () => {
		if (!frame) frame = requestAnimationFrame(render);
	};
	const snapToNearest = () => {
		const rect = section.getBoundingClientRect();
		if (rect.top > 24 || rect.bottom < window.innerHeight - 24) return;

		const distance = Math.max(section.offsetHeight - window.innerHeight, 1);
		const progress = Math.min(Math.max(-rect.top / distance, 0), 1);
		const nearest = Math.round(progress * (slides.length - 1));
		const sectionTop = window.scrollY + rect.top;
		const target = sectionTop + (nearest / (slides.length - 1)) * distance;

		if (Math.abs(window.scrollY - target) > 1) window.scrollTo({ top: target, behavior: 'smooth' });
	};
	const handleScroll = () => {
		requestRender();
		window.clearTimeout(snapTimer);
		snapTimer = window.setTimeout(snapToNearest, 180);
	};

	section.style.setProperty('--slide-count', String(slides.length));
	section.setAttribute('data-carousel-ready', '');
	render();
	window.addEventListener('scroll', handleScroll, { passive: true });
	window.addEventListener('resize', requestRender);
}
