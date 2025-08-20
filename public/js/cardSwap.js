// Card swap functionality for the stacked cards UI

// Define position styles as constants
const POSITIONS = {
    center: 'relative z-10 transition-all duration-500',
    left: 'absolute left-0 right-0 top-0 -rotate-2 -translate-x-96 translate-y-4 transform transition-all duration-500 hover:-translate-x-[28rem] hover:-rotate-3 hover:translate-y-2 cursor-pointer',
    right: 'absolute left-0 right-0 top-0 translate-x-96 translate-y-4 rotate-2 transform transition-all duration-500 hover:translate-x-[28rem] hover:rotate-3 hover:translate-y-2 cursor-pointer'
};

let isSwapping = false;

function normalizeCardName(name) {
    return name === 'both' ? 'groucho_and_chica' : name;
}

function getCardsByPosition() {
    const cards = {
        groucho: document.getElementById('card-groucho'),
        chica: document.getElementById('card-chica'),
        both: document.getElementById('card-both')
    };

    const positions = { center: null, left: null, right: null };

    for (const [cat, card] of Object.entries(cards)) {
        if (!card) continue;

        const pos = card.dataset.position;
        if (pos) {
            positions[pos] = {
                element: card,
                cat: normalizeCardName(cat)
            };
        }
    }

    return positions;
}

function updateCardPosition(card, newPosition, clickHandler) {
    card.element.className = POSITIONS[newPosition];
    card.element.dataset.position = newPosition;
    card.element.onclick = clickHandler;
}

function updateCardContent(card, showCarousel) {
    const aboutSection = card.element.querySelector('[id^="about"]');
    if (!aboutSection) return;

    const endpoint = `/api/cats/about/${card.cat}?show_carousel=${showCarousel}`;

    htmx.ajax('GET', endpoint, {
        target: aboutSection,
        swap: 'innerHTML'
    });
}

function swapBackgroundColors(cards) {
    const innerDivs = cards.map((card) => card.element.querySelector('div > div'));

    const colors = innerDivs.map((div) => div?.className || '');

    // Rotate colors: 0 -> 1, 1 -> 2, 2 -> 0
    innerDivs.forEach((div, i) => {
        if (div) {
            div.className = colors[(i + 1) % colors.length];
        }
    });
}

function swapCards(clickedCat) {
    if (isSwapping) return;
    isSwapping = true;

    const positions = getCardsByPosition();

    // Validate clicked card
    if (
        !positions.left ||
        !positions.right ||
        !positions.center ||
        positions.center.cat === clickedCat ||
        (positions.left.cat !== clickedCat && positions.right.cat !== clickedCat)
    ) {
        isSwapping = false;
        return;
    }

    const isLeftClicked = positions.left.cat === clickedCat;
    const clicked = isLeftClicked ? positions.left : positions.right;
    const other = isLeftClicked ? positions.right : positions.left;
    const center = positions.center;

    // Three-way rotation
    // Clicked -> Center
    updateCardPosition(clicked, 'center', null);

    // Center -> Opposite of clicked
    updateCardPosition(center, isLeftClicked ? 'right' : 'left', () => swapCards(center.cat));

    // Other -> Clicked position
    updateCardPosition(other, isLeftClicked ? 'left' : 'right', () => swapCards(other.cat));

    // Update carousel states
    updateCardContent(clicked, true); // New center gets carousel
    updateCardContent(center, false); // Old center loses carousel

    // Rotate background colors
    swapBackgroundColors([clicked, center, other]);

    // Re-enable swapping after animation
    setTimeout(() => {
        isSwapping = false;
    }, 500);
}

// Make swapCards available globally for onclick handlers
window.swapCards = swapCards;
