export type AboutSectionProps = {
    imageSrc: string;
    imageAlt: string;
    title: string;
    subtitle?: string;
    aboutItems: Array<string>;
};

export function renderAboutSection({ imageSrc, imageAlt, title, subtitle, aboutItems }: AboutSectionProps): string {
    const listHtml = aboutItems.map((item) => `<li>${item}</li>`).join('');

    return /* html */ `
        <img
            alt="${imageAlt}"
            src="${imageSrc}"
            class="max-h-[480px] w-full object-cover"
        />
        <div class="p-8">
            <h2 class="${subtitle ? 'mb-2' : 'mb-4'} text-2xl font-bold text-gray-800">${title}</h2>
            ${subtitle ? /* html */ `<p class="mb-4 text-gray-500 italic">${subtitle}</p>` : ''}
            <ul role="list" class="list-inside list-disc space-y-2 text-gray-700">
                ${listHtml}
            </ul>
        </div>
    `;
}
