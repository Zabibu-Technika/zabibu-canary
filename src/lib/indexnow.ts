import { SITE, absolute } from "./site";
import { publicUrls } from "./routes";

// IndexNow: the open ping protocol that tells Bing, Yandex and friends that a URL
// changed. It is Google's Indexing API for everyone else.
//
// The ownership proof is a static file at /<key>.txt (see public/). It must
// contain exactly the key and nothing else, or the ping is rejected — which is
// why it is committed rather than generated, and why keyLocation below has to
// match the file we actually serve.

const ENDPOINT = "https://api.indexnow.org/indexnow";

export type IndexNowPayload = {
  host: string;
  key: string;
  keyLocation: string;
  urlList: string[];
};

export function indexNowPayload(urls: string[] = publicUrls()): IndexNowPayload {
  return {
    host: new URL(SITE.url).host,
    key: SITE.indexNowKey,
    keyLocation: absolute(`/${SITE.indexNowKey}.txt`),
    urlList: urls,
  };
}

export type IndexNowResult =
  | { ok: true; status: number; submitted: number; endpoint: string }
  | { ok: false; status: number; submitted: 0; endpoint: string; detail: string };

/** Submit the public URLs to IndexNow. 200/202 mean accepted. */
export async function submitToIndexNow(urls: string[] = publicUrls()): Promise<IndexNowResult> {
  const payload = indexNowPayload(urls);
  try {
    const res = await fetch(ENDPOINT, {
      method: "POST",
      headers: { "content-type": "application/json; charset=utf-8" },
      body: JSON.stringify(payload),
    });
    if (res.status === 200 || res.status === 202) {
      return { ok: true, status: res.status, submitted: payload.urlList.length, endpoint: ENDPOINT };
    }
    const detail = await res.text().catch(() => "");
    return { ok: false, status: res.status, submitted: 0, endpoint: ENDPOINT, detail };
  } catch (err) {
    return {
      ok: false,
      status: 0,
      submitted: 0,
      endpoint: ENDPOINT,
      detail: err instanceof Error ? err.message : String(err),
    };
  }
}
