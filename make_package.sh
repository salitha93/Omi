rm -rf client_fb_upload
mkdir -p client_fb_upload/node_modules/
cp -R client/icons ./client_fb_upload/
cp -r client/lib client_fb_upload/
cp -r client/src client_fb_upload/
cp -r client/node_modules/phaser client_fb_upload/node_modules/
cp -r client/node_modules/socket.io-client client_fb_upload/node_modules/
cp -r client/fbapp-config.json client_fb_upload/
cp -r client/LICENSE client_fb_upload/
cp -r client/index.html client_fb_upload/