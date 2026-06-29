import test from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";

const root = process.cwd();

function read(relativePath) {
  return readFileSync(path.join(root, relativePath), "utf8");
}

test("landing route group and app surfaces exist", () => {
  assert.equal(existsSync(path.join(root, "src/app/(landing)/page.tsx")), true);
  assert.equal(existsSync(path.join(root, "src/app/onboard/page.tsx")), true);
  assert.equal(existsSync(path.join(root, "src/app/dashboard/page.tsx")), true);
});

test("manifest starts the installed app in onboard flow", () => {
  const manifest = read("src/app/manifest.ts");

  assert.match(manifest, /start_url:\s*["'`]\/onboard["'`]/);
  assert.match(manifest, /scope:\s*["'`]\/["'`]/);
  assert.match(manifest, /display:\s*["'`]standalone["'`]/);
  assert.match(manifest, /android-chrome-192x192\.png/);
  assert.match(manifest, /android-chrome-512x512\.png/);
  assert.match(manifest, /apple-touch-icon\.png/);
});

test("placeholder app routes stay intentionally minimal for now", () => {
  const onboardPage = read("src/app/onboard/page.tsx");
  const landingPage = read("src/app/(landing)/page.tsx");
  const dashboardPage = read("src/app/dashboard/page.tsx");

  assert.match(landingPage, /Ini landing nanti\./);
  assert.match(onboardPage, /Ini onboard nanti\./);
  assert.match(dashboardPage, /Ini dashboard nanti\./);
  assert.doesNotMatch(onboardPage, /localStorage/);
});

test("app-only routes use an installed-mode gate", () => {
  const onboardLayout = read("src/app/onboard/layout.tsx");
  const dashboardLayout = read("src/app/dashboard/layout.tsx");
  const gate = read("src/features/pwa/components/installed-app-gate.tsx");

  assert.match(onboardLayout, /InstalledAppGate/);
  assert.match(dashboardLayout, /InstalledAppGate/);
  assert.match(gate, /matchMedia\([\s\S]*?["'`]\(display-mode:\s*standalone\)["'`][\s\S]*?\)/);
  assert.match(gate, /"standalone"\s+in\s+navigator/);
  assert.match(gate, /router\.replace\(["'`]\/["'`]\)/);
});

test("root layout registers the service worker entry point", () => {
  const layout = read("src/app/layout.tsx");

  assert.match(layout, /ServiceWorkerRegistration/);
  assert.match(layout, /favicon-32x32\.png/);
  assert.match(layout, /favicon-16x16\.png/);
  assert.match(layout, /apple-touch-icon\.png/);
});

test("landing uses shared container and shared navbar", () => {
  const container = read("src/shared/components/layout/Container.tsx");
  const navbar = read("src/features/landing/components/LandingNavbar.tsx");
  const landingPage = read("src/app/(landing)/page.tsx");
  const installButton = read("src/features/pwa/components/InstallAppButton.tsx");
  const installInstructions = read(
    "src/features/pwa/components/InstallInstructions.tsx",
  );
  const installHook = read("src/features/pwa/hooks/useInstallPrompt.ts");
  const pressButton = read("src/shared/components/buttons/PressButton.tsx");
  const pressButtonConfig = read("src/shared/components/buttons/pressButtonConfig.ts");

  assert.match(container, /max-w-\[1200px\]/);
  assert.match(container, /px-4/);
  assert.match(navbar, /Container/);
  assert.match(navbar, /InstallAppButton/);
  assert.match(navbar, /sakutera-full\.svg/);
  assert.match(navbar, /border-b/);
  assert.match(navbar, /text-base/);
  assert.match(installButton, /Daftar Gratis|Install App|Buka App/);
  assert.match(installButton, /beforeinstallprompt|isPromptAvailable/);
  assert.match(installInstructions, /Add to Home Screen|Tambah ke Layar Utama/);
  assert.match(installHook, /beforeinstallprompt/);
  assert.match(installHook, /appinstalled/);
  assert.match(pressButton, /^"use client";/);
  assert.match(pressButton, /motion\./);
  assert.match(pressButtonConfig, /bg-primary/);
  assert.match(pressButtonConfig, /text-secondary/);
  assert.match(landingPage, /LandingNavbar/);
});

test("shared component structure is grouped by responsibility", () => {
  const feedbackIndex = read("src/shared/components/feedback/index.ts");
  const rootIndex = read("src/shared/components/index.ts");
  const skeleton = read("src/shared/components/feedback/Skeleton.tsx");
  const cn = read("src/shared/lib/cn.ts");

  assert.equal(existsSync(path.join(root, "src/shared/components/skeleton.tsx")), false);
  assert.match(feedbackIndex, /Skeleton/);
  assert.match(rootIndex, /feedback/);
  assert.match(skeleton, /@\/src\/shared\/lib\/cn/);
  assert.match(cn, /twMerge/);
});
