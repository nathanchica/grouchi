import { Photo } from '../types/photo';

export type AboutSectionProps = {
    alias: string;
    title: string;
    subtitle?: string;
    aboutItems: Array<string> | undefined;
    initialPhoto: Photo;
    photos: Photo[];
    numPhotos: number;
};

export type PhotoCarouselProps = {
    alias: string;
    imageSrc: string;
    imageAlt: string;
    nextIndex: number;
    prevIndex: number;
    nextImageSrc?: string;
    prevImageSrc?: string;
    currentIndex?: number;
    numPhotos?: number;
    transitionDirection?: 'next' | 'prev';
};

export function renderPhotoCarousel({
    imageSrc,
    imageAlt,
    alias,
    nextIndex,
    prevIndex,
    nextImageSrc,
    prevImageSrc,
    currentIndex = 0,
    numPhotos = 1,
    transitionDirection
}: PhotoCarouselProps): string {
    const showNavigation = numPhotos > 1;

    return /* html */ `
        <div
            id="photo-carousel"
            class="relative bg-stone-900"
            tabindex="0"
            ${transitionDirection ? `data-direction="${transitionDirection}"` : ''}
            role="region"
            aria-label="Photo carousel"
            aria-live="polite"
            hx-on:keydown="${
                showNavigation
                    ? `
                if (event.key === 'ArrowLeft') {
                    event.preventDefault();
                    this.querySelector('[aria-label=\\'Previous photo\\']')?.click();
                } else if (event.key === 'ArrowRight') {
                    event.preventDefault();
                    this.querySelector('[aria-label=\\'Next photo\\']')?.click();
                }
            `
                    : ''
            }"
            hx-on::after-swap="this.focus()"
            hx-on::before-request="this.querySelectorAll('button').forEach(b => b.disabled = true)"
            hx-on::after-settle="this.querySelectorAll('button').forEach(b => b.disabled = false)"
        >
            ${nextImageSrc ? `<link rel="prefetch" href="${nextImageSrc}" as="image">` : ''}
            ${prevImageSrc ? `<link rel="prefetch" href="${prevImageSrc}" as="image">` : ''}
            <img
                alt="${imageAlt}"
                src="${imageSrc}"
                class="max-h-[480px] min-h-[360px] w-full object-contain carousel-image"
            />
            <span class="sr-only" aria-live="polite">Photo ${currentIndex + 1} of ${numPhotos}: ${imageAlt}</span>
            ${
                showNavigation
                    ? /* html */ `
                <div class="absolute top-4 right-4 bg-white/60 text-gray-800 px-3 py-1 rounded-full text-sm animate-fade-out">
                    ${currentIndex + 1} / ${numPhotos}
                </div>`
                    : ''
            }
            ${
                showNavigation
                    ? /* html */ `
                <button
                    class="absolute top-1/2 -translate-y-1/2 left-2 bg-white/50 hover:bg-white/90 rounded-full w-8 h-8 flex items-center justify-center shadow-md hover:shadow-lg cursor-pointer transition-all disabled:opacity-50"
                    hx-get="/api/cats/about/${alias}/photos/${prevIndex.toString()}?direction=prev"
                    hx-swap="innerHTML swap:0.3s"
                    hx-target="#photo-carousel"
                    hx-indicator="#photo-carousel"
                    aria-label="Previous photo"
                >
                    <i class="fa-solid fa-chevron-left text-gray-700"></i>
                </button>
                <button
                    class="absolute top-1/2 -translate-y-1/2 right-2 bg-white/50 hover:bg-white/90 rounded-full w-8 h-8 flex items-center justify-center shadow-md hover:shadow-lg cursor-pointer transition-all disabled:opacity-50"
                    hx-get="/api/cats/about/${alias}/photos/${nextIndex.toString()}?direction=next"
                    hx-swap="innerHTML swap:0.3s"
                    hx-target="#photo-carousel"
                    hx-indicator="#photo-carousel"
                    aria-label="Next photo"
                >
                    <i class="fa-solid fa-chevron-right text-gray-700"></i>
                </button>
            `
                    : ''
            }
            <div class="htmx-indicator absolute inset-0 bg-black/20 flex items-center justify-center pointer-events-none">
                <i class="fa-solid fa-spinner fa-spin text-white"></i>
            </div>
        </div>
    `;
}

export function renderAboutSection({
    alias,
    title,
    subtitle,
    aboutItems = [],
    initialPhoto,
    photos,
    numPhotos
}: AboutSectionProps): string {
    const listHtml = aboutItems.map((item) => `<li>${item}</li>`).join('');

    const nextPhotoIndex = numPhotos > 1 ? 1 : 0;
    const prevPhotoIndex = numPhotos - 1;

    const { src, altText } = initialPhoto;
    const nextImageSrc = photos[nextPhotoIndex]?.src;
    const prevImageSrc = photos[prevPhotoIndex]?.src;

    return /* html */ `
        ${renderPhotoCarousel({
            alias,
            imageSrc: src,
            imageAlt: altText,
            nextIndex: nextPhotoIndex,
            prevIndex: prevPhotoIndex,
            nextImageSrc,
            prevImageSrc,
            currentIndex: 0,
            numPhotos
        })}
        <div class="p-8">
            <h2 class="${subtitle ? 'mb-2' : 'mb-4'} text-2xl font-bold text-gray-800">${title}</h2>
            ${subtitle ? /* html */ `<p class="mb-4 text-gray-500 italic">${subtitle}</p>` : ''}
            <ul role="list" class="list-inside list-disc space-y-2 text-gray-700">
                ${listHtml}
            </ul>
        </div>
    `;
}
