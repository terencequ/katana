npm version patch -m "Bump version to %s"
PACKAGE_VERSION=$(cat package.json|grep version|head -1|awk -F: '{ print $2 }'|sed 's/[", ]//g')
git tag -a "v$PACKAGE_VERSION" -m "Version $PACKAGE_VERSION"
git push origin "v$PACKAGE_VERSION"
git push
npm publish --access public
read -s -n 1 -p "Press any key to continue . . ."
echo ""