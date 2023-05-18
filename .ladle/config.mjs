export default {
    viteConfig: "./ladle-vite.config.ts",
    outDir: "build_artifacts/ladle-prod",
    port: 61000,
    previewPort: 61000,
    addons: {
      width: {
        options: {
          iPhone3: 414,             // iPhone - 11 Pro Max, 11, XR, XS Max, 8 Plus, 7 Plus, 6 Plus, 6S Plus
          iPhone4: 375,             // iPhone - 11 Pro, XS, X, 8, 7, 6
          iPhone5: 320,             // iPhone - 5
          iPod: 320,                // iPod
          iPad1: 1024,              // iPad Pro
          iPad2: 768,               // iPad 3 & 4 Gen, iPad Air 1 & 2, iPad Mini 2 & 3, iPad Mini
          AndroidPhones1: 480,      // Samsung Galaxy Note 5 - LG G5 - One Plus 3, 
          AndroidPhones2: 412,      // Nexus 6P & 5X - Google Pixel 4, 4XL, 3a XL, 3a, 3XL, 3, 2XL, XL - Samsung Galaxy S10+ - Samsung Note 10+, Note 10 
          AndroidPhones3: 360,      // Samsung Galaxy S10, S9+, S9, S8+, S8, S7 Edge, S7 - Samsung Note 9
          AndroidTablets1: 1280,    // Chromebook Pixel
          AndroidTablets2: 900,     // Pixel C
          AndroidTablets3: 800,     // Samsung Galaxy Tab 10
          AndroidTablets4: 768,     // Nexus 9
          AndroidTablets5: 600,     // Nexus 7 (2013)
          MicrosoftTablets: 720,    // MS Surface Pro/Pro 2
          MicrosoftTablets3: 912,   // MS Surface Pro 7
          MicrosoftTablets2: 1024,  // MS Surface Pro 3
          LaptopDesktopDCI4k: 4096,
          LaptopDesktopUHD4k: 3840,
          SurfaceBook: 3000,
          MacBookPro15ince: 2880,
          MacBookPro13inch: 2560,
          MacBook12inch: 2304,
          LaptopDesktopFullHD: 1920,
          LaptopDesktopHighDPI: 1440,
          LaptopMediumDPI: 1366,
          LaptopDesktopLowDPI: 1280
        },
        enabled: true, // the addon can be disabled
        defaultValue: 0, // 0 = no viewport is set
      },
    },
  };