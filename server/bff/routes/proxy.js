import { Router } from "express";
import { config } from "../config.js";
import { getSession } from "../sessionStore.js";

const router = Router();

/**
 * Proxy middleware - forwards requests to backend API with access token
 */
async function proxyMiddleware(req, res, next) {
  const sessionId = req.cookies?.[config.sessionCookieName];
  if (!sessionId) {
    return res.status(401).json({ status: false, code: 401, msg: "Chưa đăng nhập" });
  }
  
  const session = await getSession(sessionId);
  if (!session || session.revoked) {
    res.clearCookie(config.sessionCookieName, {
      httpOnly: true,
      secure: config.sessionCookieSecure,
      sameSite: config.sessionCookieSameSite,
      path: config.sessionCookiePath,
    });
    res.clearCookie(config.csrfCookieName, {
      httpOnly: true,
      secure: config.sessionCookieSecure,
      sameSite: config.sessionCookieSameSite,
      path: config.sessionCookiePath,
    });
    return res.status(401).json({ status: false, code: 401, msg: "Phiên đã hết hạn" });
  }
  
  // Attach access token to request for proxy
  req.bffAccessToken = session.accessToken;
  req.bffSession = session;
  next();
}

/**
 * Proxy request to backend API
 */
router.all("/api/*", proxyMiddleware, async (req, res) => {
  try {
    // Extract the path after /bff/api/
    const apiPath = req.path.replace(/^\/api/, "") || "/";
    const url = `${config.backendUrl}${apiPath}${req.url.includes("?") ? req.url.substring(req.path.length) : ""}`;
    
    const method = req.method;
    const headers = {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${req.bffAccessToken}`,
      "x-bff-internal-token": config.backendInternalToken,
    };
    
    // Forward query string
    const queryString = req.url.includes("?") ? req.url.substring(req.url.indexOf("?")) : "";
    const fullUrl = `${config.backendUrl}${apiPath}${queryString}`;
    
    let body;
    if (["POST", "PUT", "PATCH", "DELETE"].includes(method) && req.body && Object.keys(req.body).length > 0) {
      body = JSON.stringify(req.body);
    }
    
    const response = await fetch(fullUrl, {
      method,
      headers,
      body,
    });
    
    // Copy response headers (except hop-by-hop)
    const excludedHeaders = ["connection", "keep-alive", "transfer-encoding", "content-encoding", "content-length"];
    response.headers.forEach((value, key) => {
      if (!excludedHeaders.includes(key.toLowerCase())) {
        res.setHeader(key, value);
      }
    });
    
    res.status(response.status);
    
    // Stream response
    if (response.body) {
      // For JSON responses, parse and re-stringify to ensure valid JSON
      const contentType = response.headers.get("content-type") || "";
      if (contentType.includes("application/json")) {
        const text = await response.text();
        try {
          const json = JSON.parse(text);
          res.json(json);
        } catch {
          res.send(text);
        }
      } else {
        // Stream non-JSON responses
        const reader = response.body.getReader();
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          res.write(value);
        }
        res.end();
      }
    } else {
      res.end();
    }
  } catch (e) {
    console.error("[BFF] Proxy error:", e);
    if (!res.headersSent) {
      res.status(502).json({ status: false, code: 502, msg: "Bad gateway" });
    }
  }
});

export default router;