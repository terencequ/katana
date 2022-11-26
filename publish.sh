# Init
npm install
npm config set sign-git-tag false

# Version incrementing
npm version patch --git-tag-version false # Increment patch number to get package version for everything
PACKAGE_VERSION=$(cat package.json|grep version|head -1|awk -F: '{ print $2 }'|sed 's/[", ]//g')

# Katana - Core: Increment version and publish to npm
cd ./projects/core/
npm version $PACKAGE_VERSION --git-tag-version false
cd ../../
ng build core
cd ./dist/core/
npm publish --access public
cd ../../

# Finalise version change, and push to git
npm version $PACKAGE_VERSION --allow-same-version true -m "Bump version to %s" --force