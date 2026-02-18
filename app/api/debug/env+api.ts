export function GET() {
  return Response.json({
    RAPIDAPI_KEY_present: !!process.env.RAPIDAPI_KEY,
    NEWS_API_KEY_present: !!process.env.NEWS_API_KEY,
    node_env: process.env.NODE_ENV || null,
    expo_env: process.env.EAS_BUILD_PROFILE || null,
  });
}
