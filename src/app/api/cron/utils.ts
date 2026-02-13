export function verifyCronSecret(request: Request): boolean {
  const authHeader = request.headers.get("authorization");
  return authHeader === `Bearer ${process.env.CRON_SECRET}`;
}

export async function cronHandler(
  request: Request,
  collectorFn: () => Promise<void>,
  jobName: string
) {
  if (!verifyCronSecret(request)) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const startTime = Date.now();
  try {
    await collectorFn();
    console.log(`[${jobName}] Completed in ${Date.now() - startTime}ms`);
    return Response.json({ success: true, duration: Date.now() - startTime });
  } catch (error) {
    console.error(`[${jobName}] Failed:`, error);
    return Response.json({ error: "Collection failed" }, { status: 500 });
  }
}
