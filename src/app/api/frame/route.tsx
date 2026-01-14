import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";

export const runtime = "edge";
export const dynamic = "force-dynamic";

type FrameStep = "initial" | "instructions";

const FALLBACK_APP_URL = "https://super-cluster-list.vercel.app/";

function resolveStep(value: string | null): FrameStep {
  if (value === "instructions") return "instructions";
  return "initial";
}

function resolveAppUrl(req: NextRequest): string {
  const envUrl = process.env.NEXT_PUBLIC_APP_URL;
  if (envUrl && envUrl.trim().length > 0) {
    return envUrl.replace(/\/$/, "");
  }
  try {
    const { origin } = new URL(req.url);
    return origin;
  } catch {
    return FALLBACK_APP_URL;
  }
}

function buildImage(step: FrameStep) {
  const title =
    step === "initial" ? "Request sUSDC Withdrawal" : "Ready to Claim USDC?";
  const subtitle =
    step === "initial"
      ? "Start your withdrawal request directly from Farcaster Frame"
      : "Monitor your withdrawal status and claim when ready";

  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          width: "100%",
          height: "100%",
          padding: "64px",
          background:
            "linear-gradient(135deg, #0f172a 0%, #1e3a8a 40%, #0ea5e9 100%)",
          color: "#e2e8f0",
          fontFamily: "Inter, Arial, sans-serif",
        }}
      >
        <div
          style={{
            fontSize: 28,
            fontWeight: 600,
            letterSpacing: 2,
            textTransform: "uppercase",
            color: "rgba(226, 232, 240, 0.8)",
          }}
        >
          SuperCluster
        </div>
        <div>
          <div
            style={{
              fontSize: 72,
              fontWeight: 700,
              lineHeight: 1.1,
              marginBottom: 24,
            }}
          >
            {title}
          </div>
          <div
            style={{
              fontSize: 32,
              lineHeight: 1.4,
              color: "rgba(226, 232, 240, 0.85)",
              maxWidth: 720,
            }}
          >
            {subtitle}
          </div>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontSize: 28,
            color: "rgba(226, 232, 240, 0.75)",
          }}
        >
          <span>
            {process.env.NEXT_PUBLIC_CHAIN_NAME || ""} • SuperCluster Protocol
          </span>
          <span>Powered by Farcaster Frames</span>
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}

function buildFrameHtml(step: FrameStep, req: NextRequest): string {
  const baseUrl = new URL(req.url);
  baseUrl.search = "";
  baseUrl.hash = "";

  const imageUrl = new URL(baseUrl);
  imageUrl.searchParams.set("image", step);

  const postUrl = new URL(baseUrl);
  postUrl.searchParams.set("step", step);

  const appUrl = resolveAppUrl(req);
  const title =
    step === "initial"
      ? "SuperCluster • sUSDC Withdrawal"
      : "SuperCluster • Claim USDC";
  const description =
    step === "initial"
      ? "Start your sUSDC/wsUSDC withdrawal request directly from Farcaster."
      : "Prepare to claim your USDC after your withdrawal is ready for processing.";

  const buttonOneLabel =
    step === "initial" ? "🚀 Request Withdrawal" : "💰 Claim USDC";
  const buttonOneTarget =
    step === "initial"
      ? `${appUrl}/withdrawals/request`
      : `${appUrl}/withdrawals/claim`;
  const buttonTwoLabel = step === "initial" ? "📖 Instructions" : "⬅️ Back";

  return `<!DOCTYPE html><html lang="en"><head>
    <meta charset="utf-8" />
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${title}</title>
    <meta property="og:title" content="${title}" />
    <meta property="og:description" content="${description}" />
    <meta property="og:image" content="${imageUrl.toString()}" />
    <meta property="fc:frame" content="vNext" />
    <meta property="fc:frame:image" content="${imageUrl.toString()}" />
    <meta property="fc:frame:image:aspect_ratio" content="1.91:1" />
    <meta property="fc:frame:button:1" content="${buttonOneLabel}" />
    <meta property="fc:frame:button:1:action" content="link" />
    <meta property="fc:frame:button:1:target" content="${buttonOneTarget}" />
    <meta property="fc:frame:button:2" content="${buttonTwoLabel}" />
    <meta property="fc:frame:button:2:action" content="post" />
    <meta property="fc:frame:post_url" content="${postUrl.toString()}" />
  </head><body></body></html>`;
}

function createHtmlResponse(html: string) {
  return new Response(html, {
    status: 200,
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "no-cache, no-store, max-age=0, must-revalidate",
    },
  });
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const imageParam = searchParams.get("image");

  if (imageParam) {
    const step = resolveStep(imageParam);
    return buildImage(step);
  }

  const step = resolveStep(searchParams.get("step"));
  const html = buildFrameHtml(step, req);
  return createHtmlResponse(html);
}

type FrameRequestBody = {
  untrustedData?: {
    buttonIndex?: number | string;
  };
};

export async function POST(req: NextRequest) {
  const url = new URL(req.url);
  const currentStep = resolveStep(url.searchParams.get("step"));

  let buttonIndex = 0;
  try {
    const body = (await req.json()) as FrameRequestBody;
    const rawIndex = body?.untrustedData?.buttonIndex;
    if (typeof rawIndex === "string") {
      buttonIndex = parseInt(rawIndex, 10);
    } else if (typeof rawIndex === "number") {
      buttonIndex = rawIndex;
    }
  } catch {
    buttonIndex = 0;
  }

  let nextStep: FrameStep = currentStep;
  if (currentStep === "initial" && buttonIndex === 2) {
    nextStep = "instructions";
  } else if (currentStep === "instructions" && buttonIndex === 2) {
    nextStep = "initial";
  }

  const html = buildFrameHtml(nextStep, req);
  return createHtmlResponse(html);
}
