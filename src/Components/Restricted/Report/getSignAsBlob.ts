export async function getSignAsBlob(url?: string) {
  if (!url) return undefined;
  try {
    const res = await fetch(url);
    const blob = await res.blob();
    const blobUrl = URL.createObjectURL(blob);
    console.log('blob at url', blobUrl);
    return blobUrl;
  } catch (error) {
    console.error(error);
  }
}
