/**
 * This file is part of Adguard Browser Extension (https://github.com/AdguardTeam/AdguardBrowserExtension).
 *
 * Adguard Browser Extension is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Lesser General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * Adguard Browser Extension is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public License
 * along with Adguard Browser Extension.  If not, see <http://www.gnu.org/licenses/>.
 */

/**
 * Sync settings provider
 *
 * @type {{get, save}}
 */
var SyncProvider = (function () { // jshint ignore:line

    var requestFileSystem = window.requestFileSystem || window.webkitRequestFileSystem;

    var readFile = function (path, callback) {

        var errorHandler = function (e) {
            console.error(e);

            callback();
        };

        var onInitFs = function (fs) {
            fs.root.getFile(path, {}, function (fileEntry) {
                fileEntry.file(function (file) {
                    var reader = new FileReader();

                    reader.onloadend = function (e) {
                        callback(JSON.parse(this.result));
                    };

                    reader.readAsText(file);

                }, errorHandler);

            }, errorHandler);
        };

        requestFileSystem(window.TEMPORARY, 1024 * 1024, onInitFs, errorHandler);
    };

    var saveFile = function (path, data, callback) {
        var errorHandler = function (e) {
            console.error(e);

            callback(false);
        };

        var onInitFs = function (fs) {
            fs.root.getFile(path, {create: true}, function(fileEntry) {

                // Create a FileWriter object for our FileEntry (log.txt).
                fileEntry.createWriter(function(fileWriter) {

                    fileWriter.onwriteend = function(e) {
                        callback(true);
                    };

                    fileWriter.onerror = function(e) {
                        console.log('Write failed: ' + e.toString());
                        callback(false);
                    };

                    var blob = new Blob([JSON.stringify(data)], {type: 'text/plain'});

                    fileWriter.write(blob);

                }, errorHandler);
            }, errorHandler);
        };

        requestFileSystem(window.TEMPORARY, 1024 * 1024, onInitFs, errorHandler);
    };


    // API
    var load = function (filePath, callback) {
        readFile(filePath, callback);
    };

    var save = function (filePath, data, callback) {
        saveFile(filePath, data, callback);
    };

    // EXPOSE
    return {
        /**
         * Loads data from provider
         */
        load: load,
        /**
         * Saves data to provider
         */
        save: save
    };
})();