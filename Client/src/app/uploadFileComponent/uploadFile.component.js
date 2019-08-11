(function() {
    "use strict";

    angular.module('myApp')
        .component('uploadFile', {
            templateUrl: '/src/app/uploadFileComponent/uploadFile.tmpl.html',
            controller: uploadFileCtrl,
            binding: {
                uploadedFileSrc: '@'
            }
        });

    uploadFileCtrl.$inject = ['$scope', "Upload", "$window", '$http'];

    function uploadFileCtrl($scope, Upload, $window, $http) {
        var $ctrl = this;
        console.log("uploadFile component on!");
        $ctrl.$onInit = function() {
            $ctrl.files = [];
            $ctrl.lang = {
                view: "ENG",
                tesseract: "eng",
                googletranslate: "en-US"
            };
            $ctrl.langs = [{
                    view: "ENG",
                    tesseract: "eng",
                    googletranslate: "en-US"
                },
                {
                    view: "JPN",
                    tesseract: "jpn",
                    googletranslate: "jp-JP"
                },
                {
                    view: "VIE",
                    tesseract: "vie",
                    googletranslate: "vi-VI"
                },

            ];
            // $ctrl.langs = ['eng', 'vie', 'jpn'];
            $ctrl.ocrResult = "";
            $ctrl.progressCircular = false;
            $ctrl.voiceSrc = "";
        }

        $ctrl.submit = function() { //function to call on form submit
            $ctrl.ocrResult = "";
            $ctrl.progressCircular = true;
            console.log($ctrl.file);
            if ($ctrl.file) { //check if from is valid
                $ctrl.upload($ctrl.file); //call upload function
            }
            var now = new Date();
            $ctrl.fileName = now.getTime();
        };

        $ctrl.upload = function(file) {
            console.log('in Upload');
            $ctrl.fileName = $ctrl.fileName + $ctrl.file.filename;
            console.log($ctrl.fileName);
            Upload.rename(file, $ctrl.fileName);
            Upload.upload({
                url: '/api/upload', //webAPI exposed to upload the file
                data: {
                    file: file
                } //pass file as data, should be user ng-model
            }).then(function(resp) { //upload function returns a promise
                if (resp.data.error_code === 0) { //validate success
                    // show alert
                    // $window.alert('Success ' + resp.config.data.file.name + 'uploaded. Response: ');
                    var type = $ctrl.file.type;
                    $ctrl.outUrl = resp.data.msg;
                    console.log(resp);
                    console.log($ctrl.outUrl);
                    if (type == "application/pdf") {
                        console.log("get text from PDF");
                        $http.get('/api/pdf2text', {
                            params: {
                                url: $ctrl.outUrl,
                                lang: $ctrl.lang.tesseract
                            }
                        }).then(function(response) {
                            console.log(response);
                            $ctrl.progressCircular = false;
                            $ctrl.ocrResult = response.data;
                        })

                    } else {
                        console.log("get OCR result from IMG");
                        $http.get('/api/ocr', {
                            params: {
                                url: $ctrl.outUrl,
                                lang: $ctrl.lang.tesseract
                            }
                        }).then(function(response) {
                            console.log(response);
                            $ctrl.progressCircular = false;
                            $ctrl.ocrResult = response.data;
                        });
                    }

                } else {
                    $window.alert('an error occured');
                }
            }, function(resp) { //catch error
                console.log('Error status: ' + resp.status);
                $window.alert('Error status: ' + resp.status);
            }, function(evt) {
                console.log(evt);
                var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                console.log('upload progress: ' + progressPercentage + '% ' + evt.config.data.file.name);
                $ctrl.progress = 'upload progress: ' + progressPercentage + '% '; // capture upload progress
            });
        };

        $ctrl.getVoice = function(text) {
            console.log("get voice from google");
            console.log({
                text: text,
                lang: $ctrl.lang.googletranslate,
                filename: $ctrl.fileName
            })
            $http.get('/api/voice', {
                params: {
                    text: text,
                    lang: $ctrl.lang.googletranslate,
                    filename: $ctrl.fileName
                }
            }).then(function(response) {
                console.log(response);
                var filename = response.data.slice(1, response.data.length);
                var url = "./../../public/voice" + filename;
                console.log(url);
                var path = document.location.pathname;
                var directory = path.substring(path.indexOf('/'), path.lastIndexOf('/'));
                console.log(directory);
                $ctrl.voiceSrc = url;

            })
        }
    }
})();