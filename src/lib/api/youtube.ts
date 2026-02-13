export async function fetchChannelVideos() {
  const response = await fetch(
    `https://www.googleapis.com/youtube/v3/search?key=${process.env.YOUTUBE_API_KEY}&channelId=${process.env.YOUTUBE_CHANNEL_ID}&part=id&type=video&order=date&maxResults=50`
  );
  if (!response.ok) throw new Error(`YouTube API error: ${response.status}`);
  const data = await response.json();
  return data.items?.map((item: { id: { videoId: string } }) => item.id.videoId) || [];
}

export async function fetchVideoStatistics(videoIds: string[]) {
  const ids = videoIds.join(",");
  const response = await fetch(
    `https://www.googleapis.com/youtube/v3/videos?key=${process.env.YOUTUBE_API_KEY}&id=${ids}&part=statistics,contentDetails,snippet`
  );
  if (!response.ok) throw new Error(`YouTube API error: ${response.status}`);
  return response.json();
}
