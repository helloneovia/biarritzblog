import urllib.request
import re
import json

try:
    req = urllib.request.Request(
        'https://share.temu.com/BzHOlooJIAB', 
        headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'}
    )
    # Temu uses extensive anti-bot, so a simple GET might get a captcha page. 
    # But usually the initial HTML (even for captcha) contains the meta tags for OpenGraph images.
    html = urllib.request.urlopen(req).read().decode('utf-8')
    
    # Try finding high-res product images
    images = set(re.findall(r'https://img\.kwcdn\.com/product/fancy/[a-zA-Z0-9\-]+\.jpg', html))
    videos = set(re.findall(r'https://[a-zA-Z0-9\-\.]+\.kwcdn\.com/[^\s\"\']+\.mp4[^\s\"\']*', html))
    
    # Let's also look for og:image
    og_images = set(re.findall(r'content="(https://img\.kwcdn\.com/[^"]+)" property="og:image"', html))
    
    print("--- IMAGES ---")
    for img in list(images)[:10]:
        print(img)
    print("--- OG IMAGES ---")
    for img in list(og_images)[:5]:
        print(img)
    print("--- VIDEOS ---")
    for vid in list(videos)[:5]:
        print(vid)
        
except Exception as e:
    print(f"Error scraping: {e}")
