const path = require('path');

module.exports = function babelPluginAlias() {
  return {
    visitor: {
      ImportDeclaration(path) {
        const source = path.node.source.value;
        if (source.startsWith('@/')) {
          // Calculate relative path based on current file location
          const currentFile = path.hub.file.opts.filename;
          const currentDir = path.dirname(currentFile);
          const targetPath = path.resolve(process.cwd(), 'src', source.slice(2));
          let relativePath = path.relative(currentDir, targetPath);
          
          // Ensure path starts with ./ or ../
          if (!relativePath.startsWith('.')) {
            relativePath = './' + relativePath;
          }
          
          // Replace backslashes with forward slashes for cross-platform compatibility
          relativePath = relativePath.replace(/\\/g, '/');
          
          path.node.source.value = relativePath;
        }
      }
    }
  };
};
