const crypto = require('crypto');

const generateHash = (content) => crypto.createHash('sha1').update(content).digest('hex');

const NEW_FORMAT_DATE = new Date('2024-07-02');

hexo.extend.filter.register('post_permalink', (originalLink) => {
  const newOriginalLink = originalLink.toLowerCase();
  const match = newOriginalLink.match(/[0-9]{4}\/[0-9]{2}\/[0-9]{2}/);

  if (match) {
    const dateString = match[0];
    const linkDate = new Date(dateString);

    return linkDate > NEW_FORMAT_DATE
      ? `posts/${generateHash(originalLink).slice(0, 12)}/`
      : newOriginalLink;
  } else {
    console.warn('No date found in the link:', originalLink);
    return newOriginalLink;
  }
});
