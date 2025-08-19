export function getAssetUrl(alias: string, type: 'nav' | number): string {
    const formattedAlias = alias.replaceAll('_', '-');
    const filePrefix = formattedAlias === 'groucho-and-chica' ? 'grouchi' : formattedAlias;
    const formattedType = typeof type === 'number' ? type.toString() : type;

    return `https://cdn.jsdelivr.net/gh/nathanchica/grouchi-assets@main/img/${formattedAlias}/${filePrefix}-${formattedType}.jpg`;
}
