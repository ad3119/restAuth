module.exports = function(server, multer) {
    server.use(multer({ dest: './uploads/',
        rename: function (fieldname, filename, req, res) {
            return req.body.email;
        },
        onFileUploadStart: function (file) {
            console.log(file.originalname + ' is starting..')
        },
        onFileUploadComplete: function (file) {
            console.log('File upload success.');
        }
  }));
};