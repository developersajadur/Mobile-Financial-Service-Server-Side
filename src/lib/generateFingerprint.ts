export async function generateDeviceFingerprint() {
    const userAgent = navigator.userAgent;
    const ip = await getPublicIP(); // Get IP from an external API
  
    const encoder = new TextEncoder();
    const data = encoder.encode(`${ip}-${userAgent}`);
  
    const hashBuffer = await crypto.subtle.digest("SHA-256", data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const fingerprint = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
  
    return fingerprint;
  }
  
  async function getPublicIP() {
    try {
      const res = await fetch("https://api64.ipify.org?format=json");
      const data = await res.json();
      return data.ip;
    } catch (error) {
      console.error("Failed to fetch IP:", error);
      return "unknown-ip";
    }
  }
  