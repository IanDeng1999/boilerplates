// swift-tools-version: 5.9
import PackageDescription

// DO NOT MODIFY THIS FILE - managed by Capacitor CLI commands
let package = Package(
    name: "CapApp-SPM",
    platforms: [.iOS(.v15)],
    products: [
        .library(
            name: "CapApp-SPM",
            targets: ["CapApp-SPM"])
    ],
    dependencies: [
        .package(url: "https://github.com/ionic-team/capacitor-swift-pm.git", exact: "8.5.2"),
        .package(name: "CapacitorActionSheet", path: "../../../node_modules/.pnpm/@capacitor+action-sheet@8.1.1_@capacitor+core@8.5.2/node_modules/@capacitor/action-sheet"),
        .package(name: "CapacitorApp", path: "../../../node_modules/.pnpm/@capacitor+app@8.1.1_@capacitor+core@8.5.2/node_modules/@capacitor/app"),
        .package(name: "CapacitorAppLauncher", path: "../../../node_modules/.pnpm/@capacitor+app-launcher@8.0.1_@capacitor+core@8.5.2/node_modules/@capacitor/app-launcher"),
        .package(name: "CapacitorDevice", path: "../../../node_modules/.pnpm/@capacitor+device@8.0.3_@capacitor+core@8.5.2/node_modules/@capacitor/device"),
        .package(name: "CapacitorDialog", path: "../../../node_modules/.pnpm/@capacitor+dialog@8.0.1_@capacitor+core@8.5.2/node_modules/@capacitor/dialog"),
        .package(name: "CapacitorHaptics", path: "../../../node_modules/.pnpm/@capacitor+haptics@8.0.2_@capacitor+core@8.5.2/node_modules/@capacitor/haptics"),
        .package(name: "CapacitorKeyboard", path: "../../../node_modules/.pnpm/@capacitor+keyboard@8.0.5_@capacitor+core@8.5.2/node_modules/@capacitor/keyboard"),
        .package(name: "CapacitorPreferences", path: "../../../node_modules/.pnpm/@capacitor+preferences@8.0.1_@capacitor+core@8.5.2/node_modules/@capacitor/preferences"),
        .package(name: "CapacitorScreenOrientation", path: "../../../node_modules/.pnpm/@capacitor+screen-orientation@8.0.1_@capacitor+core@8.5.2/node_modules/@capacitor/screen-orientation"),
        .package(name: "CapacitorShare", path: "../../../node_modules/.pnpm/@capacitor+share@8.0.2_@capacitor+core@8.5.2/node_modules/@capacitor/share"),
        .package(name: "CapacitorSplashScreen", path: "../../../node_modules/.pnpm/@capacitor+splash-screen@8.0.2_@capacitor+core@8.5.2/node_modules/@capacitor/splash-screen"),
        .package(name: "CapacitorStatusBar", path: "../../../node_modules/.pnpm/@capacitor+status-bar@8.0.3_@capacitor+core@8.5.2/node_modules/@capacitor/status-bar"),
        .package(name: "CapacitorTextZoom", path: "../../../node_modules/.pnpm/@capacitor+text-zoom@8.0.1_@capacitor+core@8.5.2/node_modules/@capacitor/text-zoom"),
        .package(name: "CapacitorToast", path: "../../../node_modules/.pnpm/@capacitor+toast@8.0.1_@capacitor+core@8.5.2/node_modules/@capacitor/toast")
    ],
    targets: [
        .target(
            name: "CapApp-SPM",
            dependencies: [
                .product(name: "Capacitor", package: "capacitor-swift-pm"),
                .product(name: "Cordova", package: "capacitor-swift-pm"),
                .product(name: "CapacitorActionSheet", package: "CapacitorActionSheet"),
                .product(name: "CapacitorApp", package: "CapacitorApp"),
                .product(name: "CapacitorAppLauncher", package: "CapacitorAppLauncher"),
                .product(name: "CapacitorDevice", package: "CapacitorDevice"),
                .product(name: "CapacitorDialog", package: "CapacitorDialog"),
                .product(name: "CapacitorHaptics", package: "CapacitorHaptics"),
                .product(name: "CapacitorKeyboard", package: "CapacitorKeyboard"),
                .product(name: "CapacitorPreferences", package: "CapacitorPreferences"),
                .product(name: "CapacitorScreenOrientation", package: "CapacitorScreenOrientation"),
                .product(name: "CapacitorShare", package: "CapacitorShare"),
                .product(name: "CapacitorSplashScreen", package: "CapacitorSplashScreen"),
                .product(name: "CapacitorStatusBar", package: "CapacitorStatusBar"),
                .product(name: "CapacitorTextZoom", package: "CapacitorTextZoom"),
                .product(name: "CapacitorToast", package: "CapacitorToast")
            ]
        )
    ]
)
