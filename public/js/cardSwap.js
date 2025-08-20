// Card swap functionality for the stacked cards UI

const ANIMATION_DURATION_MS = 500;
const DURATION_CLASS = `duration-${ANIMATION_DURATION_MS}`;

// Define position styles as constants
const POSITIONS = {
    center: `relative z-10 transition-all ${DURATION_CLASS}`,
    left: `absolute left-0 right-0 top-0 -rotate-2 -translate-x-96 translate-y-4 transform transition-all ${DURATION_CLASS} hover:-translate-x-[28rem] hover:-rotate-3 hover:translate-y-2 cursor-pointer`,
    right: `absolute left-0 right-0 top-0 translate-x-96 translate-y-4 rotate-2 transform transition-all ${DURATION_CLASS} hover:translate-x-[28rem] hover:rotate-3 hover:translate-y-2 cursor-pointer`
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

function updateCardPosition(card, newPosition) {
    card.element.className = POSITIONS[newPosition];
    card.element.dataset.position = newPosition;
}

function updateCardContent(card, showCarousel) {
    const aboutSection = card.element.querySelector('[id^="about"]');
    if (!aboutSection) return;

    if (typeof htmx === 'undefined') {
        console.error('HTMX is not loaded');
        return;
    }

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
    updateCardPosition(clicked, 'center');

    // Center -> Opposite of clicked
    updateCardPosition(center, isLeftClicked ? 'right' : 'left');

    // Other -> Clicked position
    updateCardPosition(other, isLeftClicked ? 'left' : 'right');

    // Update carousel states
    updateCardContent(clicked, true); // New center gets carousel
    updateCardContent(center, false); // Old center loses carousel

    // Rotate background colors
    swapBackgroundColors([clicked, center, other]);

    // Re-enable swapping after animation
    setTimeout(() => {
        isSwapping = false;
    }, ANIMATION_DURATION_MS);
}

document.addEventListener('DOMContentLoaded', function () {
    const container = document.getElementById('cards-container');

    if (container) {
        container.addEventListener('click', function (e) {
            // Find the card element (could be the card itself or a child element)
            const card = e.target.closest('[data-cat]');

            if (card && card.dataset.position !== 'center') {
                const catName = card.dataset.cat;
                swapCards(catName);
            }
        });
    }
});
