export const SCHEME_VIDEO_IDS: Record<string, string[]> = {
  'pm-kisan': ['SKAeIGWtv0Q', 'Ig7BrtotRQ4', '4H1VAxe008s'],
};

export const FALLBACK_SCHEME_VIDEO_IDS = [
  'ddg-5DIoXCU',
  'Yy3a15mrFfI',
  'bo47QgbMXNA',
];

const YOUTUBE_VIDEO_ID_PATTERN = /^[\w-]{11}$/;

export const getSchemeVideoIds = (schemeId: string): string[] => {
  const curatedVideoIds = SCHEME_VIDEO_IDS[schemeId];
  const validCuratedVideoIds = curatedVideoIds?.filter((videoId) =>
    YOUTUBE_VIDEO_ID_PATTERN.test(videoId),
  );

  return (validCuratedVideoIds?.length ? validCuratedVideoIds : FALLBACK_SCHEME_VIDEO_IDS)
    .slice(0, 3);
};
