import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { CATALOG, groupByCategory } from '../furniture/catalog'
import { LANGUAGES } from '../i18n'
import './Catalog.css'

// the catalog is static, so group it once
const FOLDERS = groupByCategory(CATALOG)

// Floating panel listing the furniture that can be added to the room,
// styled after the Leva GUI: title bar, search, folders of square tiles.
// Tiles are buttons so they're keyboard reachable once picking is wired up.
export default function Catalog() {
    const { t } = useTranslation()
    const [collapsed, setCollapsed] = useState(false)
    // hidden slides the whole panel off-screen; it stays mounted so its state survives
    const [hidden, setHidden] = useState(false)
    const [query, setQuery] = useState('')

    // search matches the translated name, so it works in the language the user sees
    const needle = query.trim().toLowerCase()
    const folders = FOLDERS
        .map(([category, items]) => [
            category,
            items.filter((item) => matches(t(`furniture.${item.id}`), needle)),
        ])
        .filter(([, items]) => items.length > 0)

    return (
        <>
            <aside className={`catalog${hidden ? ' is-hidden' : ''}`} inert={hidden}>
                <div className="catalog-titlebar">
                    <button
                        type="button"
                        className="catalog-chevron"
                        aria-label={collapsed ? t('catalog.expand') : t('catalog.collapse')}
                        aria-expanded={!collapsed}
                        onClick={() => setCollapsed((value) => !value)}
                    >
                        <Chevron open={!collapsed} />
                    </button>
                    <span className="catalog-title">{t('catalog.title')}</span>
                    <LanguageSwitch />
                    <button
                        type="button"
                        className="catalog-hide"
                        aria-label={t('catalog.hide')}
                        onClick={() => setHidden(true)}
                    >
                        <Chevrons direction="left" />
                    </button>
                </div>
                {!collapsed && (
                    <>
                        <label className="catalog-search">
                            <SearchIcon />
                            <input
                                type="search"
                                placeholder={t('catalog.search')}
                                aria-label={t('catalog.searchLabel')}
                                value={query}
                                onChange={(event) => setQuery(event.target.value)}
                            />
                        </label>
                        <div className="catalog-panel">
                            {folders.map(([category, items]) => (
                                // while searching every matching folder is shown open
                                <Folder
                                    key={category}
                                    title={t(`category.${category}`)}
                                    items={items}
                                    forceOpen={needle !== ''}
                                />
                            ))}
                            {folders.length === 0 && <p className="catalog-empty">{t('catalog.noMatches')}</p>}
                        </div>
                    </>
                )}
            </aside>
            {/* tab at the screen edge that brings the hidden panel back */}
            <button
                type="button"
                className={`catalog-tab${hidden ? ' is-visible' : ''}`}
                aria-label={t('catalog.show')}
                tabIndex={hidden ? 0 : -1}
                onClick={() => setHidden(false)}
            >
                <Chevrons direction="right" />
            </button>
        </>
    )
}

function matches(name, needle) {
    return needle === '' || name.toLowerCase().includes(needle)
}

// PL/EN toggle in the title bar; i18next remembers the choice in localStorage
function LanguageSwitch() {
    const { t, i18n } = useTranslation()
    const current = i18n.resolvedLanguage
    const next = LANGUAGES.find((lng) => lng !== current)

    return (
        <button
            type="button"
            className="catalog-language"
            aria-label={t('language.switch')}
            onClick={() => i18n.changeLanguage(next)}
        >
            {t('language.short')}
        </button>
    )
}

function Folder({ title, items, forceOpen }) {
    const [open, setOpen] = useState(true)
    const shown = open || forceOpen

    return (
        <section className="catalog-folder">
            <button
                type="button"
                className="catalog-folder-title"
                aria-expanded={shown}
                onClick={() => setOpen((value) => !value)}
            >
                <Chevron open={shown} />
                {title}
            </button>
            {shown && (
                <ul className="catalog-grid">
                    {items.map((item) => (
                        <li key={item.id}>
                            <CatalogTile item={item} />
                        </li>
                    ))}
                </ul>
            )}
        </section>
    )
}

function CatalogTile({ item }) {
    const { t } = useTranslation()
    // state rather than CSS :hover because the preview will react to it too
    const [hovered, setHovered] = useState(false)
    const [width, height, depth] = item.size
    const name = t(`furniture.${item.id}`)

    return (
        <button
            type="button"
            className="catalog-tile"
            aria-label={t('catalog.tileLabel', {
                name,
                width: formatMetres(width),
                depth: formatMetres(depth),
                height: formatMetres(height),
            })}
            onPointerEnter={() => setHovered(true)}
            onPointerLeave={() => setHovered(false)}
            onFocus={() => setHovered(true)}
            onBlur={() => setHovered(false)}
        >
            <ItemPreview item={item} hovered={hovered} />
            <span className={`catalog-caption${hovered ? ' is-visible' : ''}`} aria-hidden="true">
                <span className="catalog-caption-name">{name}</span>
                <span className="catalog-caption-size">
                    <Dimension label={t('catalog.dimension.width')} value={width} />
                    <Dimension label={t('catalog.dimension.depth')} value={depth} />
                    <Dimension label={t('catalog.dimension.height')} value={height} />
                </span>
            </span>
        </button>
    )
}

// Placeholder until the furniture has models. It will become a view into a
// shared preview Canvas (Drei <View>) that rotates the model while `hovered`.
function ItemPreview({ item, hovered }) {
    return (
        <span
            className={`catalog-preview${hovered ? ' is-hovered' : ''}`}
            style={{ background: item.color }}
        />
    )
}

function Dimension({ label, value }) {
    return (
        <span className="catalog-dimension">
            <span className="catalog-dimension-label">{label}</span>
            {formatMetres(value)}
        </span>
    )
}

function Chevron({ open }) {
    return (
        <svg
            className="catalog-chevron-icon"
            width="9"
            height="5"
            viewBox="0 0 9 5"
            aria-hidden="true"
            style={{ transform: open ? 'none' : 'rotate(-90deg)' }}
        >
            <path d="M0 0h9L4.5 5z" fill="currentColor" />
        </svg>
    )
}

// double chevron, pointing left (hide) or right (show)
function Chevrons({ direction }) {
    return (
        <svg
            width="10"
            height="10"
            viewBox="0 0 10 10"
            aria-hidden="true"
            style={{ transform: direction === 'right' ? 'scaleX(-1)' : 'none' }}
        >
            <path
                d="M5 1L1 5l4 4M9 1L5 5l4 4"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    )
}

function SearchIcon() {
    return (
        <svg className="catalog-search-icon" width="12" height="12" viewBox="0 0 12 12" aria-hidden="true">
            <circle cx="5" cy="5" r="3.5" fill="none" stroke="currentColor" strokeWidth="1.5" />
            <path d="M7.8 7.8L11 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
    )
}

// metres with up to two decimals
function formatMetres(value) {
    return value.toFixed(2).replace(/\.?0+$/, '')
}
