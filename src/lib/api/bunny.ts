export async function fetchBunnyVideos() {
  const response = await fetch(
    `https://video.bunnycdn.com/library/${process.env.BUNNY_LIBRARY_ID}/videos?page=1&itemsPerPage=100`,
    { headers: { AccessKey: process.env.BUNNY_API_KEY! } }
  );
  if (!response.ok) throw new Error(`Bunny API error: ${response.status}`);
  return response.json();
}
