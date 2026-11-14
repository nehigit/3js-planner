// Static furniture catalog. Placed furniture stores only the `id`, so an entry's
// size or look can change here without breaking rooms saved in localStorage.
// `size` is [width (x), height (y), depth (z)] in metres.
// `category` groups entries into folders in the catalog UI.
// Names live in `src/i18n/*.json` under `furniture.<id>` and `category.<category>`,
// so this file stays language-free.
export const CATALOG = [
    { id: 'sofa', category: 'seating', size: [2.0, 0.85, 0.9], color: '#6b8e9f' },
    { id: 'armchair', category: 'seating', size: [0.9, 0.85, 0.9], color: '#7f9c7a' },
    { id: 'chair', category: 'seating', size: [0.45, 0.9, 0.45], color: '#c9a66b' },
    { id: 'table', category: 'tables', size: [1.4, 0.75, 0.8], color: '#a88b5c' },
    { id: 'bed', category: 'bedroom', size: [1.6, 0.5, 2.0], color: '#b08b7a' },
    { id: 'wardrobe', category: 'storage', size: [1.2, 2.0, 0.6], color: '#8c7b6b' },
    { id: 'bookshelf', category: 'storage', size: [0.8, 1.8, 0.3], color: '#9a8470' },
]

export function getCatalogItem(id) {
    return CATALOG.find((item) => item.id === id)
}

// [[category, items], ...] in order of first appearance
export function groupByCategory(items) {
    const groups = new Map()
    for (const item of items) {
        if (!groups.has(item.category)) groups.set(item.category, [])
        groups.get(item.category).push(item)
    }
    return [...groups]
}
