const fs = require('fs');
const path = require('path');

const projectRoot = process.cwd();

function ensureFile(relativePath, contents) {
  const target = path.join(projectRoot, relativePath);
  fs.mkdirSync(path.dirname(target), { recursive: true });

  if (!fs.existsSync(target) || fs.readFileSync(target, 'utf8') !== contents) {
    fs.writeFileSync(target, contents);
  }
}

function walk(directory) {
  if (!fs.existsSync(directory)) {
    return [];
  }

  const entries = fs.readdirSync(directory, { withFileTypes: true });
  return entries.flatMap((entry) => {
    const fullPath = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      return walk(fullPath);
    }
    return [fullPath];
  });
}

function patchExpoNodeExternals() {
  const target = path.join(
    projectRoot,
    'node_modules/@expo/cli/build/src/start/server/metro/externals.js'
  );

  if (!fs.existsSync(target)) {
    return;
  }

  const source = fs.readFileSync(target, 'utf8');
  const original = `    (process.binding ? Object.keys(process.binding("natives")) : []) || []).filter((x)=>!/^_|^(internal|v8|node-inspect)\\/|\\//.test(x) && ![
            "sys"
        ].includes(x)
    ), 
].sort();`;
  const replacement = `    (process.binding ? Object.keys(process.binding("natives")) : []) || []).filter((x)=>!/^_|^(internal|v8|node-inspect)\\/|\\//.test(x) && ![
            "sys"
        ].includes(x)
    ).map((x)=>x.replace(/^node:/, ""))
    , 
].filter((value, index, array)=>array.indexOf(value) === index).sort();`;

  if (source.includes(original) && !source.includes('array.indexOf(value) === index')) {
    fs.writeFileSync(target, source.replace(original, replacement));
  }
}

function ensureReactNativePlatformProxies() {
  const librariesRoot = path.join(projectRoot, 'node_modules/react-native/Libraries');

  for (const filePath of walk(librariesRoot)) {
    if (!filePath.endsWith('.ios.js')) {
      continue;
    }

    const genericPath = filePath.replace(/\.ios\.js$/, '.js');
    if (fs.existsSync(genericPath)) {
      continue;
    }

    const moduleName = path.basename(filePath, '.js');
    fs.writeFileSync(
      genericPath,
      `'use strict';\n\nmodule.exports = require('./${moduleName}');\n`
    );
  }

  for (const filePath of walk(librariesRoot)) {
    if (!filePath.endsWith('.android.js')) {
      continue;
    }

    const genericPath = filePath.replace(/\.android\.js$/, '.js');
    if (fs.existsSync(genericPath)) {
      continue;
    }

    const moduleName = path.basename(filePath, '.js');
    fs.writeFileSync(
      genericPath,
      `'use strict';\n\nmodule.exports = require('./${moduleName}');\n`
    );
  }
}

function patchTurboModuleRegistry() {
  const target = path.join(
    projectRoot,
    'node_modules/react-native/Libraries/TurboModule/TurboModuleRegistry.js'
  );

  if (!fs.existsSync(target)) {
    return;
  }

  let source = fs.readFileSync(target, 'utf8');

  if (!source.includes('const isWeb =')) {
    source = source.replace(
      "const turboModuleProxy = global.__turboModuleProxy;\n",
      "const turboModuleProxy = global.__turboModuleProxy;\nconst isWeb =\n  typeof window !== 'undefined' &&\n  typeof document !== 'undefined' &&\n  typeof navigator !== 'undefined';\n"
    );
  }

  source = source.replace(
    '  if (global.RN$Bridgeless !== true) {',
    '  if (!isWeb && global.RN$Bridgeless !== true) {'
  );

  fs.writeFileSync(target, source);
}

patchExpoNodeExternals();
patchTurboModuleRegistry();
ensureReactNativePlatformProxies();

ensureFile(
  'node_modules/react-native/Libraries/Utilities/Platform.js',
  `'use strict';\n\nconst Platform = {\n  OS: 'web',\n  Version: 'web',\n  constants: {\n    reactNativeVersion: {\n      major: 0,\n      minor: 72,\n      patch: 10,\n      prerelease: null,\n    },\n  },\n  select: (spec) => {\n    if (spec && Object.prototype.hasOwnProperty.call(spec, 'web')) {\n      return spec.web;\n    }\n    if (spec && Object.prototype.hasOwnProperty.call(spec, 'default')) {\n      return spec.default;\n    }\n    if (spec && Object.prototype.hasOwnProperty.call(spec, 'native')) {\n      return spec.native;\n    }\n    return undefined;\n  },\n};\n\nmodule.exports = Platform;\n`
);

ensureFile(
  'node_modules/react-native/Libraries/Components/AccessibilityInfo/legacySendAccessibilityEvent.js',
  "'use strict';\n\nmodule.exports = function legacySendAccessibilityEvent() {};\n"
);

ensureFile(
  'node_modules/react-native/Libraries/StyleSheet/PlatformColorValueTypes.js',
  `'use strict';\n\nconst PlatformColor = (...names) => names[0] ?? null;\nconst DynamicColorIOSPrivate = (tuple) => tuple?.light ?? null;\nconst normalizeColorObject = (color) => color ?? null;\nconst processColorObject = (color) => color ?? null;\n\nmodule.exports = {\n  PlatformColor,\n  DynamicColorIOSPrivate,\n  normalizeColorObject,\n  processColorObject,\n};\n`
);

console.log('Applied Expo web compatibility patches.');
