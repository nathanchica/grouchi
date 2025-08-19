export type NavigationItemProps = {
    targetAlias: string;
    imgSrc: string;
    imgAlt: string;
    label: string;
};

export function renderNavigationItem({ targetAlias, imgSrc, imgAlt, label }: NavigationItemProps): string {
    // Create a user-friendly URL path - replace all underscores with hyphens
    const urlPath = targetAlias.replace(/_/g, '-');

    return /* html */ `
        <div
            class="group relative flex-1 cursor-pointer" 
            hx-get="/api/cats/about/${targetAlias}" 
            hx-target="#about-section" 
            hx-swap="innerHTML show:window:top"
            hx-push-url="/cats/${urlPath}"
            hx-on::after-request="htmx.ajax('GET', '/api/cats/about_navigation/${targetAlias}', '#about-navigation-section')"
        >
            <img alt="${imgAlt}" src="${imgSrc}" class="max-h-[480px] w-full object-cover" />
            <div class="backdrop-blur-0 absolute inset-0 flex items-center justify-center bg-black/0 transition-all duration-300 group-hover:bg-black/30 group-hover:backdrop-blur-xs">
                <p class="font-family-playfair text-xl font-bold text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                    ${label}
                </p>
            </div>
        </div>
    `;
}
