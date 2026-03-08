/**
 * Centralized Unsplash image URLs for AgroTrack
 * All images are free-to-use from Unsplash
 */

export const IMAGES = {
    // ─── Hero & Backgrounds ───────────────────────────────────────
    heroMain: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=1600&q=85',
    heroOverlay: 'https://images.unsplash.com/photo-1464226184884-fa280b87c399?auto=format&fit=crop&w=1600&q=85',
    dashboardBanner: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?auto=format&fit=crop&w=1600&q=80',
    cropField: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1600&q=80',

    // ─── Equipment Images ─────────────────────────────────────────
    tractor1: 'https://images.unsplash.com/photo-1592982537447-6f2a6a0c7c18?auto=format&fit=crop&w=800&q=80',
    tractor2: 'https://images.unsplash.com/photo-1593926207032-41617e132910?auto=format&fit=crop&w=800&q=80',
    tractor3: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=800&q=80',
    harvester1: 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?auto=format&fit=crop&w=800&q=80',
    harvester2: 'https://images.unsplash.com/photo-1560493676-04071c5f467b?auto=format&fit=crop&w=800&q=80',
    plough: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?auto=format&fit=crop&w=800&q=80',
    irrigation: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?auto=format&fit=crop&w=800&q=80',
    seedDrill: 'https://images.unsplash.com/photo-1464226184884-fa280b87c399?auto=format&fit=crop&w=800&q=80',
    cultivator: 'https://images.unsplash.com/photo-1533637902604-1c5abcde8ee6?auto=format&fit=crop&w=800&q=80',

    // ─── Farmer / People ─────────────────────────────────────────
    farmer1: 'https://images.unsplash.com/photo-1589923188900-85dae523342b?auto=format&fit=crop&w=800&q=80',
    farmer2: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=800&q=80',

    // ─── Category defaults ────────────────────────────────────────
    byCategory: {
        'Tractors': 'https://images.unsplash.com/photo-1592982537447-6f2a6a0c7c18?auto=format&fit=crop&w=800&q=80',
        'Harvesters': 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?auto=format&fit=crop&w=800&q=80',
        'Seeding': 'https://images.unsplash.com/photo-1464226184884-fa280b87c399?auto=format&fit=crop&w=800&q=80',
        'Irrigation': 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?auto=format&fit=crop&w=800&q=80',
        'Soil Prep': 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?auto=format&fit=crop&w=800&q=80',
        'Default': 'https://images.unsplash.com/photo-1593926207032-41617e132910?auto=format&fit=crop&w=800&q=80',
    }
};

/**
 * Returns the best image for a given equipment item.
 * First uses image_url from DB, then falls back to category, then default.
 */
export const getEquipmentImage = (equipment) => {
    if (equipment?.image_url) return equipment.image_url;
    if (equipment?.category && IMAGES.byCategory[equipment.category]) {
        return IMAGES.byCategory[equipment.category];
    }
    return IMAGES.byCategory['Default'];
};
