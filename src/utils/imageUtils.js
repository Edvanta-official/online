// Utility helper to convert Google Drive sharing links to direct image embedding URLs
export const getDirectImageUrl = (url) => {
  if (!url) return 'images/plumeria_flower_claw_clip_drive.jpg';
  
  if (typeof url !== 'string') return url;

  // Convert Google Drive View/Share URL format to direct LH3 URL
  if (url.includes('drive.google.com/file/d/')) {
    const match = url.match(/\/d\/([a-zA-Z0-9_-]+)/);
    if (match && match[1]) {
      return `https://lh3.googleusercontent.com/d/${match[1]}`;
    }
  }
  
  if (url.includes('drive.google.com/open?id=') || url.includes('drive.google.com/uc?')) {
    const match = url.match(/id=([a-zA-Z0-9_-]+)/);
    if (match && match[1]) {
      return `https://lh3.googleusercontent.com/d/${match[1]}`;
    }
  }

  // Strip leading '/' for relative compatibility on GitHub Pages sub-folder deployments (/online/)
  if (url.startsWith('/')) {
    return url.slice(1);
  }

  return url;
};

export const getCategoryFallbackImage = (category) => {
  switch (category) {
    case 'bangles':
      return 'images/silver_bangles.jpg';
    case 'bracelets':
      return 'images/2_adjustable_gold_plated_kada_bracelet_1_jpg_drive.jpg';
    case 'earrings':
      return 'images/chandbali_earrings.jpg';
    case 'chains':
      return 'images/green_oval_stone_chain_drive.jpg';
    case 'necklaces':
      return 'images/traditional_south_indian_matte_gold_plated_antiavue_droplet_choker_neckalce_set_jpeg_drive.jpg';
    case 'gift-sets':
      return 'images/gift_set.jpg';
    default:
      return 'images/plumeria_flower_claw_clip_drive.jpg';
  }
};

/**
 * Normalizes item names and file paths for 100% accurate fuzzy matching
 * Ignores: case, spaces, hyphens, underscores, file extensions (.jpg, .jpeg, .png, .webp)
 */
export const normalizeItemKey = (str) => {
  if (!str) return '';
  return str
    .toLowerCase()
    .replace(/\.(jpg|jpeg|png|webp|gif|svg)$/i, '')
    .replace(/[^a-z0-9]/g, '');
};

/**
 * Matches an item name against available Drive images
 */
export const matchItemWithDriveImage = (itemName, availableImages = [], category = '') => {
  if (!itemName) return getCategoryFallbackImage(category);
  
  const normalizedItem = normalizeItemKey(itemName);
  
  const exactMatch = availableImages.find(img => {
    const normalizedImg = normalizeItemKey(img);
    return normalizedImg.includes(normalizedItem) || normalizedItem.includes(normalizedImg);
  });

  if (exactMatch) return exactMatch;

  return getCategoryFallbackImage(category);
};
