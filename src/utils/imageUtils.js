// Utility helper to convert Google Drive sharing links to direct image embedding URLs
export const getDirectImageUrl = (url) => {
  if (!url) return 'images/butterfly_clip.jpg';
  
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
