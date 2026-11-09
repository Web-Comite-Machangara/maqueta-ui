#!/usr/bin/env python3
"""Verify OpenPencil MCP renders and fix the renderer's broken alpha channel.

The MCP renderer paints RGB correctly but writes alpha=0 for every pixel
(premultiplied-alpha bug). Verification reads RGB only. `fix` mode rewrites
alpha (255 where RGB is nonzero, else 0) and saves a clean PNG.

Usage:
  python3 verify-render.py <page_index> <out.png> x,y[,x,y...]   # screenshot + RGB samples
  python3 verify-render.py fix <in.png> <out.png>                # repair alpha
"""
import json, sys, base64, re, urllib.request, struct, zlib

ENDPOINT = "http://127.0.0.1:3100/mcp"

def call(method, params, mid):
    body = json.dumps({"jsonrpc": "2.0", "id": mid, "method": method, "params": params}).encode()
    req = urllib.request.Request(ENDPOINT, data=body, headers={
        "Content-Type": "application/json",
        "Accept": "application/json, text/event-stream",
        "mcp-session-id": "openpencil",
    })
    with urllib.request.urlopen(req, timeout=60) as r:
        return json.loads(r.read())

def tool(name, args, mid=10):
    res = call("tools/call", {"name": name, "arguments": args}, mid)
    if "error" in res:
        raise RuntimeError(res["error"])
    out = ""
    for c in res["result"].get("content", []):
        if c.get("type") == "text":
            out += c.get("text", "")
    return out

def decode(png_bytes):
    pos = 8; w = h = None; idat = b""
    while pos < len(png_bytes):
        ln = struct.unpack(">I", png_bytes[pos:pos+4])[0]
        typ = png_bytes[pos+4:pos+8]
        chunk = png_bytes[pos+8:pos+8+ln]
        if typ == b"IHDR":
            w, h, bd, ct = struct.unpack(">IIBB", chunk[:10])
        elif typ == b"IDAT":
            idat += chunk
        pos += 12 + ln
    return w, h, bd, ct, zlib.decompress(idat)

def raw_of(png_bytes):
    w, h, bd, ct, idat = decode(png_bytes)
    assert ct == 6, f"expected RGBA, got colortype {ct}"
    return w, h, idat

def sample_rgb(w, h, idat, x, y):
    i = y * (w * 4 + 1) + 1 + x * 4
    return tuple(idat[i:i+3])

def fix_alpha(png_bytes):
    w, h, idat = raw_of(png_bytes)
    out = bytearray(idat)
    stride = w * 4 + 1
    for y in range(h):
        i = y * stride + 1
        for x in range(w):
            p = i + x * 4
            rgb = out[p] or out[p+1] or out[p+2]
            out[p+3] = 255 if rgb else 0
    # rebuild PNG: reuse original chunks but replace IDAT
    parts = []
    pos = 8
    while pos < len(png_bytes):
        ln = struct.unpack(">I", png_bytes[pos:pos+4])[0]
        typ = png_bytes[pos+4:pos+8]
        chunk = png_bytes[pos+8:pos+8+ln]
        if typ != b"IDAT":
            parts.append(png_bytes[pos:pos+12+ln])
        pos += 12 + ln
    def chunk_of(typ, data):
        c = typ + data
        return struct.pack(">I", len(data)) + c + struct.pack(">I", zlib.crc32(c) & 0xFFFFFFFF)
    idat_chunk = chunk_of(b"IDAT", zlib.compress(bytes(out), 6))
    return b"\x89PNG\r\n\x1a\n" + b"".join(parts) + idat_chunk + chunk_of(b"IEND", b"")

if __name__ == "__main__":
    if sys.argv[1] == "fix":
        src, dst = sys.argv[2], sys.argv[3]
        data = open(src, "rb").read()
        open(dst, "wb").write(fix_alpha(data))
        print(f"alpha fixed: {dst}")
        sys.exit(0)
    page, out = sys.argv[1], sys.argv[2]
    samples = [tuple(map(int, s.split(","))) for s in sys.argv[3:]]
    tool("set_active_page", {"index": page}, 1)
    text = tool("get_screenshot", {"nodeId": "root"}, 2)
    m = re.search(r"[A-Za-z0-9+/=]{200,}", text)
    png_bytes = base64.b64decode(m.group(0))
    w, h, idat = raw_of(png_bytes)
    print(f"saved {out}: {w}x{h}")
    for (x, y) in samples:
        if x >= w or y >= h:
            print(f"({x},{y}) OUT OF RANGE")
            continue
        print(f"({x},{y}) RGB = {sample_rgb(w, h, idat, x, y)}")
    open(out, "wb").write(png_bytes)
