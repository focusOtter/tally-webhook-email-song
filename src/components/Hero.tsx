function Hero() {
	return (
		<div className="hero min-h-screen bg-base-200">
			<div className="hero-content flex-col lg:flex-row-reverse">
				<div className="text-center lg:text-left">
					<h1 className="text-5xl font-bold">Get your free song🎵</h1>
					<p className="py-6">
						It's simple! Just fill out the form and we'll email you a song!
					</p>
				</div>
				<div className="card shrink-0 w-full max-w-sm shadow-2xl bg-base-100">
					<iframe
						data-tally-src="https://tally.so/embed/wAle4D?hideTitle=1&transparentBackground=1&dynamicHeight=1"
						loading="eager"
						width="100%"
						height="381"
						title="Registration form"
					></iframe>
				</div>
			</div>
		</div>
	)
}

export default Hero
