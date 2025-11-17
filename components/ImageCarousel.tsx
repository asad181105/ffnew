import { useEffect, useRef, useState } from "react";

interface ImageCarouselProps {
	images: string[];
	autoScrollInterval?: number;
}

export default function ImageCarousel({ images, autoScrollInterval = 3000 }: ImageCarouselProps) {
	const [currentIndex, setCurrentIndex] = useState(0);
	const [isTransitioning, setIsTransitioning] = useState(true);
	const intervalRef = useRef<NodeJS.Timeout | null>(null);
	const carouselRef = useRef<HTMLDivElement>(null);

	// Create triple set for seamless infinite loop
	const tripleImages = [...images, ...images, ...images];

	useEffect(() => {
		if (images.length === 0) return;

		// Start at the middle set (index = images.length)
		setCurrentIndex(images.length);

		// Auto-scroll functionality
		intervalRef.current = setInterval(() => {
			setIsTransitioning(true);
			setCurrentIndex((prev) => {
				const next = prev + 1;
				// When we reach the end of the second set, jump back to start of second set seamlessly
				if (next >= images.length * 2) {
					// Reset without transition for seamless loop
					setTimeout(() => {
						setIsTransitioning(false);
						setCurrentIndex(images.length);
					}, 50);
					return images.length * 2;
				}
				return next;
			});
		}, autoScrollInterval);

		return () => {
			if (intervalRef.current) {
				clearInterval(intervalRef.current);
			}
		};
	}, [images.length, autoScrollInterval]);

	// Reset transition after jump
	useEffect(() => {
		if (!isTransitioning && currentIndex === images.length) {
			const timer = setTimeout(() => {
				setIsTransitioning(true);
			}, 50);
			return () => clearTimeout(timer);
		}
	}, [isTransitioning, currentIndex, images.length]);

	if (images.length === 0) return null;

	return (
		<div className="relative w-full overflow-hidden rounded-xl bg-black/20 border border-white/10">
			<div
				ref={carouselRef}
				className="flex"
				style={{
					transform: `translateX(-${currentIndex * 100}%)`,
					transition: isTransitioning ? "transform 0.5s ease-in-out" : "none",
				}}
			>
				{tripleImages.map((image, index) => (
					<div key={index} className="min-w-full flex-shrink-0">
						<img
							src={image}
							alt={`Carousel image ${(index % images.length) + 1}`}
							className="w-full h-64 md:h-80 object-cover"
							loading="lazy"
						/>
					</div>
				))}
			</div>

			{/* Dots indicator */}
			<div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
				{images.map((_, index) => {
					const displayIndex = currentIndex % images.length;
					return (
						<button
							key={index}
							onClick={() => {
								setIsTransitioning(true);
								setCurrentIndex(images.length + index);
							}}
							className={`h-2 rounded-full transition-all ${
								displayIndex === index ? "w-8 bg-primary-yellow" : "w-2 bg-white/40"
							}`}
							aria-label={`Go to slide ${index + 1}`}
						/>
					);
				})}
			</div>
		</div>
	);
}

